/**
 * Check every URL Google actually knows about against the redirect table.
 *
 * WHY THIS AND NOT THE EXISTING TESTS. `route-manifest.test.ts` proves the table is
 * internally consistent: no chains, no duplicate sources, nothing advertised that
 * redirects. It cannot prove the table covers reality, because it only knows about
 * paths somebody thought to declare. Google knows about URLs nobody remembers creating:
 * old app routes, an image that got indexed, a page from a previous version of the site.
 *
 * So this takes the Pages.csv out of a Search Console export and walks every row through
 * the table the way Next would, following chains, and reports anything that does not
 * reach a page. It weights by clicks, because a dead URL with 159 clicks and a dead URL
 * with none are not the same problem and should not read as the same line.
 *
 * It checks the current table and the release-day one, because a URL can be fine today
 * and die when the phase 4 redirects switch on, which is the worst time to find out.
 *
 *   node scripts/audit-redirects.mjs <path to Pages.csv>
 *
 * Export it from Search Console: Performance, Pages tab, Export, and unzip.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import manifest from '../src/lib/route-manifest.js';

const { ROUTES, getRedirectsForPhases } = manifest;
const ROOT = process.cwd();
const APP = path.join(ROOT, 'src/app');
const CONTENT = path.join(ROOT, 'content/blog');

const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node scripts/audit-redirects.mjs <path to Pages.csv>');
  process.exit(2);
}

const rows = readFileSync(path.resolve(ROOT, csvPath), 'utf8')
  .split('\n')
  .slice(1)
  .filter(Boolean)
  .map((line) => {
    const cells = line.split(',');
    try {
      return {
        url: new URL(cells[0]).pathname.replace(/\/$/, '') || '/',
        clicks: Number(cells[1]) || 0,
        impressions: Number(cells[2]) || 0,
      };
    } catch {
      return null;
    }
  })
  .filter(Boolean);

const LIVE = new Set(ROUTES.filter((r) => r.disposition === 'live').map((r) => r.path));

/** Next matches a redirect source in declaration order, first win. */
function sourceMatches(source, target) {
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
 * Does this path serve something?
 *
 * Three cases, and missing any one of them produces false alarms about working URLs,
 * which is how a check like this gets ignored:
 *   1. a declared live route
 *   2. a dynamic route segment, ANY [name], not just [slug], plus the content behind it
 *      where the route is the article one
 *   3. a static file under public/, because Google indexes images
 */
function serves(target) {
  const clean = target.split('?')[0];
  if (LIVE.has(clean)) return true;
  if (existsSync(path.join(ROOT, 'public', clean))) return true;

  const segments = clean.split('/').filter(Boolean);
  const slug = segments.pop();
  if (!slug) return false;

  const parent = path.join(APP, ...segments);
  if (!existsSync(parent)) return false;
  const dynamic = readdirSync(parent).filter(
    (entry) => entry.startsWith('[') && existsSync(path.join(parent, entry, 'page.tsx'))
  );
  if (dynamic.length === 0) return false;
  return dynamic.includes('[slug]') ? existsSync(path.join(CONTENT, `${slug}.md`)) : true;
}

function resolve(start, table) {
  let current = start;
  for (let hop = 0; hop < 6; hop++) {
    const rule = table.find((r) => sourceMatches(r.source, current));
    if (!rule) return { landed: current, hops: hop };
    current = rule.destination.includes(':')
      ? current.replace(
          new RegExp(`^${rule.source.split('/:')[0]}`),
          rule.destination.split('/:')[0]
        )
      : rule.destination;
  }
  return { landed: current, hops: 6 };
}

const totalClicks = rows.reduce((n, r) => n + r.clicks, 0);
console.log(
  `${rows.length} URLs in the export, ${totalClicks} clicks and ` +
    `${rows.reduce((n, r) => n + r.impressions, 0)} impressions.\n`
);

let worst = 0;
for (const [label, phases] of [
  ['Today', ['active']],
  ['Release day', ['active', 'phase4']],
]) {
  const table = getRedirectsForPhases(phases);
  const hops = {};
  const dead = [];
  for (const row of rows) {
    const { landed, hops: n } = resolve(row.url, table);
    hops[n] = (hops[n] ?? 0) + 1;
    if (!serves(landed)) dead.push({ ...row, landed, n });
  }
  const lost = dead.reduce((n, d) => n + d.clicks, 0);
  worst = Math.max(worst, lost);

  console.log(`${label}`);
  console.log(
    `  hops: ${Object.entries(hops).map(([n, c]) => `${c} in ${n}`).join(', ')}`
  );
  console.log(`  not reaching a page: ${dead.length}, carrying ${lost} clicks`);
  for (const d of dead.sort((a, b) => b.clicks - a.clicks)) {
    console.log(
      `    ${String(d.clicks).padStart(4)} clicks ${String(d.impressions).padStart(6)} impr  ` +
        `${d.url}${d.n ? ` -> ${d.landed}` : ''}`
    );
  }
  console.log();
}

/*
 * Only a dead URL that carries clicks fails the run. A zero-click 404 is usually an old
 * app route that should stay a 404: redirecting it somewhere plausible is a soft 404,
 * which Google treats worse than the honest thing.
 */
process.exit(worst > 0 ? 1 : 0);
