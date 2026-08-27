#!/usr/bin/env node
/**
 * Style isolation guard for the routes the repositioning must not touch.
 *
 * D17 scopes the new marketing palette to a marketing surface rather than :root,
 * because "out of scope" is a requirement and not an implementation mechanism. Root
 * custom properties and a global `h1,h2 { text-transform: lowercase }` reach every
 * route regardless of intent, so /availability and /admin would be restyled by a
 * marketing-site redesign nobody asked to apply to them.
 *
 * This captures what those routes actually compute and fails when it drifts.
 *
 * WHY COMPUTED STYLES RATHER THAN PIXEL DIFFS. The failure mode here is token
 * leakage, and a computed-style baseline names it directly: you get
 * "--surface-page changed from #FFFFFF to #F7F5F1" instead of "4,812 pixels differ".
 * Pixel diffing is also flaky across font rendering and antialiasing, which would
 * train everyone to ignore it. Screenshots are still captured alongside, for a human
 * to look at, but they are artefacts rather than the assertion.
 *
 *   npm run check:style-isolation                     # against a running dev server
 *   npm run check:style-isolation -- --update         # re-record the baseline
 *   npm run check:style-isolation -- --base=http://localhost:3000
 *
 * Exit code 1 on drift, so it can gate a build.
 *
 * @see tasks/repositioning/decisions.md D17, D19
 */
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};
const has = (name) => process.argv.includes(`--${name}`);

const BASE = arg('base', 'http://localhost:3000').replace(/\/$/, '');
const UPDATE = has('update');
const BASELINE = path.join(process.cwd(), 'src', 'test', 'baselines', 'style-isolation.json');
const SHOTS = path.join(process.cwd(), '.next', 'style-isolation');

/**
 * The properties a leaking token would move. Deliberately small: this is a tripwire,
 * not a full style snapshot, and a large surface drifts for innocent reasons.
 */
/**
 * Guaranteed to exist on any rendered page, and the first thing a global token
 * change moves. Everything else on these routes is conditional.
 */
const BODY_PROBES = [{ selector: 'body', props: ['background-color', 'color', 'font-family'] }];

const CHROME_PROBES = [
  ...BODY_PROBES,
  { selector: 'h1', props: ['text-transform', 'font-family', 'font-weight', 'color'] },
  { selector: 'a', props: ['color'] },
];

const CONTROL_PROBES = [
  { selector: 'button', props: ['background-color', 'color', 'border-color', 'border-radius'] },
  { selector: 'input', props: ['border-color', 'border-width', 'border-radius'] },
];

/**
 * Routes that must be unaffected by the marketing restyle.
 *
 * Probes are per route because the two kinds of page behave differently:
 *
 * /availability/new is a client-rendered form, so its controls exist only after
 * hydration. waitFor gives them a chance to appear rather than racing them.
 *
 * /admin is auth-gated and renders a different tree depending on session state, so
 * its controls are not a stable baseline. Chrome-level probes are, and they are the
 * ones a leaking token would move anyway.
 */
const PROTECTED_ROUTES = [
  // Signed-in dashboards. Their DOM depends on session and on whether any polls
  // exist, so headings and controls come and go between runs and make a useless
  // baseline. Body is stable and is what a global token change would move first.
  // The colour walk below still covers every element on the page regardless.
  { path: '/availability', probes: BODY_PROBES },
  { path: '/admin', probes: BODY_PROBES },
  // The public poll creation form. Stable, and the one place worth probing controls.
  { path: '/availability/new', probes: [...CHROME_PROBES, ...CONTROL_PROBES], waitFor: 'input' },
];

/**
 * Marketing colours that must never be RENDERED on these routes, as computed rgb.
 *
 * An earlier version of this check asserted that the --oj-* custom properties were
 * not DEFINED here. That was written for a design where the new palette would be
 * scoped behind a marketing surface selector. The palette ended up namespaced and
 * declared globally instead, because scoping it would have forced either route
 * groups or a layout that reads headers() and deopts 153 static pages.
 *
 * A custom property that nothing references has no visual effect, so "is it defined"
 * was the wrong question. "Does it actually reach a pixel on this route" is the
 * right one, and it still catches the real risk: a component on a tool route
 * accidentally using an oj-* class.
 */
const FORBIDDEN_RENDERED_COLOURS = {
  'rgb(247, 107, 12)': '--oj-orange',
  'rgb(192, 84, 8)': '--oj-orange-deep',
  'rgb(35, 37, 46)': '--oj-ink',
  'rgb(247, 245, 241)': '--oj-cream',
  'rgb(252, 251, 249)': '--oj-paper',
  'rgb(255, 211, 173)': '--oj-peach',
};

