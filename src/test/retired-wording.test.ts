import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * Retired wording in published articles.
 *
 * The positioning gate cannot cover `content/`. Its strongest rule rejects "pub
 * marketing" as a company description, and these are hospitality articles where that
 * phrase is accurate and is the term the keyword research found. Pointing the gate at
 * them would fail the build on 105 articles doing their job.
 *
 * So the narrow thing gets its own check. On 6 September 2026 two published guides
 * were still selling packages retired by D3 in March, in body copy: "From a one-off
 * Growth Fix to ongoing Growth Partner support" and "a Momentum Month package from
 * us". Both rendered. A further 26 articles carried a package name in a
 * `ctaButtonText` frontmatter field that nothing has ever read, which is not a live
 * problem and is exactly how one starts.
 *
 * Only names, never sector vocabulary. A rule here that reached for "pub marketing"
 * would be switched off within a week.
 */
const RETIRED = [
  ['Growth Fix', 'a package retired by D3'],
  ['Momentum Month', 'a package retired by D3'],
  ['Turnaround Intensive', 'a package retired by D3'],
  ['growth partner', 'the self-description retired on 6 September 2026'],
] as const;

function markdownFiles(dir: string): string[] {
  const root = path.join(process.cwd(), dir);
  return readdirSync(root)
    .filter((name) => name.endsWith('.md'))
    .map((name) => path.join(dir, name));
}

describe('published articles', () => {
  const files = [...markdownFiles('content/blog'), ...markdownFiles('content/insights')];

  it('reads a meaningful number of articles, so a passing run means something', () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it.each(RETIRED)('never says "%s", %s', (phrase) => {
    const pattern = new RegExp(phrase.replace(/ /g, '\\s+'), 'i');
    const offenders = files
      .map((file) => {
        const line = readFileSync(path.join(process.cwd(), file), 'utf8')
          .split('\n')
          .findIndex((text) => pattern.test(text));
        return line === -1 ? null : `${file}:${line + 1}`;
      })
      .filter(Boolean);

    expect(offenders).toEqual([]);
  });
});
