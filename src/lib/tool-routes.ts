/**
 * The organiser tool and the poll pages, as opposed to the marketing site.
 *
 * `ChromeGate` uses this to suppress the marketing navigation and footer, and
 * `MainGate` uses it to stand back from the `<main>` landmark, because these screens
 * open their own. It lives here rather than being written out twice: the two gates
 * disagreeing is how the tool ended up with two main landmarks on every page.
 *
 * Distinct from `isPollRoute` in `token-routes.ts`, which is narrower and exists for
 * a different reason: that one gates third-party scripts away from URLs carrying a
 * bearer token, and it must stay conservative because getting it wrong leaks a
 * credential. This one is about layout.
 */
export function isToolRoute(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/availability');
}
