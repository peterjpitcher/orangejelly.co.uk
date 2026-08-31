import { describe, expect, it } from 'vitest';

import { isLegacyRoute, LEGACY_ROUTES } from '@/lib/legacy-routes';
import { isOjRoute } from '@/lib/oj-routes';
import { ROUTES } from '@/lib/route-manifest';
import { isToolRoute } from '@/lib/tool-routes';

const livePaths = ROUTES.filter((route) => route.disposition === 'live').map((route) => route.path);

describe('legacy routes', () => {
  /*
   * The list is written out by hand so the 700-line manifest stays out of the client
   * bundle. This is what stops the copy drifting from the original.
   */
  it('covers every live route that is neither redesigned nor a tool screen', () => {
    const uncovered = livePaths.filter(
      (path) => !isOjRoute(path) && !isToolRoute(path) && !isLegacyRoute(path)
    );
    expect(uncovered).toEqual([]);
  });

  it('claims nothing the manifest does not declare as live', () => {
    for (const route of LEGACY_ROUTES) {
      const declared = livePaths.some((path) => path === route || path.startsWith(`${route}/`));
      expect(declared, `${route} is not a live route in the manifest`).toBe(true);
    }
  });

  /*
   * The whole reason the gate was inverted. An unmatched URL is served by
   * not-found.tsx, which carries its own header and footer, so it must not also be
   * handed the legacy chrome.
   */
  it('treats an unmatched path as not legacy, so the 404 gets one set of chrome', () => {
    for (const path of ['/this-page-does-not-exist', '/help', '/terms', '/campaigns', '/x/y/z']) {
      expect(isLegacyRoute(path)).toBe(false);
    }
  });

  it('does not claim redesigned or tool routes', () => {
    for (const path of ['/', '/guides', '/guides/summer-pub-marketing', '/start-here']) {
      expect(isLegacyRoute(path)).toBe(false);
    }
    for (const path of ['/admin', '/availability', '/availability/new']) {
      expect(isLegacyRoute(path)).toBe(false);
    }
  });

  /*
   * The parent-match behaviour still matters even though only one route uses it:
   * `/dev/components` is a directory today and could gain a child tomorrow, and the
   * fixtures this used before, `/services/paid-social-for-pubs` and
   * `/ways-to-work/growth-fix`, stopped existing when phase 4 shipped.
   */
  it('covers nested pages under a listed parent', () => {
    expect(isLegacyRoute('/dev/components')).toBe(true);
    expect(isLegacyRoute('/dev/components/buttons')).toBe(true);
  });

  it('no longer claims the pages phase 4 retired', () => {
    for (const path of [
      '/services/paid-social-for-pubs',
      '/ways-to-work/growth-fix',
      '/capabilities',
    ]) {
      expect(isLegacyRoute(path)).toBe(false);
    }
  });
});
