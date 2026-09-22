/**
 * The survey the whole site is promoting, in one place.
 *
 * Peter asked for the pub-apps survey to be championed everywhere (22 September
 * 2026): a primary nav item, a footer link, a band on the homepage, the Pubs page and
 * the guides library, and a prompt on every page. All of them read this constant, so
 * when the survey closes one line takes every promotion down at once: set it to
 * `null`. Leaving it pointing at a closed survey is not a dead end (the survey page
 * says it has closed), but the prompt checks the survey is still live before it opens
 * and stays quiet otherwise, so only the static links would linger.
 *
 * The words come from the survey's own copy in `content/surveys/pub-apps.json`,
 * shortened for a banner. They live here rather than being read from the JSON so the
 * nav and the prompt do not ship the whole survey definition to every page.
 */
export interface PromotedSurvey {
  /** The survey's slug in the database. The prompt asks the server whether it is live. */
  slug: string;
  href: string;
  /** The nav and footer label. Short: the bar is already seven items wide. */
  navLabel: string;
  eyebrow: string;
  title: string;
  /** The line under the title on a band and in the desktop prompt. */
  blurb: string;
  /** The one line the phone prompt has room for. */
  teaser: string;
  cta: string;
}

export const PROMOTED_SURVEY: PromotedSurvey | null = {
  slug: 'pub-apps',
  href: '/survey/pub-apps',
  navLabel: 'Pub survey',
  eyebrow: 'Pub survey',
  title: 'Which tools would make running your pub easier?',
  blurb:
    'We run our own pub and we build software. Tell us which tools to build first. About three minutes, mostly taps.',
  teaser: 'About three minutes, mostly taps.',
  cta: 'Take the survey',
};
