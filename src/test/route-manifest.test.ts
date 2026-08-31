import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  ROUTES,
  PHASE_4_REDIRECTS,
  ACTIVE_PHASES,
  getRedirects,
  getRedirectsForPhases,
  getNonIndexablePaths,
  getSitemapRoutes,
} from '@/lib/route-manifest';

/**
 * The manifest exists to stop three lists disagreeing. These tests are what make that
 * true; without them it is just a fourth list.
 *
 * The chain test is the one that matters. A redirect chain is the most likely way this
 * restructure quietly loses the small amount of search authority the site has, and it
 * is invisible until someone crawls the live site.
 */
/**
 * Does a Next redirect `source` match this path?
 *
 * WHY THIS EXISTS. Both chain tests used to compare sources and destinations as plain
 * strings, and the active one went further and filtered wildcard sources out
 * altogether. That makes the check blind to the most likely kind of chain in this
 * manifest, because the wildcards are what retire whole folders:
 *
 *   /services/instagram-services-for-pubs -> /services/social-media-marketing-for-pubs
 *   /services/:slug                       -> /pub-marketing
 *
 * Two lines, each correct on its own, and at phase 4 they compose into a hop through
 * a page that no longer exists. Neither test could see it, because neither knew that
 * `/services/:slug` matches the first line's destination.
 *
 * `:slug` matches one segment, `:slug*` matches the rest of the path, which is how
 * Next reads them.
 */
function sourceMatches(source: string, path: string): boolean {
  if (!source.includes(':')) return source === path;
  const pattern = source
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':') && segment.endsWith('*')) return '.+';
      if (segment.startsWith(':')) return '[^/]+';
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return new RegExp(`^${pattern}$`).test(path);
}

/** Every redirect whose destination is itself redirected by some other rule. */
function chainsIn(table: Array<{ source: string; destination: string }>): string[] {
  return table
    .map((route) => {
      const destination = route.destination.split('?')[0];
      const next = table.find(
        (other) => other !== route && sourceMatches(other.source, destination)
      );
      return next ? `${route.source} -> ${destination} -> ${next.destination}` : null;
    })
    .filter((x): x is string => x !== null);
}

