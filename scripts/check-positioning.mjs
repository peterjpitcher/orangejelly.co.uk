#!/usr/bin/env node

/**
 * The positioning gate.
 *
 * Orange Jelly is no longer a hospitality marketing company and no longer publishes
 * prices. Both statements are only true if nothing on the site contradicts them,
 * and the contradiction never arrives as a page: it arrives as a stray sentence in
 * a JSON file, a package name in a constant, or a price in a piece of structured
 * data nobody reads.
 *
 * SCOPE IS DELIBERATELY NARROW AND WILL WIDEN.
 *
 * The sector pages are still live and still correct: "hospitality marketing agency"
 * is the strongest term the keyword research found, and it stays on the pages where
 * it is accurate. What must never carry it is anything that describes the COMPANY:
 * the root metadata, the organisation schema, the repositioned pages, the site
 * navigation and footer, and the shared constants.
 *
 * Phase 4 consolidates the pub landing pages (T063). When that lands, SURFACES
 * grows to the whole of src/app and the sector hub becomes the single exception.
 * Until then, widening it early would fail the build on pages that are still doing
 * their job.
 *
 * @see tasks/repositioning/IMPLEMENTATION-SPEC.md, decisions D3 and D14
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

/**
 * Files and directories that describe the company itself.
 *
 * The two hospitality sector pages are NOT here. They are the pages where "pub
 * marketing" is accurate and valuable, which is the whole point of keeping the
 * scope narrow. Their own test asserts what they must and must not say.
 */
const SURFACES = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/home-content.ts',
  'src/app/about',
  'src/app/how-we-work',
  'src/app/fractional-cmo',
  'src/app/growth-problems',
  'src/app/insights',
  'src/app/results',
  'src/app/sectors',
  'src/app/solutions',
  'src/app/start-here',
  'src/app/tools',
  'src/app/opengraph-image.tsx',
  'src/components/oj',
  'src/lib/constants.ts',
  'content/data/navigation.json',
  'content/data/footer.json',
];

const EXTENSIONS = new Set(['.ts', '.tsx', '.json', '.md']);

const RULES = [
  {
    name: 'old position',
    pattern: /\b(hospitality|pub)\s+(marketing|consultancy|agency|growth partner)\b/gi,
    message:
      'Describes the company by sector. Hospitality is one market Orange Jelly works in, not what it is. The term is allowed on the sector pages, not here.',
  },
  {
    name: 'sector-bound self-description',
    pattern: /\bfor (?:pubs|hospitality)\b(?![^.]*\bsector\b)/gi,
    message:
      'Scopes the offer to hospitality. The offer is for ambitious small and mid-sized businesses.',
  },
  {
    name: 'published price other than the hourly rate',
    /*
     * A price for work, not any currency amount, and no longer a blanket ban.
     *
     * D3 removed pricing entirely. On 31 August 2026 the owner reinstated one number
     * and one only: £62.50 plus VAT an hour, published for transparency. Packages
     * did not come back and are still caught by the rule below, so what this now
     * guards is the difference between a rate and a menu. A rate says what an hour
     * costs and leaves the size of the job open; a package quotes the job before
     * anybody has looked at it, which is the thing the repositioning removed.
     *
     * THE_RATE is allowed wherever it appears. Any other price still fails, which is
     * what catches the old £75 and £375 if they ever come back.
     *
     * The looser version of this pattern caught "£2" in a sample quiz-night message,
     * which is a pub's entry fee in example content and not something Orange Jelly
     * charges. A gate that cries wolf gets switched off, so it has to tell a price
     * from a number with a pound sign in front of it.
     */
    /*
     * `(?:\.\d{2})?` matters more than it looks. Without it the pattern stopped at
     * the pound and the whole number, so £62.50 was reported as "£62" and no
     * allowance written against the real rate could ever match it.
     */
    pattern:
      /(?:from\s*)?£\s?(?:\d[\d,]{1,}|\d(?=\s*(?:\+|plus)\s*VAT|\s*(?:per|\/)\s*(?:month|mo|hour|hr|day)))[\d,]*(?:\.\d{2})?(?:\s*(?:\+|plus)\s*VAT|\s*(?:per|\/)\s*(?:month|mo|hour|hr|day))?/gi,
    allow: /^£\s?62\.50(?:\s*(?:\+|plus)\s*VAT)?(?:\s*(?:per|\/)\s*(?:hour|hr))?$/i,
    message:
      'The only price the site publishes is £62.50 plus VAT an hour. Anything else is a package, and packages went with D3.',
  },
  {
    name: 'retired package',
    pattern: /\b(Growth Fix|Momentum Month|Turnaround Intensive)\b/g,
    message: 'The named packages went with D3. There is no menu.',
  },
  {
    name: 'price signal in structured data',
    pattern: /priceRange/g,
    message:
      'priceRange is a price signal and contradicts every page saying the work is priced to the problem.',
  },
  {
    name: 'retired claim',
    pattern: /\b(?:25 hours|60-70K|£75K|£100K|58%\s*(?:→|to)\s*71%)\b/gi,
    message: 'Retired in the CLAIMS rewrite. Use one of the five approved claims.',
  },
  {
    name: 'response-time promise',
    pattern: /\bwithin (?:24 hours|48 hours|one working day|\d+ (?:hours|working days))\b/gi,
    message:
      'D23: no response-time promise anywhere. A missed promise on first contact is worse than no promise.',
  },
];

