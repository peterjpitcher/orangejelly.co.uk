#!/usr/bin/env node
/**
 * Runtime width audit.
 *
 * The static check in check-design-tokens.mjs catches ad-hoc width CLASSES. It
 * cannot catch what actually lands on screen, because that depends on how
 * components compose: a width built from a prop, a gutter applied by a parent, a
 * measure nested inside a card. Those only exist once the page is rendered.
 *
 * So this loads every route in a real browser and measures where content actually
 * starts. The design system allows three horizontal positions, and every block on
 * a page must sit on one of them:
 *
 *   shell         the .page-shell content edge
 *   measure       768px centred inside the shell
 *   measure-wide  896px centred inside the shell
 *
 * The reference edges are derived from the page's own .page-shell rather than
 * hardcoded, so this keeps working if the shell width or gutters ever change.
 *
 *   npm run audit:widths                        # against a running dev server
 *   npm run audit:widths -- --base=http://localhost:3000
 *   npm run audit:widths -- --viewport=1440 --routes=/,/about
 *
 * Exit code 1 if any violation is found, so it can gate a build.
 */
import { chromium } from 'playwright';

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};

const BASE = arg('base', 'http://localhost:3000').replace(/\/$/, '');
const VIEWPORTS = arg('viewport', '1920,1280')
  .split(',')
  .map((v) => parseInt(v, 10))
  .filter(Boolean);
const CONCURRENCY = parseInt(arg('concurrency', '4'), 10);
const ROUTES_ARG = arg('routes', '');
const LIMIT = parseInt(arg('limit', '0'), 10);

/** Routes that legitimately do not use the marketing shell. */
const SKIP = [/^\/admin/, /^\/availability/, /^\/test-shadcn/];

