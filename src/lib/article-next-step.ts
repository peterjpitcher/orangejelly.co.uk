import { GROWTH_PROBLEMS } from '@/app/growth-problems/content';
import { CASE_STUDIES } from '@/app/results/case-studies';

import mapping from '../../tasks/repositioning/data/article-next-steps.json';

/**
 * Where each hospitality article leads.
 *
 * Every article on `/licensees-guide/*` ends with one or two curated links: the
 * growth problem underneath its hospitality surface, and where one genuinely
 * applies, a case study showing it move. The job is to take somebody who arrived
 * from Google asking a pub question and offer them the business problem beneath it.
 *
 * WHY NOT THE EXISTING RELATED LINKS. `content/data/related-links.json` points at
 * routes that phase 4 retires and at packages that no longer exist. It could not be
 * reused, which is what made this a gap rather than a rename.
 *
 * The mapping lives in JSON rather than here so it can be reviewed as data. The
 * thirty protected posts carry 95% of the blog's clicks and their mappings are
 * Peter's to approve, which is easier against a table than against TypeScript.
 *
 * @see tasks/repositioning/data/article-next-steps.json
 */
export interface ArticleNextStep {
  problem: string;
  caseStudy: string | null;
}

const MAPPING = mapping as Record<string, ArticleNextStep>;

export interface NextStepLink {
  stage: string;
  title: string;
  href: string;
}

/**
 * The links for one article, resolved against the real content.
 *
 * Returns an empty array rather than throwing when a slug is unmapped or a
 * destination has gone: a missing next step should never take an article down.
 * `validateNextSteps` is what makes the omission loud, at build rather than at
 * request time.
 */
export function getNextStepFor(slug: string): NextStepLink[] {
  const entry = MAPPING[slug];
  if (!entry) return [];

  const links: NextStepLink[] = [];

  const problem = GROWTH_PROBLEMS.find((p) => p.slug === entry.problem);
  if (problem) {
    links.push({
      stage: 'The problem underneath',
      title: problem.title,
      href: `/growth-problems/${problem.slug}`,
    });
  }

  if (entry.caseStudy) {
    const study = CASE_STUDIES.find((c) => c.slug === entry.caseStudy);
    if (study) {
      links.push({
        stage: 'What happened when we fixed it',
        title: study.title,
        href: `/results/${study.slug}`,
      });
    }
  }

  return links;
}

export interface NextStepProblem {
  slug: string;
  problem: string;
  issue: string;
}

/**
 * Every broken or missing mapping, for the build to fail on.
 *
 * Checked rather than assumed because the failure mode is silent: a mistyped
 * problem slug renders no link at all, on an article nobody on the team reads,
 * and the only symptom is a page that quietly stops leading anywhere.
 */
export function validateNextSteps(slugs: string[]): NextStepProblem[] {
  const problems = new Set(GROWTH_PROBLEMS.map((p) => p.slug));
  const studies = new Set(CASE_STUDIES.map((c) => c.slug));
  const found: NextStepProblem[] = [];

  for (const slug of slugs) {
    const entry = MAPPING[slug];
    if (!entry) {
      found.push({ slug, problem: '', issue: 'no mapping' });
      continue;
    }
    if (!problems.has(entry.problem)) {
      found.push({ slug, problem: entry.problem, issue: 'growth problem does not exist' });
    }
    if (entry.caseStudy && !studies.has(entry.caseStudy)) {
      found.push({ slug, problem: entry.caseStudy, issue: 'case study does not exist' });
    }
  }

  // A mapping for an article that no longer exists is dead weight and usually the
  // sign of a rename that only got done on one side.
  const known = new Set(slugs);
  for (const slug of Object.keys(MAPPING)) {
    if (!known.has(slug)) {
      found.push({ slug, problem: '', issue: 'mapped article does not exist' });
    }
  }

  return found;
}

export { MAPPING as ARTICLE_NEXT_STEPS };
