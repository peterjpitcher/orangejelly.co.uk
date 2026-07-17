import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EMAIL_PASS_LIMIT, runPollSweep } from './poll-sweep';
import { SWEEP_LIMIT } from './db/polls';
import type * as PollsModule from './db/polls';
import type * as EmailModule from './email';

/**
 * The passes behind the daily cron.
 *
 * Supabase and Resend are both mocked — the repo's rule is that a test never
 * reaches a real service, and this one deletes data and sends mail. The email
 * BUILDERS are deliberately not mocked: they are internal pure functions, and
 * mocking them would hide the thing most worth asserting here — that the nudge
 * is addressed to the organiser and to nobody else.
 */

const sweepExpiredPolls = vi.fn();
const sweepUnverifiedDrafts = vi.fn();
const sweepRateLimitWindows = vi.fn();
const findPollsDueForDeadlineReminder = vi.fn();
const markDeadlineReminded = vi.fn();
const sendPollEmail = vi.fn();

/** Every pass that ran, in order. The order is a requirement, not an accident. */
let callLog: string[] = [];

let adminConfigured = true;

/** Rows the mocked database hands back, per table. Set per test. */
let tableRows: Record<string, unknown[]> = {};

/**
 * `polls.select()` is issued twice per run — once by the digest pass, once by
 * the nudge pass — so a single rows fixture cannot serve both. They are queued
 * in pass order instead.
 */
let pollSelectQueue: unknown[][] = [];

/** Selects that should fail, by table, so a pass can be failed on its own. */
let selectErrors: Record<string, string> = {};

/** Every update the passes wrote, so bookkeeping can be asserted. */
let updates: Array<{ table: string; values: Record<string, unknown> }> = [];

vi.mock('./db/polls', async (importOriginal) => {
  const actual = await importOriginal<typeof PollsModule>();
  return {
    ...actual,
    sweepExpiredPolls: (options: unknown) => sweepExpiredPolls(options),
    sweepUnverifiedDrafts: (options: unknown) => sweepUnverifiedDrafts(options),
    sweepRateLimitWindows: (options: unknown) => sweepRateLimitWindows(options),
    findPollsDueForDeadlineReminder: (options: unknown) => findPollsDueForDeadlineReminder(options),
    markDeadlineReminded: (id: unknown) => markDeadlineReminded(id),
  };
});

vi.mock('./email', async (importOriginal) => {
  const actual = await importOriginal<typeof EmailModule>();
  return {
    ...actual,
    sendPollEmail: (message: unknown) => sendPollEmail(message),
    // No pacing in tests. The real 600ms exists for Resend's rate limit; paying
    // it here would only make the suite slow.
    POLL_EMAIL_SEND_INTERVAL_MS: 0,
  };
});

function resolveSelect(table: string): { data: unknown[]; error: { message: string } | null } {
  if (selectErrors[table]) return { data: [], error: { message: selectErrors[table] } };
  if (table === 'polls') return { data: pollSelectQueue.shift() ?? [], error: null };
  return { data: tableRows[table] ?? [], error: null };
}

/** A thenable chain: every filter returns itself, awaiting it resolves the rows. */
function makeChain(table: string): Record<string, unknown> {
  const chain: Record<string, unknown> = {};
  for (const method of ['eq', 'lt', 'gt', 'not', 'is', 'in', 'order', 'limit', 'range']) {
    chain[method] = () => chain;
  }
  chain.then = (resolve: (value: unknown) => unknown, reject?: (reason: unknown) => unknown) =>
    Promise.resolve(resolveSelect(table)).then(resolve, reject);
  return chain;
}

vi.mock('./db/supabase-admin', () => ({
  isSupabaseAdminConfigured: () => adminConfigured,
  getSupabaseAdminClient: () => ({
    from: (table: string) => ({
      select: () => makeChain(table),
      update: (values: Record<string, unknown>) => {
        updates.push({ table, values });
        return { eq: () => Promise.resolve({ error: null }) };
      },
    }),
  }),
}));

const ok = (deleted: number, remaining = 0) => ({ stored: true, data: { deleted, remaining } });

const openPoll = {
  id: 'poll-1',
  title: 'Quiz night planning',
  organiser_name: 'Peter',
  organiser_email: 'peter@orangejelly.co.uk',
  organiser_token: 'organiser-token-1',
  participant_token: 'participant-token-1',
  option_kind: 'dates' as const,
  last_digest_at: null,
  created_at: '2026-01-01T00:00:00.000Z',
};

