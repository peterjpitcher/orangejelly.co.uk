import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  inviteByEmail,
  removeInvitation,
  retryInvitations,
  setInvitationEmails,
} from './poll-invitees';

/**
 * Email invitations: the gate matters more than the happy path. Only a
 * signed-in admin, on a poll they set up, may make us email anyone (Peter's
 * decision, 30 September 2026). Every external service is mocked.
 */

const resolveAdminIdentity = vi.fn();
vi.mock('@/lib/admin-identity', () => ({
  resolveAdminIdentity: (token: unknown) => resolveAdminIdentity(token),
}));

const getOrganiserView = vi.fn();
vi.mock('@/lib/db/polls', () => ({
  getOrganiserView: (token: unknown) => getOrganiserView(token),
}));

const addInvitees = vi.fn();
const removeInvitee = vi.fn();
const setInviteeOptOut = vi.fn();
vi.mock('@/lib/db/poll-invitees', () => ({
  INVITEE_NOT_FOUND: 'INVITEE_NOT_FOUND',
  TOO_MANY_INVITEES: 'TOO_MANY_INVITEES',
  addInvitees: (...args: unknown[]) => addInvitees(...args),
  removeInvitee: (...args: unknown[]) => removeInvitee(...args),
  setInviteeOptOut: (...args: unknown[]) => setInviteeOptOut(...args),
}));

const sendPendingInvitations = vi.fn();
vi.mock('@/lib/poll-invitations', () => ({
  sendPendingInvitations: (pollId: unknown) => sendPendingInvitations(pollId),
}));

const checkRateLimit = vi.fn();
vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => checkRateLimit(...args),
  hashKey: (value: string) => `hashed:${value}`,
  getClientIp: () => '203.0.113.7',
}));

