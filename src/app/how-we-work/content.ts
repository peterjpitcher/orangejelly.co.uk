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
    line: 'Understand what is really happening, not what the brief says.',
    body: 'We get close to the operating reality: the leader, the people doing the work, the data, and where it helps, the customer. Leadership interviews, staff conversations, a walk through the journey and the systems, and a proper look at the numbers.',
    outcome:
      'A problem statement in plain words, a map of how it works today, the baseline we will measure against, and an honest list of what the evidence does not cover.',
    discipline:
      'Listening is not enough. The job is to hear the difference between what people say is happening and what the numbers show.',
  },
  {
    word: 'CHALLENGE.',
    line: 'Test what everyone assumes, against the evidence.',
    body: 'This is the uncomfortable part and it is the part that pays. We connect the visible symptom to the rest of the business, take apart the comfortable explanation, and make the trade-offs explicit. Root cause, funnel, margin, process, journey, systems and data, then sizing and prioritising what is actually worth doing.',
    outcome:
      'A Growth Pressure Map, an agreed definition of the problem, a prioritised short list, and the measures we will judge it by.',
    discipline:
      'Do not solve the loudest symptom. Find the few pressure points that can change the outcome, and say so even when it is not what anybody wanted to hear.',
  },
  {
    word: 'BUILD.',
    line: 'Build the fix, not a document about the fix.',
    body: 'The solution might be a proposition, a conversion journey, a pricing change, a booking system, a dashboard, an automation, an operating rhythm, or an AI tool that earns its place. The problem decides. We start with the smallest intervention capable of making a material difference, prototype early where we are unsure, design it for the people who have to use it, build the measurement in rather than bolting it on, and write down what you need to run it after we have gone.',
    discipline:
      'Avoid unnecessary technology. If the answer is a pricing change and a phone call, that is the answer.',
  },
  {
    word: 'OPTIMISE.',
    line: 'Measure it against the baseline, then keep going until it moves.',
    body: 'Success is agreed before anything is built, so there is nothing to argue about afterwards. Then we compare against the baseline, look at the leading indicators as well as the lagging ones, fix the adoption problems that always appear, and iterate.',
    outcome:
      'An impact report with before and after, a learning log, an honest handover, and a recommendation to scale it, change it or stop.',
    discipline:
      'Work is not finished because something was delivered. It is finished when the change is implemented, understood, and measured as far as the engagement allows.',
  },
];

export const PRESSURE_AREAS_EXPLAINED = [
  { area: 'Demand', body: 'Whether enough of the right people know and care.' },
  { area: 'Conversion', body: 'What happens between interest and a decision.' },
  { area: 'Margin', body: 'What is left after the sale, and where it leaks.' },
  { area: 'Operations', body: 'What the business spends effort on that it should not.' },
  { area: 'Experience', body: 'What people remember, as opposed to what you deliver.' },
  { area: 'Scale', body: 'What breaks first at twice the size.' },
] as const;

export const STARTING_AGREEMENT = [
  'The problem we are solving, in one sentence we both recognise.',
  'Why it matters now.',
  'The baseline, or the honest admission that there is not one yet.',
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