const options = [
  { id: 'option-1', position: 1, option_date: '2026-08-01', starts_at: null, ends_at: null },
  { id: 'option-2', position: 2, option_date: '2026-08-02', starts_at: null, ends_at: null },
];

/** A response that is newer than any watermark a test sets. */
const recentResponse = {
  participant_id: 'participant-1',
  option_id: 'option-1',
  availability: 'yes' as const,
  updated_at: '2099-01-01T00:00:00.000Z',
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});

  callLog = [];
  adminConfigured = true;
  tableRows = {};
  pollSelectQueue = [[], []];
  selectErrors = {};
  updates = [];

  sweepExpiredPolls.mockImplementation(() => {
    callLog.push('expired');
    return Promise.resolve(ok(0));
  });
  sweepUnverifiedDrafts.mockImplementation(() => {
    callLog.push('drafts');
    return Promise.resolve(ok(0));
  });
  sweepRateLimitWindows.mockImplementation(() => {
    callLog.push('rateLimits');
    return Promise.resolve(ok(0));
  });
  // Not tracked in callLog: like the digest and nudge passes, it is a mail pass,
  // and callLog exists to prove the three DELETES run first. Its ordering (last)
  // is fixed structurally in runPollSweep.
  findPollsDueForDeadlineReminder.mockResolvedValue({ stored: true, data: [] });
  markDeadlineReminded.mockResolvedValue({ stored: true });
  sendPollEmail.mockResolvedValue({ success: true });
});

describe('runPollSweep — the passes and their order', () => {
  it('should run the three deletes before either mail pass', async () => {
    // The order is the guarantee: the deletes are the retention promise made in
    // the privacy notice, the mail is a courtesy. If the function times out
    // halfway, what gets dropped must be the courtesy.
    await runPollSweep();

    expect(callLog).toEqual(['expired', 'drafts', 'rateLimits']);
  });

  it('should call the shipped retention sweep with the shipped bound', async () => {
    // sweepExpiredPolls is already written and already bounded. This asserts the
    // cron calls it rather than reimplementing an unbounded delete beside it.
    await runPollSweep();

    expect(sweepExpiredPolls).toHaveBeenCalledWith({ limit: SWEEP_LIMIT });
    expect(sweepUnverifiedDrafts).toHaveBeenCalledWith({ limit: SWEEP_LIMIT });
    expect(sweepRateLimitWindows).toHaveBeenCalledWith({ limit: SWEEP_LIMIT });
  });

  it('should report clean counts and no errors when nothing is due', async () => {
    const report = await runPollSweep();

    expect(report.errors).toEqual([]);
    expect(report.expired).toEqual({ deleted: 0, backlog: false });
    expect(report.digests).toEqual({ sent: 0, failed: 0, backlog: false });
    expect(report.deadlineReminders).toEqual({ sent: 0, failed: 0, backlog: false });
  });

  it('should email the organiser and stamp the poll when a deadline has passed', async () => {
    findPollsDueForDeadlineReminder.mockResolvedValueOnce({
      stored: true,
      data: [
        {
          id: 'poll-1',
          title: 'Quiz night',
          organiser_name: 'Peter',
          organiser_email: 'peter@orangejelly.co.uk',
          organiser_token: 'org-token',
          entries_close_at: '2026-07-17T09:00:00.000Z',
        },
      ],
    });

    const report = await runPollSweep();

    expect(sendPollEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'peter@orangejelly.co.uk' })
    );
    // Stamped only after the send, so a failed send retries next run.
    expect(markDeadlineReminded).toHaveBeenCalledWith('poll-1');
    expect(report.deadlineReminders.sent).toBe(1);
    expect(report.errors).toEqual([]);
  });

  it('should not stamp the poll when the deadline reminder fails to send', async () => {
    findPollsDueForDeadlineReminder.mockResolvedValueOnce({
      stored: true,
      data: [
        {
          id: 'poll-1',
          title: 'Quiz night',
          organiser_name: 'Peter',
          organiser_email: 'peter@orangejelly.co.uk',
          organiser_token: 'org-token',
          entries_close_at: '2026-07-17T09:00:00.000Z',
        },
      ],
    });
    sendPollEmail.mockResolvedValueOnce({ error: 'Resend hiccup' });

    const report = await runPollSweep();

    expect(markDeadlineReminded).not.toHaveBeenCalled();
    expect(report.deadlineReminders.failed).toBe(1);
    // A failed send is per-poll, not a pass failure: no 500.
    expect(report.errors).toEqual([]);
  });

  it('should report an error rather than five clean zeroes when the database is unconfigured', async () => {
    // A sweep that cannot reach the database has NOT kept the retention promise.
    // Reporting "0 deleted, all well" would be indistinguishable from "nothing
    // was due", which is the silent failure this whole report exists to prevent.
    adminConfigured = false;

    const report = await runPollSweep();

    expect(report.errors).toHaveLength(1);
    expect(sweepExpiredPolls).not.toHaveBeenCalled();
  });
});

