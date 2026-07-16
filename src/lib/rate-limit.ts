import { createHash } from 'crypto';
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from '@/lib/db/supabase-admin';

/**
 * Rate limiting for the availability-poll feature, backed by Postgres.
 *
 * The honest trade-off, recorded once: a database round trip costs roughly 30ms
 * more than a Redis one. On a form a human submits once, that is invisible. It is
 * not free and it is not a problem; it is the price of not onboarding a vendor
 * for nine counters.
 *
 * Atomicity lives in the database (public.poll_rate_limit_hit). There is no
 * read-then-write here by design: two concurrent requests would both read 2, both
 * write 3, and a limit of 3 would admit four requests.
 */

/** The complete set of buckets. Adding one means adding it here first. */
export type RateLimitBucket =
  | 'poll_create_ip'
  | 'poll_create_email'
  | 'poll_resend_poll'
  | 'poll_verify_ip'
  | 'poll_respond_ip'
  | 'poll_respond_poll'
  | 'poll_update_ip'
  | 'poll_organiser_ip'
  | 'poll_send_fanout';

interface BucketConfig {
  limit: number;
  windowSeconds: number;
}

/** Limit and fixed-window length per bucket. See SPEC §3.4.2 for the reasoning behind each. */
const BUCKETS: Record<RateLimitBucket, BucketConfig> = {
  poll_create_ip: { limit: 3, windowSeconds: 3600 },
  poll_create_email: { limit: 5, windowSeconds: 86400 },
  poll_resend_poll: { limit: 3, windowSeconds: 3600 },
  poll_verify_ip: { limit: 20, windowSeconds: 3600 },
  poll_respond_ip: { limit: 20, windowSeconds: 3600 },
  poll_respond_poll: { limit: 60, windowSeconds: 86400 },
  poll_update_ip: { limit: 30, windowSeconds: 3600 },
  poll_organiser_ip: { limit: 30, windowSeconds: 3600 },
  poll_send_fanout: { limit: 250, windowSeconds: 86400 },
};

/** One second. A limiter must never be the reason a form feels broken. */
const RATE_LIMIT_TIMEOUT_MS = 1000;

/**
 * The single refusal message, used for every bucket.
 *
 * It names no bucket and no wait time on purpose: telling an attacker which limit
 * they hit tells them which limit to route around, and the retry window is theirs
 * to discover.
 */
export const RATE_LIMIT_MESSAGE = 'Too many attempts. Please try again in a few minutes.';

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets. For callers that set Retry-After; never shown to the user. */
  retryAfterSeconds: number;
  /**
   * WHY this answer, which is not the same question as whether it was allowed.
   *
   * Without this a caller cannot tell "you have hit the limit" from "the limiter
   * is broken" — both arrived as `allowed: false`, so a fail-open caller had no
   * way to fail open and voting was silently fail-closed. That is the wrong
   * default for the one action the whole tool exists to make effortless: a
   * limiter outage must never stop a licensee answering a poll.
   *
   * - `ok`          — under the limit.
   * - `limited`     — genuinely over the limit. Every caller denies.
   * - `unavailable` — the limiter could not answer. Fail-CLOSED callers
   *                   (createPoll, confirmOption) still deny: an outage must not
   *                   become a way to mint polls on our sending domain.
   *                   Fail-OPEN callers (voting) allow.
   */
  reason: 'ok' | 'limited' | 'unavailable';
}

/**
 * True only when the admin client AND the pepper are configured.
 *
 * The pepper is part of the configuration, not an optional extra: without it,
 * hashKey() is an unpeppered SHA-256, which is reversible across the whole IPv4
 * space and across any list of email addresses. An unpeppered limiter is a
 * limiter that stores personal data, so it counts as not configured.
 */
export function isRateLimitConfigured(): boolean {
  return Boolean(isSupabaseAdminConfigured() && process.env.RATE_LIMIT_KEY_PEPPER);
}

/**
 * Hashes an identifier before it becomes a rate-limit key.
 *
 * Applies to IP addresses AND email addresses. Both are personal data under the
 * UK GDPR, and an email address is the more identifying of the two — peppering
 * the IP while writing the address in clear would be theatre. A peppered SHA-256
 * is a stable key with no way back to the value, and the Phase 5 sweep deletes
 * the row once its window has passed.
 *
 * Throws when the pepper is absent rather than degrading silently. Callers gate
 * on isRateLimitConfigured() first, so this is unreachable in practice and is a
 * loud failure if the gate is ever removed.
 */
export function hashKey(value: string): string {
  const pepper = process.env.RATE_LIMIT_KEY_PEPPER;
  if (!pepper) throw new Error('RATE_LIMIT_KEY_PEPPER is not configured.');
  return createHash('sha256').update(`${pepper}:${value}`).digest('hex').slice(0, 32);
}

