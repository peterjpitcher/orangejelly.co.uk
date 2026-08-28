import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GET, PATCH } from '@/app/api/admin/enquiries/route';
import { listEnquiries, setEnquiryStatus } from '@/lib/db/enquiries';
import { LEAD_STATES, isLeadState } from '@/lib/schemas/enquiry';
import type * as AdminAuth from '@/lib/admin-auth';

/**
 * The admin enquiry route.
 *
 * It returns every answer someone gave, which is the most commercially sensitive
 * data the site holds. Most of what is worth testing here is the gate.
 */
vi.mock('@/lib/db/enquiries', () => ({
  listEnquiries: vi.fn(),
  setEnquiryStatus: vi.fn(),
}));

const admin = vi.fn();
vi.mock('@/lib/admin-auth', async () => {
  const actual = await vi.importActual<typeof AdminAuth>('@/lib/admin-auth');
  return { ...actual, requireAdmin: () => admin() };
});

function request(url: string, init?: RequestInit): Request {
  return new Request(url, init);
}

describe('lead states', () => {
  it('names the six the pipeline uses', () => {
    expect(LEAD_STATES).toEqual([
      'new',
      'contacted',
      'qualified',
      'conversation_booked',
      'declined',
      'client',
    ]);
  });

  it('rejects anything else', () => {
    expect(isLeadState('new')).toBe(true);
    expect(isLeadState('warm')).toBe(false);
    expect(isLeadState(undefined)).toBe(false);
  });
});

describe('GET /api/admin/enquiries', () => {
  beforeEach(() => {
    vi.mocked(listEnquiries).mockReset().mockResolvedValue({ enquiries: [] });
    vi.mocked(setEnquiryStatus).mockReset().mockResolvedValue({ stored: true, id: 'lead-1' });
    admin.mockReset().mockResolvedValue({ email: 'peter@orangejelly.co.uk' });
  });

  it('returns the enquiries to an admin', async () => {
    const response = await GET(request('https://oj.test/api/admin/enquiries'));
    expect(response.status).toBe(200);
    expect(listEnquiries).toHaveBeenCalled();
  });

  it('reads nothing for anyone who is not an admin', async () => {
    admin.mockResolvedValue({
      response: new Response(JSON.stringify({ error: 'Not authenticated.' }), { status: 401 }),
    });

    const response = await GET(request('https://oj.test/api/admin/enquiries'));
    expect(response.status).toBe(401);
    // The gate has to stop the query, not just the response. Reading the row and
    // then discarding it still puts it through the logs.
    expect(listEnquiries).not.toHaveBeenCalled();
  });

  it('filters by lead state', async () => {
    await GET(request('https://oj.test/api/admin/enquiries?status=qualified'));
    expect(listEnquiries).toHaveBeenCalledWith(expect.objectContaining({ status: 'qualified' }));
  });

  it('refuses a state that does not exist rather than returning everything', async () => {
    const response = await GET(request('https://oj.test/api/admin/enquiries?status=warm'));
    expect(response.status).toBe(400);
    expect(listEnquiries).not.toHaveBeenCalled();
  });

  it('caps how much can be pulled in one request', async () => {
    await GET(request('https://oj.test/api/admin/enquiries?limit=5000'));
    // listEnquiries clamps to 200. This asserts the parameter reaches it rather
    // than being spliced into a query.
    expect(listEnquiries).toHaveBeenCalledWith(expect.objectContaining({ limit: 5000 }));
  });
});

describe('PATCH /api/admin/enquiries', () => {
  beforeEach(() => {
    vi.mocked(setEnquiryStatus).mockReset().mockResolvedValue({ stored: true, id: 'lead-1' });
    admin.mockReset().mockResolvedValue({ email: 'peter@orangejelly.co.uk' });
  });

  function patch(body: unknown): Request {
    return request('https://oj.test/api/admin/enquiries', {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  it('moves a lead along the pipeline', async () => {
    const response = await PATCH(patch({ id: 'lead-1', status: 'conversation_booked' }));
    expect(response.status).toBe(200);
    expect(setEnquiryStatus).toHaveBeenCalledWith('lead-1', 'conversation_booked');
  });

  it('writes nothing for anyone who is not an admin', async () => {
    admin.mockResolvedValue({
      response: new Response(JSON.stringify({ error: 'Not authorised.' }), { status: 403 }),
    });

    const response = await PATCH(patch({ id: 'lead-1', status: 'client' }));
    expect(response.status).toBe(403);
    expect(setEnquiryStatus).not.toHaveBeenCalled();
  });

  it('refuses a state outside the six', async () => {
    const response = await PATCH(patch({ id: 'lead-1', status: 'warm' }));
    expect(response.status).toBe(400);
    expect(setEnquiryStatus).not.toHaveBeenCalled();
  });

  it('refuses a malformed body without throwing', async () => {
    const response = await PATCH(
      request('https://oj.test/api/admin/enquiries', { method: 'PATCH', body: 'not json' })
    );
    expect(response.status).toBe(400);
  });

  it('asks which enquiry when none is named', async () => {
    const response = await PATCH(patch({ status: 'client' }));
    expect(response.status).toBe(400);
  });
});
