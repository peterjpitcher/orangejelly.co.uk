import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { GROWTH_PROBLEMS } from '@/app/growth-problems/content';
import { CASE_STUDIES } from '@/app/results/case-studies';
import { ARTICLE_NEXT_STEPS, getNextStepFor, validateNextSteps } from '@/lib/article-next-step';

/**
 * The article next-step mapping.
 *
 * 105 hospitality articles carry 92.9% of this site's search clicks, and thirty of
 * them carry 95% of that. The next step is what turns a reader who arrived asking a
 * pub question into somebody looking at the business problem underneath, so an
 * article without one is an article that leads nowhere.
 *
 * The failure mode is silent: a mistyped problem slug renders no link at all, on a
 * page nobody on the team reads. These make it loud.
 */
const ARTICLE_SLUGS = readdirSync(join(process.cwd(), 'content/blog'))
  .filter((file) => file.endsWith('.md') && file.toLowerCase() !== 'readme.md')
  .map((file) => file.replace(/\.md$/, ''));

const TIERS = new Map<string, string>(
  readFileSync(join(process.cwd(), 'tasks/repositioning/data/protected-posts-register.csv'), 'utf8')
    .split('\n')
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const cells = line.split(',');
      return [cells[0].replace('/licensees-guide/', ''), cells[2]] as [string, string];
    })
);

const PROTECTED = ARTICLE_SLUGS.filter((slug) =>
  ['1-critical', '2-protected'].includes(TIERS.get(slug) ?? '')
);

describe('the mapping', () => {
  it('covers every article, with no destination that does not exist', () => {
    // One assertion, because every one of these is the same defect wearing a
    // different hat: an article that leads nowhere.
    expect(validateNextSteps(ARTICLE_SLUGS)).toEqual([]);
  });

  it('covers all 105 articles', () => {
    expect(ARTICLE_SLUGS).toHaveLength(105);
    expect(Object.keys(ARTICLE_NEXT_STEPS)).toHaveLength(105);
  });

  it('covers all thirty protected posts, which are the ones that matter most', () => {
    expect(PROTECTED).toHaveLength(30);
    for (const slug of PROTECTED) {
      expect(ARTICLE_NEXT_STEPS[slug], slug).toBeDefined();
    }
  });

  it('records exactly which problems have no way in from search', () => {
    /*
     * A problem page with no article pointing at it can only be reached by somebody
     * already on the site, which wastes the one asset that brings strangers to it.
     *
     * One is orphaned and it is the right answer rather than a mapping error.
     * Nothing in 105 hospitality articles is about AI, tooling payoff or
     * automation. The nearest candidates were the EPOS guides, which are about
     * tills and till data, and pointing those at the AI page would be a dishonest
     * handoff for a reader who came to find out about a till.
     *
     * It is a CONTENT gap, not a mapping gap, and the fix is the AI-for-profession
     * articles rather than borrowed hospitality traffic. That is T084 to T087, and
     * this assertion is what stops the omission being forgotten: it fails the day
     * an article finally points there, forcing the note to be removed.
     */
    const KNOWN_ORPHANS = ['using-ai-intelligently'];

    const pointedAt = new Set(Object.values(ARTICLE_NEXT_STEPS).map((entry) => entry.problem));
    const orphaned = GROWTH_PROBLEMS.filter((p) => !pointedAt.has(p.slug)).map((p) => p.slug);
    expect(orphaned).toEqual(KNOWN_ORPHANS);
  });

  it('keeps the thinly-served problems visible', () => {
    // systems-cannot-keep-up has one inbound article and it is unranked, so
    // effectively no click volume reaches it. Honest: nothing in a pub blog is
    // about a business creaking at higher volume. Recorded so that it is a known
    // number rather than a surprise.
    const counts = new Map<string, number>();
    for (const entry of Object.values(ARTICLE_NEXT_STEPS)) {
      counts.set(entry.problem, (counts.get(entry.problem) ?? 0) + 1);
    }
    expect(counts.get('systems-cannot-keep-up')).toBe(1);
    expect(counts.get('leads-not-converting')).toBeGreaterThanOrEqual(5);
  });

  it('does not dump everything into the umbrella problem', () => {
    // "Growth has stalled" is the umbrella and it is the easy answer for anything
    // ambiguous. If it takes more than a quarter of the library, the mapping has
    // stopped being a classification.
    const counts = new Map<string, number>();
    for (const entry of Object.values(ARTICLE_NEXT_STEPS)) {
      counts.set(entry.problem, (counts.get(entry.problem) ?? 0) + 1);
    }
    const stalled = counts.get('growth-has-stalled') ?? 0;
    expect(stalled).toBeLessThan(ARTICLE_SLUGS.length / 4);
  });

  it('only attaches a case study where one genuinely exists', () => {
    const studies = new Set(CASE_STUDIES.map((c) => c.slug));
    for (const [slug, entry] of Object.entries(ARTICLE_NEXT_STEPS)) {
      if (entry.caseStudy === null) continue;
      expect(studies.has(entry.caseStudy), `${slug} -> ${entry.caseStudy}`).toBe(true);
    }
  });

  it('leaves the case study off more often than not', () => {
    // Attaching a bookings case study to an article about cellar management is
    // worse than attaching nothing. The mapping should be comfortable saying no.
    const withStudy = Object.values(ARTICLE_NEXT_STEPS).filter((e) => e.caseStudy !== null).length;
    expect(withStudy).toBeLessThan(ARTICLE_SLUGS.length);
    expect(withStudy).toBeGreaterThan(0);
  });
});

describe('resolving one article', () => {
  it('returns the problem, and the case study when there is one', () => {
    const slug = Object.keys(ARTICLE_NEXT_STEPS).find(
      (s) => ARTICLE_NEXT_STEPS[s].caseStudy !== null
    );
    expect(slug).toBeDefined();

    const links = getNextStepFor(slug as string);
    expect(links).toHaveLength(2);
    expect(links[0].href.startsWith('/growth-problems/')).toBe(true);
    expect(links[1].href.startsWith('/results/')).toBe(true);
  });

  it('caps at two, because NextStep drops the third anyway', () => {
    for (const slug of ARTICLE_SLUGS) {
      expect(getNextStepFor(slug).length).toBeLessThanOrEqual(2);
    }
  });

  it('returns nothing rather than throwing for an unknown article', () => {
    // A missing next step must never take an article down. The validator is what
    // makes the omission loud, not a runtime error in front of a reader.
    expect(getNextStepFor('an-article-that-does-not-exist')).toEqual([]);
  });
});
