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

  it('keeps every line of the designer copy that no decision forced us to change', () => {
    /*
     * The port is a transform of the supplied template, not a retype, and this is
     * what proves it stayed one. Retyping a supplied asset is how all seven
     * taxonomy tints drifted from the pack, silently, for a fortnight.
     *
     * Every deliberate divergence is listed with its reason. Anything not listed
     * has to match the source byte for byte, so a stray edit fails here rather
     * than quietly becoming the new original.
     */
    const CHANGED = new Set([
      // Unsupported numbers. Every one would have shipped as fact.
      'stalled.symptoms.0', // "flat for three quarters or more": arbitrary threshold
      'stalled.examine.1.why', // "Half of stall diagnoses collapse"
      'ai.examine.1.why', // "Half of AI ideas die on data quality"
      'conversion.examine.1.why', // "the strongest single conversion lever"
      'margin.examine.2.why', // "once the uplift is halved"
      'scale.examine.0.why', // "fail at 2x": CLAIMS.md bans multiples
      // Framing the repo's own gates reject.
      'scale.examine.2.what', // "gets cheaper": cost-reduction language
      'stalled.examine.2.what', // "The cheapest unlock": a price signal, with no prices on the site
      'experience.causes', // "costs more than keeping them ever would": unsupported, and cost framing
      // Unsupported absolutes, one of them used on two pages.
      'stalled.intro',
      'conversion.intro',
      'stalled.examine.0.why',
      // British register.
      'ai.symptoms.3', // "vendor"
    ]);

    const mismatches: string[] = [];
    for (const [key, source] of Object.entries(SOURCE)) {
      const ported =
        GROWTH_PROBLEMS.find((p) => p.intro === source.intro || p.causes === source.causes) ??
        GROWTH_PROBLEMS[Object.keys(SOURCE).indexOf(key)];
      if (!ported) continue;

      const compare = (field: string, from: string, to: string) => {
        if (CHANGED.has(`${key}.${field}`)) return;
        if (from !== to) mismatches.push(`${key}.${field}`);
      };

      compare('intro', source.intro, ported.intro);
      compare('causes', source.causes, ported.causes);
      source.symptoms.forEach((symptom, i) =>
        compare(`symptoms.${i}`, symptom, ported.symptoms[i])
      );
    }

    expect(mismatches).toEqual([]);
  });

  it('changed only what a decision or a gate forced', () => {
    // Guards the list above from growing quietly. Thirteen changes across eight
    // pages, and every one of them is named.
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
    for (const problem of GROWTH_PROBLEMS.filter((p) => p.proof.hasNumbers)) {
      expect(problem.proof.body, problem.slug).toMatch(/The Anchor, our own venue/);
    }
  });

  it('does not let the margin page imply a margin percentage it cannot evidence', () => {
    // The approved claim is +98% food REVENUE. The old food GP figure was retired.
    const margin = getGrowthProblem('margin-under-pressure');
    expect(margin?.proof.body).toMatch(/It measures revenue, not margin percentage/);
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
    expect(at('sound familiar?')).toBeLessThan(at('the connected causes.'));
    expect(at('the connected causes.')).toBeLessThan(at('what we would examine first.'));
    expect(at('what we would examine first.')).toBeLessThan(
      at('The gap between wanting to come and having a table.')
    );
  });

  it('names the method with the word the pack retired', () => {
    expect(textOf(<GrowthProblemPage params={{ slug: 'weak-demand' }} />)).toMatch(
      /the HEAR and CHALLENGE half of the method/
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
    const cta = screen.getAllByRole('link', { name: /Bring us the problem/ });
    expect(cta.length).toBeGreaterThanOrEqual(2);
    for (const link of cta) expect(link).toHaveAttribute('href', '/start-here');
    expect(document.body.textContent).not.toMatch(/A Growth Diagnostic/);
  });

  it('marks growth problems as the current section', () => {
    render(<GrowthProblemPage params={{ slug: 'weak-demand' }} />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Unlock growth' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });
});
