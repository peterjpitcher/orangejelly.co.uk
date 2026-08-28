/**
 * The AI readiness result texts.
 *
 * One per pressure area, in two states. Twelve in all.
 *
 * THE HONESTY RULE IS THE POINT. Every pressed text has to say where AI genuinely
 * pays in that area AND where it does not. A tool that concludes "you need AI"
 * whatever the answers is a lead magnet wearing an assessment's clothes, and it
 * would fail the brand's own decision filter on the first question it asks.
 *
 * The line these are written along, from the pack: AI pays where repetitive
 * judgement meets volume. It does not decide what a business is for, what it should
 * charge, or how good the work is.
 *
 * @see tasks/repositioning/SUB-SPECS.md part 2
 */
export interface AreaResult {
  id: string;
  label: string;
  /** Shown when this area is under pressure. */
  pressed: {
    what: string;
    aiHelps: string;
    aiDoesNot: string;
  };
  /** Shown when it is not. Short: the reader is here about the other ones. */
  steady: string;
}

export const AREA_RESULTS: readonly AreaResult[] = [
  {
    id: 'demand',
    label: 'Demand',
    pressed: {
      what: 'You cannot say where your best customers actually come from, and when you need more enquiries there is no obvious lever. That is a measurement problem before it is a marketing problem, and spending more on the second one rarely fixes the first.',
      aiHelps:
        'The grind. Finding the words people actually search for rather than the ones you use about yourself, drafting the volume of material that would otherwise never get written, and reading patterns in where enquiries came from.',
      aiDoesNot:
        'Decide what you are for. If the proposition is wrong, AI helps you say the wrong thing faster, more often, and in more places.',
    },
    steady:
      'You know where demand comes from and which lever moves it. That is rarer than it sounds, and it means growth here is a question of doing more of what already works rather than finding out what does.',
  },
  {
    id: 'conversion',
    label: 'Conversion',
    pressed: {
      what: 'Enquiries arrive and nobody can say how many turn into work, or why the rest did not. Follow-up depends on somebody remembering, which means it depends on how busy that somebody was.',
      aiHelps:
        'Genuinely, and this is one of the clearest cases. Chasing, drafting the follow-up nobody has time for, flagging the enquiry that has gone quiet, summarising a long thread before a call. These fail because a person forgot, and forgetting is exactly what software does not do.',
      aiDoesNot:
        'Fix a journey that asks people to do something unreasonable. If the next step is unclear, automating it makes it unclear faster and at greater scale.',
    },
    steady:
      'You can see what happens between an enquiry and a decision, and follow-up does not depend on anyone remembering. That is most of the battle.',
  },
  {
    id: 'margin',
    label: 'Margin',
    pressed: {
      what: 'You cannot say which products, services or customers actually make money, and pricing gets looked at when something goes wrong rather than on a schedule. Growth on those terms makes the problem bigger, not smaller.',
      aiHelps:
        'Seeing it. Pulling contribution by line out of systems that were never built to report it, and modelling what a change would do before you make it.',
      aiDoesNot:
        'Decide what to charge. That is judgement about what you are worth and what the market will carry, and a model that has never met your customers is the wrong thing to ask.',
    },
    steady:
      'You know which lines make money and pricing gets reviewed before it becomes a problem. Margin work here is refinement rather than rescue.',
  },
  {
    id: 'operations',
    label: 'Operations',
    pressed: {
      what: 'The same information gets typed into more than one place, and work stalls waiting on one particular person. Nobody has time to fix the thing that would give them time, which is how it stays.',
      aiHelps:
        'More than anywhere else on this list, and it is where most businesses have not looked. Repetitive judgement at volume, moving information between systems that do not talk to each other, and producing the same document again with different details.',
      aiDoesNot:
        'Rescue a bad process. Automating one makes it faster and considerably harder to change later. The process gets fixed first, and that order is not negotiable.',
    },
    steady:
      'Information is entered once and work does not queue behind one person. That is unusual, and it means capacity here is a resourcing question rather than a systems one.',
  },
  {
    id: 'experience',
    label: 'Experience',
    pressed: {
      what: 'You hear about problems after people have gone rather than before, and the standard depends on who happens to be working. Both are invisible until you look for them, which is why they persist.',
      aiHelps:
        'The listening. Reading everything customers write at a volume nobody has time for, and finding the theme while it is still a theme rather than a pattern.',
      aiDoesNot:
        'Deliver the experience. The gap between your best person and your average one is training, standards, and enough time to do the job properly. No tool has ever closed it.',
    },
    steady:
      'You find out about problems while you can still do something about them, and the standard does not depend on the rota. Keep it.',
  },
  {
    id: 'scale',
    label: 'Scale',
    pressed: {
      what: 'Half as much work again would break something, and the numbers are not current enough to decide on this week. What got the business here is now the thing holding it.',
      aiHelps:
        'The reporting. Getting numbers out of the places they hide, so a decision does not wait a fortnight for somebody to build a spreadsheet.',
      aiDoesNot:
        'Fix a system built for a smaller company. That is architecture, and putting a tool on top of it usually just adds another place for the numbers to disagree with each other.',
    },
    steady:
      'The business could take meaningfully more work without something breaking, and the numbers are current enough to act on. That is the position most of this list is trying to reach.',
  },
];

export function getAreaResult(id: string): AreaResult | undefined {
  return AREA_RESULTS.find((area) => area.id === id);
}
