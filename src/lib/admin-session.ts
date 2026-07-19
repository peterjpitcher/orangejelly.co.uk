'use client';

/**
 * Client-side admin session store, shared by every signed-in screen (the admin
 * dashboard, the polls dashboard, the nav).
 *
 * Two deliberate choices fix the "I have to log in again every time" complaint:
 *
 *  - **localStorage, not sessionStorage.** sessionStorage is wiped the moment the
 *    tab closes, so every fresh tab meant a fresh login. localStorage survives.
 *  - **Silent refresh.** The access token is short-lived. When it is close to
 *    expiry we swap it for a new one using the stored refresh token, so the
 *    session lasts as long as Supabase allows without ever prompting again.
 *
 * The token is a bearer credential. localStorage is readable by any script on the
 * origin, so this rests on the site being free of injected third-party script on
 * authed pages (which the CSP and the analytics gating already enforce). The
 * alternative, an HttpOnly cookie, would be a larger change to the whole
 * client-token auth model and is noted as a future hardening step.
 */

const KEY = 'oj-admin-session';

/** Renew this many seconds before the token actually expires, to beat the clock. */
const REFRESH_SKEW_SECONDS = 120;

export interface AdminSession {
  access_token: string;
  refresh_token?: string;
  /** Unix seconds. */
  expires_at?: number;
  email?: string;
}

export function readSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    return typeof parsed?.access_token === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export function writeSession(session: AdminSession): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}

function isExpiringSoon(session: AdminSession): boolean {
  if (!session.expires_at) return false;
  return session.expires_at * 1000 <= Date.now() + REFRESH_SKEW_SECONDS * 1000;
}

/**
 * Returns a currently-valid access token, refreshing first if the stored one is
 * about to expire. Returns null when there is no usable session, which the
 * caller treats as "show the login form".
 */
export async function getValidAccessToken(): Promise<string | null> {
  const session = readSession();
  if (!session) return null;

  if (!isExpiringSoon(session)) return session.access_token;

  if (!session.refresh_token) {
    // Old-style session with no refresh token, now expired. Force a clean login.
    clearSession();
    return null;
  }

  try {
    const res = await fetch('/api/admin/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });

    if (!res.ok) {
      clearSession();
      return null;
    }

    const body = (await res.json()) as { session?: AdminSession };
    if (!body.session?.access_token) {
      clearSession();
      return null;
    }

    writeSession({ ...body.session, email: session.email });
    return body.session.access_token;
  } catch {
    // Network blip. Keep the session and let the current token try; a hard 401
    // downstream will clear it.
    return session.access_token;
  }
}
