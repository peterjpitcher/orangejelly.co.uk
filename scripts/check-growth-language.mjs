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
    message: 'Use outcome language like margin growth, margin gains, revenue growth, or growth capacity.',
  },
];

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
 * unrelated commit. That is the same reason `docs/brand/` is excluded above.
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
  // Vendored brand and design-system files are excluded. They are third-party and
  // must stay byte-identical to the delivery, so the pack's own prose ("Save
  // important decisions and artefacts") must not fail the gate and force
  // --no-verify on unrelated commits.
  const cliFileArgs = process.argv
    .slice(2)
    .map((f) => f.replace(/\\/g, '/'))
    .filter((f) => !f.includes('docs/brand/'))
    /*
     * And test files. `llms.test.ts` asserts that the generated llms.txt does not
     * match /save/i, which is this rule enforced one layer down. A gate that fails
     * on the test written to uphold it is a gate that gets bypassed.
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
