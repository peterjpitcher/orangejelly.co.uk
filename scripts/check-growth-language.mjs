#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

const FILE_TARGETS = [
  'src/app/page.tsx',
  'src/app/results/layout.tsx',
  'src/app/results/page.tsx',
  'src/app/pub-rescue/page.tsx',
  'src/app/opengraph-image.tsx',
  'src/app/pub-marketing-no-budget/page.tsx',
  'src/components/Meta.tsx',
  'src/components/SocialProof.tsx',
  'src/components/ServiceComparison.tsx',
  'src/components/VideoTestimonial.tsx',
  'src/components/ROICalculator.tsx',
  'src/lib/constants.ts',
];

const DIRECTORY_TARGETS = ['content/data', 'content/faqs', 'content/case-studies'];

const ALLOWED_EXTENSIONS = new Set(['.json', '.md', '.ts', '.tsx']);

const BANNED_RULES = [
  {
    pattern: /\bsave(?:d|s|ing)?\b/gi,
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

function collectViolations(relativePath, content) {
  const violations = [];

  for (const rule of BANNED_RULES) {
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

async function run() {
  const targetFiles = new Set();
  const cliFileArgs = process.argv.slice(2);

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
