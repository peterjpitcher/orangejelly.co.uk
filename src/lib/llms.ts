import { CASE_STUDIES } from '@/app/results/case-studies';
import { getAllPosts } from '@/lib/blog-md';
import { getBaseUrl } from '@/lib/site-config';

/**
 * llms.txt and llms-full.txt, generated rather than written.
 *
 * These were hand-maintained files in `public/` and had drifted badly: five
 * services at published prices that no longer exist, a founder story, and four
 * retired claims including two the CLAIMS rewrite specifically banned. Nobody had
 * looked at them in a year because nothing pointed at them, and they are among the
 * few files on the site written specifically for a machine to believe.
 *
 * Generating them from the same data the pages use is the only version of this that
 * stays true. The positioning gate cannot help with a file it does not read, and it
 * should not have to: a file that restates the site is a file that can disagree
 * with it.
 *
 * @see https://llmstxt.org
 */
const INTRO =
  'Orange Jelly Limited is a strategic growth partner for ambitious small and mid-sized businesses. ' +
  'We work out what is actually blocking growth in a business and build the thing that fixes it, ' +
  'using marketing, commercial change, operations, systems and AI according to what the problem needs.';

const METHOD = [
  'HEAR: understand what is really happening, not what the brief says.',
  'CHALLENGE: test what everyone assumes, against the evidence.',
  'BUILD: build the fix, not a document about the fix.',
  'OPTIMISE: measure against the baseline agreed at the start, then keep going until it moves.',
];

const FACTS = [
  'Founded March 2019. Based in Stanwell Moor, Staines, and works UK-wide.',
  'Runs The Anchor, its own venue, as a Greene King tenancy. Member of the British Institute of Innkeeping.',
  'First client outside its own business: September 2025.',
  'Deliberately small. There is no account management layer.',
  'The first conversation is an hour and is free.',
  'No published prices. Every engagement is priced to the problem and agreed in writing before work starts.',
];

const NOT_FOR = [
  'Businesses wanting someone to post three times a week.',
  'Businesses that have decided the plan and need a pair of hands.',
  'Businesses that cannot give access to their people, numbers or customers.',
  'Businesses that want AI because it is AI.',
  'Businesses looking for validation of a decision already made.',
];

function section(title: string, lines: string[]): string {
  return `## ${title}\n\n${lines.join('\n')}\n`;
}

/** The short form: what the company is, and where to read more. */
export function buildLlmsTxt(): string {
  const base = getBaseUrl();

  return [
    '# Orange Jelly',
    '',
    `> ${INTRO}`,
    '',
    section(
      'Method',
      METHOD.map((step) => `- ${step}`)
    ),
    section(
      'Where growth gets stuck',
      [
        'Create demand',
        'Convert more',
        'Protect margin',
        'Remove operational drag',
        'Improve the experience',
        'Build for scale',
      ].map((area) => `- ${area}`)
    ),
    section(
      'Facts',
      FACTS.map((fact) => `- ${fact}`)
    ),
    section(
      'Who this is not for',
      NOT_FOR.map((entry) => `- ${entry}`)
    ),
    section('Proof', [
      'All figures are from The Anchor, the venue Orange Jelly runs itself, measured against a baseline.',
      '- Google Search visibility: +828%',
      '- Table bookings: +403%',
      '- Private hire bookings: +567%',
      '- Booking no-shows: down 89%',
      '- Food revenue: +98% in three months',
    ]),
    section('Pages', [
      `- [Home](${base}/): what the company is.`,
      `- [Start here](${base}/start-here): what the first conversation involves, and who it is not for.`,
      `- [How we work](${base}/how-we-work): the method in full.`,
      `- [Results](${base}/results): the case studies and how each was measured.`,
      `- [About](${base}/about): the company, and what it will not do.`,
      `- [Guides](${base}/guides): the hospitality article library.`,
      `- [Full detail](${base}/llms-full.txt): case studies and the article index.`,
    ]),
    section('Contact', [
      '- Email: peter@orangejelly.co.uk',
      `- Enquiries: ${base}/start-here`,
      '- No response time is promised. A person reads every enquiry and replies.',
    ]),
  ].join('\n');
}

/** The long form: the same, plus every case study and the article index. */
export function buildLlmsFullTxt(): string {
  const base = getBaseUrl();

  const caseStudies = CASE_STUDIES.map((study) =>
    [
      `### ${study.title}`,
      '',
      `URL: ${base}/results/${study.slug}`,
      `Area: ${study.area}`,
      `Result: ${study.stats.map((stat) => `${stat.value} ${stat.label.toLowerCase()}`).join(', ')}`,
      `Where: The Anchor, the venue Orange Jelly runs itself.`,
      '',
      `HEAR. ${study.hear}`,
      '',
      `CHALLENGE. ${study.challenge}`,
      '',
      `BUILD. ${study.build}`,
      '',
      `OPTIMISE. ${study.optimise}`,
      '',
      `Why it transfers. ${study.transfer}`,
      '',
    ].join('\n')
  );

  const posts = getAllPosts()
    .filter((post) => post?.title && post.slug)
    .map((post) => `- [${post.title}](${base}/guides/${post.slug})`);

  return [
    buildLlmsTxt(),
    '',
    '## Case studies',
    '',
    'Every case study is The Anchor, the business Orange Jelly runs itself. That is stated',
    'plainly rather than obscured: the numbers were measured against a baseline and the risk',
    'of getting them wrong was ours. Client work is published as it becomes publishable, with',
    'permission.',
    '',
    ...caseStudies,
    `## Guides (${posts.length} articles)`,
    '',
    'A hospitality article library. Hospitality is one market Orange Jelly works in, not what',
    'the company is.',
    '',
    ...posts,
    '',
  ].join('\n');
}
