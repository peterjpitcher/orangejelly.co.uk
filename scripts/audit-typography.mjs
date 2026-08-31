/**
 * Walks the live site and reports two things the unit tests cannot see: text still
 * rendering in the pre-repositioning typefaces, and content blocks that disagree
 * with each other about how wide a column is.
 *
 * WHY A RENDERED SWEEP. Both faults are cascade faults, so they are invisible in
 * the source. `globals.css` gives every h1 to h6 the Fraunces serif in @layer base.
 * A component that writes `className="font-oj"` on a heading looks correct in the
 * file and still renders as the old serif, because the base element rule beats the
 * utility here. The only way to know which headings actually changed is to ask the
 * browser what it painted.
 *
 * The width check is the same idea. `.measure` is 72rem and `.oj-prose` is 680px,
 * both deliberate, but a page that stacks one inside the other gets a 1088px card
 * sitting directly above a 680px paragraph, and nothing in the source says so.
 *
 * Run against a dev server or a production build:
 *   node scripts/audit-typography.mjs [baseUrl]
 */
import { readFileSync } from 'node:fs';

import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const { ROUTES } = await import('../src/lib/route-manifest.js').then((m) => m.default ?? m);

/*
 * OJ_ROUTES is TypeScript, and this script runs on bare node so it stays as cheap to
 * run as the other audits. Reading the array out of the source keeps one list rather
 * than a copy here that drifts the first time a route opts in.
 */
const OJ_ROUTES = (() => {
  const src = readFileSync(new URL('../src/lib/oj-routes.ts', import.meta.url), 'utf8');
  const body = src.slice(src.indexOf('OJ_ROUTES = ['), src.indexOf('] as const;'));
  return [...body.matchAll(/'([^']+)'/g)].map((m) => m[1]);
})();

/*
 * Only the redesigned routes. /admin and /availability deliberately still run the
 * legacy chrome, so reporting their fonts would be noise that trains the reader to
 * ignore the output.
 */
const isOj = (p) =>
  OJ_ROUTES.some((r) => (r === '/' ? p === '/' : p === r || p.startsWith(`${r}/`)));

const staticPaths = ROUTES.filter((r) => r.disposition === 'live')
  .map((r) => r.path)
  .filter((p) => !p.includes('[') && !p.includes(':'))
  .filter(isOj);

/* One real article per dynamic template, because the templates are where prose lives. */
const SAMPLES = [
  '/guides/summer-pub-marketing',
  '/guides/category/marketing',
  '/insights/why-most-pub-marketing-fails',
  '/results/the-anchor-search-visibility',
  '/growth-problems/growth-has-stalled',
];

const PATHS = [...staticPaths, ...SAMPLES];

/* next/font mangles families to `__Fraunces_d6f10c`, so match on the readable part. */
const LEGACY = { Fraunces: 'old heading serif', Open_Sans: 'old body sans' };

const SWEEP = () => {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') return false;
    /*
     * Screen-reader-only text is not something this audit can judge. It is clipped
     * rather than hidden, so it still reports a box, and its styling only ever
     * appears on keyboard focus, which is a state the sweep does not enter.
     */
    if (el.closest('.sr-only')) return false;
    return !(r.width <= 4 && r.height <= 4);
  };

  const ownText = (el) =>
    [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim();

  const path = (el) => {
    const bits = [];
    for (let n = el; n && n.tagName && bits.length < 4; n = n.parentElement) {
      const cls = (n.getAttribute('class') || '').split(/\s+/).filter(Boolean).slice(0, 2);
      bits.unshift(n.tagName.toLowerCase() + (cls.length ? '.' + cls.join('.') : ''));
    }
    return bits.join(' > ');
  };

  const fonts = [];
  for (const el of document.querySelectorAll('body *')) {
    const text = ownText(el);
    if (!text || !visible(el)) continue;
    const family = getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '');
    fonts.push({ family, tag: el.tagName.toLowerCase(), text: text.slice(0, 70), path: path(el) });
  }

  /*
   * Widths. Compare only blocks that are meant to be a column: the direct children
   * of a page shell, plus the prose container. Cards inside a grid are supposed to
   * be narrower than the grid, so walking every element would report the whole site.
   */
  const widths = [];
  for (const shell of document.querySelectorAll('.page-shell')) {
    for (const child of shell.children) {
      if (!visible(child)) continue;
      const w = Math.round(child.getBoundingClientRect().width);
      widths.push({ w, path: path(child) });
      for (const g of child.querySelectorAll('.measure, .measure-wide, .oj-prose')) {
        if (visible(g)) widths.push({ w: Math.round(g.getBoundingClientRect().width), path: path(g) });
      }
    }
  }

  /*
   * Headings are excluded from the width comparison, and not because they cannot be
   * wrong. A headline capped at `max-w-[20ch]` so it breaks in the right place is
   * normal typesetting and has nothing to do with the column the body copy runs in,
   * so including them reported six pages as inconsistent when only one was.
   */
  const isHeading = (p) => /(^|> )h[1-6](\.|$)/.test(p);
  /*
   * `.measure-article` and `.measure-prose` are also excluded, for the same reason
   * as the headings: reaching for one of them is an explicit statement that this
   * block runs at a reading width rather than at the page width. What the check is
   * looking for is the accident, a block that ended up narrower or wider than its
   * neighbours without anybody deciding it should.
   */
  const declared = (p) => /measure-(article|prose)/.test(p);
  return { fonts, widths: widths.filter((x) => !isHeading(x.path) && !declared(x.path)) };
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const legacyHits = [];
const widthReport = [];
const failed = [];

