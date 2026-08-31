/**
 * The twelve scorecard statements.
 *
 * Deliberately in their own module with no `use client` directive. They live in
 * plain data because `/tools/ai-readiness` renders them from the SERVER for its
 * no-JavaScript fallback, and a value exported from a client module is a client
 * reference: mapping over it on the server fails at build with "Attempted to call
 * map() from the server", which is a confusing error a long way from its cause.
 *
 * @see tasks/repositioning/SUB-SPECS.md part 2.4
 */
export interface ScorecardQuestion {
  /** Pressure area id. */
  area: string;
  text: string;
  /** True when "always" is the bad answer, which stops straight-lining. */
  reverse?: boolean;
}

export const SCORECARD_QUESTIONS: ScorecardQuestion[] = [
  { area: 'demand', text: 'We can explain exactly where our best new customers come from.' },
  { area: 'demand', text: 'When we need more enquiries, we know which lever to pull.' },
  {
    area: 'conversion',
    text: "We know how many enquiries turn into paying work, and why the rest don't.",
  },
  {
    area: 'conversion',
    text: 'Someone follows up every enquiry within a day, without being chased.',
  },
  { area: 'margin', text: 'We know which products, services or customers actually make us money.' },
  {
    area: 'margin',
    text: 'We review pricing on a schedule rather than when something goes wrong.',
  },
  {
    area: 'operations',
    text: 'The same information gets typed into more than one system.',
    reverse: true,
  },
  {
    area: 'operations',
    text: "Work stalls because it's waiting on one particular person.",
    reverse: true,
  },
  {
    area: 'experience',
    text: 'We hear from customers about problems before they leave, not after.',
  },
  {
    area: 'experience',
    text: 'A new team member could deliver our service to the same standard as our best person.',
  },
  { area: 'scale', text: 'We could take on 50% more work without something breaking.' },
  { area: 'scale', text: 'Our numbers are current enough to act on this week.' },
];
