#!/usr/bin/env node
/**
 * Static guards for the design system.
 *
 * Every rule here exists because the thing it forbids actually shipped and was
 * invisible until someone measured the rendered page. Tailwind does not error on
 * an unknown colour, it emits nothing, so these failures are silent by nature:
 * the class stays in the HTML, the style never arrives, and the element quietly
 * inherits whatever was underneath.
 *
 * Runs in lint and in build, alongside check-growth-language and
 * check-british-english. Contrast itself is asserted separately, in
 * src/test/design-tokens.contrast.test.ts, because it needs real colour maths.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');

/**
 * Paths allowed to contain raw hex literals, each for a stated reason. A trailing
 * slash matches a whole directory. Adding to this list is fine; adding to it
 * without a reason is not.
 */
const HEX_ALLOWLIST = [
  // No build step exists inside an inbox. The values are pinned back to
  // tailwind.config.js by src/test/design-tokens.contrast.test.ts.
  'src/lib/poll-emails/',
  // The canonical palette definitions themselves.
  'src/lib/theme-colors.ts',
  // A data-driven taxonomy palette applied as inline gradients, so it cannot be
  // expressed as Tailwind classes. Its contrast claim is asserted by
  // src/test/design-tokens.contrast.test.ts.
  'src/lib/category-colours.ts',
  // next/og renders these at the edge, without Tailwind.
  'src/app/opengraph-image.tsx',
  'src/app/icon.tsx',
  'src/app/apple-icon.tsx',
  // The web app manifest is JSON consumed by the operating system. There is no
  // stylesheet in an Android home screen, so background_color and theme_color have
  // to be literal. Their values are pinned to the palette by
  // src/test/design-tokens.contrast.test.ts.
  'src/app/manifest.ts',
];

/** Tests assert literal values on purpose; that is the point of them. */
const isTest = (rel) => /\.(test|spec)\.[tj]sx?$/.test(rel);
const hexAllowed = (rel) =>
  isTest(rel) || HEX_ALLOWLIST.some((p) => (p.endsWith('/') ? rel.startsWith(p) : rel === p));

/**
 * Colour families whose numeric scale tailwind.config.js replaces with a named
 * ramp. Writing `orange-500` looks reasonable and generates nothing at all.
 * `bg-orange-100 text-orange-800` sat in the search results styling this way,
 * rendering as unstyled text until it was measured.
 */
const OVERRIDDEN_SCALES = ['orange'];

/*
 * Files allowed to centre a width outside the measure scale, each for a reason
 * that does not apply to page content.
 */
const WIDTH_ALLOWLIST = [
  // The admin dashboard is a separate surface with its own layout.
  'src/app/admin/AdminDashboard.tsx',
];

/*
 * Paths where a retired colour NAME may legitimately appear as a word, each for a
 * stated reason. Adding to this list is fine; adding to it without a reason is not.
 *
 * The retired-colour rule catches two things: the Tailwind utility (bg-cream) and the
 * bare quoted name, because colour names used to be passed around as props. The
 * second is what needs an exception here.
 */
const RETIRED_COLOUR_ALLOWLIST = [
  // The repositioning namespace has its own --oj-cream, a genuine cream, and the
  // design contracts use 'cream' as a SURFACE TONE prop value (tone: 'cream' |
  // 'orange'). That is a variant name, not the retired Tailwind colour, and the
  // utility half of the rule still applies here: bg-cream would still be caught,
  // only bg-oj-cream is allowed.
  'src/components/oj/',
];

/** Colour names retired in the 2026-08 rename, with what to use instead. */
const RETIRED_COLOURS = {
  charcoal: 'brand-base',
  cream: 'surface',
  teal: 'blue-support',
};

const UTILITY_PREFIX =
  '(?:[a-z-]+:)*!?(?:text|bg|border|ring|ring-offset|outline|from|via|to|divide|decoration|placeholder|caret|accent|shadow|fill|stroke)-';

const errors = [];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx?|css)$/.test(entry)) out.push(full);
  }
  return out;
}