for (const p of PATHS) {
  const res = await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => null);
  if (!res || !res.ok()) {
    failed.push([p, res ? res.status() : 'no response']);
    continue;
  }
  await page.evaluate(() => document.fonts.ready);
  const { fonts, widths } = await page.evaluate(SWEEP);

  for (const f of fonts) {
    const key = Object.keys(LEGACY).find((k) => f.family.includes(k));
    if (key) legacyHits.push({ route: p, why: LEGACY[key], ...f });
  }

  const distinct = [...new Set(widths.map((x) => x.w))].sort((a, b) => b - a);
  widthReport.push({ route: p, distinct, widths });
}

await browser.close();

const line = (s) => process.stdout.write(s + '\n');

line('');
line('=== LEGACY TYPEFACES STILL RENDERING ===');
if (!legacyHits.length) {
  line('None. Every visible run of text on the redesigned routes uses the new family.');
} else {
  const byRoute = new Map();
  for (const h of legacyHits) {
    if (!byRoute.has(h.route)) byRoute.set(h.route, []);
    byRoute.get(h.route).push(h);
  }
  line(`${legacyHits.length} element(s) across ${byRoute.size} route(s).`);
  for (const [route, hits] of byRoute) {
    line('');
    line(`${route}  (${hits.length})`);
    /* Collapse repeats: 40 h2s in one article is one fault, not forty. */
    const seen = new Map();
    for (const h of hits) {
      const k = `${h.tag}|${h.why}|${h.path}`;
      if (!seen.has(k)) seen.set(k, { ...h, n: 0 });
      seen.get(k).n += 1;
    }
    for (const h of seen.values()) {
      line(`  ${h.tag}  ${h.why}${h.n > 1 ? `  x${h.n}` : ''}`);
      line(`    ${h.path}`);
      line(`    "${h.text}"`);
    }
  }
}

line('');
line('=== COLUMN WIDTHS THAT DISAGREE ON THE SAME PAGE ===');
const messy = widthReport.filter((r) => {
  const real = r.distinct.filter((w) => w > 200);
  return real.length > 1 && real[0] - real[real.length - 1] > 80;
});
if (!messy.length) {
  line('None. Every page runs one column width.');
} else {
  line(`${messy.length} route(s) render body content at more than one width.`);
  for (const r of messy) {
    line('');
    line(`${r.route}  widths: ${r.distinct.filter((w) => w > 200).join(', ')}`);
    const byW = new Map();
    for (const x of r.widths) {
      if (x.w <= 200) continue;
      if (!byW.has(x.w)) byW.set(x.w, new Set());
      byW.get(x.w).add(x.path);
    }
    for (const [w, paths] of [...byW].sort((a, b) => b[0] - a[0])) {
      line(`  ${w}px`);
      for (const pth of [...paths].slice(0, 4)) line(`    ${pth}`);
    }
  }
}

if (failed.length) {
  line('');
  line('=== ROUTES THAT DID NOT LOAD ===');
  for (const [p, s] of failed) line(`  ${p}  ${s}`);
}
line('');
