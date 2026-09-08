#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

const FILE_TARGETS = [
  'src/app/page.tsx',
  'src/app/results/layout.tsx',
  'src/app/results/page.tsx',
  'src/app/why-revenue-is-falling/page.tsx',
  'src/app/opengraph-image.tsx',
  'src/app/pub-marketing-no-budget/page.tsx',
  'src/components/Meta.tsx',
  'src/components/ROICalculator.tsx',
  'src/lib/constants.ts',
];

const DIRECTORY_TARGETS = ['content/data', 'content/faqs', 'content/case-studies'];

/*
 * The published surface: the only place this gate has any business looking.
 *
 * The rule is about what a customer reads, so the scope is the app plus the content
 * and data files that feed pages. Everything else in the repo is working material.
 * `tasks/`, `docs/reports/`, `docs/plans/` and `scripts/` are where we plan the work,
 * quote the banned words in order to explain the rule, and write operator
 * instructions like "Save as `raw/gsc-month-all.zip`". None of that reaches a reader.
 *
 * It was reading all of it as copy, because lint-staged hands over every staged
 * `js,jsx,ts,tsx,json,md` file and nothing here narrowed the list. On 8 September
 * 2026 that blocked a keyword-plan run over 34 instances of "save" in its own
 * operator instructions, and the run had to be left uncommitted. It had already bent
 * an earlier evidence note, `tasks/keyword-plan/2026-08-09-ctr-reclaim.md`, which
 * says out loud that it cannot quote the words it is describing. Swept across the
 * tracked tree the gate found 295 matches and 7 of them were on the published
 * surface, so it was almost entirely a tax on internal writing, and narrowing costs
 * nothing: the same 7 still fail. Same reasoning as the vendored and test
 * exclusions: a gate that fires on working files is a gate that gets bypassed with
 * --no-verify, and then it is not protecting the copy either.
 *
 * This subsumes two exclusions that used to be filtered separately below, because
 * neither is on the surface any more: `docs/brand/`, the vendored pack whose own
 * prose ("Save important decisions and artefacts") must stay byte-identical to the
 * delivery, and the root `AGENTS.md` / `CLAUDE.md`, which state this very rule by
 * quoting the words it bans.
 */
const PUBLISHED_SURFACE = ['src/', 'content/'];

const ALLOWED_EXTENSIONS = new Set(['.json', '.md', '.ts', '.tsx']);

const BANNED_RULES = [
  {
    // Was /\bsave(?:d|s|ing)?\b/ which expands to save|saved|saves|saveing, so the
    // gerund "saving" was never caught and seven instances reached published guides.
    pattern: /\bsav(?:e|es|ed|ing)\b/gi,
    message:
      'Replace savings language with growth language (for example: transform, accelerate, disrupt).',
  },
  {
    pattern: /\bsavings\b/gi,
    message:
      'Use outcome language like margin growth, margin gains, revenue growth, or growth capacity.',
  },
];

/*
 * lint-staged passes absolute paths and a manual run usually passes relative ones,
 * and either can carry a `..`. Normalising before the prefix test means
 * `src/../docs/brand/x.md` is still recognised as `docs/brand/x.md`.
 */
function toRepoRelative(filePath) {
  return path.relative(ROOT, path.resolve(ROOT, filePath)).replace(/\\/g, '/');
}

