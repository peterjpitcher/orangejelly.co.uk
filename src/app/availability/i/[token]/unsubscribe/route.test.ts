import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GET, POST } from './route';
import { setInviteeOptOut } from '@/lib/db/poll-invitees';

/**
 * The List-Unsubscribe address on an invitation and its reminder. POST (the mail
 * client's one-click button) stops emails about this poll for this person; GET
 * never does, because link scanners prefetch GETs.
 */

vi.mock('@/lib/db/poll-invitees', () => ({
  INVITEE_NOT_FOUND: 'INVITEE_NOT_FOUND',
  setInviteeOptOut: vi.fn(),
}));

const TOKEN = 'aaaaaaaaaaaaaaaaaaaaaa'; // 22 chars: a well-formed token shape.
const URL_FOR = (token: string): string =>
  `https://www.orangejelly.co.uk/availability/i/${token}/unsubscribe`;

function oneClick(token: string): Request {
  return new Request(URL_FOR(token), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'List-Unsubscribe=One-Click',
  });
}

beforeEach(() => {
  vi.mocked(setInviteeOptOut).mockReset().mockResolvedValue({ stored: true });
});

describe('POST: one-click unsubscribe', () => {
  it('should turn the emails off and say so', async () => {
    const response = await POST(oneClick(TOKEN), { params: { token: TOKEN } });

    expect(response.status).toBe(200);
    expect(setInviteeOptOut).toHaveBeenCalledWith(TOKEN, true);
    expect(await response.text()).toContain('Unsubscribed');
  });

  it('should answer a dead poll link with a 404', async () => {
    vi.mocked(setInviteeOptOut).mockResolvedValue({ stored: false, error: 'INVITEE_NOT_FOUND' });

    const response = await POST(oneClick(TOKEN), { params: { token: TOKEN } });

    expect(response.status).toBe(404);
  });

  it('should refuse a malformed token without touching the database', async () => {
    const response = await POST(oneClick('nope'), { params: { token: 'nope' } });

    expect(response.status).toBe(404);
    expect(setInviteeOptOut).not.toHaveBeenCalled();
  });

  it('should report a database fault as a failure, not a success', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(setInviteeOptOut).mockResolvedValue({ stored: false, error: 'connection reset' });

    const response = await POST(oneClick(TOKEN), { params: { token: TOKEN } });

    expect(response.status).toBe(500);
  });
});

describe('GET: a person following the link', () => {
  it('should change nothing, and send them to the switch on their poll page', () => {
    const response = GET(new Request(URL_FOR(TOKEN)), { params: { token: TOKEN } });

    expect(setInviteeOptOut).not.toHaveBeenCalled();
    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe(
      `https://www.orangejelly.co.uk/availability/i/${TOKEN}#emails`
    );
  });

  it('should 404 a malformed token', () => {
    const response = GET(new Request(URL_FOR('nope')), { params: { token: 'nope' } });

    expect(response.status).toBe(404);
  });
});
