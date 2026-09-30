import { beforeEach, describe, expect, it, vi } from 'vitest';

import { reopenPoll } from './polls';

/**
 * Reopening, now that a passed deadline closes entries (Peter, 30 September
 * 2026). A poll can have stopped two ways, so reopening makes two conditional
 * updates: one for a closed poll, one for a passed deadline. Supabase is mocked
 * and records each update's values and filters, in order.
 */

type Filter = [string, string, unknown];
let updates: Array<{ values: Record<string, unknown>; filters: Filter[] }> = [];
/** What each successive update's `.maybeSingle()` returns: a row, or null. */
let results: Array<{ id: string } | null> = [];

vi.mock('./supabase-admin', () => ({
  isSupabaseAdminConfigured: () => true,
  getSupabaseAdminClient: () => ({
    from: () => ({
      update: (values: Record<string, unknown>) => {
        const entry = { values, filters: [] as Filter[] };
        updates.push(entry);
        const chain: Record<string, unknown> = {};
        for (const method of ['eq', 'lte']) {
          chain[method] = (column: string, value: unknown) => {
            entry.filters.push([method, column, value]);
            return chain;
          };
        }
        chain.select = () => chain;
        chain.maybeSingle = async () => ({ data: results.shift() ?? null, error: null });
        return chain;
      },
    }),
  }),
}));

beforeEach(() => {
  updates = [];
  results = [];
});

describe('reopenPoll', () => {
  it('should reopen a closed poll and keep a deadline still to come', async () => {
    results = [{ id: 'poll-1' }, null];

    const result = await reopenPoll('otok');

    expect(result).toEqual({ stored: true });
    expect(updates[0]).toEqual({
      values: { status: 'open', closes_at: null },
      filters: [
        ['eq', 'organiser_token', 'otok'],
        ['eq', 'status', 'closed'],
      ],
    });
    // The deadline is only ever cleared once it has passed.
    expect(updates[1].values).toEqual({ entries_close_at: null });
    expect(updates[1].filters).toContainEqual(['lte', 'entries_close_at', expect.any(String)]);
  });

  it('should reopen a poll whose deadline has passed by removing the deadline', async () => {
    results = [null, { id: 'poll-1' }];

    expect(await reopenPoll('otok')).toEqual({ stored: true });
    expect(updates[1].filters).toEqual([
      ['eq', 'organiser_token', 'otok'],
      ['eq', 'status', 'open'],
      ['lte', 'entries_close_at', expect.any(String)],
    ]);
  });

  it('should refuse when the poll was neither closed nor past its deadline', async () => {
    results = [null, null];

    expect(await reopenPoll('otok')).toEqual({
      stored: false,
      error: 'This poll cannot be reopened.',
    });
  });
});
