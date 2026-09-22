import { afterEach, describe, expect, it, vi } from 'vitest';

const getSurveyForVisitor = vi.fn();
vi.mock('@/lib/db/surveys', () => ({
  getSurveyForVisitor: (...args: unknown[]) => getSurveyForVisitor(...args),
}));

import { GET } from './route';

describe('GET /api/survey-promotion', () => {
  afterEach(() => {
    getSurveyForVisitor.mockReset();
    vi.restoreAllMocks();
  });

  it('says yes only while the promoted survey is live, cached briefly at the CDN', async () => {
    getSurveyForVisitor.mockResolvedValue({ mode: 'live', survey: {} });
    const response = await GET();
    expect(await response.json()).toEqual({ live: true });
    expect(getSurveyForVisitor).toHaveBeenCalledWith('pub-apps');
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=300');
  });

  it('reads a closed survey, a draft and a missing one the same way', async () => {
    for (const access of [{ mode: 'closed', survey: {} }, null]) {
      getSurveyForVisitor.mockResolvedValue(access);
      expect(await (await GET()).json()).toEqual({ live: false });
    }
  });

  it('fails closed, uncached, when the database cannot be read', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    getSurveyForVisitor.mockRejectedValue(new Error('down'));
    const response = await GET();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ live: false });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
});
