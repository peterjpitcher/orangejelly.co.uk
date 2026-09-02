import { render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { PRESSURE_POINTS } from '@/app/home-content';
import GrowthProblemPage, { generateStaticParams } from '@/app/growth-problems/[slug]/page';
import GrowthProblemsHubPage from '@/app/growth-problems/page';
import { GROWTH_PROBLEMS, getGrowthProblem } from '@/app/growth-problems/content';

const CLAIMS = readFileSync(join(process.cwd(), 'CLAIMS.md'), 'utf8');
const SOURCE = JSON.parse(
  readFileSync(
    join(process.cwd(), 'tasks/repositioning/data/designer-growth-problem-variants.json'),
    'utf8'
  )
) as Record<string, { symptoms: string[]; causes: string; intro: string }>;

function textOf(page: React.ReactElement): string {
  render(page);
  return document.body.textContent ?? '';
}

describe('the eight problems', () => {
  it('are eight, in the order the hub template set', () => {
    expect(GROWTH_PROBLEMS).toHaveLength(8);
    expect(GROWTH_PROBLEMS.map((p) => p.number)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
    ]);
  });

  it('tag themselves only with the six real areas', () => {
    const areas = new Set(['demand', 'conversion', 'margin', 'operations', 'experience', 'scale']);
    for (const problem of GROWTH_PROBLEMS) {
      expect(problem.areas.length).toBeGreaterThan(0);
      for (const area of problem.areas) expect(areas.has(area)).toBe(true);
    }
  });

  it('cover all six areas between them, so no area is orphaned', () => {
    const covered = new Set(GROWTH_PROBLEMS.flatMap((p) => p.areas));
    expect(covered.size).toBe(6);
  });

  it('are the destination of every homepage card', () => {
    const slugs = new Set(GROWTH_PROBLEMS.map((p) => p.slug));
    for (const point of PRESSURE_POINTS) {
      expect(slugs.has(point.href.replace('/growth-problems/', ''))).toBe(true);
    }
  });

  it('keeps the shape of the designer copy: four symptoms, three checks, one proof each', () => {
    /*
     * Until 2 September 2026 this compared every intro, cause and symptom to the
     * designer's JSON byte for byte, with a named exception list. The plain-English
     * rewrite on that date replaced the wording on purpose: read as a pub owner,
     * "pipeline", "proposition", "cost-to-serve" and "operational drag" were the
     * problem, and Peter approved rewriting all eight pages in the reader's own
     * words. The structure the designer set is what survives, so that is what is
     * asserted now.
     */
    expect(Object.keys(SOURCE)).toHaveLength(8);
    for (const problem of GROWTH_PROBLEMS) {
      expect(problem.symptoms, problem.slug).toHaveLength(4);
      expect(problem.examine, problem.slug).toHaveLength(3);
      expect(problem.title.length, problem.slug).toBeLessThan(45);
      // Plus " | Orange Jelly" this has to survive a search result.
      expect(problem.metaTitle.length, problem.slug).toBeLessThanOrEqual(50);
    }
  });

  it('uses plain words in the titles, and keeps the search terms in the browser title', () => {
    const titles = GROWTH_PROBLEMS.map((p) => p.title).join(' ');
    for (const jargon of [
      'pipeline',
      'converting',
      'Margin',
      'Operations',
      'Systems can',
      'value',
    ]) {
      expect(titles).not.toContain(jargon);
    }
    const metas = GROWTH_PROBLEMS.map((p) => p.metaTitle).join(' ');
    for (const term of [
      'Leads not converting',
      'Margin under pressure',
      'Using AI intelligently',
    ]) {
      expect(metas).toContain(term);
    }
  });

  it('changed the designer lines a decision or a gate forced', () => {
    // The supplied copy carried phrases the repo's own rules reject. They must
    // stay in the source record and stay out of the site.
    const source = JSON.stringify(SOURCE);
    for (const gone of ['three quarters', 'Half of', '2x', 'cheapest unlock', 'vendor pitch']) {
      expect(source, `${gone} should be in the source`).toContain(gone);
      expect(JSON.stringify(GROWTH_PROBLEMS), `${gone} should be gone`).not.toContain(gone);
    }
  });

  it('quantify nothing that CLAIMS.md has not approved', () => {
    // The supplied copy carried six invented statistics: "half of stall diagnoses",
    // "half of AI ideas", "flat for three quarters", "fail at 2x", "once the uplift
    // is halved", and a superlative about response time. Every one would have
    // shipped as fact.
    const everything = JSON.stringify(GROWTH_PROBLEMS);
    expect(everything).not.toMatch(/\bHalf of\b/i);
    expect(everything).not.toMatch(/2x/);
    expect(everything).not.toMatch(/three quarters/i);
    expect(everything).not.toMatch(/strongest single/i);
    expect(everything).not.toMatch(/£/);

    // Any percentage that survives must be one of the five approved claims.
    for (const match of everything.matchAll(/(\d+)%/g)) {
      expect(CLAIMS, `${match[1]}% is not an approved claim`).toContain(match[1]);
    }
  });

  it('uses no retired method word and no cost-reduction framing', () => {
    const everything = JSON.stringify(GROWTH_PROBLEMS);
    expect(everything).not.toMatch(/EXPOSE/);
    expect(everything).not.toMatch(/\bcheaper\b/i);
    expect(everything).not.toMatch(/\bsav(e|es|ed|ing|ings)\b/i);
  });
});

