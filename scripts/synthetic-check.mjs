#!/usr/bin/env node

/**
 * Synthetic checks: does the site actually work, from outside?
 *
 * Unit tests prove the code is right about itself. These prove the deployed thing
 * responds, which is a different question and the one that matters at 7am. Every
 * check here is something that has broken on a real site before, and every failure
 * is something a visitor would hit.
 *
 * Usage:
 *   npm run check:synthetic                              (against production)
 *   npm run check:synthetic -- http://localhost:3000     (against a dev server)
 *
 * Exits non-zero on any failure so it can be a cron job or a CI step.
 *
 * DELIBERATELY DOES NOT SUBMIT THE ENQUIRY FORM. That writes a real lead into
 * Peter's pipeline and sends real mail to his only mailbox. It checks that the form
 * is present, correctly wired and reachable, which is what would actually break;
 * submitting it every five minutes would poison the data the form exists to collect.
 */
import { explain, isAllowed } from './lib/robots-matcher.mjs';

const BASE = (process.argv[2] ?? 'https://www.orangejelly.co.uk').replace(/\/$/, '');

const checks = [];
const check = (name, fn) => checks.push({ name, fn });

async function get(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, { redirect: 'manual', ...options });
  const body = response.status < 400 ? await response.text() : '';
  return { status: response.status, body, headers: response.headers };
}

/* The pages a stranger actually lands on. */
for (const path of ['/', '/start-here', '/growth-problems', '/results', '/guides']) {
  check(`${path} serves a page`, async () => {
    const { status, body } = await get(path);
    if (status !== 200) throw new Error(`expected 200, got ${status}`);
    if (body.length < 5000) throw new Error(`only ${body.length} bytes, page is probably broken`);
    if (!body.includes('Orange Jelly')) throw new Error('no brand name in the markup');
  });
}

check('the highest-earning article still serves', async () => {
  // 159 clicks a year, the single most valuable URL on the site.
  const { status, body } = await get('/guides/summer-pub-event-ideas');
  if (status !== 200) throw new Error(`expected 200, got ${status}`);
  if (!body.includes('application/ld+json')) throw new Error('structured data has gone');
  if (!body.includes('rel="canonical"')) throw new Error('canonical has gone');
});

check('the enquiry form is present and wired', async () => {
  // Not submitted. Submitting writes a real lead and sends real mail.
  const { body } = await get('/start-here');
  for (const field of ['name="name"', 'name="email"', 'name="company"', 'name="situation"']) {
    if (!body.includes(field)) throw new Error(`enquiry field missing: ${field}`);
  }
  if (!body.includes('<form'))
    throw new Error('no form element, so it cannot work without JavaScript');
});

check('search has an index to search', async () => {
  const { status, body } = await get('/search-index.json');
  if (status !== 200) throw new Error(`expected 200, got ${status}`);
  const parsed = JSON.parse(body);
  const count = Array.isArray(parsed) ? parsed.length : (parsed.items?.length ?? 0);
  if (count < 50) throw new Error(`only ${count} entries, the index did not build properly`);
});

check('the sitemap lists a plausible number of URLs', async () => {
  const { status, body } = await get('/sitemap.xml');
  if (status !== 200) throw new Error(`expected 200, got ${status}`);
  const urls = (body.match(/<url>/g) ?? []).length;
  if (urls < 100) throw new Error(`only ${urls} URLs, expected 100 or more`);
});

check('robots does not block the site', async () => {
  const { status, body } = await get('/robots.txt');
  if (status !== 200) throw new Error(`expected 200, got ${status}`);
  // The failure that takes a site out of Google overnight, and looks like nothing.
  if (/^\s*Disallow:\s*\/\s*$/m.test(body))
    throw new Error('Disallow: / is live. The site is blocked.');
  if (!body.includes('Sitemap:')) throw new Error('no sitemap directive');
});

/** The guide used as the second sample page, because a guide carries a hero image. */
const RENDERED_GUIDE = '/guides/summer-pub-event-ideas';

