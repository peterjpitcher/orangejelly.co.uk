/**
 * Routes that render the repositioned chrome instead of the legacy site chrome.
 *
 * THIS IS THE SINGLE SOURCE OF TRUTH. `ChromeGate` reads it to decide whether to
 * suppress the legacy Navigation and Footer, and each listed page renders the `oj`
 * Header and Footer itself. Two copies of this list would drift, and when they
 * drift the failure is visible on the most important page on the site: two
 * navigations stacked on top of each other, or none at all.
 *
 * This is the additive strategy applied to chrome. A page opts in by appearing
 * here; everything absent is untouched.
 *
 * @see tasks/repositioning/IMPLEMENTATION-SPEC.md section 4
 */
export const OJ_ROUTES = ['/', '/start-here', '/how-we-work'] as const;

export function isOjRoute(pathname: string): boolean {
  // '/' is matched exactly. A prefix match on it would claim the whole site, which
  // is the one thing this list must not do while the rest of the pages still run on
  // the legacy chrome.
  return OJ_ROUTES.some((route) =>
    route === '/' ? pathname === '/' : pathname === route || pathname.startsWith(`${route}/`)
  );
}
