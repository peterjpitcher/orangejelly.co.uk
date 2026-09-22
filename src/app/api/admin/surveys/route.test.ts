import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GET } from './route';
import { requireAdmin } from '@/lib/admin-auth';
import { getSurveysForAdmin } from '@/lib/db/surveys';

vi.mock('@/lib/admin-auth', () => ({ requireAdmin: vi.fn() }));
vi.mock('@/lib/db/surveys', () => ({ getSurveysForAdmin: vi.fn() }));

const request = (): Request => new Request('https://www.orangejelly.co.uk/api/admin/surveys');

beforeEach(() => {
  vi.mocked(requireAdmin).mockReset();
  vi.mocked(getSurveysForAdmin).mockReset().mockResolvedValue([]);
});

describe('GET /api/admin/surveys', () => {
  it('turns away anyone who is not an admin, before touching the data', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({
      response: new Response(JSON.stringify({ error: 'Unauthorised.' }), { status: 401 }),
    });
    expect((await GET(request())).status).toBe(401);
    expect(getSurveysForAdmin).not.toHaveBeenCalled();
  });

  it('returns the surveys to an admin', async () => {
    vi.mocked(requireAdmin).mockResolvedValue({ email: 'peter@orangejelly.co.uk' });
    const response = await GET(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ surveys: [] });
  });

  it('answers 500 with a plain message when the read fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(requireAdmin).mockResolvedValue({ email: 'peter@orangejelly.co.uk' });
    vi.mocked(getSurveysForAdmin).mockRejectedValue(new Error('timeout'));
    const response = await GET(request());
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Could not load surveys.' });
  });
});