vi.mock('next/headers', () => ({ headers: () => new Map() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

const TOKEN = 'aaaaaaaaaaaaaaaaaaaaaa';
const INVITE_TOKEN = 'bbbbbbbbbbbbbbbbbbbbbb';
const INVITEE_ID = '11111111-1111-4111-8111-111111111111';
const FAR_FUTURE = new Date(Date.now() + 30 * 86_400_000).toISOString();

function organiserView(overrides: Record<string, unknown> = {}) {
  return {
    poll: {
      id: 'poll-1',
      status: 'open',
      organiser_email: 'peter@orangejelly.co.uk',
      expires_at: FAR_FUTURE,
      ...overrides,
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  resolveAdminIdentity.mockResolvedValue({ email: 'peter@orangejelly.co.uk' });
  getOrganiserView.mockResolvedValue(organiserView());
  checkRateLimit.mockResolvedValue({ allowed: true, reason: 'ok' });
  addInvitees.mockResolvedValue({ stored: true, data: { added: [{}, {}], alreadyInvited: 0 } });
  sendPendingInvitations.mockResolvedValue({ sent: 2, failed: 0 });
  removeInvitee.mockResolvedValue({ stored: true });
  setInviteeOptOut.mockResolvedValue({ stored: true });
});

describe('inviteByEmail', () => {
  it('should add the people and email them', async () => {
    const result = await inviteByEmail(TOKEN, 'admin-jwt', 'sam@example.com\nalex@example.com');

    expect(result).toEqual({
      success: true,
      invited: { added: 2, alreadyInvited: 0, sent: 2, failed: 0 },
    });
    expect(addInvitees).toHaveBeenCalledWith('poll-1', ['sam@example.com', 'alex@example.com']);
    expect(sendPendingInvitations).toHaveBeenCalledWith('poll-1');
  });

  it('should refuse anyone who is not a signed-in admin, before touching anything', async () => {
    resolveAdminIdentity.mockResolvedValue(null);

    const result = await inviteByEmail(TOKEN, undefined, 'sam@example.com');

    expect(result.error).toBe('Sign in to invite people by email.');
    expect(addInvitees).not.toHaveBeenCalled();
    expect(sendPendingInvitations).not.toHaveBeenCalled();
  });

  it("should refuse an admin on somebody else's poll", async () => {
    // Holding an organiser link proves you hold the poll, not who you are.
    getOrganiserView.mockResolvedValue(organiserView({ organiser_email: 'stranger@example.com' }));

    const result = await inviteByEmail(TOKEN, 'admin-jwt', 'sam@example.com');

    expect(result.error).toContain('polls you set up');
    expect(addInvitees).not.toHaveBeenCalled();
  });

  it('should refuse a poll that is not taking answers', async () => {
    getOrganiserView.mockResolvedValue(organiserView({ status: 'confirmed' }));

    const result = await inviteByEmail(TOKEN, 'admin-jwt', 'sam@example.com');

    expect(result.error).toContain('not taking answers');
    expect(addInvitees).not.toHaveBeenCalled();
  });

  it("should refuse to invite anyone once the poll's deadline has passed", async () => {
    // The deadline closes entries (Peter, 30 September 2026): an invitation
    // would ask for an answer the poll then refuses.
    getOrganiserView.mockResolvedValue(
      organiserView({ entries_close_at: new Date(Date.now() - 60_000).toISOString() })
    );

    const result = await inviteByEmail(TOKEN, 'admin-jwt', 'sam@example.com');

    expect(result.error).toContain('not taking answers');
    expect(addInvitees).not.toHaveBeenCalled();
  });

  it('should name a typo rather than drop it', async () => {
    const result = await inviteByEmail(TOKEN, 'admin-jwt', 'sam@example.com\nalex@example');

    expect(result.error).toContain('"alex@example" is not an email address');
    expect(addInvitees).not.toHaveBeenCalled();
  });

  it('should refuse a malformed organiser link', async () => {
    const result = await inviteByEmail('nope', 'admin-jwt', 'sam@example.com');

    expect(result.error).toBeDefined();
    expect(resolveAdminIdentity).not.toHaveBeenCalled();
  });

  it('should fail closed when the limiter is down, because this sends mail', async () => {
    checkRateLimit.mockRejectedValue(new Error('limiter down'));

    const result = await inviteByEmail(TOKEN, 'admin-jwt', 'sam@example.com');

    expect(result.error).toContain('unavailable');
    expect(addInvitees).not.toHaveBeenCalled();
  });

  it('should say how many did not send, rather than report success alone', async () => {
    sendPendingInvitations.mockResolvedValue({ sent: 1, failed: 1 });

    const result = await inviteByEmail(TOKEN, 'admin-jwt', 'sam@example.com\nalex@example.com');

    expect(result.invited).toMatchObject({ sent: 1, failed: 1 });
  });

  it('should report every new person as failed when the sender throws', async () => {
    sendPendingInvitations.mockRejectedValue(new Error('Resend down'));

    const result = await inviteByEmail(TOKEN, 'admin-jwt', 'sam@example.com\nalex@example.com');

    expect(result.invited).toMatchObject({ sent: 0, failed: 2 });
  });

  it('should explain the cap when the list would take the poll over it', async () => {
    addInvitees.mockResolvedValue({ stored: false, error: 'TOO_MANY_INVITEES' });

    const result = await inviteByEmail(TOKEN, 'admin-jwt', 'sam@example.com');

    expect(result.error).toContain('up to 50');
  });

  it('should show a failure when the list cannot be stored', async () => {
    addInvitees.mockResolvedValue({ stored: false, error: 'connection reset' });

    const result = await inviteByEmail(TOKEN, 'admin-jwt', 'sam@example.com');

    expect(result.error).toBe('Those people were not added. Please try again.');
    expect(sendPendingInvitations).not.toHaveBeenCalled();
  });
});

describe('retryInvitations', () => {
  it('should resend the ones that did not go', async () => {
    sendPendingInvitations.mockResolvedValue({ sent: 1, failed: 0 });

    const result = await retryInvitations(TOKEN, 'admin-jwt');

    expect(result).toEqual({
      success: true,
      invited: { added: 0, alreadyInvited: 0, sent: 1, failed: 0 },
    });
  });

  it('should refuse anyone who is not a signed-in admin', async () => {
    resolveAdminIdentity.mockResolvedValue(null);

    const result = await retryInvitations(TOKEN, undefined);

    expect(result.error).toBe('Sign in to invite people by email.');
    expect(sendPendingInvitations).not.toHaveBeenCalled();
  });
});

describe('removeInvitation', () => {
  it('should take the person off the list', async () => {
    const result = await removeInvitation(TOKEN, 'admin-jwt', INVITEE_ID);

    expect(result).toEqual({ success: true });
    expect(removeInvitee).toHaveBeenCalledWith('poll-1', INVITEE_ID);
  });

  it('should refuse anyone who is not a signed-in admin', async () => {
    resolveAdminIdentity.mockResolvedValue(null);

    const result = await removeInvitation(TOKEN, undefined, INVITEE_ID);

    expect(result.error).toBe('Sign in to invite people by email.');
    expect(removeInvitee).not.toHaveBeenCalled();
  });
});

describe('setInvitationEmails', () => {
  it('should stop emails about this poll for the person whose link it is', async () => {
    const result = await setInvitationEmails(INVITE_TOKEN, false);

    expect(result).toEqual({ success: true });
    expect(setInviteeOptOut).toHaveBeenCalledWith(INVITE_TOKEN, true);
  });

  it('should turn them back on', async () => {
    await setInvitationEmails(INVITE_TOKEN, true);

    expect(setInviteeOptOut).toHaveBeenCalledWith(INVITE_TOKEN, false);
  });

  it('should still let someone stop emails when the limiter is down', async () => {
    checkRateLimit.mockRejectedValue(new Error('limiter down'));

    const result = await setInvitationEmails(INVITE_TOKEN, false);

    expect(result).toEqual({ success: true });
  });

  it('should give the dead-link answer for an unknown invitation', async () => {
    setInviteeOptOut.mockResolvedValue({ stored: false, error: 'INVITEE_NOT_FOUND' });

    const result = await setInvitationEmails(INVITE_TOKEN, false);

    expect(result.error).toBe('That link is not valid.');
  });
});
