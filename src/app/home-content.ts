/**
 * Homepage copy, kept out of the page so the words can be reviewed and tested
 * without reading JSX.
 *
 * Source of truth for the wording: `tasks/repositioning/copy/homepage.md`.
 * Every figure comes from `CLAIMS.md` and is expressed as a percentage, with its
 * provenance stated on the card.
 *
 * REWRITTEN 2 SEPTEMBER 2026 for plain English. The language review, read as a pub
 * owner, found the site written in the vocabulary of a strategy consultancy:
 * "handover", "run rate", "Search Console", "operational drag". The rule now is that
 * the category term ("Create demand") is a small label and the heading is the
 * problem in the reader's own words ("Not enough new customers").
 */
export const SYMPTOMS = [
  'Growth has stalled, and nobody can say exactly when it did.',
  'Enquiries come in, then go quiet after the first reply.',
  "Sales look healthy and the profit doesn't follow.",
  'The team is busy doing things a system should be doing.',
  'The business has outgrown the way it was set up to run.',
  'Everyone around the table has a different view of the real problem.',
] as const;

/**
 * The six areas, and the problem page each one leads to.
 *
 * The card title is the problem in plain words, because that is how somebody
 * recognises their own situation: nobody types "protect margin", they think "we are
 * busy and not much better off". The area name sits above it as a label so the
 * vocabulary the rest of the site uses stays joined to it rather than competing.
 */
export const PRESSURE_POINTS = [
  {
    area: 'Create demand',
    title: 'Not enough new customers',
    desc: 'Not enough of the right people know you exist, or care yet.',
    href: '/growth-problems/weak-demand',
  },
  {
    area: 'Convert more',
    title: "People look, but don't buy",
    desc: 'They get as far as asking, then go quiet. Usually the problem is what happens after they get in touch.',
    href: '/growth-problems/leads-not-converting',
  },
  {
    area: 'Protect margin',
    title: 'Busy, but not making money',
    desc: 'The sales are there. The profit is leaking out somewhere between the till and the bank.',
    href: '/growth-problems/margin-under-pressure',
  },
  {
    area: 'Remove operational drag',
    title: 'Too much admin, not enough time',
    desc: 'People doing by hand what a system should do, and no time left to improve anything.',
    href: '/growth-problems/operations-slowing-us-down',
  },
  {
    area: 'Improve the experience',
    title: "Customers don't come back",
    desc: 'What you deliver is fine. What people remember is not the same thing.',
    href: '/growth-problems/experience-leaking-value',
  },
  {
    area: 'Build for scale',
    title: "It only works because you're there",
    desc: "It works at this size. It won't work at twice this size, and you can feel it.",
    href: '/growth-problems/systems-cannot-keep-up',
  },
] as const;

export const METHOD = [
  {
    word: 'HEAR.',
    text: "We start by listening. The people running the business already know most of what is wrong, and it's rarely written down anywhere.",
  },
  {
    word: 'CHALLENGE.',
    text: "We test what everyone assumes, against the numbers. This is the uncomfortable part and it's the part that pays.",
  },
  {
    word: 'BUILD.',
    text: 'We build the fix, not a slide about the fix. Marketing, process, systems, automation, AI, whatever the problem turns out to need.',
  },
  {
    word: 'OPTIMISE.',
    text: 'We measure it against the numbers we took before we started, and we keep going until it moves.',
  },
] as const;

/**
 * The five approved claims, verbatim from CLAIMS.md.
 *
 * Improvement is always a percentage, never a raw number or a multiple: "+403%"
 * relates better than "fivefold", and a multiple invites the reader to work out the
 * base, which is not the point being made.
 *
 * The context line says how it was measured in words a reader would use. "Search
 * Console clicks and impressions" is accurate and meant nothing to a publican.
 */
export const PROOF = [
  {
    value: '+828%',
    label: 'Google Search visibility',
    context: 'How often people found The Anchor on Google: clicks and impressions, against before.',
    area: 'Create demand',
  },
  {
    value: '+403%',
    label: 'Table bookings',
    context: 'Bookings taken at The Anchor, compared with before the work started.',
    area: 'Convert more',
  },
  {
    value: '+567%',
    label: 'Private hire bookings',
    context: 'Twenty confirmed in six months, against about six a year before.',
    area: 'Create demand',
  },
  {
    value: '89%',
    label: 'Fewer booking no-shows',
    context: 'No-show rate fell from around 20% to around 2%.',
    area: 'Protect margin',
  },
  {
    value: '+98%',
    label: 'Food revenue',
    context: 'Within three months, at The Anchor.',
    area: 'Protect margin',
  },
] as const;
