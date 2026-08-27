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
 * Routes that must be unaffected by the marketing restyle.
 *
 * /admin redirects to auth when signed out, which is fine: the redirect target is
 * itself a surface the restyle must not change.
 */
const PROTECTED_ROUTES = ['/availability', '/availability/new', '/admin'];

/**
 * The properties a leaking token would move. Deliberately small: this is a tripwire,
 * not a full style snapshot, and a large surface would drift for innocent reasons.
 */
const PROBES = [
  { selector: 'body', props: ['background-color', 'color', 'font-family'] },
  { selector: 'h1', props: ['text-transform', 'font-family', 'font-weight', 'color'] },
  { selector: 'h2', props: ['text-transform', 'font-family', 'font-weight'] },
  { selector: 'button', props: ['background-color', 'color', 'border-color', 'border-radius'] },
  { selector: 'a', props: ['color'] },
  { selector: 'input', props: ['border-color', 'border-width', 'border-radius'] },
];

/** Custom properties that must never resolve on these routes. */
const FORBIDDEN_CUSTOM_PROPERTIES = [
  '--oj-orange',
  '--oj-ink',
  '--oj-cream',
  '--oj-peach',
  '--surface-page',
  '--surface-card',
  '--text-body',
];

async function capture(page, route) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });

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

      // A marketing token that resolves to anything here means the scope leaked.
      const rootStyle = getComputedStyle(document.documentElement);
      const bodyStyle = getComputedStyle(document.body);
      for (const prop of forbidden) {
        const value = rootStyle.getPropertyValue(prop).trim() || bodyStyle.getPropertyValue(prop).trim();
        if (value) out.leaked[prop] = value;
      }

      return out;
    },
    { probes: PROBES, forbidden: FORBIDDEN_CUSTOM_PROPERTIES }
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
      captured[route] = result.computed;

      for (const [prop, value] of Object.entries(result.leaked)) {
        leaks.push(`${route}: ${prop} resolves to "${value}" and must not exist here`);
      }

      await page.screenshot({
        path: path.join(SHOTS, `${route.replace(/\//g, '_') || 'root'}.png`),
        fullPage: false,
      });
    } catch (error) {
      console.error(`Could not reach ${BASE}${route}: ${error.message}`);
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
      console.error('\nBut marketing tokens are already leaking into protected routes:');
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
      console.error('Marketing tokens leaked into out-of-scope routes:');
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
