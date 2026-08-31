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
  if (!body.includes('<form')) throw new Error('no form element, so it cannot work without JavaScript');
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
  if (/^\s*Disallow:\s*\/\s*$/m.test(body)) throw new Error('Disallow: / is live. The site is blocked.');
  if (!body.includes('Sitemap:')) throw new Error('no sitemap directive');
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
