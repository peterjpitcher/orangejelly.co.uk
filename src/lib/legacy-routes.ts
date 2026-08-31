import { isOjRoute } from './oj-routes';
import { isToolRoute } from './tool-routes';

/**
 * The pages that still want the pre-repositioning header and footer.
 *
 * WHY THIS IS A LIST OF LEGACY ROUTES RATHER THAN A LIST OF NEW ONES. `ChromeGate`
 * used to ask "is this a redesigned route or a tool route? if not, render the old
 * chrome", so the old chrome was the default for every path that was not on a list.
 * That is fine while most of the site is old, and it stops being fine the moment a
 * page can be served at a path nobody declared.
 *
 * `not-found.tsx` is exactly that page. Next renders it for any unmatched URL, it
 * carries its own repositioned header and footer, and its pathname is whatever the
 * visitor typed, so it never matched the redesigned list. Every 404 on the site was
 * rendering two headers, two navigations, two footers and two `<main>` landmarks,
 * the last of which is a WCAG 1.3.1 failure and the precise thing `MainGate` exists
 * to prevent. It is also the page every stale link in the world lands on.
 *
 * Inverting it fixes that by construction: an unmatched path matches nothing here,
 * so it gets no legacy chrome and the page's own chrome stands alone. New pages now
 * default to the new design rather than the old one, which is the right way round
 * from here on.
 *
 * Written out rather than derived from `route-manifest.js` at runtime, because the
 * gates are client components and the manifest is 700 lines that would then ship to
 * every browser. `legacy-routes.test.ts` diffs this list against the manifest, so
 * the two cannot separate without the build saying so.
 *
 * Every entry below is a page phase 4 turns into a redirect, apart from `/privacy`,
 * which is public and outlives them, and `/dev/components`, which is the internal
 * component gallery. When phase 4 lands, this list is down to those two, and once
 * they are restyled the file and both gates can be deleted.
 */
export const LEGACY_ROUTES = [
  '/capabilities',
  '/compete-with-pub-chains',
  '/dev/components',
  '/empty-pub-solutions',
  '/fix-my-pub',
  '/privacy',
  '/pub-marketing-agency',
  '/pub-marketing-no-budget',
  '/quiet-midweek-solutions',
  '/services',
  '/ways-to-work',
] as const;

/**
 * True only for a path the manifest declares as a live legacy page.
 *
 * Matched exactly or as a parent: `/services` also covers
 * `/services/paid-social-for-pubs`, and `/ways-to-work` covers its four slugs, so a
 * nested page cannot fall through to the wrong chrome. Anything not on the list,
 * a 404 included, is not legacy.
 */
export function isLegacyRoute(pathname: string): boolean {
  if (isToolRoute(pathname) || isOjRoute(pathname)) return false;
  return LEGACY_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}