describe('runPollSweep — a failed pass never takes the others with it', () => {
  it('should carry on to every later pass when the retention delete fails', async () => {
    sweepExpiredPolls.mockResolvedValue({ stored: false, error: 'connection refused' });

    const report = await runPollSweep();

    expect(report.errors).toEqual(['retention sweep: connection refused']);
    expect(sweepUnverifiedDrafts).toHaveBeenCalled();
    expect(sweepRateLimitWindows).toHaveBeenCalled();
    expect(report.expired).toEqual({ deleted: 0, backlog: false });
  });

  it('should isolate a failing unverified-draft delete', async () => {
    sweepUnverifiedDrafts.mockResolvedValue({ stored: false, error: 'drafts exploded' });
    sweepExpiredPolls.mockResolvedValue(ok(4));

    const report = await runPollSweep();

    expect(report.errors).toEqual(['unverified-draft sweep: drafts exploded']);
    expect(report.expired.deleted).toBe(4);
    expect(sweepRateLimitWindows).toHaveBeenCalled();
  });

  it('should isolate a failing rate-limit sweep', async () => {
    sweepRateLimitWindows.mockResolvedValue({ stored: false, error: 'limits exploded' });

    const report = await runPollSweep();

    expect(report.errors).toEqual(['rate-limit sweep: limits exploded']);
    expect(report.rateLimits).toEqual({ deleted: 0, backlog: false });
  });

  it('should isolate a throwing pass, not only one that returns an error', async () => {
    sweepExpiredPolls.mockRejectedValue(new Error('the client threw'));

    const report = await runPollSweep();

    expect(report.errors).toEqual(['retention sweep: the client threw']);
    expect(sweepUnverifiedDrafts).toHaveBeenCalled();
  });

  it('should isolate a failing digest flush and still run the nudge', async () => {
    selectErrors = { polls: 'digest query failed' };

    const report = await runPollSweep();

    // Both mail passes read `polls`, so both fail here — the assertion that
    // matters is that the deletes were untouched and each failure is its own.
    expect(report.errors).toEqual([
      'digest flush: digest query failed',
      'nudge: digest query failed',
    ]);
    expect(report.expired.deleted).toBe(0);
  });

  it('should collect every failure rather than stopping at the first', async () => {
    sweepExpiredPolls.mockResolvedValue({ stored: false, error: 'one' });
    sweepUnverifiedDrafts.mockResolvedValue({ stored: false, error: 'two' });
    sweepRateLimitWindows.mockResolvedValue({ stored: false, error: 'three' });

    const report = await runPollSweep();

    expect(report.errors).toHaveLength(3);
  });
});

describe('runPollSweep — backlog reporting', () => {
  it('should report a backlog when a delete hit its bound, without calling it an error', async () => {
    // A backlog is the bound working as designed, not a fault. It is surfaced so
    // it is visible rather than silently accruing night after night.
    sweepExpiredPolls.mockResolvedValue(ok(SWEEP_LIMIT, -1));

    const report = await runPollSweep();

    expect(report.expired).toEqual({ deleted: SWEEP_LIMIT, backlog: true });
    expect(report.errors).toEqual([]);
  });

  it('should report a mail backlog when a pass filled its limit', async () => {
    const many = Array.from({ length: EMAIL_PASS_LIMIT }, (_, index) => ({
      ...openPoll,
      id: `poll-${index}`,
    }));
    pollSelectQueue = [many, []];
    tableRows = { poll_options: options, poll_responses: [recentResponse] };
    tableRows.poll_participants = [{ id: 'participant-1', display_name: 'Sam' }];

    const report = await runPollSweep();

    expect(report.digests.backlog).toBe(true);
  });
});

