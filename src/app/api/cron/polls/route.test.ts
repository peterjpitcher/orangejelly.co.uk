import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GET } from './route';
import type { PollSweepReport } from '@/lib/poll-sweep';

/**
 * The route's whole job is the secret check and the status code. The passes
 * themselves are mocked out and tested in poll-sweep.test.ts.
 */

const runPollSweep = vi.fn();

vi.mock('@/lib/poll-sweep', () => ({
  runPollSweep: () => runPollSweep(),
}));

const cleanReport: PollSweepReport = {
  expired: { deleted: 3, backlog: false },
  drafts: { deleted: 1, backlog: false },
  rateLimits: { deleted: 12, backlog: false },
  digests: { sent: 2, failed: 0, backlog: false },
  nudges: { sent: 1, failed: 0, backlog: false },
  errors: [],
};

const SECRET = 'a-long-and-random-cron-secret';

function get(authorization?: string): Promise<Response> {
  return GET(
    new Request('https://www.orangejelly.co.uk/api/cron/polls', {
      headers: authorization ? { authorization } : {},
    })
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  runPollSweep.mockResolvedValue(cleanReport);
  process.env.CRON_SECRET = SECRET;
});

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.CRON_SECRET;
});

describe('GET /api/cron/polls — authentication', () => {
  it('should fail closed with 503 when CRON_SECRET is not set', async () => {
    // An unset secret must never mean an open delete endpoint. Refusing is the
    // only safe reading: the alternative is that a missing env var silently
    // publishes a route that deletes other people's data.
    delete process.env.CRON_SECRET;

    const response = await get(`Bearer ${SECRET}`);

    expect(response.status).toBe(503);
    expect(runPollSweep).not.toHaveBeenCalled();
  });

  it('should reject with 401 when no authorization header is sent', async () => {
    const response = await get();

    expect(response.status).toBe(401);
    expect(runPollSweep).not.toHaveBeenCalled();
  });

  it('should reject with 401 when the secret is wrong', async () => {
    const response = await get('Bearer not-the-right-secret-at-all-no');

    expect(response.status).toBe(401);
    expect(runPollSweep).not.toHaveBeenCalled();
  });

  it('should reject a wrong secret of identical length without throwing', async () => {
    // The length guard exists because timingSafeEqual THROWS on a length
    // mismatch; this is the case that reaches the comparison itself. A secret
    // the same length as the real one must still be refused, and must not 500 —
    // a 500 here would confirm the route exists.
    const sameLength = 'b'.repeat(SECRET.length);

    const response = await get(`Bearer ${sameLength}`);

    expect(response.status).toBe(401);
    expect(runPollSweep).not.toHaveBeenCalled();
  });

  it('should reject a bare secret sent without the Bearer scheme', async () => {
    const response = await get(SECRET);

    expect(response.status).toBe(401);
  });

  it('should run the sweep when the secret matches', async () => {
    const response = await get(`Bearer ${SECRET}`);

    expect(response.status).toBe(200);
    expect(runPollSweep).toHaveBeenCalledTimes(1);
  });
});

describe('GET /api/cron/polls — reporting', () => {
  it('should return 200 and the per-pass counts when every pass succeeded', async () => {
    const response = await get(`Bearer ${SECRET}`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(cleanReport);
  });

  it('should return 500 when any pass failed', async () => {
    // A silent 200 on a failed retention run is worse than a 500: the deletion
    // promise quietly stops being kept and nobody knows. Vercel surfaces the
    // non-200, and that is the whole of our alerting.
    runPollSweep.mockResolvedValue({
      ...cleanReport,
      errors: ['retention sweep: connection refused'],
    });

    const response = await get(`Bearer ${SECRET}`);

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      errors: ['retention sweep: connection refused'],
    });
  });

  it('should still report the passes that succeeded alongside the failure', async () => {
    runPollSweep.mockResolvedValue({
      ...cleanReport,
      digests: { sent: 0, failed: 0, backlog: false },
      errors: ['digest flush: boom'],
    });

    const response = await get(`Bearer ${SECRET}`);
    const body = await response.json();

    expect(response.status).toBe(500);
    // The retention delete ran and is reported even though a later pass failed.
    expect(body.expired.deleted).toBe(3);
  });

  it('should return 200 for a backlog, because a bound working is not an error', async () => {
    runPollSweep.mockResolvedValue({
      ...cleanReport,
      expired: { deleted: 500, backlog: true },
    });

    const response = await get(`Bearer ${SECRET}`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      expired: { deleted: 500, backlog: true },
    });
  });
});
