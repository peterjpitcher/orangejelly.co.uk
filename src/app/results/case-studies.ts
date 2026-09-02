/**
 * The case studies.
 *
 * All three are The Anchor, our own venue. That is a deliberate framing rather than
 * an apology for having one client: the numbers are real, they were measured, and
 * the risk of getting them wrong was ours. A page of anonymous logos would say less.
 *
 * Every figure is an approved claim from `CLAIMS.md` and appears as a percentage.
 * The actions described are the ones already recorded in
 * `content/data/case-studies.json`, restructured around the method so the page
 * demonstrates HEAR CHALLENGE BUILD OPTIMISE rather than asserting it.
 *
 * Client work goes here as it becomes publishable, with permission. Until then this
 * page does not pretend otherwise.
 *
 * @see tasks/repositioning/copy/results.md
 */
export interface CaseStudyStat {
  value: string;
  label: string;
  context: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  /** The growth area it belongs to, matching the six on the homepage. */
  area: string;
  /** One line for the card. */
  summary: string;
  /** Shown on the card and at the top of the page. */
  headline: CaseStudyStat;
  stats: CaseStudyStat[];
  hear: string;
  challenge: string;
  build: string;
  optimise: string;
  /** What this case study is evidence of, beyond the numbers. */
  transfer: string;
  featured?: boolean;
}

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: 'nobody-could-find-us',
    title: 'Nobody could find us',
    area: 'Create demand',
    summary:
      'A business with no demand problem it could see, because the demand was going somewhere else entirely.',
    headline: {
      value: '+828%',
      label: 'Google Search visibility',
      context:
        'How often people found The Anchor on Google: clicks and impressions, against before.',
    },
    stats: [
      {
        value: '+828%',
        label: 'Google Search visibility',
        context:
          'How often people found The Anchor on Google: clicks and impressions, against before.',
      },
      {
        value: '+567%',
        label: 'Private hire bookings',
        context: 'Twenty confirmed in six months, against about six a year before.',
      },
    ],
    hear: 'Trade was flat and the explanation everybody offered was the economy. The website existed, it looked fine, and nobody could say what it was for. The one thing nobody had looked at was what people in the area were actually typing into Google, and whether any of it led here.',
    challenge:
      'It did not. The site described the venue in the language the venue used about itself, and people were searching in completely different words for completely different things: a room for forty, somewhere that would do a wake, a Sunday roast that was still on at three. The demand was there and it was going to whoever had written those words down.',
    build:
      'The site was rebuilt around what people actually search for, page by page, with the answer on the page rather than a phone number and a hope. The enquiry route for private hire was made obvious instead of buried, because that was the search with the highest intent and the least competition.',
    optimise:
      'Measured against the Google Search Console numbers taken before any of it started. Visibility grew 828%, and private hire went from about six bookings a year to twenty confirmed in six months, which is what the visibility was worth in money.',
    transfer:
      'The mechanism has nothing to do with pubs. A business describes itself in its own words, its customers search in theirs, and the gap between the two is demand somebody else is collecting.',
    featured: true,
  },
  {
    slug: 'interest-that-did-not-turn-up',
    title: 'Interest that did not turn up',
    area: 'Convert more',
    summary:
      'Plenty of people wanted to come. The gap was between wanting to and actually having a table.',
    headline: {
      value: '+403%',
      label: 'Table bookings',
      context: 'Bookings taken at The Anchor, compared with before the work started.',
    },
    stats: [
      {
        value: '+403%',
        label: 'Table bookings',
        context: 'Bookings taken at The Anchor, compared with before the work started.',
      },
      {
        value: '89%',
        label: 'Fewer booking no-shows',
        context: 'No-show rate fell from around 20% to around 2%.',
      },
    ],
    hear: 'Quiet sessions that barely covered the staff on them, and a booking process that was a phone number during service. Nobody was counting how many people tried to book and gave up, which is the number that mattered.',
    challenge:
      'Two separate problems were being treated as one. There was not enough reason to come on a Tuesday, and there was too much friction for the people who already wanted to. Fixing the second without the first would have moved nothing, and the room was mostly arguing about the first.',
    build:
      'A reason to book on the quiet sessions, and a booking journey that took the interest and turned it into a confirmed table rather than an intention. Then confirmations and reminders, because a booking that does not turn up costs more than one that never existed: the table was held and the food was prepped.',
    optimise:
      'Table bookings grew 403% compared with before, and no-shows fell from around one in five to around one in fifty, an 89% reduction. The second number is the one that changed the economics.',
    transfer:
      'Every business has a version of the held table: the slot, the quote, the appointment, the sample. It costs whether or not anyone turns up, and almost nobody measures the drop-off between interest and confirmation.',
  },
  {
    slug: 'busy-and-not-much-better-off',
    title: 'Busy, and not much better off',
    area: 'Protect margin',
    summary: 'Sales looked healthy. What was left after them did not.',
    headline: {
      value: '+98%',
      label: 'Food revenue',
      context: 'Within three months, at The Anchor.',
    },
    stats: [
      {
        value: '+98%',
        label: 'Food revenue',
        context: 'Within three months, at The Anchor.',
      },
    ],
    hear: 'Food was being sold, the kitchen was busy, and the contribution was not what the effort suggested it should be. Pricing had been set by looking at what everyone else charged and taking a bit off.',
    challenge:
      'The menu was working against itself. The dishes people ordered most were the ones with least left in them, the descriptions gave nobody a reason to trade up, and the pricing carried no logic anyone could explain. Selling more of that menu would have made the problem bigger.',
    build:
      'The menu was rebuilt around what each dish actually contributes, not what it costs. Descriptions written to sell rather than to list. Pricing given a reason. One high-margin dish made the obvious choice rather than the hidden one.',
    optimise:
      'Food revenue grew 98% within three months, and the growth came from the dishes that were worth selling rather than from volume across the board.',
    transfer:
      'Any business with a product mix has this. The thing that sells most is rarely the thing worth selling most, and nobody finds that out by looking at the revenue line.',
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

export function getFeaturedCaseStudy(): CaseStudy {
  return CASE_STUDIES.find((study) => study.featured) ?? CASE_STUDIES[0];
}
