import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DIGEST_WINDOW_MINUTES, notifyOrganiserOfResponse } from './poll-digest';
import type * as EmailModule from './email';

/**
 * The lazy half of the digest (SPEC §4.2): what a vote or an edit sets off.
 *
 * Until 29 September 2026 this half did not exist. Nothing set
 * `digest_pending_since`, so the cron's flush never found a poll and no organiser
 * was ever told about a response. These tests pin the trigger, the hourly window
 * and the rule that nothing here can fail the vote that called it.
 *
 * Supabase and Resend are mocked; the email builder is not, so the assertions
 * are on the real message.
 */

const sendPollEmail = vi.fn();

vi.mock('./email', async (importOriginal) => {
  const actual = await importOriginal<typeof EmailModule>();
  return { ...actual, sendPollEmail: (message: unknown) => sendPollEmail(message) };
});

/** The poll row `sendDigestIfDue` reads. Null means no such poll. */
let pollRow: Record<string, unknown> | null = null;
let tableRows: Record<string, Array<Record<string, string>>> = {};
let updates: Array<Record<string, unknown>> = [];
let updateError: { message: string } | null = null;
let claimWins = true;

function selectChain(table: string): Record<string, unknown> {
  const chain: Record<string, unknown> = {};
  const after: Array<[string, string]> = [];
  for (const method of ['eq', 'is', 'order', 'limit']) chain[method] = () => chain;
  chain.gt = (column: string, value: string) => {
    after.push([column, value]);
    return chain;
  };
  chain.maybeSingle = () => Promise.resolve({ data: pollRow, error: null });
  chain.then = (resolve: (value: unknown) => unknown) =>
    Promise.resolve({
      data: (tableRows[table] ?? []).filter((row) =>
        after.every(([column, value]) => row[column] > value)
      ),
      error: null,
    }).then(resolve);
  return chain;
}

function updateChain(): Record<string, unknown> {
  const chain: Record<string, unknown> = {};
  for (const method of ['eq', 'is', 'select']) chain[method] = () => chain;
  chain.maybeSingle = () =>
    Promise.resolve({ data: claimWins ? { id: 'poll-1' } : null, error: updateError });
  chain.then = (resolve: (value: unknown) => unknown) =>
    Promise.resolve({ error: updateError }).then(resolve);
  return chain;
}

vi.mock('./db/supabase-admin', () => ({
  isSupabaseAdminConfigured: () => true,
  getSupabaseAdminClient: () => ({
    from: (table: string) => ({
      select: () => selectChain(table),
      update: (values: Record<string, unknown>) => {
        updates.push(values);
        return updateChain();
      },
    }),
  }),
}));

const minutesAgo = (minutes: number): string =>
  new Date(Date.now() - minutes * 60 * 1000).toISOString();

function openPoll(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'poll-1',
    title: 'Quiz night planning',
    organiser_name: 'Peter',
    organiser_email: 'peter@orangejelly.co.uk',
    organiser_token: 'organiser-token-1',
    option_kind: 'dates',
    last_digest_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
    status: 'open',
    digest_opt_out: false,
    email_verified_at: '2026-01-01T00:05:00.000Z',
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});

  pollRow = openPoll();
  tableRows = {
    poll_options: [
      { id: 'option-1', position: '1', option_date: '2026-08-01', starts_at: '', ends_at: '' },
    ],
    poll_responses: [
      {
        participant_id: 'participant-1',
        option_id: 'option-1',
        availability: 'yes',
        updated_at: minutesAgo(1),
      },
    ],
    poll_participants: [{ id: 'participant-1', display_name: 'Sam' }],
  };
  updates = [];
  updateError = null;
  claimWins = true;
  sendPollEmail.mockResolvedValue({ success: true });
});

describe('notifyOrganiserOfResponse', () => {
  it('should mark the poll pending and email the organiser on the first response', async () => {
    await notifyOrganiserOfResponse('poll-1');

    expect(updates[0]).toEqual({ digest_pending_since: expect.any(String) });
    expect(sendPollEmail).toHaveBeenCalledTimes(1);
    const message = sendPollEmail.mock.calls[0][0];
    expect(message.to).toBe('peter@orangejelly.co.uk');
    expect(message.subject).toBe('1 new response to "Quiz night planning"');
    expect(message.text).toContain('Sam');
    expect(message.headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');
  });

  it('should hold the email inside the hourly window, but still mark the news', async () => {
    // Twenty people answering in an hour is one email, not twenty. The marker
    // stays set so the next response after the window, or the cron, carries it.
    pollRow = openPoll({ last_digest_at: minutesAgo(DIGEST_WINDOW_MINUTES - 10) });

    await notifyOrganiserOfResponse('poll-1');

    expect(updates).toEqual([{ digest_pending_since: expect.any(String) }]);
    expect(sendPollEmail).not.toHaveBeenCalled();
  });

  it('should send once the window has passed', async () => {
    pollRow = openPoll({ last_digest_at: minutesAgo(DIGEST_WINDOW_MINUTES + 5) });
    tableRows.poll_responses[0].updated_at = minutesAgo(2);

    await notifyOrganiserOfResponse('poll-1');

    expect(sendPollEmail).toHaveBeenCalledTimes(1);
  });

  it('should send nothing when the organiser has turned the emails off', async () => {
    pollRow = openPoll({ digest_opt_out: true });

    await notifyOrganiserOfResponse('poll-1');

    expect(sendPollEmail).not.toHaveBeenCalled();
  });

  it('should send nothing for a poll whose organiser never verified the address', async () => {
    pollRow = openPoll({ email_verified_at: null });

    await notifyOrganiserOfResponse('poll-1');

    expect(sendPollEmail).not.toHaveBeenCalled();
  });

  it('should send nothing when a concurrent response already claimed the window', async () => {
    claimWins = false;

    await notifyOrganiserOfResponse('poll-1');

    expect(sendPollEmail).not.toHaveBeenCalled();
  });

  it('should never throw when the database fails, because the vote is already stored', async () => {
    updateError = { message: 'database down' };

    await expect(notifyOrganiserOfResponse('poll-1')).resolves.toBeUndefined();
    expect(sendPollEmail).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Digest not sent'));
  });

  it('should never throw when the send fails, and leave the marker set for the cron', async () => {
    sendPollEmail.mockResolvedValue({ error: 'Resend is down' });

    await expect(notifyOrganiserOfResponse('poll-1')).resolves.toBeUndefined();
    // The mark and the claim, and nothing clearing the mark.
    expect(updates).toEqual([
      { digest_pending_since: expect.any(String) },
      { last_digest_at: expect.any(String) },
    ]);
  });

  it('should never throw when the send itself throws', async () => {
    sendPollEmail.mockRejectedValue(new Error('network'));

    await expect(notifyOrganiserOfResponse('poll-1')).resolves.toBeUndefined();
  });
});
