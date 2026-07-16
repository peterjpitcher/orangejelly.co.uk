/**
 * Which routes carry a capability in the URL, and therefore must not leak it.
 *
 * THIS IS THE SINGLE SOURCE OF TRUTH. It is imported by `src/middleware.ts` (which
 * sets Referrer-Policy) and by the client-side script gate (which keeps
 * third-party JavaScript off these pages). Two copies of these patterns would
 * drift, and when they drift the failure is silent and the consequence is a
 * leaked credential: the gate stops firing on a route the middleware still
 * believes is protected.
 *
 * Deliberately dependency-free so middleware (edge runtime) and client components
 * can both import it.
 */

/**
 * Routes whose path contains a bearer token.
 *
 * `/availability/p/<token>`      — a participant's ballot and edit capability
 * `/availability/o/<token>`      — the organiser's full control of the poll
 * `/availability/verify/<token>` — the magic link, equally a capability
 *
 * Anyone holding one of these URLs *is* the person it was issued to, permanently.
 * There is no login to fall back on.
 */
export const TOKEN_PATH_PATTERN = /^\/availability\/(p|o|verify)\//;

/**
 * The whole poll feature, token-bearing or not — including `/availability/new`.
 *
 * Broader than TOKEN_PATH_PATTERN on purpose. The two are used for different jobs:
 * the narrow one for Referrer-Policy (where the token is the thing at risk), the
 * broad one for the third-party script gate (where we also simply do not want an
 * exit-intent modal over someone's ballot).
 */
export const POLL_PATH_PATTERN = /^\/availability(\/|$)/;

/**
 * True when the path carries a bearer token.
 *
 * Drives `Referrer-Policy: no-referrer`. The site-wide default,
 * `strict-origin-when-cross-origin`, sends the FULL URL on same-origin
 * navigations — and the token is in the path, so the default is a leak here.
 */
export function isTokenRoute(pathname: string): boolean {
  return TOKEN_PATH_PATTERN.test(pathname);
}

/**
 * True anywhere in the poll feature.
 *
 * Drives the third-party script gate. Being a superset of isTokenRoute() means a
 * token route can never be gated for referrer purposes but missed by the script
 * gate — which is the failure that would actually leak the token.
 */
export function isPollRoute(pathname: string): boolean {
  return POLL_PATH_PATTERN.test(pathname);
}