describe('proof, including where there is none', () => {
  it('admits plainly that three of the eight have no number', () => {
    // None of the five approved claims measures hours, capacity, or anything
    // attributable to AI, and the metrics that would have were retired for being
    // unverifiable. Saying so is the argument of the whole site applied to itself.
    const without = GROWTH_PROBLEMS.filter((p) => !p.proof.hasNumbers).map((p) => p.slug);
    expect(without.sort()).toEqual([
      'operations-slowing-us-down',
      'systems-cannot-keep-up',
      'using-ai-intelligently',
    ]);
  });

  it('says so in the first sentence on every page that has no number', () => {
    for (const problem of GROWTH_PROBLEMS.filter((p) => !p.proof.hasNumbers)) {
      const opening = problem.proof.body.split('.')[0];
      expect(opening, problem.slug).toMatch(/no (AI )?number|No number/i);
    }
  });

  it('never lets a no-proof page borrow a percentage as its own evidence', () => {
    // The AI page does cite two approved figures, and that is the point of it: it
    // names them in order to say they are not attributable to AI. So the rule
    // cannot be "no percentages", it has to be "no percentage presented as proof of
    // this page". Anywhere a figure appears on a no-proof page, the disclaimer has
    // to appear with it.
    for (const problem of GROWTH_PROBLEMS.filter((p) => !p.proof.hasNumbers)) {
      if (!/\d+%/.test(problem.proof.body)) continue;
      expect(problem.proof.body, problem.slug).toMatch(
        /is not the reason|not attributable|does not prove/i
      );
    }
  });

  it('keeps the AI page honest about what AI did and did not do', () => {
    const ai = getGrowthProblem('using-ai-intelligently');
    expect(ai?.proof.body).toMatch(/It is not the reason those figures moved/);
    expect(ai?.proof.body).toMatch(/would be theatre/);
  });

  it('states the provenance wherever it does show a number', () => {
    // The page header already says whose venue it is; the proof paragraph names
    // it again rather than leaving a percentage floating.
    for (const problem of GROWTH_PROBLEMS.filter((p) => p.proof.hasNumbers)) {
      expect(problem.proof.body, problem.slug).toMatch(/The Anchor/);
    }
  });

  it('does not let the margin page imply a margin percentage it cannot evidence', () => {
    // The approved claim is +98% food REVENUE. The old food GP figure was retired.
    const margin = getGrowthProblem('margin-under-pressure');
    expect(margin?.proof.body).toMatch(/measures revenue, not margin percentage/);
  });

  it('does not let the experience page imply a retention result', () => {
    // There is no retention, repeat-rate or lifetime-value claim anywhere, and the
    // old tasting-retention figure was retired.
    const experience = getGrowthProblem('experience-leaking-value');
    expect(experience?.proof.body).toMatch(/we have no retention number/i);
    expect(experience?.proof.body).toMatch(/does not prove anyone came back a second time/);
  });
});

