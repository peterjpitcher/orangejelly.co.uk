import { existsSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { getRedirectsForPhases, ROUTES } from '@/lib/route-manifest';

/**
 * URLs that exist on paper and cannot be changed.
 *
 * Peter confirmed on 31 August 2026 that the Greene King "Rhythm of the Week" toolkit
 * went to print with QR codes encoding six article URLs directly, rather than the short
 * alias the other toolkits use. A seventh appears in the autumn implementation plan.
 *
 * A printed QR code cannot be reissued. Whatever else happens to this site, scanning one
 * of those codes has to land on a real page, for as long as the printed material is in
 * circulation, which for a toolkit distributed to licensees is indefinitely.
 *
 * That makes these seven paths load-bearing in a way no other URL on the site is. They
 * are the reason the guide rename ships with a permanent wildcard redirect rather than
 * a tidy-up of individual entries, and the reason this file exists: to fail loudly the
 * moment somebody retires, renames or reshapes a route in a way that would leave a
 * scanned code on a 404.
 *
 * Do not relax these assertions to make a refactor pass. If one fails, the refactor is
 * what is wrong.
 *
 * @see docs/charlotte/rhythm-of-the-week-toolkit.md
 * @see docs/greene-king-toolkit/autumn-2026-implementation-plan.md
 */
const PRINTED = [
  '/licensees-guide/boardgame-night-101',
  '/licensees-guide/cash-bingo-101',
  '/licensees-guide/family-craft-hour-101',
  '/licensees-guide/karaoke-night-101',
  '/licensees-guide/music-bingo-101',
  '/licensees-guide/quiz-night-101',
  '/licensees-guide/autumn-pub-event-ideas',
];

/** Short aliases printed on the other toolkits. Deliberately temporary redirects. */
const PRINTED_ALIASES = ['/autumn', '/christmas', '/summer'];

const CONTENT = path.resolve(__dirname, '../../content/blog');
const LIVE = new Set(ROUTES.filter((r) => r.disposition === 'live').map((r) => r.path));

/** Next matches a redirect source in declaration order, first win. */
function matches(source: string, target: string): boolean {
  if (!source.includes(':')) return source === target;
  const pattern = source
    .split('/')
    .map((seg) => {
      if (seg.startsWith(':') && seg.endsWith('*')) return '.+';
      if (seg.startsWith(':')) return '([^/]+)';
      return seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return new RegExp(`^${pattern}$`).test(target);
}

/**
 * Walk the redirect table the way Next would, and return where a path finally lands.
 *
 * Follows chains rather than stopping at the first hop, because a URL that survives one
 * redirect and dies on the second is just as broken to somebody holding a printed code.
 */
function resolve(startPath: string, table: Array<{ source: string; destination: string }>): string {
  let current = startPath;
  for (let hop = 0; hop < 5; hop++) {
    const rule = table.find((r) => matches(r.source, current));
    if (!rule) return current;
    current = rule.destination.includes(':')
      ? // A wildcard destination carries the captured segment through.
        current.replace(
          new RegExp(`^${rule.source.split('/:')[0]}`),
          rule.destination.split('/:')[0]
        )
      : rule.destination;
  }
  throw new Error(`${startPath} still redirecting after five hops`);
}

const APP = path.resolve(__dirname, '../app');

/**
 * Does this path actually serve a page?
 *
 * Both halves are needed and the first draft of this only had one. Checking that the
 * article markdown exists proves nothing: delete the whole route folder and the file is
 * still on disk, so the test would pass while every scanned code returned a 404.
 * Checking the route exists is not enough either, because a dynamic route with no
 * matching content 404s just as hard.
 *
 * So: a declared live route, or a dynamic route segment that exists in the app tree WITH
 * the content file behind it. The seasonal aliases carry UTM parameters on their
 * destination, so the query string is stripped first; it is campaign tagging, not route.
 */
function serves(target: string): boolean {
  const pathOnly = target.split('?')[0];
  if (LIVE.has(pathOnly)) return true;

  const segments = pathOnly.split('/').filter(Boolean);
  const slug = segments.pop();
  if (!slug) return false;

  const routeRendersIt = existsSync(path.join(APP, ...segments, '[slug]', 'page.tsx'));
  const contentExists = existsSync(path.join(CONTENT, `${slug}.md`));
  return routeRendersIt && contentExists;
}

describe.each([
  ['today', ['active'] as string[]],
  ['on release day', ['active', 'phase4'] as string[]],
])('printed QR codes, %s', (_when, phases) => {
  const table = getRedirectsForPhases(phases).filter((r) => r.permanent !== false || true);

  it.each(PRINTED)('%s reaches a real page', (printed) => {
    const landed = resolve(printed, table);
    expect(serves(landed), `${printed} lands on ${landed}, which serves nothing`).toBe(true);
  });

  it.each(PRINTED_ALIASES)('%s reaches a real page', (alias) => {
    const landed = resolve(alias, table);
    expect(serves(landed), `${alias} lands on ${landed}, which serves nothing`).toBe(true);
  });
});

describe('the seasonal aliases stay temporary', () => {
  /*
   * `/autumn`, `/christmas` and `/summer` are 307s on purpose: they are repointed every
   * year, and a permanent redirect would tell Google a mapping is final when it is not.
   * Tidying them into 308s would break the one property that lets the printed codes be
   * reused next season.
   */
  const table = getRedirectsForPhases(['active', 'phase4']);
  it.each(PRINTED_ALIASES)('%s is not permanent', (alias) => {
    const rule = table.find((r) => r.source === alias);
    expect(rule, `${alias} is printed and must stay declared`).toBeDefined();
    expect(rule?.permanent).toBe(false);
  });
});