/** Build output the pages link to: stylesheets, script chunks and fonts. */
const NEXT_STATIC = /(?:href|src)="([^"]*\/_next\/static\/[^"]*)"/g;

/** The image optimiser, which is what almost every img element on the site points at. */
const NEXT_IMAGE = /src="([^"]*\/_next\/image[^"]*)"/g;

/**
 * Robots patterns are matched against the URL a page really links to, and the markup
 * carries `&amp;` where the URL carries `&`.
 */
const decodeEntities = (value) => value.replace(/&amp;/g, '&');

/** Distinct capture-group values for a global pattern, in the order the page lists them. */
const extractAll = (html, pattern) => [
  ...new Set([...html.matchAll(pattern)].map((match) => decodeEntities(match[1]))),
];

/**
 * The value of `attribute` on every `<tag>` whose markup contains `marker`, whichever
 * order the attributes happen to be serialised in. Matching two attributes in one
 * expression would bake in an order that holds only until the next framework release
 * changes it, and the check would then quietly extract nothing.
 */
const tagAttributes = (html, tag, marker, attribute) => {
  const values = new Set();
  for (const match of html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'g'))) {
    if (!match[0].includes(marker)) continue;
    const value = match[0].match(new RegExp(`${attribute}="([^"]*)"`));
    if (value) values.add(decodeEntities(value[1]));
  }
  return [...values];
};

/**
 * The site's own canonical origin, taken from the `Sitemap:` line. Metadata URLs such as
 * `og:image` are serialised absolute against that origin, so when this script runs
 * against a dev server they will not share an origin with BASE even though they are the
 * same site. Both origins count as ours; anything else genuinely belongs to a third
 * party, and this site's robots.txt has no say over it.
 */
const canonicalOrigin = (rules) => {
  const line = rules.match(/^\s*Sitemap:\s*(\S+)/im);
  if (!line) return null;
  try {
    return new URL(line[1]).origin;
  } catch {
    return null;
  }
};

/**
 * The path plus query that robots patterns are matched against, or null when the asset
 * is served by somebody else.
 */
const sitePath = (url, ourOrigins) => {
  const resolved = new URL(url, BASE);
  if (!ourOrigins.includes(resolved.origin)) return null;
  return `${resolved.pathname}${resolved.search}`;
};

check('robots lets Googlebot fetch the rendering assets', async () => {
  // Asserting that a disallow list no longer contains a given string proves nothing: a
  // wildcard rule or a Googlebot-specific group can block the same URLs without that
  // string ever appearing. The question is whether Googlebot, reading the live file, may
  // fetch the URLs the live pages actually reference, so ask exactly that.
  const robotsResponse = await get('/robots.txt');
  if (robotsResponse.status !== 200) {
    throw new Error(`robots.txt returned ${robotsResponse.status}`);
  }
  const rules = robotsResponse.body;

  const home = (await get('/')).body;
  const guide = (await get(RENDERED_GUIDE)).body;

  const homeStatic = extractAll(home, NEXT_STATIC);
  const guideStatic = extractAll(guide, NEXT_STATIC);
  const homeImages = extractAll(home, NEXT_IMAGE);
  const guideImages = extractAll(guide, NEXT_IMAGE);

  // Floors first, before a single assertion. A markup change, a page that served an
  // error or a regex that stopped matching would leave every list empty, and a check
  // that asserts "everything extracted is allowed" passes an empty list happily. These
  // are the numbers the live pages carry today, not aspirations.
  if (homeStatic.length < 15) {
    throw new Error(
      `only ${homeStatic.length} /_next/static URLs on the home page, extraction broke`
    );
  }
  if (guideImages.length < 3) {
    throw new Error(
      `only ${guideImages.length} /_next/image URLs on ${RENDERED_GUIDE}, extraction broke`
    );
  }

  const singletons = [];
  for (const [path, body] of [
    ['/', home],
    [RENDERED_GUIDE, guide],
  ]) {
    for (const [label, tag, marker, attribute] of [
      ['icon', 'link', 'rel="icon"', 'href'],
      ['apple-touch-icon', 'link', 'rel="apple-touch-icon"', 'href'],
      ['manifest', 'link', 'rel="manifest"', 'href'],
      ['og:image', 'meta', 'property="og:image"', 'content'],
    ]) {
      const found = tagAttributes(body, tag, marker, attribute);
      if (found.length !== 1) {
        throw new Error(`expected exactly one ${label} on ${path}, extracted ${found.length}`);
      }
      singletons.push(...found);
    }
    singletons.push(...tagAttributes(body, 'meta', 'name="twitter:image"', 'content'));
  }

  const assets = [
    ...new Set([...homeStatic, ...guideStatic, ...homeImages, ...guideImages, ...singletons]),
  ];

  const ourOrigins = [new URL(BASE).origin, canonicalOrigin(rules)].filter(Boolean);

  for (const asset of assets) {
    const path = sitePath(asset, ourOrigins);
    if (!path) {
      throw new Error(`${asset} is not served from ${BASE}, so this check cannot speak for it`);
    }
    const verdict = explain(rules, path, 'Googlebot');
    if (!verdict.allowed) {
      throw new Error(`Googlebot is blocked from ${path} by "${verdict.rule}"`);
    }
  }

  // The four rules that remain must still do their job, or this check would sit happily
  // on top of a robots.txt that allowed the whole site including the admin machinery.
  for (const path of [
    '/api/',
    '/api/admin/enquiries',
    '/admin/',
    '/admin/enquiries',
    '/private/',
    '/search-index.json',
  ]) {
    if (isAllowed(rules, path, 'Googlebot')) {
      throw new Error(`${path} is no longer blocked`);
    }
  }

  // `/admin/` deliberately does not match the bare `/admin`, which is held out of the
  // index by its own noindex metadata rather than by robots.
  for (const path of ['/admin', '/']) {
    const verdict = explain(rules, path, 'Googlebot');
    if (!verdict.allowed) {
      throw new Error(`${path} is blocked by "${verdict.rule}"`);
    }
  }

  // Permission to fetch a URL that 404s is not worth much, so fetch each one once.
  const fetched = await Promise.all(
    assets.map(async (asset) => ({
      asset,
      status: (await get(sitePath(asset, ourOrigins))).status,
    }))
  );
  const broken = fetched.filter((result) => result.status !== 200);
  if (broken.length > 0) {
    const first = broken[0];
    throw new Error(
      `${broken.length} of ${assets.length} assets did not return 200, first ${first.asset} gave ${first.status}`
    );
  }
});

