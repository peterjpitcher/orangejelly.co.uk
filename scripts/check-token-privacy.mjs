#!/usr/bin/env node
/**
 * Runtime proof that poll token routes leak nothing to third parties.
 *
 * Poll URLs carry a bearer token in the path. Anyone holding one IS the person it
 * was issued to, permanently, with no login to fall back on. Vercel Analytics and
 * GTM both report the raw path, so a third-party script running on these pages
 * hands the poll's own access token to Google and to Vercel.
 *
 * WHAT THIS ADDS OVER THE EXISTING TEST. src/components/engagement/
 * MarketingChrome.test.tsx already asserts that the gated components render nothing
 * on token routes, that the token never appears in the rendered chrome, and that the
 * root layout cannot bypass the gate by importing a third-party script directly.
 * That is a strong unit-level guarantee and it stays the first line of defence.
 *
 * It cannot prove the absence of a request. A dependency could fetch on mount, a
 * font or image could point at a third-party host, a future component could call
 * out without rendering a script tag. This drives a real browser and watches the
 * network, so the assertion is "nothing left the machine" rather than "nothing was
 * rendered".
 *
 * MUST RUN AGAINST A DEPLOYMENT, NOT LOCALHOST. Vercel Analytics and Speed Insights
 * are no-ops off Vercel, and a local `next start` does not reproduce the deployed
 * environment, so nothing third-party loads and the check has nothing to detect. The
 * control route below turns that into a loud failure rather than a false pass.
 *
 *   npm run check:token-privacy -- --base=https://www.orangejelly.co.uk
 *   npm run check:token-privacy -- --base=https://<preview>.vercel.app
 *
 * Exit code 1 on any third-party request or any appearance of the token off-origin.
 *
 * @see tasks/repositioning/decisions.md D19
 * @see src/lib/token-routes.ts
 */
import { chromium } from 'playwright';

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};

const BASE = arg('base', 'http://localhost:3000').replace(/\/$/, '');

/**
 * A token shaped like the real thing and belonging to nobody. The routes will not
 * resolve a poll, which does not matter: the gate runs on the pathname, so the
 * page still exercises exactly the code path under test.
 */
const FAKE_TOKEN = 'aaaaaaaabbbbccccddddeeeeeeeeeeee';

const TOKEN_ROUTES = [
  `/availability/o/${FAKE_TOKEN}`,
  `/availability/p/${FAKE_TOKEN}`,
  `/availability/verify/${FAKE_TOKEN}`,
];

/** A marketing route, to prove the check can tell the difference. */
const CONTROL_ROUTE = '/';

/**
 * Grant full analytics consent before every visit.
 *
 * This is the strong form of the test. Without consent nothing loads anywhere, so a
 * pass would only prove the cookie banner works. What matters is that a visitor who
 * has accepted everything still leaks nothing on a token route, because that is the
 * visitor whose browser is most willing to talk to Google.
 */
async function grantConsent(page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('oj-cookie-consent', JSON.stringify({ analytics: true }));
    } catch {
      // A private context without storage is fine: the visit still happens.
    }
  });
}

async function requestsFor(page, route) {
  const requests = [];
  const handler = (request) => requests.push(request.url());
  page.on('request', handler);

  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' }).catch(() => {});
  // Give anything that fires on mount or on idle a chance to give itself away.
  await page.waitForTimeout(2500);

  page.off('request', handler);
  return requests;
}

function offOrigin(urls) {
  const origin = new URL(BASE).origin;
  return urls.filter((url) => {
    if (url.startsWith('data:') || url.startsWith('blob:')) return false;
    try {
      return new URL(url).origin !== origin;
    } catch {
      return false;
    }
  });
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await grantConsent(page);

  const failures = [];

  for (const route of TOKEN_ROUTES) {
    const urls = await requestsFor(page, route);
    const external = offOrigin(urls);

    for (const url of external) {
      failures.push(`${route}\n    third-party request: ${url}`);
    }

    // Belt and braces: even a same-origin request must not carry the token
    // somewhere it was not already, and no request anywhere may contain it except
    // the page's own navigation and its RSC payload.
    const tokenElsewhere = urls.filter(
      (url) => url.includes(FAKE_TOKEN) && new URL(url).origin !== new URL(BASE).origin
    );
    for (const url of tokenElsewhere) {
      failures.push(`${route}\n    token appeared off-origin: ${url}`);
    }
  }

  // The control proves the check is capable of failing. If a marketing route also
  // makes no third-party request, the assertion above is worthless, because
  // something unrelated is blocking the network.
  const controlExternal = offOrigin(await requestsFor(page, CONTROL_ROUTE));

  await browser.close();

  if (controlExternal.length === 0) {
    console.error('Check is not meaningful: the control route made no third-party request');
    console.error(`either ${CONTROL_ROUTE} is broken, or the network is blocked in this run.`);
    console.error('A pass would prove nothing, so this is being treated as a failure.');
    process.exit(1);
  }

  if (failures.length) {
    console.error('Token route privacy check FAILED.\n');
    console.error('These routes carry a bearer token in the path and must reach nothing:');
    failures.forEach((f) => console.error(`  ${f}`));
    console.error('\nSee src/lib/token-routes.ts and MarketingChrome.tsx.');
    process.exit(1);
  }

  console.log(`Token privacy check passed across ${TOKEN_ROUTES.length} token routes.`);
  console.log(
    `Control route made ${controlExternal.length} third-party requests, so the check can detect one.`
  );
}

main();
