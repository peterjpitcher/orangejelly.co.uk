import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GET } from './route';

const sweepSurveyContacts = vi.fn();

vi.mock('@/lib/db/surveys', () => ({
  sweepSurveyContacts: () => sweepSurveyContacts(),
}));

const SECRET = 'a-long-and-random-cron-secret';

function get(authorization?: string): Promise<Response> {
  return GET(
    new Request('https://www.orangejelly.co.uk/api/cron/surveys', {
      headers: authorization ? { authorization } : {},
    })
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  sweepSurveyContacts.mockResolvedValue({ deleted: 2 });
  process.env.CRON_SECRET = SECRET;
});

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.CRON_SECRET;
});

describe('GET /api/cron/surveys', () => {
  it('fails closed with 503 when CRON_SECRET is not set', async () => {
    delete process.env.CRON_SECRET;
    expect((await get(`Bearer ${SECRET}`)).status).toBe(503);
    expect(sweepSurveyContacts).not.toHaveBeenCalled();
  });

  it('refuses a missing or wrong secret, including one of a different length', async () => {
    for (const header of [undefined, `Bearer ${SECRET}x`, 'Bearer nope', SECRET]) {
      expect((await get(header)).status).toBe(401);
    }
    expect(sweepSurveyContacts).not.toHaveBeenCalled();
  });

  it('runs the sweep and reports what it deleted', async () => {
    const response = await get(`Bearer ${SECRET}`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ deleted: 2 });
  });

  it('answers 500 when the sweep fails, so the dashboard shows it', async () => {
    sweepSurveyContacts.mockResolvedValue({ deleted: 0, error: 'permission denied' });
    expect((await get(`Bearer ${SECRET}`)).status).toBe(500);
  });
});
