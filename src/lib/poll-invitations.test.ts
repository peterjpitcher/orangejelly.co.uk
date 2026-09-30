import { beforeEach, describe, expect, it, vi } from 'vitest';

import { sendPendingInvitations } from './poll-invitations';
import type * as EmailModule from './email';

/**
 * The invitation sender. Resend and Supabase are mocked; the email builder is
 * real, so the assertions are on the message people actually get.
 */

const sendPollEmail = vi.fn();
const listUnsentInvitees = vi.fn();
const markInvited = vi.fn();

vi.mock('./email', async (importOriginal) => {
  const actual = await importOriginal<typeof EmailModule>();
  return {
    ...actual,
    sendPollEmail: (message: unknown) => sendPollEmail(message),
    POLL_EMAIL_SEND_INTERVAL_MS: 0,
  };
});

vi.mock('./db/poll-invitees', () => ({
  listUnsentInvitees: (pollId: string) => listUnsentInvitees(pollId),
  markInvited: (id: string) => markInvited(id),
}));

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
    title: 'Quiz night planning',
    description: null,
    location: 'The Anchor',
    organiser_name: 'Peter Pitcher',
    organiser_email: 'peter@orangejelly.co.uk',
    option_kind: 'dates',
    entries_close_at: null,
  };
  listUnsentInvitees.mockResolvedValue([invitee(1), invitee(2)]);
  markInvited.mockResolvedValue(undefined);
  sendPollEmail.mockResolvedValue({ success: true });
});

describe('sendPendingInvitations', () => {
  it('should email each person their own link, one email each', async () => {
    const result = await sendPendingInvitations('poll-1');

    expect(result).toEqual({ sent: 2, failed: 0 });
    expect(sendPollEmail).toHaveBeenCalledTimes(2);
    const first = sendPollEmail.mock.calls[0][0];
    expect(first.to).toBe('person1@example.com');
    expect(first.text).toContain(`/availability/i/${invitee(1).invite_token}`);
    // Never anyone else's link, and never everyone in one "to".
    expect(first.text).not.toContain(invitee(2).invite_token);
  });

  it("should send replies to the organiser and carry the invitee's own unsubscribe", async () => {
    await sendPendingInvitations('poll-1');

    const message = sendPollEmail.mock.calls[0][0];
    expect(message.replyTo).toBe('peter@orangejelly.co.uk');
    expect(message.headers['List-Unsubscribe']).toContain(
      `/availability/i/${invitee(1).invite_token}/unsubscribe`
    );
  });

  it('should stamp a person only once their email has gone', async () => {
    sendPollEmail
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ error: 'Failed to send email.' });

    const result = await sendPendingInvitations('poll-1');

    expect(result).toEqual({ sent: 1, failed: 1 });
    expect(markInvited).toHaveBeenCalledTimes(1);
    expect(markInvited).toHaveBeenCalledWith('invitee-1');
  });

  it('should carry on past a send that throws', async () => {
    sendPollEmail.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce({
      success: true,
    });

    const result = await sendPendingInvitations('poll-1');

    expect(result).toEqual({ sent: 1, failed: 1 });
  });

  it('should count a sent email as sent even if stamping it fails', async () => {
    markInvited.mockRejectedValue(new Error('database down'));

    const result = await sendPendingInvitations('poll-1');

    expect(result).toEqual({ sent: 2, failed: 0 });
  });

  it('should send nothing for a poll that is not live', async () => {
    // A draft's invitations wait for verification; a closed poll takes no answers.
    pollRow = { ...pollRow, status: 'draft' };

    const result = await sendPendingInvitations('poll-1');

    expect(result).toEqual({ sent: 0, failed: 0 });
    expect(sendPollEmail).not.toHaveBeenCalled();
  });

  it('should name the deadline when the organiser set one', async () => {
    pollRow = { ...pollRow, entries_close_at: '2026-10-07T16:00:00.000Z' };

    await sendPendingInvitations('poll-1');

    // 16:00 UTC is 5pm in London in October (BST).
    expect(sendPollEmail.mock.calls[0][0].text).toContain('Please answer by');
    expect(sendPollEmail.mock.calls[0][0].text).toContain('5:00pm');
  });
});
