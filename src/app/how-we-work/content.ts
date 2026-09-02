/**
 * `/how-we-work` copy.
 *
 * Source of truth for the wording: `tasks/repositioning/copy/how-we-work.md`.
 *
 * The words are HEAR CHALLENGE BUILD OPTIMISE. The pack's draft said HEAR EXPOSE
 * BUILD PROVE; EXPOSE became CHALLENGE because challenge is what actually happens
 * in the room, and PROVE became OPTIMISE because proving is a moment and optimising
 * is the job. Measurement lives inside OPTIMISE rather than standing as its own
 * step, which is why that step has the baseline in it.
 *
 * Plain-English pass, 2 September 2026. The four words stay as stage labels; the
 * sentences under them lost "operating reality", "leading and lagging indicators",
 * "adoption problems", "material difference" and the rest. Each step now says what
 * happens and what you get, in words a business owner would use.
 */
export interface MethodDetail {
  word: string;
  line: string;
  body: string;
  outcome?: string;
  discipline: string;
}

export const METHOD_DETAIL: readonly MethodDetail[] = [
  {
    word: 'HEAR.',
    line: 'Understand what is really happening, not what everyone says is happening.',
    body: 'We talk to you and to the people doing the work, walk through how things actually get done, and take a proper look at the numbers. Where it helps, we talk to customers too.',
    outcome:
      'The problem in plain words, a map of how the business works today, the numbers we will measure against, and an honest list of what we still do not know.',
    discipline:
      'Listening is not enough. The job is to hear the difference between what people say is happening and what the numbers show.',
  },
  {
    word: 'CHALLENGE.',
    line: 'Test what everyone assumes, against the evidence.',
    body: 'This is the uncomfortable part and it is the part that pays. We take the explanation everyone has agreed on and check it against the numbers, follow the symptom back to what is actually causing it, and work out which one or two things are worth doing first.',
    outcome:
      'A one-page map of where the pressure is in your business, an agreed definition of the problem, a short list of what to do first, and the numbers we will judge it by.',
    discipline:
      'Do not solve the loudest symptom. Find the few things that would actually change the outcome, and say so even when it is not what anybody wanted to hear.',
  },
  {
    word: 'BUILD.',
    line: 'Build the fix, not a document about the fix.',
    body: 'The fix might be a clearer offer, a better way for people to book, a pricing change, a dashboard, an automation, a weekly routine, or an AI tool that earns its place. The problem decides. We start with the smallest change that would make a real difference, design it for the people who have to use it, build the measurement in from the start, and write down what you need to run it after we have gone.',
    discipline:
      'Avoid unnecessary technology. If the answer is a pricing change and a phone call, that is the answer.',
  },
  {
    word: 'OPTIMISE.',
    line: 'Measure it against where you started, then keep going until it moves.',
    body: 'Success is agreed before anything is built, so there is nothing to argue about afterwards. Then we compare against the numbers we took at the start, watch the early signs as well as the final results, fix the teething problems that always appear, and keep adjusting.',
    outcome:
      'A before-and-after report, a record of what we learned, an honest handover, and a recommendation to do more of it, change it or stop.',
    discipline:
      'Work is not finished because something was delivered. It is finished when the change is running, understood, and measured.',
  },
];

export const PRESSURE_AREAS_EXPLAINED = [
  { area: 'Demand', body: 'Whether enough of the right people know you exist and care.' },
  { area: 'Conversion', body: 'What happens between someone being interested and someone buying.' },
  { area: 'Margin', body: 'What is left after the sale, and where it leaks.' },
  { area: 'Operations', body: 'What the business spends effort on that it should not.' },
  { area: 'Experience', body: 'What people remember, as opposed to what you deliver.' },
  { area: 'Scale', body: 'What breaks first at twice the size.' },
] as const;

/**
 * How long each stage takes. Added 2 September 2026 because the page explained the
 * method in full and never said how long any of it takes, which is the first thing
 * an owner asks. The figures are the ones Start here already commits to.
 */
export const TIMELINE = [
  {
    stage: 'The first conversation',
    length: 'An hour. Free.',
    body: 'You leave with our first read on where to look, and a straight answer on whether we are the right people.',
  },
  {
    stage: 'The first proper look',
    length: 'Two to three weeks.',
    body: 'HEAR and CHALLENGE. Real numbers, real conversations, and an agreed definition of the problem at the end of it.',
  },
  {
    stage: 'Building and measuring',
    length: 'Depends on what we find.',
    body: 'BUILD and OPTIMISE. The shape and the hours are agreed in writing before this starts, never after.',
  },
] as const;

export const STARTING_AGREEMENT = [
  'The problem we are solving, in one sentence we both recognise.',
  'Why it matters now.',
  'The numbers we are starting from, or the honest admission that there are none yet.',
  'What success looks like, as a number where possible.',
  'What is in scope and what is not.',
  'Who can make the decisions, and who owns implementation.',
  'What data and access we need.',
  'How we will review progress.',
  'What would make us stop, change direction or expand.',
] as const;

export const PREVENTS = [
  'Starting with a tactic somebody asked for before anyone has understood the problem.',
  'Treating every problem as a marketing problem.',
  'Using AI where it adds nothing.',
  'Handing over a strategy the business cannot actually implement.',
  'Measuring activity instead of impact.',
  'Carrying on after the useful outcome has already been reached.',
  'Letting everyone avoid the decision the business actually needs to make.',
] as const;
