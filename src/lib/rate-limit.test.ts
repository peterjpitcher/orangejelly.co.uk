import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const rpcMock = vi.fn();

vi.mock('@/lib/db/supabase-admin', () => ({
  isSupabaseAdminConfigured: () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  getSupabaseAdminClient: () => ({ rpc: rpcMock }),
}));

import {
  checkRateLimit,
  getClientIp,
  hashKey,
  isRateLimitConfigured,
  getBucketConfig,
  RATE_LIMIT_MESSAGE,
  type RateLimitBucket,
} from './rate-limit';

/** Every bucket in the enum. Kept here so a new bucket without a test fails loudly. */
const ALL_BUCKETS: RateLimitBucket[] = [
  'poll_create_ip',
  'poll_create_email',
  'poll_resend_poll',
  'poll_verify_ip',
  'poll_respond_ip',
  'poll_respond_poll',
  'poll_update_ip',
  'poll_organiser_ip',
  'poll_send_fanout',
];

function headersWith(values: Record<string, string>): { get(name: string): string | null } {
  return { get: (name: string) => values[name] ?? null };
}

function configure(): void {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
  process.env.RATE_LIMIT_KEY_PEPPER = 'test-pepper';
  vi.stubEnv('NODE_ENV', 'production');
}

describe('hashKey', () => {
  beforeEach(() => {
    process.env.RATE_LIMIT_KEY_PEPPER = 'test-pepper';
  });

  afterEach(() => {
    delete process.env.RATE_LIMIT_KEY_PEPPER;
  });

  it('should return a stable 32-character hex key when given the same value twice', () => {
    const first = hashKey('198.51.100.7');
    expect(first).toBe(hashKey('198.51.100.7'));
    expect(first).toMatch(/^[0-9a-f]{32}$/);
  });

  it('should never contain the raw value when given an email address', () => {
    expect(hashKey('landlord@example.com')).not.toContain('landlord');
  });

  it('should produce a different key when the pepper changes', () => {
    const withOriginalPepper = hashKey('198.51.100.7');
    process.env.RATE_LIMIT_KEY_PEPPER = 'rotated-pepper';
    expect(hashKey('198.51.100.7')).not.toBe(withOriginalPepper);
  });

  it('should throw when the pepper is absent', () => {
    delete process.env.RATE_LIMIT_KEY_PEPPER;
    expect(() => hashKey('198.51.100.7')).toThrow('RATE_LIMIT_KEY_PEPPER is not configured.');
  });
});

describe('getClientIp', () => {
  it('should prefer x-vercel-forwarded-for when both headers are present', () => {
    // x-forwarded-for is client-supplied; trusting it first would let an attacker
    // rotate the header and get a fresh bucket per request.
    const ip = getClientIp(
      headersWith({
        'x-vercel-forwarded-for': '198.51.100.7',
        'x-forwarded-for': '203.0.113.9',
      })
    );
    expect(ip).toBe('198.51.100.7');
  });

  it('should take the first value when x-forwarded-for holds a list', () => {
    expect(getClientIp(headersWith({ 'x-forwarded-for': '198.51.100.7, 10.0.0.1' }))).toBe(
      '198.51.100.7'
    );
  });

  it('should return unknown when no forwarded-for header is present', () => {
    expect(getClientIp(headersWith({}))).toBe('unknown');
  });
});

describe('isRateLimitConfigured', () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.RATE_LIMIT_KEY_PEPPER;
  });

  it('should be false when the pepper is missing even though Supabase is configured', () => {
    // An unpeppered limiter stores a reversible hash of an IP, which is personal
    // data. That is not a degraded limiter; it is an unconfigured one.
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    expect(isRateLimitConfigured()).toBe(false);
  });

  it('should be true when both Supabase and the pepper are configured', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.RATE_LIMIT_KEY_PEPPER = 'test-pepper';
    expect(isRateLimitConfigured()).toBe(true);
  });
});

