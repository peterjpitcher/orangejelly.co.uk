import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SWEEP_LIMIT, sweepRateLimitWindows, sweepUnverifiedDrafts } from './polls';

/**
 * The two deletes added for the Phase 5 cron.
 *
 * A separate file from polls.test.ts on purpose: that file's Supabase mock is
 * shared by every test in it and shaped around the paths it already covers.
 * These two need a head-count request and a range request that it has no notion
 * of, and widening a mock that 589 green tests depend on to serve two new
 * functions is a poor trade.
 *
 * The bound is what is being tested. Both of these run unattended on a cron with
 * nobody to ask for approval, and the workspace rules gate any bulk operation
 * over 1,000 rows.
 */

const del = vi.fn();

/** What the mocked database holds. Set per test. */
const state: {
  draftIds: Array<{ id: string }>;
  rateLimitCount: number;
  boundaryRows: Array<{ window_start: string }>;
  deletedCount: number;
  selectError: string | null;
  deleteError: string | null;
} = {
  draftIds: [],
  rateLimitCount: 0,
  boundaryRows: [],
  deletedCount: 0,
  selectError: null,
  deleteError: null,
};

/** Captured so the bounds can be asserted rather than assumed. */
let limitArg: number | null = null;
let rangeArgs: [number, number] | null = null;
let inFilter: string[] | null = null;
let deleteFilters: Array<{ table: string; column: string; value: unknown }> = [];
let countedHead = false;

function error(message: string | null) {
  return message ? { message } : null;
}

function makeSelectChain(table: string, options?: { head?: boolean }): Record<string, unknown> {
  if (options?.head) countedHead = true;

  const chain: Record<string, unknown> = {};
  for (const method of ['eq', 'lt', 'order']) {
    chain[method] = () => chain;
  }

  chain.limit = (n: number) => {
    limitArg = n;
    return Promise.resolve({ data: state.draftIds, error: error(state.selectError) });
  };

  chain.range = (from: number, to: number) => {
    rangeArgs = [from, to];
    return Promise.resolve({ data: state.boundaryRows, error: error(state.selectError) });
  };

  // Awaited directly by the head count on poll_rate_limits.
  chain.then = (resolve: (value: unknown) => unknown) =>
    Promise.resolve({
      count: state.rateLimitCount,
      data: null,
      error: error(state.selectError),
    }).then(resolve);

  return chain;
}