describe('runPollSweep — the digest flush', () => {
  beforeEach(() => {
    pollSelectQueue = [[openPoll], []];
    tableRows = {
      poll_options: options,
      poll_responses: [recentResponse],
      poll_participants: [{ id: 'participant-1', display_name: 'Sam' }],
    };
  });

  it('should email the organiser and clear the pending marker on success', async () => {
    const report = await runPollSweep();

    expect(report.digests).toEqual({ sent: 1, failed: 0, backlog: false });
    expect(sendPollEmail).toHaveBeenCalledTimes(1);
    expect(sendPollEmail.mock.calls[0][0]).toMatchObject({ to: 'peter@orangejelly.co.uk' });
    expect(updates).toContainEqual(
      expect.objectContaining({
        table: 'polls',
        values: expect.objectContaining({ digest_pending_since: null }),
      })
    );
  });

  it('should carry a List-Unsubscribe header, because a digest is recurring mail', async () => {
    await runPollSweep();

    const headers = sendPollEmail.mock.calls[0][0].headers;
    expect(headers['List-Unsubscribe']).toContain('/unsubscribe');
    expect(headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');
  });

  it('should count new AND edited responses, keyed off the response timestamp', async () => {
    // The obvious version counts poll_participants.created_at, which never moves
    // when somebody edits an answer — so an edit would trip the window and send
    // a digest reading "0 new responses" above an empty list.
    await runPollSweep();

    expect(sendPollEmail.mock.calls[0][0].subject).toContain('1 new response');
  });

  it('should send nothing and clear the marker when no response has moved since the watermark', async () => {
    // Reachable under a race where a lazy send already flushed the window. A
    // digest saying "0 new responses" is worse than no digest at all.
    tableRows.poll_responses = [{ ...recentResponse, updated_at: '2020-01-01T00:00:00.000Z' }];

    const report = await runPollSweep();

    expect(sendPollEmail).not.toHaveBeenCalled();
    expect(report.digests.sent).toBe(0);
    expect(updates).toContainEqual({ table: 'polls', values: { digest_pending_since: null } });
  });

  it('should leave the marker set when the send fails, so tomorrow retries', async () => {
    sendPollEmail.mockResolvedValue({ error: 'Failed to send email.' });

    const report = await runPollSweep();

    expect(report.digests).toEqual({ sent: 0, failed: 1, backlog: false });
    expect(updates).toEqual([]);
    // A failed send is a per-poll fault, not a failed pass — the cron must not
    // 500 because one organiser's address bounced.
    expect(report.errors).toEqual([]);
  });
});

describe('runPollSweep — the nudge', () => {
  beforeEach(() => {
    pollSelectQueue = [[], [openPoll]];
    tableRows = { poll_options: options, poll_responses: [] };
  });

  it('should email the ORGANISER and never a participant', async () => {
    // The briefed email was meant to chase non-responders and cannot exist: a
    // participant row only appears once somebody has responded, so the set of
    // non-responders is empty at the schema level. This asserts the only address
    // the pass ever touches is the one that was verified.
    await runPollSweep();

    expect(sendPollEmail).toHaveBeenCalledTimes(1);
    expect(sendPollEmail.mock.calls[0][0].to).toBe('peter@orangejelly.co.uk');
  });

  it('should stamp nudge_sent_at only after a successful send', async () => {
    const report = await runPollSweep();

    expect(report.nudges).toEqual({ sent: 1, failed: 0, backlog: false });
    expect(updates).toHaveLength(1);
    expect(updates[0].table).toBe('polls');
    expect(updates[0].values).toHaveProperty('nudge_sent_at');
  });

  it('should leave nudge_sent_at unset when the send fails, so tomorrow retries', async () => {
    sendPollEmail.mockResolvedValue({ error: 'Failed to send email.' });

    const report = await runPollSweep();

    expect(report.nudges).toEqual({ sent: 0, failed: 1, backlog: false });
    expect(updates).toEqual([]);
    expect(report.errors).toEqual([]);
  });

  it('should skip a poll that has had response activity inside the quiet window', async () => {
    tableRows.poll_responses = [recentResponse];

    const report = await runPollSweep();

    expect(sendPollEmail).not.toHaveBeenCalled();
    expect(report.nudges.sent).toBe(0);
    // Nothing written: a poll that is not quiet must not burn its one nudge.
    expect(updates).toEqual([]);
  });

  it('should not crash when nobody has responded, which is the commonest case', async () => {
    // "The best option right now is <undefined>" is the obvious crash here.
    const report = await runPollSweep();

    expect(report.errors).toEqual([]);
    expect(sendPollEmail.mock.calls[0][0].text).toContain('Nobody has responded yet.');
  });

  it('should name the leading option when there is one', async () => {
    tableRows.poll_responses = [{ ...recentResponse, updated_at: '2020-01-01T00:00:00.000Z' }];

    await runPollSweep();

    const { text } = sendPollEmail.mock.calls[0][0];
    expect(text).toContain('1 person has responded so far');
    expect(text).toContain('Saturday, 1 August 2026');
  });
});