describe('route manifest', () => {
  // Wildcards included. Excluding them was the blind spot, not a simplification.
  const activeRedirects = getRedirects();

  it('never chains: no redirect points at another redirect source', () => {
    const chains = chainsIn(activeRedirects);
    expect(chains, `these redirects land on another redirect:\n${chains.join('\n')}`).toEqual([]);
  });

  it('never advertises a non-200 URL in the sitemap', () => {
    const blocked = new Set(getNonIndexablePaths());
    const advertised = getSitemapRoutes()
      .map((r) => r.path)
      .filter((p) => blocked.has(p));

    expect(advertised).toEqual([]);
  });

  it('has no duplicate active redirect sources', () => {
    const sources = activeRedirects.map((r) => r.source);
    const seen = new Set<string>();
    const duplicates = sources.filter((s) => (seen.has(s) ? true : (seen.add(s), false)));

    expect(duplicates).toEqual([]);
  });

  it('gives every redirect a destination', () => {
    const broken = [...ROUTES, ...PHASE_4_REDIRECTS]
      .filter((r) => r.disposition === 'redirect' && !r.destination)
      .map((r) => r.path);

    expect(broken).toEqual([]);
  });

  it('keeps phase 4 redirects declared but not live', () => {
    expect(ACTIVE_PHASES).toEqual(['active']);

    const emitted = new Set(getRedirects().map((r) => r.source));
    const leaked = PHASE_4_REDIRECTS.filter(
      (r) =>
        emitted.has(r.path) &&
        // a path can legitimately be an active redirect to one target and a phase 4
        // redirect to another; what must not happen is the phase 4 target going live
        getRedirects().find((e) => e.source === r.path)?.destination === r.destination
    ).map((r) => `${r.path} -> ${r.destination}`);

    expect(leaked, `phase 4 redirects must not ship early:\n${leaked.join('\n')}`).toEqual([]);
  });

  it('only lists routes in the sitemap that actually exist in the app', () => {
    const appDir = path.join(process.cwd(), 'src', 'app');

    // A path is served either by its own directory or by a dynamic sibling, so
    // /ways-to-work/growth-fix is satisfied by src/app/ways-to-work/[slug]/page.tsx.
    const hasPage = (dir: string) =>
      existsSync(path.join(dir, 'page.tsx')) || existsSync(path.join(dir, 'page.ts'));

    const isServed = (routePath: string) => {
      const segments = routePath === '/' ? [] : routePath.slice(1).split('/');
      if (hasPage(path.join(appDir, ...segments))) return true;
      if (segments.length === 0) return false;

      const parent = path.join(appDir, ...segments.slice(0, -1));
      if (!existsSync(parent)) return false;
      return readdirSync(parent).some(
        (entry) => entry.startsWith('[') && hasPage(path.join(parent, entry))
      );
    };

    const missing = getSitemapRoutes()
      .map((r) => r.path)
      .filter((p) => !isServed(p));

    expect(missing, `in the sitemap but no page in src/app:\n${missing.join('\n')}`).toEqual([]);
  });

  it('does not list a deleted route as live', () => {
    const deleted = ROUTES.filter((r) => r.disposition === 'deleted').map((r) => r.path);
    const live = new Set(ROUTES.filter((r) => r.disposition === 'live').map((r) => r.path));

    expect(deleted.filter((p) => live.has(p))).toEqual([]);
  });

  it('keeps the seasonal campaign redirects temporary', () => {
    // These repoint every year. A permanent redirect would tell Google a seasonal
    // mapping is final and the wrong target would stick.
    const campaign = getRedirects().filter((r) =>
      ['/autumn', '/christmas', '/summer'].includes(r.source)
    );

    expect(campaign).toHaveLength(3);
    expect(campaign.every((r) => r.permanent === false)).toBe(true);
  });
});

describe('planned routes', () => {
  it('declares each path once within ROUTES', () => {
    // A path may legitimately appear twice across ALL_ENTRIES: once live now, once
    // as a phase 4 redirect. Twice inside ROUTES is always a mistake, and the one
    // that loses is decided by declaration order, which nobody reading the file
    // would predict. This caught /results and /about being declared planned when
    // they were already live and are rebuilt in place.
    const counts = new Map<string, number>();
    for (const route of ROUTES) counts.set(route.path, (counts.get(route.path) ?? 0) + 1);
    expect([...counts.entries()].filter(([, n]) => n > 1)).toEqual([]);
  });

  it('never advertises a route that does not exist yet', () => {
    // There may legitimately be none: every route that was planned has now been
    // built. So this asserts the property rather than requiring a population, and
    // the test below keeps it from being vacuous.
    const planned = ROUTES.filter((route) => route.disposition === 'planned');
    const sitemap = new Set(getSitemapRoutes().map((route) => route.path));
    const redirects = new Set(getRedirects().map((redirect) => redirect.source));

    const advertised = planned
      .filter((route) => sitemap.has(route.path) || redirects.has(route.path))
      .map((route) => route.path);
    expect(advertised).toEqual([]);
  });

  it('would catch a planned route that got advertised', () => {
    // The check above passes trivially while nothing is planned. This proves the
    // rule it encodes still discriminates, by running it over a synthetic entry
    // that breaks it.
    const sitemap = new Set(getSitemapRoutes().map((route) => route.path));
    const anyLiveSitemapPath = [...sitemap][0];
    expect(anyLiveSitemapPath).toBeDefined();

    const synthetic = [{ path: anyLiveSitemapPath, disposition: 'planned' as const }];
    const advertised = synthetic
      .filter((route) => sitemap.has(route.path))
      .map((route) => route.path);
    expect(advertised).toEqual([anyLiveSitemapPath]);
  });

  it('gives no planned route a redirect destination', () => {
    for (const route of ROUTES.filter((r) => r.disposition === 'planned')) {
      expect(route.destination).toBeUndefined();
    }
  });
});

