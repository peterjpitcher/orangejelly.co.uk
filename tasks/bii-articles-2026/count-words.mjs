#!/usr/bin/env node

/**
 * Word counts for the printed BII articles.
 *
 * The printer's limit is hard: copy that runs over gets cut by somebody else, and in a
 * 300 word compliance piece the sentence that goes is as likely to be the legal caveat
 * as the padding. So the limit is checked by a script rather than by eye.
 *
 * A print file holds one or more blocks, each wrapped like this:
 *
 *   <!-- PRINT-BLOCK id="a2-print" min="250" max="300" must="orangejelly.co.uk/x" -->
 *   ...copy...
 *   <!-- /PRINT-BLOCK -->
 *
 * WHAT COUNTS. Everything a reader would see in print: headline, standfirst, body,
 * box text, byline, sign-off and the printed web address. Counted the way a word
 * processor counts, as runs of characters separated by white space, so a lone "/" or
 * "@" is one word and a web address is one word. That is deliberately the strict
 * reading: whichever convention the magazine uses, a block that passes here fits.
 *
 * WHAT DOES NOT COUNT. Designer notes, which are written as a backticked label in
 * square brackets, for example `[HEADLINE]` or `[QR CODE, 25 mm]`. HTML comments.
 * Markdown symbols (#, >, *, _, |, list bullets), which are layout and never print.
 *
 * It also fails a block that contains an em dash, a word from the family the
 * growth-language gate bans, or that is missing a `must` string (use it for the short
 * link, which is the whole point of the printed piece). `must` takes several strings
 * separated by "||".
 *
 * Usage: node tasks/bii-articles-2026/count-words.mjs <file.md> [more files]
 */
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const BLOCK = /<!--\s*PRINT-BLOCK\s+([^>]*?)\s*-->([\s\S]*?)<!--\s*\/PRINT-BLOCK\s*-->/g;
const ATTRIBUTE = /(\w+)="([^"]*)"/g;
// Built from its code point so this file never contains the character it bans.
const EM_DASH = String.fromCharCode(0x2014);
// The same two patterns as scripts/check-growth-language.mjs, which never sees tasks/.
const BANNED = /\bsav(?:e|es|ed|ing|ings)\b/i;

export function printedText(markdown) {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .split('\n')
    .map(
      (line) =>
        line
          .replace(/`\[[^\]`]*\]`/g, ' ') // designer notes
          .replace(/^\s*\|?\s*:?-{3,}[\s|:-]*$/, ' ') // table rule rows and horizontal rules
          .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
          .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links keep their text
          .replace(/^\s{0,3}#{1,6}\s+/, '') // headings
          .replace(/^\s{0,3}>\s?/, '') // block quotes
          .replace(/^\s*[-*+]\s+/, '') // bullets
          .replace(/\|/g, ' ') // table cells
          .replace(/[*_`]/g, '') // emphasis and code marks
    )
    .join('\n');
}

export function countWords(markdown) {
  return printedText(markdown).split(/\s+/).filter(Boolean).length;
}

function attributesOf(raw) {
  const out = {};
  for (const [, key, value] of raw.matchAll(ATTRIBUTE)) out[key] = value;
  return out;
}

export function checkFile(content) {
  const results = [];
  for (const [, rawAttributes, body] of content.matchAll(BLOCK)) {
    const { id = '(no id)', min = '0', max, must = '' } = attributesOf(rawAttributes);
    const text = printedText(body);
    const words = text.split(/\s+/).filter(Boolean).length;
    const problems = [];

    if (!max) problems.push('no max attribute');
    if (words < Number(min)) problems.push(`${words} words is under the minimum of ${min}`);
    if (max && words > Number(max)) problems.push(`${words} words is over the maximum of ${max}`);
    if (body.includes(EM_DASH)) problems.push('contains an em dash');
    const banned = text.match(BANNED);
    if (banned) problems.push(`contains "${banned[0]}", which the growth-language rule bans`);
    for (const needle of must.split('||').filter(Boolean)) {
      if (!text.toLowerCase().includes(needle.toLowerCase())) problems.push(`missing "${needle}"`);
    }

    results.push({ id, words, min: Number(min), max: Number(max), problems });
  }
  return results;
}

// Run as a command, not when imported by a test.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error('Usage: node tasks/bii-articles-2026/count-words.mjs <file.md> [more files]');
    process.exit(1);
  }

  let failed = false;
  for (const file of files) {
    const results = checkFile(fs.readFileSync(file, 'utf8'));
    if (results.length === 0) {
      console.error(`FAIL  ${file}: no PRINT-BLOCK found`);
      failed = true;
      continue;
    }
    for (const result of results) {
      const ok = result.problems.length === 0;
      if (!ok) failed = true;
      console.log(
        `${ok ? 'PASS' : 'FAIL'}  ${file}  ${result.id}: ${result.words} words (limit ${result.min} to ${result.max})`
      );
      for (const problem of result.problems) console.log(`      ${problem}`);
    }
  }
  process.exit(failed ? 1 : 0);
}
