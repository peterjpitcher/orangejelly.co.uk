#!/usr/bin/env node

/**
 * Every number in new content, against CLAIMS.md.
 *
 * The five approved claims are the only quantified proof points this site is
 * allowed to publish. That rule is easy to hold in a page somebody wrote by hand
 * and very hard to hold in long-form articles, where a plausible-sounding
 * statistic is the single most natural thing in the world to reach for and the
 * single hardest thing to notice afterwards.
 *
 * "Around 60% of firms cannot say where their work comes from" reads like research.
 * It is not research. Nobody counted. A number with no source is worse than no
 * number, because a reader has no way to tell the difference and we have given them
 * a reason to trust the next one.
 *
 * SCOPE IS NEW CONTENT ONLY. content/blog is 105 legacy hospitality articles full
 * of legitimate illustrative arithmetic ("if twenty covers spend fifteen pounds"),
 * which is a licensee working something out rather than a claim about our work.
 * Sweeping those in would produce hundreds of false positives and the gate would be
 * switched off within a day.
 *
 * @see CLAIMS.md
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

const SURFACES = ['content/insights', 'src/app/growth-problems', 'src/app/tools', 'src/app/sectors'];

/** Numbers that are never a claim, whatever the context. */
const INNOCENT = new Set([
  '100', // "100 per cent" as an idiom, and percentages of a whole in prose
  '50', // "50% more work" appears in the scorecard statement, which is a question
]);

function approvedFigures(claims) {
  // The percentages in the approved table, with and without their sign.
  const found = new Set();
  for (const match of claims.matchAll(/\*\*([+-]?\d+)%\*\*/g)) found.add(match[1].replace(/[+-]/, ''));
  for (const match of claims.matchAll(/\b(\d{2,3})%/g)) found.add(match[1]);
  return found;
}

async function walk(directory) {
  const full = path.join(ROOT, directory);
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(full, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const next = path.join(full, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path.relative(ROOT, next))));
    else if (/\.(md|ts|tsx)$/.test(entry.name)) out.push(next);
  }
  return out;
}

function isComment(line) {
  return /^\s*(\*|\/\/|\/\*)/.test(line);
}

const claims = await fs.readFile(path.join(ROOT, 'CLAIMS.md'), 'utf8');
const approved = approvedFigures(claims);

const problems = [];
for (const surface of SURFACES) {
  for (const file of await walk(surface)) {
    const relative = path.relative(ROOT, file);
    const content = await fs.readFile(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (isComment(line)) return;
      for (const match of line.matchAll(/(\d[\d,.]*)\s?%/g)) {
        const figure = match[1].replace(/[,.]/g, '');
        if (approved.has(figure) || INNOCENT.has(figure)) continue;
        problems.push({ file: relative, line: index + 1, text: match[0], context: line.trim().slice(0, 100) });
      }
    });
  }
}

if (problems.length === 0) {
  console.log(`Claims check passed: every figure in new content is one of the ${approved.size} approved.`);
  process.exit(0);
}

console.error(`\nClaims check failed with ${problems.length} unapproved figure(s):\n`);
for (const problem of problems) {
  console.error(`  ${problem.file}:${problem.line}  "${problem.text}"`);
  console.error(`    ${problem.context}\n`);
}
console.error(
  'Only the five claims in CLAIMS.md may be quantified on this site, as percentages,\n' +
    'with The Anchor named as our own venue. A number with no source is worse than no\n' +
    'number: the reader cannot tell the difference, and it costs the ones that are real.\n'
);
process.exit(1);