describe('checkRateLimit', () => {
  beforeEach(() => {
    rpcMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.RATE_LIMIT_KEY_PEPPER;
  });

  it('should allow the request when the returned count is at the limit', async () => {
    configure();
    rpcMock.mockResolvedValue({ data: 3, error: null });

    const result = await checkRateLimit('poll_create_ip', 'hashed-key');

    expect(result.allowed).toBe(true);
  });

  it('should refuse the request when the returned count exceeds the limit', async () => {
    configure();
    rpcMock.mockResolvedValue({ data: 4, error: null });

    const result = await checkRateLimit('poll_create_ip', 'hashed-key');

    expect(result.allowed).toBe(false);
  });

  it('should call the database function once with the bucket window when checked', async () => {
    configure();
    rpcMock.mockResolvedValue({ data: 1, error: null });

    await checkRateLimit('poll_create_email', 'hashed-key');

    // One RPC, not a read then a write: the increment must be a single statement
    // or two concurrent requests both read the same count and the limit leaks.
    expect(rpcMock).toHaveBeenCalledTimes(1);
    expect(rpcMock).toHaveBeenCalledWith('poll_rate_limit_hit', {
      p_bucket: 'poll_create_email',
      p_key: 'hashed-key',
      p_window_seconds: 86400,
    });
  });

  it('should report seconds remaining in the window when allowed', async () => {
    configure();
    rpcMock.mockResolvedValue({ data: 1, error: null });

    const result = await checkRateLimit('poll_create_ip', 'hashed-key');

    expect(result.retryAfterSeconds).toBeGreaterThan(0);
    expect(result.retryAfterSeconds).toBeLessThanOrEqual(3600);
  });

  it('should refuse when the database returns an error in production', async () => {
    configure();
    rpcMock.mockResolvedValue({ data: null, error: { message: 'connection refused' } });

    const result = await checkRateLimit('poll_create_ip', 'hashed-key');

    expect(result.allowed).toBe(false);
  });

  it('should refuse when the database throws in production', async () => {
    configure();
    rpcMock.mockRejectedValue(new Error('socket hang up'));

    const result = await checkRateLimit('poll_create_ip', 'hashed-key');

    expect(result.allowed).toBe(false);
  });

  it('should refuse when the database returns a non-numeric count in production', async () => {
    configure();
    rpcMock.mockResolvedValue({ data: null, error: null });

    const result = await checkRateLimit('poll_create_ip', 'hashed-key');

    expect(result.allowed).toBe(false);
  });

  it('should refuse when the limiter is unconfigured in production', async () => {
    // The caller decides fail-open vs fail-closed, but the default this function
    // hands back must be the safe one.
    vi.stubEnv('NODE_ENV', 'production');

    const result = await checkRateLimit('poll_create_ip', 'hashed-key');

    expect(result.allowed).toBe(false);
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it('should refuse when the database exceeds the timeout in production', async () => {
    configure();
    vi.useFakeTimers();
    rpcMock.mockReturnValue(new Promise(() => {}));

    const pending = checkRateLimit('poll_create_ip', 'hashed-key');
    await vi.advanceTimersByTimeAsync(1500);
    const result = await pending;

    expect(result.allowed).toBe(false);
    vi.useRealTimers();
  });

  it('should allow the request when the limiter is unconfigured outside production', async () => {
    // Without this escape a fresh clone cannot create a poll at all, because
    // createPoll fails closed.
    vi.stubEnv('NODE_ENV', 'development');

    const result = await checkRateLimit('poll_create_ip', 'hashed-key');

    expect(result.allowed).toBe(true);
    expect(rpcMock).not.toHaveBeenCalled();
  });
});

describe('bucket configuration', () => {
  it.each(ALL_BUCKETS)('should define a positive limit and window for %s', (bucket) => {
    const config = getBucketConfig(bucket);
    expect(config.limit).toBeGreaterThan(0);
    expect(config.windowSeconds).toBeGreaterThan(0);
  });

  it('should match the limits the spec fixes for the mail-sending buckets', () => {
    expect(getBucketConfig('poll_create_ip')).toEqual({ limit: 3, windowSeconds: 3600 });
    expect(getBucketConfig('poll_create_email')).toEqual({ limit: 5, windowSeconds: 86400 });
    expect(getBucketConfig('poll_resend_poll')).toEqual({ limit: 3, windowSeconds: 3600 });
    expect(getBucketConfig('poll_send_fanout')).toEqual({ limit: 250, windowSeconds: 86400 });
  });
});

describe('RATE_LIMIT_MESSAGE', () => {
  it('should name neither the bucket nor the wait time', () => {
    // Naming the bucket tells an attacker which limit to route around, and the
    // retry window is theirs to discover.
    expect(RATE_LIMIT_MESSAGE).toBe('Too many attempts. Please try again in a few minutes.');
    for (const bucket of ALL_BUCKETS) {
      expect(RATE_LIMIT_MESSAGE).not.toContain(bucket);
    }
  });
});
