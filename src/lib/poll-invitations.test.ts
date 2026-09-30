import { beforeEach, describe, expect, it, vi } from 'vitest';

import { sendPendingInvitations } from './poll-invitations';
import type * as EmailModule from './email';

/**
 * The invitation sender. Resend and Supabase are mocked; the email builder is
 * real, so the assertions are on the message people actually get.
 */

const sendPollEmailBatch = vi.fn();
const listUnsentInvitees = vi.fn();
const claimInvitees = vi.fn();
const releaseInvitees = vi.fn();

vi.mock('./email', async (importOriginal) => {
  const actual = await importOriginal<typeof EmailModule>();
  return {
    ...actual,
    sendPollEmailBatch: (messages: unknown) => sendPollEmailBatch(messages),
  };
});

vi.mock('./db/poll-invitees', () => ({
  listUnsentInvitees: (pollId: string) => listUnsentInvitees(pollId),
  claimInvitees: (ids: string[], at: string) => claimInvitees(ids, at),
  releaseInvitees: (ids: string[], at: string) => releaseInvitees(ids, at),
}));

/** The messages the one batch call carried. */
const sent = (): Array<{
  to: string;
  text: string;
  replyTo?: string;
  headers: Record<string, string>;
}> => sendPollEmailBatch.mock.calls[0][0];

let pollRow: Record<string, unknown> | null = null;

function chain(result: unknown): Record<string, unknown> {
  const self: Record<string, unknown> = {};
  for (const method of ['select', 'eq', 'order']) self[method] = () => self;
  self.maybeSingle = () => Promise.resolve({ data: pollRow, error: null });
  self.then = (resolve: (value: unknown) => unknown) => Promise.resolve(result).then(resolve);
  return self;
}

vi.mock('./db/supabase-admin', () => ({
  getSupabaseAdminClient: () => ({
    from: (table: string) =>
      table === 'poll_options'
        ? chain({
            data: [
              { option_date: '2026-10-08', starts_at: null, ends_at: null },
              { option_date: '2026-10-09', starts_at: null, ends_at: null },
            ],
            error: null,
          })
        : chain({ data: [], error: null }),
  }),
}));

const invitee = (n: number) => ({
  id: `invitee-${n}`,
  email: `person${n}@example.com`,
  invite_token: `invite-token-${n}`.padEnd(22, 'x'),
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  pollRow = {
    id: 'poll-1',
    status: 'open',
    closes_at: null,
    title: 'Quiz night planning',
    description: null,
    location: 'The Anchor',
    organiser_name: 'Peter Pitcher',
    organiser_email: 'peter@orangejelly.co.uk',
    option_kind: 'dates',
    entries_close_at: null,
  };
  listUnsentInvitees.mockResolvedValue([invitee(1), invitee(2)]);
  claimInvitees.mockImplementation(async (ids: string[]) => new Set(ids));
  releaseInvitees.mockResolvedValue(undefined);
  sendPollEmailBatch.mockImplementation(async (messages: unknown[]) => messages.map(() => true));
});

describe('sendPendingInvitations', () => {
  it('should email each person their own link, one message each, in one batch', async () => {
    const result = await sendPendingInvitations('poll-1');

    expect(result).toEqual({ sent: 2, failed: 0 });
    expect(sendPollEmailBatch).toHaveBeenCalledTimes(1);
    expect(sent()).toHaveLength(2);
    expect(sent()[0].to).toBe('person1@example.com');
    expect(sent()[0].text).toContain(`/availability/i/${invitee(1).invite_token}`);
    // Never anyone else's link, and never everyone in one "to".
    expect(sent()[0].text).not.toContain(invitee(2).invite_token);
  });

  it("should send replies to the organiser and carry the invitee's own unsubscribe", async () => {
    await sendPendingInvitations('poll-1');

    expect(sent()[0].replyTo).toBe('peter@orangejelly.co.uk');
    expect(sent()[0].headers['List-Unsubscribe']).toContain(
      `/availability/i/${invitee(1).invite_token}/unsubscribe`
    );
  });

  it('should claim people before sending, so an overlapping send cannot email them twice', async () => {
    // The other run won invitee-1.
    claimInvitees.mockResolvedValue(new Set(['invitee-2']));

    const result = await sendPendingInvitations('poll-1');

    expect(result).toEqual({ sent: 1, failed: 0 });
    expect(sent().map((message) => message.to)).toEqual(['person2@example.com']);
    expect(claimInvitees.mock.invocationCallOrder[0]).toBeLessThan(
      sendPollEmailBatch.mock.invocationCallOrder[0]
    );
  });

  it('should release anyone Resend refused, so they show as unsent and retry', async () => {
    sendPollEmailBatch.mockResolvedValue([true, false]);

    const result = await sendPendingInvitations('poll-1');

    expect(result).toEqual({ sent: 1, failed: 1 });
    expect(releaseInvitees).toHaveBeenCalledWith(['invitee-2'], expect.any(String));
  });

  it('should report everyone as failed when the whole batch is refused', async () => {
    sendPollEmailBatch.mockResolvedValue([false, false]);

    const result = await sendPendingInvitations('poll-1');

    expect(result).toEqual({ sent: 0, failed: 2 });
    expect(releaseInvitees).toHaveBeenCalledWith(['invitee-1', 'invitee-2'], expect.any(String));
  });

  it('should send nothing for a poll that is not live', async () => {
    // A draft's invitations wait for verification; a closed poll takes no answers.
    pollRow = { ...pollRow, status: 'draft' };

    const result = await sendPendingInvitations('poll-1');

    expect(result).toEqual({ sent: 0, failed: 0 });
    expect(claimInvitees).not.toHaveBeenCalled();
    expect(sendPollEmailBatch).not.toHaveBeenCalled();
  });

  it('should send nothing once the deadline has passed', async () => {
    pollRow = { ...pollRow, entries_close_at: new Date(Date.now() - 60_000).toISOString() };

    const result = await sendPendingInvitations('poll-1');

    expect(result).toEqual({ sent: 0, failed: 0 });
    expect(sendPollEmailBatch).not.toHaveBeenCalled();
  });

  it('should name the deadline when the organiser set one', async () => {
    // Far in the future and in winter, so the test never goes stale and the
    // London time is plain GMT: 17:00 UTC is 5pm.
    pollRow = { ...pollRow, entries_close_at: '2099-01-15T17:00:00.000Z' };

    await sendPendingInvitations('poll-1');

    expect(sent()[0].text).toContain('Please answer by');
    expect(sent()[0].text).toContain('5:00pm');
  });
});
