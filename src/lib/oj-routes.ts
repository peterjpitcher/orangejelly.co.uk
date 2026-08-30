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
export const OJ_ROUTES = [
  '/',
  '/start-here',
  '/how-we-work',
  '/results',
  '/about',
  '/solutions',
  '/pub-marketing',
  '/small-business-rescue',
  '/contact',
  '/growth-problems',
  '/tools',
  '/fractional-cmo',
  '/insights',
  '/sectors',
  /*
   * The guides, added 30 August 2026.
   *
   * "Guides" is an item in the new primary navigation, and until this line was here
   * clicking it dropped the reader onto the old site: a different navigation offering
   * Ways to Work and Capabilities, both of which retire at phase 4, and a WhatsApp
   * button as the call to action.
   *
   * Seven of the ten WhatsApp links on a guide page were contact prompts rather than
   * share links, and one of them opened "I'd like to find out about your packages",
   * which is a message about packages at prices this site no longer has (D3) written
   * in the founder's first person (D21). Across 106 pages.
   *
   * The article bodies keep their existing styling, which is good and would be a much
   * larger job to port. This is the chrome only: the navigation, the footer and the
   * legacy overlays.
   */
  '/licensees-guide',
] as const;

export function isOjRoute(pathname: string): boolean {
  // '/' is matched exactly. A prefix match on it would claim the whole site, which
  // is the one thing this list must not do while the rest of the pages still run on
  // the legacy chrome.
  return OJ_ROUTES.some((route) =>
    route === '/' ? pathname === '/' : pathname === route || pathname.startsWith(`${route}/`)
  );
}
