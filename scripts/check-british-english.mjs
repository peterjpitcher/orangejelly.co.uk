#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

const FILE_TARGETS = new Set([
  'src/app/empty-pub-solutions/page.tsx',
  'src/app/pub-rescue/page.tsx',
  'src/app/pub-marketing-no-budget/page.tsx',
  'src/app/results/page.tsx',
  'src/app/licensees-guide/page.tsx',
  'src/app/test-shadcn/page.tsx',
]);

const DIRECTORY_TARGETS = ['content'];

const ALLOWED_EXTENSIONS = new Set(['.md', '.json', '.ts', '.tsx']);

const COMMON_RULES = [
  {
    pattern: /\boptimiz(e|ed|ing|ation)\b/gi,
    message: 'Use British spelling: optimise / optimised / optimising / optimisation.',
  },
  {
    pattern: /\banalyz(e|ed|ing)\b/gi,
    message: 'Use British spelling: analyse / analysed / analysing.',
  },
  {
    pattern: /\bbehavior(s)?\b/gi,
    message: 'Use British spelling: behaviour / behaviours.',
  },
  {
    pattern: /\bfavorit(e|es)\b/gi,
    message: 'Use British spelling: favourite / favourites.',
  },
  {
    pattern: /\bmaximiz(e|ed|ing|ation)\b/gi,
    message: 'Use British spelling: maximise / maximised / maximising / maximisation.',
  },
  {
    pattern: /\brecogniz(e|ed|ing|able)\b/gi,
    message: 'Use British spelling: recognise / recognised / recognising / recognisable.',
  },
];

const CONTENT_RULES = [
  {
    pattern: /\bcenter(s)?\b/gi,
    message: 'Use British spelling: centre / centres.',
  },
];

const MARKDOWN_ONLY_RULES = [
  {
    pattern: /\bcolor(s)?\b/gi,
    message: 'Use British spelling: colour / colours.',
  },
];

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
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

function getRulesForFile(relativePath) {
  const rules = [...COMMON_RULES];

  if (relativePath.startsWith('content/')) {
    rules.push(...CONTENT_RULES);
  }

  if (relativePath.endsWith('.md')) {
    rules.push(...MARKDOWN_ONLY_RULES);
  }

  return rules;
}

function collectViolations(relativePath, content) {
  const violations = [];
  const rules = getRulesForFile(relativePath);

  for (const rule of rules) {
    for (const match of content.matchAll(rule.pattern)) {
      if (match.index === undefined) {
        continue;
      }

      const { line, column } = lineAndColumn(content, match.index);
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

function shouldCheckCliPath(relativePath) {
  if (relativePath.startsWith('content/')) {
    return true;
  }

  return FILE_TARGETS.has(relativePath);
}

async function run() {
  const targetFiles = new Set();
  const cliFileArgs = process.argv.slice(2);

  for (const arg of cliFileArgs) {
    const absolutePath = path.resolve(ROOT, arg);
    const relativePath = path.relative(ROOT, absolutePath);
    const extension = path.extname(absolutePath);

    if (!ALLOWED_EXTENSIONS.has(extension)) {
      continue;
    }

    if (!shouldCheckCliPath(relativePath)) {
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
    console.log('British English check passed.');
    return;
  }

  console.error('British English check failed. Found non-UK spellings:');
  for (const violation of violations) {
    console.error(
      `- ${violation.file}:${violation.line}:${violation.column} "${violation.text}" -> ${violation.message}`
    );
  }
  process.exit(1);
}

run().catch((error) => {
  console.error('British English check failed due to an unexpected error.');
  console.error(error);
  process.exit(1);
});