/**
 * Surfaces phase 4 has not reached yet, with the exact rules they are still allowed
 * to break and the task that removes the exemption.
 *
 * This is debt made countable rather than debt made invisible. A file listed here
 * still fails every OTHER rule, so an exemption for a package name cannot quietly
 * become cover for a new price or a response-time promise.
 *
 * Delete each entry with the task named beside it. The gate reports an exemption
 * that is no longer needed, so they cannot outlive their reason.
 */
/*
 * Empty since phase 4 shipped on 31 August 2026.
 *
 * Both entries existed because /ways-to-work still sold four named packages and was
 * waiting on T063 to redirect. It has, the pages are deleted, and the constants and
 * footer data that carried the package names have been rewritten, so there is
 * nothing left to hold open. Kept as a mechanism rather than deleted: the next
 * staged change will want it.
 */
const PENDING_PHASE_4 = {};

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.isFile() && EXTENSIONS.has(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

function position(text, index) {
  const before = text.slice(0, index);
  return { line: before.split('\n').length };
}

/**
 * A line that exists to forbid the thing is not a violation of it.
 *
 * Without this the gate fails on its own rules, on the comment explaining why
 * priceRange was removed, and on every test asserting a price is absent. Marking
 * the intent explicitly is better than excluding whole files, which would let a
 * real price hide in a file that also contains a test.
 */
function isDeliberateMention(line) {
  return (
    /^\s*(?:\*|\/\/|\/\*)/.test(line) ||
    /\bnot\.toMatch|not\.toContain|expect\(/.test(line) ||
    /eslint|positioning-gate-ok/.test(line)
  );
}

async function collect(file) {
  const relative = path.relative(ROOT, file).replace(/\\/g, '/');
  const content = await fs.readFile(file, 'utf8');
  const lines = content.split('\n');
  const pending = PENDING_PHASE_4[relative];
  const violations = [];
  const usedExemptions = new Set();

  for (const rule of RULES) {
    for (const match of content.matchAll(rule.pattern)) {
      if (match.index === undefined) continue;
      /*
       * A rule may allow specific matches through. Only the price rule uses it, to
       * let the published hourly rate past while every other price still fails.
       */
      if (rule.allow?.test(match[0].trim())) continue;
      const { line } = position(content, match.index);
      if (isDeliberateMention(lines[line - 1] ?? '')) continue;
      if (pending?.rules.includes(rule.name)) {
        usedExemptions.add(rule.name);
        continue;
      }
      violations.push({ file: relative, line, text: match[0], rule });
    }
  }

  const stale = pending
    ? pending.rules.filter((rule) => !usedExemptions.has(rule)).map((rule) => ({ file: relative, rule, task: pending.task }))
    : [];

  return { violations, stale };
}

async function run() {
  const files = [];

  for (const surface of SURFACES) {
    const absolute = path.join(ROOT, surface);
    if (!(await exists(absolute))) continue;
    const stat = await fs.stat(absolute);
    if (stat.isDirectory()) {
      files.push(...(await walk(absolute)));
    } else if (EXTENSIONS.has(path.extname(absolute))) {
      files.push(absolute);
    }
  }

  const results = await Promise.all(files.map(collect));
  const violations = results.flatMap((result) => result.violations);
  const stale = results.flatMap((result) => result.stale);

  for (const entry of stale) {
    console.log(
      `Note: ${entry.file} no longer breaks the "${entry.rule}" rule. ` +
        `Remove its exemption from PENDING_PHASE_4 (${entry.task}).`
    );
  }

  if (violations.length === 0) {
    const exempt = Object.keys(PENDING_PHASE_4).length;
    console.log(
      `Positioning check passed across ${files.length} files` +
        (exempt ? `, with ${exempt} file(s) still carrying a phase 4 exemption.` : '.')
    );
    return;
  }

  console.error(`\nPositioning check failed with ${violations.length} problem(s):\n`);
  for (const violation of violations) {
    console.error(`  ${violation.file}:${violation.line}`);
    console.error(`    "${violation.text}" — ${violation.rule.name}`);
    console.error(`    ${violation.rule.message}\n`);
  }
  console.error(
    'These are not style problems. Each one is the site contradicting a decision\n' +
      'that has already been made and published elsewhere on the same site.\n'
  );
  process.exit(1);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