async function collectRoutes() {
  if (ROUTES_ARG) return ROUTES_ARG.split(',').map((r) => r.trim());
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}. Is the dev server up at ${BASE}?`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const paths = urls.map((u) => {
    try {
      return new URL(u).pathname;
    } catch {
      return u;
    }
  });
  return [...new Set(paths)].filter((p) => !SKIP.some((re) => re.test(p))).sort();
}

/**
 * Runs inside the page. Returns the violations for one route at one viewport.
 *
 * Everything here is deliberately conservative: a false positive costs more than a
 * missed one, because a checker people stop trusting is worse than no checker.
 */
const IN_PAGE = () => {
  const box = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      left: Math.round(r.left + parseFloat(cs.paddingLeft)),
      right: Math.round(r.right - parseFloat(cs.paddingRight)),
      w: Math.round(r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)),
      padX: Math.round(parseFloat(cs.paddingLeft)),
    };
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 1 && r.height > 1 && cs.display !== 'none' && cs.visibility !== 'hidden';
  };
  // Fixed overlays are positioned against the viewport, not the page column.
  const inFixed = (el) => {
    for (let n = el; n; n = n.parentElement) if (getComputedStyle(n).position === 'fixed') return true;
    return false;
  };
  const describe = (el) => ({
    tag: el.tagName.toLowerCase(),
    cls: (el.className || '').toString().slice(0, 70),
    text: (el.textContent || '').trim().slice(0, 40),
  });

  const shells = [...document.querySelectorAll('.page-shell')].filter((e) => visible(e) && !inFixed(e));
  if (!shells.length) return { skipped: 'no .page-shell on this route' };

  const boxes = shells.map(box);
  const ref = boxes.slice().sort((a, b) => b.w - a.w)[0];

  /*
   * The measure widths are READ from the stylesheet, never hardcoded here. They are
   * driven by --measure-max in globals.css, which is a deliberate single lever, and
   * a checker that hardcodes the number it is checking stops being a check the
   * moment someone moves the lever.
   */
  const probeWidth = (cls) => {
    const p = document.createElement('div');
    p.className = cls;
    p.style.position = 'absolute';
    p.style.visibility = 'hidden';
    document.body.appendChild(p);
    const mw = getComputedStyle(p).maxWidth;
    p.remove();
    return mw === 'none' ? Infinity : parseFloat(mw);
  };
  const widths = { measure: probeWidth('measure'), 'measure-wide': probeWidth('measure-wide') };

  /*
   * When the shell is narrower than the measure, max-width stops binding and the
   * measure simply fills the shell. Centring maths on a negative remainder would
   * expect an edge to the LEFT of the shell, which nothing can satisfy: an early
   * run at 768px reported 29 phantom violations wanting an edge of 0.
   */
  const edgeFor = (w) => (!isFinite(w) || ref.w <= w ? ref.left : Math.round(ref.left + (ref.w - w) / 2));
  const expect = {
    shell: ref.left,
    measure: edgeFor(widths.measure),
    'measure-wide': edgeFor(widths['measure-wide']),
  };

  const v = [];
  const near = (a, b) => Math.abs(a - b) <= 1;

  // 1. Every shell on a page starts at the same edge.
  for (const el of shells) {
    const b = box(el);
    if (!near(b.left, expect.shell) && b.w >= ref.w - 1) {
      v.push({ rule: 'shell-edge', got: b.left, want: expect.shell, ...describe(el) });
    }
  }

  // 2. A shell inside a shell double-gutters its contents.
  for (const el of shells) {
    if (el.parentElement && el.parentElement.closest('.page-shell')) {
      v.push({ rule: 'nested-shell', got: box(el).left, want: expect.shell, ...describe(el) });
    }
  }

  for (const name of ['measure', 'measure-wide']) {
    for (const el of document.querySelectorAll(`.${name}`)) {
      if (!visible(el) || inFixed(el)) continue;
      const b = box(el);

      /*
       * 3. The gutter belongs to the shell above, never to the measure itself.
       *
       * Only for a transparent layout wrapper. A measure-width CARD, meaning one
       * with its own background or border, legitimately has internal padding: that
       * is card padding, not a page gutter, and flagging it would push authors into
       * writing an extra wrapper for no gain.
       */
      const cs = getComputedStyle(el);
      const isCard =
        (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') ||
        parseFloat(cs.borderLeftWidth) > 0 ||
        cs.backgroundImage !== 'none';
      if (b.padX > 0 && !isCard) {
        v.push({ rule: 'measure-has-gutter', got: b.padX, want: 0, ...describe(el) });
      }

      /*
       * 4. Correct edge, but only when the measure has the full shell to sit in.
       *    Inside a card or grid column it is legitimately narrower, and asserting
       *    an edge there would be noise.
       *
       *    Compared on the BORDER box, not the content box. A card that spans the
       *    shell and has its own p-8 sits correctly at the shell edge while its
       *    content starts 32px in; measuring the content box reported that as a
       *    32px misalignment. Padding is rule 3's job, not this one's.
       */
      const borderLeft = Math.round(el.getBoundingClientRect().left);
      const parent = el.parentElement;
      const avail = parent ? box(parent).w : ref.w;
      if (avail >= ref.w - 1 && !near(borderLeft, expect[name])) {
        v.push({ rule: `${name}-edge`, got: borderLeft, want: expect[name], ...describe(el) });
      }
    }
  }

  // 5. Any centred width outside the scale.
  for (const el of document.querySelectorAll('[class*="max-w-"]')) {
    if (!visible(el) || inFixed(el)) continue;
    const cls = (el.className || '').toString();
    if (/\b(measure|measure-wide|page-shell)\b/.test(cls)) continue;
    if (!/\bmx-auto\b/.test(cls)) continue; // left-aligned constraints are fine
    if (!/max-w-(2xl|3xl|4xl|5xl|6xl|7xl)\b/.test(cls)) continue; // component scales are fine
    const b = box(el);
    if (b.w < 200) continue;
    v.push({ rule: 'ad-hoc-centred-width', got: b.left, want: expect.measure, ...describe(el) });
  }

  /*
   * 6. The page's title and its body copy must read as one column.
   *
   * Rules 1 to 5 check each block against the scale in isolation, and both the
   * shell edge and the measure edge are legal. A page can therefore pass all of
   * them and still look broken, by putting its H1 flush to the shell while its
   * article sits in a centred measure. That is exactly what happened on
   * /licensees-guide/[slug]: the hero title started at 416 and the article at 576,
   * a visible 160px step, and every earlier rule was satisfied.
   *
   * Aligned means sharing a left edge OR sharing a centre, because a centred title
   * over a centred column is just as coherent as two left-aligned blocks. Only when
   * they share neither is there a step.
   */
  const h1 = [...document.querySelectorAll('h1')].filter((e) => visible(e) && !inFixed(e))[0];
  const proseHost =
    document.querySelector('article.measure, article, .measure > .prose, .prose') || null;
  /*
   * Only when the prose is the page's own reading column, not a column inside a
   * multi-up layout. On /about the first .prose is one half of a two-up grid, 669px
   * wide and centred at 846 rather than 960: comparing a centred page title to that
   * is meaningless, and the first version of this rule reported it as a defect.
   * If the host's parent is narrower than the shell, the host is in a column.
   */
  const hostParentW = proseHost && proseHost.parentElement ? box(proseHost.parentElement).w : 0;
  const hostIsPageColumn = hostParentW >= ref.w - 1;
  if (h1 && proseHost && hostIsPageColumn && visible(proseHost) && !inFixed(proseHost)) {
    const a = box(h1);
    const b = box(proseHost);
    const centre = (x) => Math.round((x.left + x.right) / 2);
    if (!near(a.left, b.left) && Math.abs(centre(a) - centre(b)) > 1) {
      v.push({
        rule: 'title-body-misaligned',
        got: a.left,
        want: b.left,
        tag: 'h1',
        cls: (h1.className || '').toString().slice(0, 70),
        text: `title starts at ${a.left}, body at ${b.left}`,
      });
    }
  }

  const edges = {};
  for (const el of document.querySelectorAll('.page-shell, .measure, .measure-wide')) {
    if (!visible(el) || inFixed(el)) continue;
    const l = box(el).left;
    edges[l] = (edges[l] || 0) + 1;
  }

  return { expect, edges, violations: v };
};

const routes = await collectRoutes();
const todo = LIMIT ? routes.slice(0, LIMIT) : routes;
console.log(`Auditing ${todo.length} routes at ${VIEWPORTS.join('px, ')}px against ${BASE}\n`);

const browser = await chromium.launch();
const results = [];
let done = 0;

async function auditOne(route) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const out = [];
  try {
    for (const width of VIEWPORTS) {
      await page.setViewportSize({ width, height: 1080 });
      const res = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 45000 });
      if (!res || res.status() >= 400) {
        out.push({ route, width, error: `HTTP ${res ? res.status() : 'no response'}` });
        continue;
      }
      const r = await page.evaluate(IN_PAGE);
      out.push({ route, width, ...r });
    }
  } catch (e) {
    out.push({ route, error: String(e).split('\n')[0].slice(0, 120) });
  } finally {
    await ctx.close();
  }
  done++;
  process.stdout.write(`\r  ${done}/${todo.length} routes`);
  return out;
}

for (let i = 0; i < todo.length; i += CONCURRENCY) {
  const batch = todo.slice(i, i + CONCURRENCY);
  const got = await Promise.all(batch.map(auditOne));
  results.push(...got.flat());
}
await browser.close();
process.stdout.write('\n\n');

const failures = results.filter((r) => r.violations && r.violations.length);
const errored = results.filter((r) => r.error);
const skipped = results.filter((r) => r.skipped);

for (const r of failures) {
  console.log(`${r.route}  @${r.width}px`);
  console.log(
    `  expected edges: shell ${r.expect.shell}, measure ${r.expect.measure}, measure-wide ${r.expect['measure-wide']}`
  );
  const seen = new Set();
  for (const v of r.violations) {
    const key = `${v.rule}|${v.got}|${v.cls}`;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`  [${v.rule}] got ${v.got}, want ${v.want}`);
    console.log(`     <${v.tag} class="${v.cls}">  ${v.text ? '"' + v.text + '"' : ''}`);
  }
  console.log('');
}

if (errored.length) {
  console.log('Routes that could not be audited:');
  for (const r of errored) console.log(`  ${r.route}: ${r.error}`);
  console.log('');
}
if (skipped.length) {
  const uniq = [...new Set(skipped.map((s) => s.route))];
  console.log(`No .page-shell (not audited): ${uniq.length} route(s)\n`);
}

const total = failures.reduce((n, r) => n + r.violations.length, 0);

// A route that would not load has not been audited, so it cannot be reported as
// passing. Treating an error as a pass is how a green check starts meaning nothing.
if (errored.length) {
  console.log(`Width audit FAILED: ${errored.length} route(s) could not be loaded.`);
  if (total) console.log(`Also ${total} width violation(s) in the routes that did load.`);
  process.exit(1);
}
if (total) {
  console.log(`Width audit FAILED: ${total} violation(s) across ${failures.length} route/viewport pairs.`);
  console.log('Every block must sit on the shell edge, the measure edge, or the measure-wide edge.');
  process.exit(1);
}
console.log(`Width audit passed: ${results.length} route/viewport pairs, every block on a scale edge.`);
