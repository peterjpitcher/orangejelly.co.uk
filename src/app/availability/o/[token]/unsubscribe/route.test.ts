import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GET, POST } from './route';
import { setDigestOptOut } from '@/lib/db/polls';

/**
 * The List-Unsubscribe address on the digest and the nudge.
 *
 * Until 29 September 2026 nothing answered here, so every unsubscribe button in
 * a mail client led to a 404. The two rules pinned below: POST (the one-click
 * button) switches the emails off, and GET never does, because link scanners
 * prefetch GETs.
 */

vi.mock('@/lib/db/polls', () => ({
  POLL_NOT_FOUND: 'POLL_NOT_FOUND',
  setDigestOptOut: vi.fn(),
}));

const TOKEN = 'aaaaaaaaaaaaaaaaaaaaaa'; // 22 chars: a well-formed token shape.
const URL_FOR = (token: string): string =>
  `https://www.orangejelly.co.uk/availability/o/${token}/unsubscribe`;

function oneClick(token: string): Request {
  return new Request(URL_FOR(token), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'List-Unsubscribe=One-Click',
  });
}

beforeEach(() => {
  vi.mocked(setDigestOptOut).mockReset().mockResolvedValue({ stored: true });
});

describe('POST: one-click unsubscribe', () => {
  it('should turn the emails off and say so', async () => {
    const response = await POST(oneClick(TOKEN), { params: { token: TOKEN } });

    expect(response.status).toBe(200);
    expect(setDigestOptOut).toHaveBeenCalledWith(TOKEN, true);
    expect(await response.text()).toContain('Unsubscribed');
  });

  it('should answer a dead poll link with a 404', async () => {
    vi.mocked(setDigestOptOut).mockResolvedValue({ stored: false, error: 'POLL_NOT_FOUND' });

    const response = await POST(oneClick(TOKEN), { params: { token: TOKEN } });

    expect(response.status).toBe(404);
  });

  it('should refuse a malformed token without touching the database', async () => {
    const response = await POST(oneClick('nope'), { params: { token: 'nope' } });

    expect(response.status).toBe(404);
    expect(setDigestOptOut).not.toHaveBeenCalled();
  });

  it('should report a database fault as a failure, not a success', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(setDigestOptOut).mockResolvedValue({ stored: false, error: 'connection reset' });

    const response = await POST(oneClick(TOKEN), { params: { token: TOKEN } });

    expect(response.status).toBe(500);
  });
});

describe('GET: a person following the link', () => {
  it('should change nothing, and send them to the switch on their poll page', () => {
    const response = GET(new Request(URL_FOR(TOKEN)), { params: { token: TOKEN } });

    expect(setDigestOptOut).not.toHaveBeenCalled();
    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe(
      `https://www.orangejelly.co.uk/availability/o/${TOKEN}#emails`
    );
  });

  it('should 404 a malformed token', () => {
    const response = GET(new Request(URL_FOR('nope')), { params: { token: 'nope' } });

    expect(response.status).toBe(404);
  });
});