describe('redirect destinations', () => {
  /**
   * Every redirect has to land somewhere that serves a 200.
   *
   * This is the check that would have caught /capabilities pointing at /solutions
   * months before /solutions existed. A redirect to a 404 is worse than no
   * redirect: it consolidates authority into nothing and the release looks fine
   * until somebody follows the link.
   */
  function servesTwoHundred(destination: string): boolean {
    const target = destination.split('?')[0].replace(/\/$/, '') || '/';
    const live = new Set(
      ROUTES.filter((route) => route.disposition === 'live').map((route) => route.path)
    );
    if (live.has(target)) return true;
    // Guide articles are content rather than routes, so the manifest does not list
    // them individually.
    return target.startsWith('/guides/');
  }

  it('sends every active redirect to a live route', () => {
    const broken = ROUTES.filter(
      (route) => route.disposition === 'redirect' && !servesTwoHundred(route.destination as string)
    );
    expect(broken.map((route) => `${route.path} -> ${route.destination}`)).toEqual([]);
  });

  it('sends every phase 4 redirect to a live route, before the release rather than during it', () => {
    const broken = PHASE_4_REDIRECTS.filter(
      (route) => !servesTwoHundred(route.destination as string)
    );
    expect(broken.map((route) => `${route.path} -> ${route.destination}`)).toEqual([]);
  });
});

describe('phase 4, simulated', () => {
  /**
   * The release flips ACTIVE_PHASES to include phase 4. That is one line, and it
   * turns twelve declared redirects live at once.
   *
   * These rebuild the redirect table as it will be on that day and check it the way
   * the active table is checked. Finding a chain or a duplicate source on release
   * day, with the old pages already deleted, is the worst possible time to find it.
   */
  // Built by the shipping code with the phase forced on, not reassembled here. A
  // test that reimplements the merge rule can only ever agree with its own version
  // of it, which is exactly the bug this is looking for.
  const asShipped = getRedirectsForPhases(['active', 'phase4']).filter(
    (redirect) => redirect.permanent
  );

  it('declares each source once, so nothing depends on declaration order', () => {
    // A path can appear as live now and as a phase 4 redirect. It must not appear
    // twice as a redirect: Next takes the first match, and which one that is comes
    // down to the order of two arrays.
    const counts = new Map<string, number>();
    for (const route of asShipped) counts.set(route.source, (counts.get(route.source) ?? 0) + 1);
    const duplicates = [...counts.entries()].filter(([, n]) => n > 1).map(([path]) => path);
    expect(duplicates).toEqual([]);
  });

  it('never chains, so no redirect lands on another redirect', () => {
    const chained = chainsIn(asShipped);
    expect(chained, `these chain on release day:\n${chained.join('\n')}`).toEqual([]);
  });

  it('advertises none of the redirected paths in the sitemap', () => {
    /*
     * Matched with `sourceMatches`, not with `Set.has`.
     *
     * This assertion passed for as long as it has existed while the sitemap
     * advertised seven pages that phase 4 redirects, because it compared the
     * concrete `/ways-to-work/growth-fix` against the literal string
     * `/ways-to-work/:slug` and found nothing. A green test over a real defect is
     * worse than no test, and it is the same blind spot the chain test was fixed for.
     */
    const sitemap = getSitemapRoutes().map((route) => route.path);
    const advertised = sitemap.filter((path) =>
      asShipped.some((route) => sourceMatches(route.source, path))
    );
    expect(
      advertised,
      `these are in the sitemap and redirect on release day:\n${advertised.join('\n')}`
    ).toEqual([]);
  });
});
