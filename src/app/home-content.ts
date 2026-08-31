/**
 * Homepage copy, kept out of the page so the words can be reviewed and tested
 * without reading JSX.
 *
 * Source of truth for the wording: `tasks/repositioning/copy/homepage.md`.
 * Every figure comes from `CLAIMS.md` and is expressed as a percentage, with its
 * provenance stated on the card.
 */
export const SYMPTOMS = [
  'Growth has stalled, and nobody can say exactly when it did.',
  "Leads arrive and don't convert, and the handover is where they go quiet.",
  "Sales look healthy and the profit doesn't follow.",
  'The team is busy doing things a system should be doing.',
  'The business has outgrown the way it was set up to run.',
  'Everyone around the table has a different view of the real problem.',
] as const;

/**
 * The six areas, and the problem page each one leads to.
 *
 * The card titles are the areas (where growth gets stuck). The destinations are
 * symptom-shaped, because that is how somebody recognises their own situation:
 * nobody types "protect margin", they think "we are busy and not much better off".
 * The eight problem pages carry the symptom language and tag themselves with the
 * areas they touch, so the two vocabularies stay joined rather than competing.
 */
export const PRESSURE_POINTS = [
  {
    title: 'Create demand',
    desc: 'Not enough of the right people know you exist, or care yet.',
    href: '/growth-problems/weak-demand',
  },
  {
    title: 'Convert more',
    desc: "They arrive, they look, and they don't buy. Usually the fault is in the handover.",
    href: '/growth-problems/leads-not-converting',
  },
  {
    title: 'Protect margin',
    desc: "The revenue is there. It's leaking out somewhere between the sale and the bank.",
    href: '/growth-problems/margin-under-pressure',
  },
  {
    title: 'Remove operational drag',
    desc: 'People doing by hand what a system should do, and no time left to improve anything.',
    href: '/growth-problems/operations-slowing-us-down',
  },
  {
    title: 'Improve the experience',
    desc: 'What you deliver is fine. What people remember is not the same thing.',
    href: '/growth-problems/experience-leaking-value',
  },
  {
    title: 'Build for scale',
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
    text: 'We measure it against the baseline we agreed at the start, and we keep going until it moves.',
  },
] as const;

/**
 * The five approved claims, verbatim from CLAIMS.md.
 *
 * Improvement is always a percentage, never a raw number or a multiple: "+403%"
 * relates better than "fivefold", and a multiple invites the reader to work out the
 * base, which is not the point being made.
 */
export const PROOF = [
  {
    value: '+828%',
    label: 'Google Search visibility',
    context: 'Search Console clicks and impressions, at The Anchor.',
    area: 'Create demand',
  },
  {
    value: '+403%',
    label: 'Table bookings',
    context: 'Bookings taken at The Anchor, against the previous run rate.',
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