describe('/growth-problems hub', () => {
  it('asks the recognition question rather than listing services', () => {
    render(<GrowthProblemsHubPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'which of these sounds like your business?'
    );
  });

  it('links to all eight', () => {
    render(<GrowthProblemsHubPage />);
    for (const problem of GROWTH_PROBLEMS) {
      expect(screen.getByRole('link', { name: new RegExp(problem.title) })).toHaveAttribute(
        'href',
        `/growth-problems/${problem.slug}`
      );
    }
  });

  it('says the first conversation is free and asks for the problem', () => {
    const text = textOf(<GrowthProblemsHubPage />);
    expect(text).toMatch(/an hour and it is free/);
    // The template said "Book a growth diagnostic", which D11 replaced.
    expect(text).not.toMatch(/Book a growth diagnostic/);
  });
});

describe('a growth problem page', () => {
  it('generates one page per problem, all resolvable', () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(8);
    for (const { slug } of params) expect(getGrowthProblem(slug)).toBeDefined();
  });

  it('runs symptom, then cause, then examination, then proof', () => {
    // The order is the method. Proof first would make it a case study; what we
    // would do first would make it a service page.
    const text = textOf(<GrowthProblemPage params={{ slug: 'leads-not-converting' }} />);
    const at = (needle: string) => text.indexOf(needle);
    expect(at('does this sound familiar?')).toBeLessThan(at('what is usually causing it.'));
    expect(at('what is usually causing it.')).toBeLessThan(at('what we would check first.'));
    expect(at('what we would check first.')).toBeLessThan(
      at('The gap between wanting to come and having a table.')
    );
  });

  it('says the cause comes before the fix, in plain words', () => {
    // This used to name the HEAR and CHALLENGE half of the method. The method
    // words mean nothing to a reader who has not been to How we work first.
    expect(textOf(<GrowthProblemPage params={{ slug: 'weak-demand' }} />)).toMatch(
      /We find the cause first\. The fix comes after the evidence/
    );
  });

  it('tags the areas it touches', () => {
    render(<GrowthProblemPage params={{ slug: 'growth-has-stalled' }} />);
    for (const label of ['Create demand', 'Convert more', 'Build for scale']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('offers the measurement link only where there is something measured', () => {
    const { unmount } = render(<GrowthProblemPage params={{ slug: 'weak-demand' }} />);
    expect(screen.getByRole('link', { name: /How each number was measured/ })).toBeInTheDocument();
    unmount();

    render(<GrowthProblemPage params={{ slug: 'using-ai-intelligently' }} />);
    expect(
      screen.queryByRole('link', { name: /How each number was measured/ })
    ).not.toBeInTheDocument();
  });

  it('sends its action to the conversation, not to a product', () => {
    render(<GrowthProblemPage params={{ slug: 'margin-under-pressure' }} />);
    const cta = screen.getAllByRole('link', { name: /Let's talk/ });
    expect(cta.length).toBeGreaterThanOrEqual(2);
    for (const link of cta) expect(link).toHaveAttribute('href', '/start-here');
    expect(document.body.textContent).not.toMatch(/A Growth Diagnostic/);
  });

  it('marks growth problems as the current section', () => {
    render(<GrowthProblemPage params={{ slug: 'weak-demand' }} />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Growth problems' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });
});