async function capture(page, route) {
  await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle' });

  /*
   * Wait for the stylesheet to actually be in effect before probing.
   *
   * Without this the guard reports every property at its browser default when it
   * happens to run while the dev server is recompiling, which looks exactly like a
   * catastrophic style loss and is nothing of the sort. A guard that cries wolf gets
   * ignored, so it waits for evidence that CSS has landed.
   */
  await page
    .waitForFunction(
      () => {
        const bg = getComputedStyle(document.body).backgroundColor;
        return bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
      },
      { timeout: 15000 }
    )
    .catch(() => {
      throw new Error('stylesheet never applied, the dev server may still be compiling');
    });

  if (route.waitFor) {
    // Tolerated if it never appears: a route that legitimately has no such control
    // should not fail the run, it should simply record nothing for it.
    await page.waitForSelector(route.waitFor, { timeout: 5000 }).catch(() => {});
  }

  const result = await page.evaluate(
    ({ probes, forbidden }) => {
      const out = { computed: {}, leaked: {} };

      for (const { selector, props } of probes) {
        const el = document.querySelector(selector);
        if (!el) continue;
        const style = getComputedStyle(el);
        out.computed[selector] = Object.fromEntries(
          props.map((p) => [p, style.getPropertyValue(p).trim()])
        );
      }

      // Walk everything on the page and see whether a marketing colour actually
      // renders. Cheap enough on these routes and it catches a stray oj-* class
      // anywhere, not just on the probed selectors.
      const paintProps = ['color', 'background-color', 'border-top-color', 'border-bottom-color'];
      for (const el of Array.from(document.querySelectorAll('*'))) {
        const style = getComputedStyle(el);
        for (const prop of paintProps) {
          const value = style.getPropertyValue(prop).trim();
          if (forbidden[value]) {
            const where = el.tagName.toLowerCase() + (el.className ? `.${String(el.className).split(' ')[0]}` : '');
            out.leaked[`${forbidden[value]} on ${where} (${prop})`] = value;
          }
        }
      }

      return out;
    },
    { probes: route.probes, forbidden: FORBIDDEN_RENDERED_COLOURS }
  );

  return result;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  mkdirSync(SHOTS, { recursive: true });
  const captured = {};
  const leaks = [];

  for (const route of PROTECTED_ROUTES) {
    try {
      const result = await capture(page, route);
      captured[route.path] = result.computed;

      for (const [where, value] of Object.entries(result.leaked)) {
        leaks.push(`${route.path}: ${where} renders ${value}`);
      }

      await page.screenshot({
        path: path.join(SHOTS, `${route.path.replace(/\//g, '_') || 'root'}.png`),
        fullPage: false,
      });
    } catch (error) {
      console.error(`Could not reach ${BASE}${route.path}: ${error.message}`);
      console.error('Is the dev server running? npm run dev');
      await browser.close();
      process.exit(1);
    }
  }

  await browser.close();

  if (UPDATE) {
    mkdirSync(path.dirname(BASELINE), { recursive: true });
    writeFileSync(BASELINE, `${JSON.stringify(captured, null, 2)}\n`);
    console.log(`Baseline recorded for ${PROTECTED_ROUTES.length} routes.`);
    console.log(`Screenshots in ${path.relative(process.cwd(), SHOTS)} for a human to check.`);
    if (leaks.length) {
      console.error('\nBut marketing colours are already rendering on protected routes:');
      leaks.forEach((l) => console.error(`  ${l}`));
      process.exit(1);
    }
    return;
  }

  if (!existsSync(BASELINE)) {
    console.error('No baseline. Record one first: npm run check:style-isolation -- --update');
    process.exit(1);
  }

  const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'));
  const drift = [];

  for (const [route, selectors] of Object.entries(baseline)) {
    for (const [selector, props] of Object.entries(selectors)) {
      for (const [prop, expected] of Object.entries(props)) {
        const actual = captured[route]?.[selector]?.[prop];
        if (actual !== expected) {
          drift.push(`${route} ${selector} { ${prop}: ${actual ?? 'missing'} }  expected ${expected}`);
        }
      }
    }
  }

  if (leaks.length || drift.length) {
    console.error('Style isolation check failed.\n');
    if (leaks.length) {
      console.error('Marketing colours rendered on out-of-scope routes:');
      leaks.forEach((l) => console.error(`  ${l}`));
      console.error('');
    }
    if (drift.length) {
      console.error('Computed styles drifted on out-of-scope routes:');
      drift.forEach((d) => console.error(`  ${d}`));
      console.error('');
    }
    console.error('If the change is intended, re-record: npm run check:style-isolation -- --update');
    process.exit(1);
  }

  console.log(`Style isolation check passed across ${PROTECTED_ROUTES.length} protected routes.`);
}

main();
