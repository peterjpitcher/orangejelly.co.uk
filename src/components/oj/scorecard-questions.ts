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
  /*
   * Every statement now points the same way: "Always" is always the healthy answer.
   *
   * These two used to be reverse-scored ("the same information gets typed into more
   * than one system"), which stopped straight-lining but confused the people
   * answering honestly: ten statements where Always was good, then two where it was
   * bad, on the same scale with no warning. The `reverse` flag stays in the type
   * and the scoring for anyone who needs it later; no statement uses it.
   */
  {
    area: 'operations',
    text: 'Information gets typed in once. Nobody re-keys it into a second system.',
  },
  {
    area: 'operations',
    text: 'Work keeps moving when one particular person is busy or away.',
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
