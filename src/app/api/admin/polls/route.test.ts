import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GET } from './route';
import { requireAdmin } from '@/lib/admin-auth';

/**
 * The /availability dashboard's poll list.
 *
 * It returns organiser tokens, so two things are asserted: it sits behind the
 * shared admin gate, and it lists only the signed-in admin's own polls. Poll
 * creation is public, so the table also holds strangers' polls, and until
 * 29 September 2026 this route returned every one of them.
 */

vi.mock('@/lib/admin-auth', () => ({ requireAdmin: vi.fn() }));

/** Every filter the route applied to `polls`, so the owner filter can be asserted. */
let pollFilters: Array<[string, unknown]> = [];
let pollRows: unknown[] = [];

function chain(resolveWith: () => unknown, record?: (column: string, value: unknown) => void) {
  const self: Record<string, unknown> = {};
  for (const method of ['select', 'order', 'in']) self[method] = () => self;
  self.eq = (column: string, value: unknown) => {
    record?.(column, value);
    return self;
  };
  self.then = (resolve: (value: unknown) => unknown) =>
    Promise.resolve(resolveWith()).then(resolve);
  return self;
}

vi.mock('@/lib/db/supabase-admin', () => ({
  getSupabaseAdminClient: () => ({
    from: (table: string) =>
      table === 'polls'
        ? chain(
            () => ({ data: pollRows, error: null }),
            (column, value) => pollFilters.push([column, value])
          )
        : chain(() => ({ data: [], error: null })),
  }),
}));

const request = (): Request => new Request('https://www.orangejelly.co.uk/api/admin/polls');

beforeEach(() => {
  vi.mocked(requireAdmin).mockReset();
  pollFilters = [];
  pollRows = [];
});

describe('GET /api/admin/polls', () => {
  it('turns away anyone who is not an admin, before touching the data', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({
      response: new Response(JSON.stringify({ error: 'Not authenticated.' }), { status: 401 }),
    });

    expect((await GET(request())).status).toBe(401);
    expect(pollFilters).toEqual([]);
  });

  it("lists only the signed-in admin's own polls", async () => {
    vi.mocked(requireAdmin).mockResolvedValue({ email: 'Peter@OrangeJelly.co.uk' });

    const response = await GET(request());

    expect(response.status).toBe(200);
    // Lowercased, because the data layer stores organiser addresses lowercased.
    expect(pollFilters).toContainEqual(['organiser_email', 'peter@orangejelly.co.uk']);
  });

  it('returns the polls it finds', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({ email: 'peter@orangejelly.co.uk' });
    pollRows = [
      {
        id: 'poll-1',
        title: 'Quiz night planning',
        status: 'open',
        organiser_token: 'o-token',
        participant_token: 'p-token',
        option_kind: 'dates',
        confirmed_option_id: null,
        expires_at: '2026-12-01T00:00:00.000Z',
        created_at: '2026-09-01T00:00:00.000Z',
      },
    ];

    const body = await (await GET(request())).json();

    expect(body.polls).toHaveLength(1);
    expect(body.polls[0]).toMatchObject({ id: 'poll-1', responderCount: 0 });
  });
});
