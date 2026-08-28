import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  ROUTES,
  PHASE_4_REDIRECTS,
  ACTIVE_PHASES,
  getRedirects,
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
describe('route manifest', () => {
  const activeRedirects = getRedirects().filter((r) => !r.source.includes(':'));

  it('never chains: no redirect points at another redirect source', () => {
    const sources = new Set(activeRedirects.map((r) => r.source));
    const chains = activeRedirects
      .filter((r) => sources.has(r.destination.split('?')[0]))
      .map((r) => `${r.source} -> ${r.destination}`);

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
    const planned = ROUTES.filter((route) => route.disposition === 'planned');
    expect(planned.length).toBeGreaterThan(0);

    const sitemap = new Set(getSitemapRoutes().map((route) => route.path));
    const redirects = new Set(getRedirects().map((redirect) => redirect.source));
    for (const route of planned) {
      expect(sitemap.has(route.path)).toBe(false);
      expect(redirects.has(route.path)).toBe(false);
    }
  });

  it('gives no planned route a redirect destination', () => {
    for (const route of ROUTES.filter((r) => r.disposition === 'planned')) {
      expect(route.destination).toBeUndefined();
    }
  });
});