check('llms.txt describes the current company', async () => {
  const { status, body } = await get('/llms.txt');
  if (status !== 200) throw new Error(`expected 200, got ${status}`);
  if (!body.includes('growth partner')) throw new Error('not the current positioning');
  if (/£/.test(body)) throw new Error('a price has reappeared');
});

check('a retired URL redirects rather than 404s', async () => {
  const { status, headers } = await get('/services');
  if (status !== 308 && status !== 301 && status !== 307) {
    throw new Error(`expected a redirect, got ${status}`);
  }
  if (!headers.get('location')) throw new Error('redirect with no destination');
});

check('a URL that never existed returns 404, not 200', async () => {
  // A soft 404 is worse than a hard one: Google indexes it.
  const { status } = await get('/this-page-has-never-existed-9f3a');
  if (status !== 404) throw new Error(`expected 404, got ${status}`);
});

check('the component harness is not served in production', async () => {
  // An internal component gallery, indexable and linked to nothing, competing with the
  // real pages for crawl budget.
  const { status } = await get('/dev/components');
  if (status !== 404) throw new Error(`expected 404, got ${status}`);
});

check('an unknown case study or growth problem returns 404, not a soft one', async () => {
  // The status is the whole assertion here, deliberately: get() discards the body for
  // anything at 400 or above, and a soft 404 is a 200 whatever the body says.
  for (const path of ['/results/no-such-case-study', '/growth-problems/no-such-problem']) {
    const { status } = await get(path);
    if (status !== 404) throw new Error(`${path} returned ${status}, expected 404`);
  }
});

check('the admin area is not open', async () => {
  const { status, body } = await get('/api/admin/enquiries');
  if (status === 200) throw new Error('the enquiry list answered without authentication');
  if (body.includes('@')) throw new Error('an email address leaked in the error body');
});

const results = [];
for (const { name, fn } of checks) {
  try {
    await fn();
    results.push({ name, ok: true });
  } catch (error) {
    results.push({ name, ok: false, why: error.message });
  }
}

console.log(`\nSynthetic checks against ${BASE}\n`);
for (const result of results) {
  console.log(`  ${result.ok ? 'ok  ' : 'FAIL'} ${result.name}`);
  if (!result.ok) console.log(`       ${result.why}`);
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length} of ${results.length} passed.\n`);
process.exit(failed.length > 0 ? 1 : 0);