vi.mock('./supabase-admin', () => ({
  isSupabaseAdminConfigured: () => true,
  getSupabaseAdminClient: () => ({
    from: (table: string) => ({
      select: (_columns: string, options?: { head?: boolean }) => makeSelectChain(table, options),
      delete: (options?: { count?: string }) => {
        del(table, options);
        const chain: Record<string, unknown> = {};
        chain.in = (_column: string, ids: string[]) => {
          inFilter = ids;
          return chain;
        };
        chain.eq = (column: string, value: unknown) => {
          deleteFilters.push({ table, column, value });
          return chain;
        };
        chain.lt = (column: string, value: unknown) => {
          deleteFilters.push({ table, column, value });
          return chain;
        };
        chain.then = (resolve: (value: unknown) => unknown) =>
          Promise.resolve({ error: error(state.deleteError), count: state.deletedCount }).then(
            resolve
          );
        return chain;
      },
    }),
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  state.draftIds = [];
  state.rateLimitCount = 0;
  state.boundaryRows = [];
  state.deletedCount = 0;
  state.selectError = null;
  state.deleteError = null;
  limitArg = null;
  rangeArgs = null;
  inFilter = null;
  deleteFilters = [];
  countedHead = false;
});

describe('sweepUnverifiedDrafts', () => {
  it('should never delete more than the sweep limit in one run', async () => {
    // This one needs the bound MORE than the retention sweep, not less. The
    // retention sweep leans on expires_at, which is pushed forward as a poll is
    // used, so its due set is self-limiting. A draft has no such column: every
    // draft older than a day is due, every day, forever.
    state.draftIds = [{ id: 'poll-1' }];

    const result = await sweepUnverifiedDrafts({ limit: 10_000 });

    expect(result.stored).toBe(true);
    expect(limitArg).toBe(SWEEP_LIMIT);
  });

  it('should delete by id rather than by predicate', async () => {
    // Select-then-delete-by-id is what makes the bound real: a bare predicate
    // delete cannot be limited.
    state.draftIds = [{ id: 'poll-1' }, { id: 'poll-2' }];

    const result = await sweepUnverifiedDrafts();

    expect(inFilter).toEqual(['poll-1', 'poll-2']);
    expect(result.data?.deleted).toBe(2);
  });

  it('should re-assert the draft status on the delete, not only on the select', async () => {
    // A poll verified in the gap between the select and the delete would
    // otherwise be deleted out from under an organiser who had just brought it
    // to life — silently.
    state.draftIds = [{ id: 'poll-1' }];

    await sweepUnverifiedDrafts();

    expect(deleteFilters).toContainEqual({ table: 'polls', column: 'status', value: 'draft' });
  });

  it('should report nothing to do when no draft has lapsed', async () => {
    state.draftIds = [];

    const result = await sweepUnverifiedDrafts();

    expect(result.data).toEqual({ deleted: 0, remaining: 0 });
    expect(del).not.toHaveBeenCalled();
  });

  it('should flag a backlog when it filled a whole batch', async () => {
    state.draftIds = Array.from({ length: SWEEP_LIMIT }, (_, i) => ({ id: `poll-${i}` }));

    const result = await sweepUnverifiedDrafts();

    expect(result.data?.remaining).toBe(-1);
  });

  it('should return the error rather than throwing when the select fails', async () => {
    state.selectError = 'connection refused';

    const result = await sweepUnverifiedDrafts();

    expect(result).toEqual({ stored: false, error: 'connection refused' });
  });

  it('should return the error rather than throwing when the delete fails', async () => {
    state.draftIds = [{ id: 'poll-1' }];
    state.deleteError = 'delete refused';

    const result = await sweepUnverifiedDrafts();

    expect(result).toEqual({ stored: false, error: 'delete refused' });
  });
});

describe('sweepRateLimitWindows', () => {
  it('should count before deleting, so the row count is measured and not assumed', async () => {
    // poll_rate_limits has no surrogate key — its primary key is the composite
    // (bucket, key, window_start) — so the select-ids-then-delete-by-id shape is
    // unavailable and the bound is built out of an exact count instead.
    state.rateLimitCount = 12;

    const result = await sweepRateLimitWindows();

    expect(countedHead).toBe(true);
    expect(result.data).toEqual({ deleted: 12, remaining: 0 });
  });

  it('should do nothing when no window has closed', async () => {
    state.rateLimitCount = 0;

    const result = await sweepRateLimitWindows();

    expect(result.data).toEqual({ deleted: 0, remaining: 0 });
    expect(del).not.toHaveBeenCalled();
  });

  it('should delete everything due in one statement when the count is within the bound', async () => {
    state.rateLimitCount = SWEEP_LIMIT;

    const result = await sweepRateLimitWindows();

    expect(result.data).toEqual({ deleted: SWEEP_LIMIT, remaining: 0 });
    expect(rangeArgs).toBeNull();
  });

  it('should delete only a bounded slice when more is due than one run may take', async () => {
    // The slice is everything strictly below the window_start of the limit-th
    // oldest due row, so by construction fewer than `limit` rows fall inside it.
    state.rateLimitCount = SWEEP_LIMIT + 1;
    state.boundaryRows = [{ window_start: '2026-07-10T03:00:00.000Z' }];
    state.deletedCount = 480;

    const result = await sweepRateLimitWindows();

    expect(rangeArgs).toEqual([SWEEP_LIMIT - 1, SWEEP_LIMIT - 1]);
    expect(deleteFilters).toContainEqual({
      table: 'poll_rate_limits',
      column: 'window_start',
      value: '2026-07-10T03:00:00.000Z',
    });
    expect(result.data).toEqual({ deleted: 480, remaining: -1 });
  });

  it('should honour the sweep cap even when a caller asks for more', async () => {
    state.rateLimitCount = 50;

    await sweepRateLimitWindows({ limit: 10_000 });

    // 50 due against a cap of 500 takes the single-statement path; the cap is
    // what decided that, so a caller cannot opt out of it.
    expect(rangeArgs).toBeNull();
  });

  it('should surface a stalled slice as a backlog rather than exceeding its bound', async () => {
    // Reachable only if one window_start holds 500+ counters, which needs 500
    // distinct IPs inside a single hour. If it ever happens the sweep stalls and
    // says so, rather than quietly deleting an unbounded batch.
    state.rateLimitCount = SWEEP_LIMIT + 1;
    state.boundaryRows = [];

    const result = await sweepRateLimitWindows();

    expect(result.data).toEqual({ deleted: 0, remaining: -1 });
  });

  it('should return the error rather than throwing when the count fails', async () => {
    state.selectError = 'count refused';

    const result = await sweepRateLimitWindows();

    expect(result).toEqual({ stored: false, error: 'count refused' });
  });

  it('should return the error rather than throwing when the delete fails', async () => {
    state.rateLimitCount = 10;
    state.deleteError = 'delete refused';

    const result = await sweepRateLimitWindows();

    expect(result).toEqual({ stored: false, error: 'delete refused' });
  });
});
