#!/usr/bin/env node

/**
 * Slugs claimed by both content collections.
 *
 * `content/blog` renders at `/licensees-guide/<slug>` and `content/insights` at
 * `/insights/<slug>`. A slug in both is not an error either collection can see:
 * each renders its own page perfectly well, and the only symptom is two pages
 * competing for the same subject with different canonical URLs, plus a search index
 * that has to guess which one the reader wanted.
 *
 * Cheap to check, invisible otherwise, so it runs in the build.
 *
 * @see tasks/repositioning/SUB-SPECS.md part 4.2
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

async function slugsIn(directory) {
  const full = path.join(ROOT, directory);
  try {
    const entries = await fs.readdir(full);
    return entries
      .filter((file) => file.endsWith('.md') && file.toLowerCase() !== 'readme.md')
      .map((file) => file.replace(/\.md$/, ''));
  } catch {
    return [];
  }
}

const guide = await slugsIn('content/blog');
const insights = await slugsIn('content/insights');
const guideSet = new Set(guide);
const collisions = insights.filter((slug) => guideSet.has(slug));

if (collisions.length > 0) {
  console.error(`\nSlug collision between the two content collections:\n`);
  for (const slug of collisions) {
    console.error(`  ${slug}`);
    console.error(`    content/blog/${slug}.md      -> /licensees-guide/${slug}`);
    console.error(`    content/insights/${slug}.md  -> /insights/${slug}\n`);
  }
  console.error(
    'Both pages will render. Neither collection can detect this on its own, and the\n' +
      'result is two canonicals competing for one subject. Rename one.\n'
  );
  process.exit(1);
}

console.log(
  `Slug check passed: ${guide.length} guide articles, ${insights.length} insights, no collisions.`
);
