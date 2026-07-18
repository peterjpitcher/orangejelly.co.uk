import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { verifyTurnstileToken, isTurnstileConfigured } from './turnstile';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function mockFetchResolving(body: unknown, ok = true, status = 200): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('isTurnstileConfigured', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should be false when the secret is unset', () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', '');
    expect(isTurnstileConfigured()).toBe(false);
  });

  it('should be true when the secret is set', () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secret-value');
    expect(isTurnstileConfigured()).toBe(true);
  });
});

describe('verifyTurnstileToken', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secret-value');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should pass when Cloudflare returns success true', async () => {
    mockFetchResolving({ success: true });

    await expect(verifyTurnstileToken('token-value')).resolves.toEqual({ success: true });
  });

  it('should refuse when Cloudflare returns success false', async () => {
    mockFetchResolving({ success: false, 'error-codes': ['invalid-input-response'] });

    await expect(verifyTurnstileToken('token-value')).resolves.toEqual({ success: false });
  });

  it('should refuse when Cloudflare returns a truthy non-true success value', async () => {
    // Strictly === true. A truthy string would otherwise wave through a malformed
    // or hostile response body.
    mockFetchResolving({ success: 'true' });

    await expect(verifyTurnstileToken('token-value')).resolves.toEqual({ success: false });
  });

  it('should refuse when Cloudflare returns a non-200', async () => {
    mockFetchResolving({}, false, 503);

    await expect(verifyTurnstileToken('token-value')).resolves.toEqual({ success: false });
  });

  it('should refuse when the request throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('socket hang up')));

    await expect(verifyTurnstileToken('token-value')).resolves.toEqual({ success: false });
  });

  it('should refuse when the secret is unset in production', async () => {
    // Fail closed: an unverified create path sends mail on a shared sending
    // domain. Losing a poll is recoverable; a burned sending domain is not.
    vi.stubEnv('TURNSTILE_SECRET_KEY', '');
    const fetchMock = mockFetchResolving({ success: true });

    await expect(verifyTurnstileToken('token-value')).resolves.toEqual({ success: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should allow when the secret is unset outside production', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', '');
    vi.stubEnv('NODE_ENV', 'development');

    await expect(verifyTurnstileToken('token-value')).resolves.toEqual({ success: true });
  });

  it('should post the secret and response as form-encoded to siteverify', async () => {
    const fetchMock = mockFetchResolving({ success: true });

    await verifyTurnstileToken('token-value', '198.51.100.7');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(SITEVERIFY_URL);
    expect(init.method).toBe('POST');
    expect(init.headers['Content-Type']).toBe('application/x-www-form-urlencoded');

    const body = init.body as URLSearchParams;
    expect(body.get('secret')).toBe('secret-value');
    expect(body.get('response')).toBe('token-value');
    expect(body.get('remoteip')).toBe('198.51.100.7');
  });

  it('should omit remoteip when the client IP is unknown', async () => {
    // 'unknown' is getClientIp's fallback, not an address.
    const fetchMock = mockFetchResolving({ success: true });

    await verifyTurnstileToken('token-value', 'unknown');

    const body = fetchMock.mock.calls[0][1].body as URLSearchParams;
    expect(body.has('remoteip')).toBe(false);
  });
});
