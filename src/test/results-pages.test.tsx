import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import CaseStudyPage, { generateStaticParams } from '@/app/results/[slug]/page';
import ResultsPage from '@/app/results/page';
import { CASE_STUDIES, getCaseStudy, getFeaturedCaseStudy } from '@/app/results/case-studies';

const CLAIMS = readFileSync(join(process.cwd(), 'CLAIMS.md'), 'utf8');

describe('the case study data', () => {
  it('uses only approved claims, every one as a percentage', () => {
    for (const study of CASE_STUDIES) {
      for (const stat of study.stats) {
        expect(stat.value).toMatch(/%$/);
        // CLAIMS.md is the single source of truth. A figure that is not in it is
        // not a figure this site is allowed to publish.
        expect(CLAIMS).toContain(stat.value.replace('+', '').replace('%', ''));
      }
    }
  });

  it('gives every figure a basis', () => {
    // A percentage with no provenance is a marketing estimate. Every one names
    // where it came from and what it was measured against.
    for (const study of CASE_STUDIES) {
      for (const stat of study.stats) {
        expect(stat.context.length).toBeGreaterThan(20);
      }
    }
  });

  it('covers all five approved claims across the three studies', () => {
    const values = CASE_STUDIES.flatMap((study) => study.stats.map((stat) => stat.value));
    expect(new Set(values)).toEqual(new Set(['+828%', '+567%', '+403%', '89%', '+98%']));
  });

  it('tells each one through the four method steps', () => {
    for (const study of CASE_STUDIES) {
      for (const step of [study.hear, study.challenge, study.build, study.optimise]) {
        expect(step.length).toBeGreaterThan(80);
      }
    }
  });

  it('ends each one with the mechanism, not the industry', () => {
    // Without this the page is three pub stories. The transfer line is what makes
    // it evidence for a professional services firm reading it.
    for (const study of CASE_STUDIES) {
      expect(study.transfer.length).toBeGreaterThan(60);
    }
  });

  it('has exactly one featured study', () => {
    expect(CASE_STUDIES.filter((study) => study.featured)).toHaveLength(1);
    expect(getFeaturedCaseStudy().slug).toBe('nobody-could-find-us');
  });

  it('resolves every slug it advertises', () => {
    for (const { slug } of generateStaticParams()) {
      expect(getCaseStudy(slug)).toBeDefined();
    }
    expect(generateStaticParams()).toHaveLength(CASE_STUDIES.length);
  });
});

describe('/results', () => {
  function body(): string {
    render(<ResultsPage />);
    return document.body.textContent ?? '';
  }

  it('says whose numbers these are in the first sentence', () => {
    // The framing is the argument: one business we can answer any question about
    // beats a wall of logos from work that cannot be described.
    render(<ResultsPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'proven where the risk was ours.'
    );
    expect(document.body.textContent).toMatch(/The Anchor, our own venue/);
  });

  it('explains why every case study is the same business', () => {
    expect(body()).toMatch(
      /Client work joins this page as it becomes publishable, with permission/
    );
  });

  it('never claims a client it does not have', () => {
    const text = body();
    expect(text).not.toMatch(/our clients|clients across|trusted by/i);
  });

  it('links to every case study', () => {
    render(<ResultsPage />);
    for (const study of CASE_STUDIES) {
      const links = screen.getAllByRole('link', { name: new RegExp(study.title, 'i') });
      expect(links.length).toBeGreaterThan(0);
    }
  });

  it('quotes no price and names no retired claim', () => {
    const text = body();
    expect(text).not.toMatch(/£/);
    for (const retired of ['58%', '71%', '25 hours', '60-70K']) {
      expect(text).not.toContain(retired);
    }
  });

  it('speaks as the company, never as the founder', () => {
    const text = body();
    expect(text).not.toMatch(/\bPeter\b/);
  });
});

describe('/results/[slug]', () => {
  it('renders a case study through the four method stages, with plain headings', () => {
    render(<CaseStudyPage params={{ slug: 'nobody-could-find-us' }} />);
    // The stage label stays so the page visibly follows the method; the heading is
    // what a reader arriving cold from a search result can actually use.
    for (const word of ['HEAR', 'CHALLENGE', 'BUILD', 'OPTIMISE']) {
      expect(screen.getByText(word)).toBeInTheDocument();
    }
    for (const heading of [
      'what was happening.',
      'what we found.',
      'what we did.',
      'what changed.',
    ]) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    }
  });

  it('states the venue is ours on every case study', () => {
    for (const study of CASE_STUDIES) {
      const { unmount } = render(<CaseStudyPage params={{ slug: study.slug }} />);
      expect(document.body.textContent).toMatch(/At The Anchor, the business we run ourselves/);
      unmount();
    }
  });

  it('ends with what the mechanism was rather than the industry', () => {
    const study = getCaseStudy('interest-that-did-not-turn-up');
    render(<CaseStudyPage params={{ slug: study!.slug }} />);
    expect(screen.getByText(study!.transfer)).toBeInTheDocument();
    expect(screen.getByText('why this matters in other businesses.')).toBeInTheDocument();
  });

  it('says the same words as the approved copy', () => {
    // The copy document is hard-wrapped for review, so both sides are collapsed to
    // single spaces before comparing. The words have to match; the line breaks are
    // a property of the file, not of the copy.
    const flatten = (value: string) => value.replace(/\s+/g, ' ');
    const copy = flatten(
      readFileSync(join(process.cwd(), 'tasks/repositioning/copy/results.md'), 'utf8')
    );
    for (const study of CASE_STUDIES) {
      expect(copy).toContain(flatten(study.title));
      expect(copy).toContain(flatten(study.transfer));
      expect(copy).toContain(flatten(study.hear));
    }
  });
});
