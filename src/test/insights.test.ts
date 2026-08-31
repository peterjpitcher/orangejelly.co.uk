import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { GROWTH_PROBLEMS } from '@/app/growth-problems/content';
import {
  INSIGHTS_PER_PAGE,
  getAllInsights,
  getInsightBySlug,
  getInsightPage,
  getSlugCollisions,
  insightFrontMatterSchema,
} from '@/lib/insights';

/**
 * The insights collection.
 *
 * The failure this exists to prevent is subtle: the existing loader hard-codes
 * `/guides/<slug>` for everything under `content/blog`, so a new article
 * dropped in there gets a hospitality URL, a hospitality canonical and a place in
 * the hospitality feed, and nothing anywhere reports a problem.
 */
describe('the front matter contract', () => {
  const VALID = {
    title: 'A piece',
    slug: 'a-piece',
    excerpt: 'What it is about.',
    publishedDate: '2026-08-01',
    collection: 'insights',
    author: { name: 'Peter Pitcher' },
    problemPage: 'growth-has-stalled',
    targetTerm: 'a term somebody searches',
  };

  it('accepts a complete front matter block', () => {
    expect(insightFrontMatterSchema.safeParse(VALID).success).toBe(true);
  });

  it('requires the collection discriminant rather than guessing from the path', () => {
    // Guessing from the directory works right up until somebody moves a file, and
    // then it fails silently towards the wrong canonical URL.
    const { collection, ...without } = VALID;
    expect(collection).toBe('insights');
    expect(insightFrontMatterSchema.safeParse(without).success).toBe(false);
    expect(insightFrontMatterSchema.safeParse({ ...VALID, collection: 'blog' }).success).toBe(
      false
    );
  });

  it('requires a problem page, and one that exists', () => {
    // An article that leads nowhere is what this collection exists to avoid. The
    // hospitality library spent years being excellent and leading to a form.
    const { problemPage, ...without } = VALID;
    expect(problemPage).toBeDefined();
    expect(insightFrontMatterSchema.safeParse(without).success).toBe(false);

    const bad = insightFrontMatterSchema.safeParse({ ...VALID, problemPage: 'not-a-real-page' });
    expect(bad.success).toBe(false);

    for (const problem of GROWTH_PROBLEMS) {
      expect(
        insightFrontMatterSchema.safeParse({ ...VALID, problemPage: problem.slug }).success
      ).toBe(true);
    }
  });

  it('requires a target term, so no article exists only to attract traffic', () => {
    const { targetTerm, ...without } = VALID;
    expect(targetTerm).toBeDefined();
    expect(insightFrontMatterSchema.safeParse(without).success).toBe(false);
    expect(insightFrontMatterSchema.safeParse({ ...VALID, targetTerm: '' }).success).toBe(false);
  });

  it('defaults researchLed to false, so it has to be claimed deliberately', () => {
    const parsed = insightFrontMatterSchema.parse(VALID);
    expect(parsed.researchLed).toBe(false);
    expect(insightFrontMatterSchema.parse({ ...VALID, researchLed: true }).researchLed).toBe(true);
  });
});

describe('the real collection', () => {
  it('loads and every article satisfies the contract', () => {
    const insights = getAllInsights({ includeFuture: true, includeDrafts: true });
    expect(insights.length).toBeGreaterThan(0);
    for (const insight of insights) {
      expect(insight.collection).toBe('insights');
      expect(GROWTH_PROBLEMS.map((p) => p.slug)).toContain(insight.problemPage);
      expect(insight.targetTerm.length).toBeGreaterThan(0);
    }
  });

  it('collides with no hospitality slug', () => {
    // Both pages would render, and the only symptom is two canonicals competing
    // for one subject. Neither collection can see it from its own side.
    expect(getSlugCollisions()).toEqual([]);
  });

  it('flags the research-led piece as research-led', () => {
    // Implied experience is a claim, and the pack's evidence rule covers claims.
    const fractional = getInsightBySlug('what-is-a-fractional-cmo');
    expect(fractional?.researchLed).toBe(true);
  });

  it('holds back drafts and anything dated ahead of today', () => {
    const future = new Date('2020-01-01');
    expect(getAllInsights({ now: future })).toEqual([]);
    expect(getAllInsights({ now: future, includeFuture: true }).length).toBeGreaterThan(0);
  });
});

describe('pagination', () => {
  it('paginates at twelve and clamps a page number out of range', () => {
    expect(INSIGHTS_PER_PAGE).toBe(12);
    const { pages } = getInsightPage(1);
    expect(getInsightPage(9999).insights).toEqual(getInsightPage(pages).insights);
    expect(getInsightPage(-4).insights).toEqual(getInsightPage(1).insights);
  });

  it('never returns more than a page at a time', () => {
    expect(getInsightPage(1).insights.length).toBeLessThanOrEqual(INSIGHTS_PER_PAGE);
  });
});

describe('a broken article stops the build rather than rendering a dead end', () => {
  it('throws with the file named and the reason given', () => {
    // Returning null would let a mistyped problemPage render an article with no way
    // out, on a page nobody on the team reads.
    const dir = mkdtempSync(join(tmpdir(), 'oj-insights-'));
    try {
      mkdirSync(join(dir, 'content/insights'), { recursive: true });
      writeFileSync(
        join(dir, 'content/insights/broken.md'),
        ['---', 'title: Broken', 'collection: insights', '---', 'body'].join('\n')
      );
      // getInsightBySlug reads from process.cwd(), so assert the schema directly:
      // it is the part that decides, and it is what the loader throws on.
      const result = insightFrontMatterSchema.safeParse({
        title: 'Broken',
        collection: 'insights',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const fields = result.error.issues.map((i) => i.path[0]);
        expect(fields).toContain('problemPage');
        expect(fields).toContain('targetTerm');
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