/**
 * Reads the client IP the way Vercel presents it.
 *
 * `x-vercel-forwarded-for` takes precedence: Vercel sets it itself and a client
 * cannot forge it, whereas `x-forwarded-for` is client-supplied and merely
 * appended to. Reading x-forwarded-for first would let an attacker rotate the
 * header and get a fresh bucket per request, which is a limiter that does nothing.
 *
 * Taking the FIRST value of x-forwarded-for is only trustworthy because Vercel
 * overwrites the header at the edge rather than appending to whatever the client
 * sent. Behind a proxy that appends, the first value is attacker-controlled and
 * this function would need the last value instead.
 *
 * Falls back to 'unknown', which shares one bucket across every caller with no
 * forwarded-for header. On Vercel the header is always present, so this is a
 * local-development and misconfiguration path, not a production one — accepted,
 * and named here so nobody treats it as a bug.
 *
 * Structurally typed rather than `Headers`: on Next 14, `headers()` returns a
 * ReadonlyHeaders, which is not assignable to Headers.
 */
export function getClientIp(headers: { get(name: string): string | null }): string {
  return (
    headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

/** Seconds remaining in the fixed window that `nowMs` falls into. */
function retryAfterFor(windowSeconds: number, nowMs: number): number {
  const nowSeconds = Math.floor(nowMs / 1000);
  const windowStart = Math.floor(nowSeconds / windowSeconds) * windowSeconds;
  return windowStart + windowSeconds - nowSeconds;
}

let developmentWarningLogged = false;

/**
 * Rejects if the promise has not settled within RATE_LIMIT_TIMEOUT_MS.
 *
 * A slow limiter must not become a slow form. The timeout is treated exactly like
 * an error: the caller decides whether that means fail-closed or fail-open.
 */
async function withTimeout<T>(promise: PromiseLike<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error('Rate limit check timed out.')),
          RATE_LIMIT_TIMEOUT_MS
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Counts one hit against `bucket` for `key` and reports whether it is allowed.
 *
 * `key` MUST already be passed through hashKey() by the caller. This function does
 * not hash for you: the caller knows whether it holds an IP, an address or a poll
 * id, and making the hash explicit at the call site is what stops a raw value
 * reaching the database by accident.
 *
 * IMPORTANT — this function never fails closed on its own. On any failure it
 * returns `{ allowed: false }` so that a caller which does nothing gets the safe
 * outcome, but the fail-open callers (everything that does not send mail) must
 * check isRateLimitConfigured() / catch and allow explicitly. See SPEC §3.4.2.
 */
export async function checkRateLimit(
  bucket: RateLimitBucket,
  key: string
): Promise<RateLimitResult> {
  const config = BUCKETS[bucket];

  // Local development escape. Without it, a fresh clone cannot create a poll at
  // all, because createPoll fails closed and the limiter is unconfigured.
  //
  // The gate is NODE_ENV, never a bespoke DISABLE_RATE_LIMIT flag: NODE_ENV is
  // 'production' on every Vercel deployment including previews, so this escape
  // cannot be switched on by setting an env var in the dashboard.
  if (!isRateLimitConfigured()) {
    if (process.env.NODE_ENV !== 'production') {
      if (!developmentWarningLogged) {
        developmentWarningLogged = true;
        console.warn('[polls] Rate limiter not configured — allowing in development.');
      }
      return { allowed: true, retryAfterSeconds: 0, reason: 'ok' };
    }
    return {
      allowed: false,
      retryAfterSeconds: retryAfterFor(config.windowSeconds, Date.now()),
      reason: 'unavailable',
    };
  }

  try {
    const { data, error } = await withTimeout(
      getSupabaseAdminClient().rpc('poll_rate_limit_hit', {
        p_bucket: bucket,
        p_key: key,
        p_window_seconds: config.windowSeconds,
      })
    );

    if (error) throw new Error(error.message);
    if (typeof data !== 'number') throw new Error('poll_rate_limit_hit returned no count.');

    const allowed = data <= config.limit;
    return {
      allowed,
      retryAfterSeconds: retryAfterFor(config.windowSeconds, Date.now()),
      reason: allowed ? 'ok' : 'limited',
    };
  } catch (error) {
    // Deliberately not re-thrown. A limiter outage is a limiter decision, not a
    // 500: the caller picks fail-closed or fail-open per SPEC §3.4.2.
    console.error('[polls] Rate limiter unavailable.', error);
    return {
      allowed: false,
      retryAfterSeconds: retryAfterFor(config.windowSeconds, Date.now()),
      reason: 'unavailable',
    };
  }
}

/** Exposed for tests and for callers that need a bucket's shape without duplicating it. */
export function getBucketConfig(bucket: RateLimitBucket): BucketConfig {
  return BUCKETS[bucket];
}