function isPublishedSurface(relativePath) {
  return PUBLISHED_SURFACE.some((prefix) => relativePath.startsWith(prefix));
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walkDirectory(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDirectory(fullPath)));
      continue;
    }

    if (entry.isFile() && ALLOWED_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function lineAndColumn(text, index) {
  const upToMatch = text.slice(0, index);
  const line = upToMatch.split('\n').length;
  const column = upToMatch.length - upToMatch.lastIndexOf('\n');
  return { line, column };
}

/*
 * Blanks out code comments, leaving the text length and every newline intact so the
 * reported line and column still point at the right place.
 *
 * The gate governs what a reader sees, and a reader never sees a comment. Without
 * this it fails on `// Generate and save RSS feed` in `feeds.ts`, which is a note
 * about writing a file to disk, and the only way past it is `--no-verify` on an
 * unrelated commit. That is the same reason the scope above stops at the published
 * surface.
 *
 * Quote state is tracked rather than regexed, because `'https://...'` contains `//`
 * and a naive strip would blank the rest of that line along with anything real
 * sitting after it.
 */
function withoutComments(source) {
  let out = '';
  let quote = null;
  let comment = null;

  for (let i = 0; i < source.length; i += 1) {
    const c = source[i];
    const next = source[i + 1];

    if (comment === 'line') {
      if (c === '\n') {
        comment = null;
        out += c;
      } else {
        out += ' ';
      }
      continue;
    }

    if (comment === 'block') {
      if (c === '*' && next === '/') {
        comment = null;
        out += '  ';
        i += 1;
      } else {
        out += c === '\n' ? c : ' ';
      }
      continue;
    }

    if (quote) {
      out += c;
      if (c === '\\') {
        out += next ?? '';
        i += 1;
      } else if (c === quote) {
        quote = null;
      }
      continue;
    }

    if (c === "'" || c === '"' || c === '`') {
      quote = c;
      out += c;
      continue;
    }

    if (c === '/' && next === '/') {
      comment = 'line';
      out += '  ';
      i += 1;
      continue;
    }

    if (c === '/' && next === '*') {
      comment = 'block';
      out += '  ';
      i += 1;
      continue;
    }

    out += c;
  }

  return out;
}

function collectViolations(relativePath, content) {
  const violations = [];
  const source = /\.(ts|tsx)$/.test(relativePath) ? withoutComments(content) : content;

  for (const rule of BANNED_RULES) {
    for (const match of source.matchAll(rule.pattern)) {
      if (match.index === undefined) {
        continue;
      }

      const { line, column } = lineAndColumn(source, match.index);
      violations.push({
        file: relativePath,
        line,
        column,
        text: match[0],
        message: rule.message,
      });
    }
  }

  return violations;
}

async function run() {
  const targetFiles = new Set();
  const cliFileArgs = process.argv
    .slice(2)
    .map(toRepoRelative)
    .filter(isPublishedSurface)
    /*
     * Test files are on the surface but are not copy. `llms.test.ts` asserts that the
     * generated llms.txt does not match /save/i, which is this rule enforced one
     * layer down. A gate that fails on the test written to uphold it is a gate that
     * gets bypassed.
     */
    .filter((f) => !/\.test\.(ts|tsx)$/.test(f));

  for (const arg of cliFileArgs) {
    const absolutePath = path.resolve(ROOT, arg);
    const extension = path.extname(absolutePath);

    if (!ALLOWED_EXTENSIONS.has(extension)) {
      continue;
    }

    if (await exists(absolutePath)) {
      targetFiles.add(absolutePath);
    }
  }

  for (const relativePath of FILE_TARGETS) {
    const absolutePath = path.join(ROOT, relativePath);
    if (await exists(absolutePath)) {
      targetFiles.add(absolutePath);
    }
  }

  for (const relativeDir of DIRECTORY_TARGETS) {
    const absoluteDir = path.join(ROOT, relativeDir);
    if (!(await exists(absoluteDir))) {
      continue;
    }

    for (const file of await walkDirectory(absoluteDir)) {
      targetFiles.add(file);
    }
  }

  const violations = [];

  for (const absolutePath of targetFiles) {
    const content = await fs.readFile(absolutePath, 'utf8');
    const relativePath = path.relative(ROOT, absolutePath);
    violations.push(...collectViolations(relativePath, content));
  }

  if (violations.length === 0) {
    console.log('Growth language check passed.');
    return;
  }

  console.error('Growth language check failed. Found banned savings-style language:');
  for (const violation of violations) {
    console.error(
      `- ${violation.file}:${violation.line}:${violation.column} "${violation.text}" -> ${violation.message}`
    );
  }
  process.exit(1);
}

run().catch((error) => {
  console.error('Growth language check failed due to an unexpected error.');
  console.error(error);
  process.exit(1);
});
