/**
 * Cloudflare Turnstile verification, server side.
 *
 * The widget rendering in the browser is not a control — anyone can skip a
 * client. The control is this: POSTing the token the widget produced to
 * Cloudflare's siteverify endpoint and refusing the request unless Cloudflare
 * confirms it.
 *
 * It matters more here than it usually would. The rate limiter is keyed per IP,
 * and a proxy pool defeats a per-IP limit outright. Turnstile is what makes the
 * IP bucket mean something.
 *
 * Gates poll creation only — no other form on the site uses it.
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Five seconds. Long enough for Cloudflare, short enough that a form never hangs. */
const TURNSTILE_TIMEOUT_MS = 5000;

export interface TurnstileResult {
  success: boolean;
}

/** True when the secret is present. The site key is public and not a gate. */
export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

interface SiteverifyResponse {
  success?: unknown;
}

/**
 * Verifies a Turnstile token with Cloudflare.
 *
 * The token is single-use: Cloudflare rejects a replay, and we deliberately do
 * not cache the result — caching would turn a single-use token into a reusable
 * one, which is the whole property Turnstile provides.
 *
 * Returns `{ success: false }` on an unset secret, a network error, a non-200, a
 * malformed body, or a timeout. Callers fail closed on all of them: refusing to
 * create a poll is recoverable, and an unthrottled endpoint that sends mail on a
 * shared sending domain is not.
 *
 * @param token    The `cf-turnstile-response` value from the widget.
 * @param remoteIp The client IP, from getClientIp(headers()). Optional: Cloudflare
 *                 treats it as a hint, and 'unknown' is not worth sending.
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    // Local development escape, gated identically to the rate limiter (SPEC
    // §3.4.3) so a fresh clone can still create a poll. NODE_ENV is 'production'
    // on every Vercel deployment including previews, so this cannot be switched
    // on from the dashboard.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[polls] Turnstile not configured — allowing in development.');
      return { success: true };
    }
    console.error('[polls] Turnstile unavailable — refusing to create.');
    return { success: false };
  }

  const body = new URLSearchParams({ secret, response: token });
  // 'unknown' is getClientIp's fallback, not an address. Sending it would ask
  // Cloudflare to reason about a string that isn't an IP.
  if (remoteIp && remoteIp !== 'unknown') {
    body.set('remoteip', remoteIp);
  }

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error('[polls] Turnstile unavailable — refusing to create.', response.status);
      return { success: false };
    }

    const json: SiteverifyResponse = await response.json();

    // Strictly `=== true`. Cloudflare returns an object; anything other than a
    // literal true — absent, truthy-but-not-true, an error payload — is a failure.
    return { success: json.success === true };
  } catch (error) {
    console.error('[polls] Turnstile unavailable — refusing to create.', error);
    return { success: false };
  }
}