const files = walk(SRC);

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const source = readFileSync(file, 'utf8');
  const lines = source.split('\n');

  /*
   * Comments explain these rules, quoting the very patterns the rules ban, so they
   * must not trip them. Testing each line on its own is not enough: the second and
   * later lines of a block comment start with ordinary prose, and a JSX comment
   * opens with `{` rather than a comment marker. Both have to be tracked across
   * lines, or the checker reports its own documentation as a violation.
   */
  let inBlockComment = false;

  lines.forEach((line, i) => {
    const at = `${rel}:${i + 1}`;
    const opensBlock = /\{?\/\*/.test(line);
    const closesBlock = /\*\/\}?/.test(line);
    const isComment =
      inBlockComment || /^\s*(\/\/|\*|\/\*|\{\/\*|<!--)/.test(line) || (opensBlock && !closesBlock);
    if (opensBlock && !closesBlock) inBlockComment = true;
    else if (closesBlock) inBlockComment = false;

    // 1. Retired colour names must not come back.
    const quotedAllowed = RETIRED_COLOUR_ALLOWLIST.some((allowed) => rel.startsWith(allowed));
    for (const [old, replacement] of Object.entries(RETIRED_COLOURS)) {
      const utility = new RegExp(`${UTILITY_PREFIX}${old}(?![-\\w])`);
      const quoted = new RegExp(`(['"\`])${old}(-light|-dark)?\\1`);
      const hit = utility.test(line) || (!quotedAllowed && quoted.test(line));
      if (!isComment && hit) {
        errors.push(
          `${at}\n    "${old}" was retired: it never resolved to a ${old}. Use "${replacement}".`
        );
      }
    }

    // 2. Numeric scales for families the config overrides generate no CSS.
    for (const family of OVERRIDDEN_SCALES) {
      const numeric = new RegExp(
        `${UTILITY_PREFIX}${family}-(50|100|200|300|400|500|600|700|800|900|950)\\b`
      );
      if (!isComment && numeric.test(line)) {
        errors.push(
          `${at}\n    tailwind.config.js replaces the "${family}" numeric scale with a named ramp,\n` +
            `    so this class generates no CSS at all. Use ${family}, ${family}-light, ${family}-dark or ${family}-darker.`
        );
      }
    }

    // 3. Control sizes have names. `min-h-[44px]` appeared thirty times, which
    //    meant the accessibility floor had thirty definitions and changing
    //    --tap-target-size changed none of them.
    if (!isComment) {
      const arbitrary = line.match(/\b(?:min-h|min-w|h|w)-\[(44|48|56)px\]/);
      if (arbitrary) {
        const token = { 44: 'tap', 48: 'control', 56: 'control-lg' }[arbitrary[1]];
        errors.push(
          `${at}\n    Hardcoded control size ${arbitrary[0]}. Use the "${token}" token, e.g. min-h-${token}.`
        );
      }
    }

    // 4. The page shell is one class, not a pattern to be retyped.
    //    Measured at 1440px, hand-rolled shells produced nine distinct content
    //    left edges on a single page, and left the header logo 56px out of line
    //    with the copy beneath it. A shell is a width and a gutter together.
    if (!isComment && !rel.endsWith('globals.css')) {
      const handRolled = line.match(/max-w-(5xl|6xl|7xl)\s+mx-auto\s+px-\d/);
      if (handRolled) {
        errors.push(
          `${at}\n    Hand-rolled page shell (${handRolled[0]}). Use the "page-shell" class,\n` +
            `    which bundles the width and the gutter so they cannot drift apart.`
        );
      }
    }

    // 5. Centred widths come from the scale, not from whichever max-w looked right.
    //    Before this, body copy was centred at 672px, 768px and 896px more or less
    //    interchangeably across 136 blocks, which is what made pages look unrelated
    //    to one another. The width of a paragraph is not a per-page decision.
    if (!isComment && !rel.endsWith('globals.css') && !WIDTH_ALLOWLIST.includes(rel)) {
      const adHoc = line.match(
        /max-w-(2xl|3xl|4xl|5xl|6xl|7xl)\b(?=[^"'`]*\bmx-auto\b)|mx-auto\b(?=[^"'`]*\bmax-w-(2xl|3xl|4xl|5xl|6xl|7xl)\b)/
      );
      if (adHoc) {
        errors.push(
          `${at}\n    Ad-hoc centred width (${adHoc[0]}). Use "measure" for prose (768px),\n` +
            `    "measure-wide" for centred grids and media (896px), or "page-shell" to span\n` +
            `    the page. Anything else will not line up with the rest of the site.`
        );
      }
    }

    // 6. Hex literals belong in the palette, not in components.
    if (!isComment && !hexAllowed(rel) && !rel.endsWith('globals.css')) {
      const hex = line.match(/#[0-9a-fA-F]{6}\b/);
      if (hex) {
        errors.push(
          `${at}\n    Hardcoded hex ${hex[0]}. Use a design token, or add this file to HEX_ALLOWLIST\n` +
            `    in scripts/check-design-tokens.mjs with a reason.`
        );
      }
    }
  });
}

// 6. globals.css custom properties: no self-references, no duplicates.
//    `--color-surface: var(--color-surface)` is invalid at computed-value time and
//    silently takes out every token derived from it. A codemod produced exactly
//    that, and it overrode the real declaration sitting above it.
const cssPath = path.join(SRC, 'app/globals.css');
const css = readFileSync(cssPath, 'utf8');
const rootBlock = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf('--color-info')));
const declarations = [...rootBlock.matchAll(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gm)];
const seen = new Map();

for (const [, name, value] of declarations) {
  if (value.includes(`var(${name})`)) {
    errors.push(
      `src/app/globals.css\n    ${name} references itself, which makes it invalid and unsets everything derived from it.`
    );
  }
  if (seen.has(name)) {
    errors.push(
      `src/app/globals.css\n    ${name} is declared twice in :root ("${seen.get(name)}" then "${value}").\n` +
        `    The later one silently wins.`
    );
  }
  seen.set(name, value);
}

// 7. Every var() reference must resolve to a declaration.
const declared = new Set([...css.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map((m) => m[1]));
const referenced = new Set([...css.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]));
for (const ref of referenced) {
  // Radix and the seasonal themes inject their own at runtime.
  if (ref.startsWith('--radix-') || ref.startsWith('--season-')) continue;
  if (!declared.has(ref)) {
    errors.push(`src/app/globals.css\n    var(${ref}) has no declaration.`);
  }
}

if (errors.length) {
  console.error(`\nDesign token check failed with ${errors.length} problem(s):\n`);
  for (const e of errors) console.error(`  ${e}\n`);
  console.error(
    'These are silent failures: Tailwind emits nothing for an unknown colour, so the\n' +
      'page renders unstyled rather than erroring. Fix them at the token layer.\n'
  );
  process.exit(1);
}

console.log('Design token check passed.');
