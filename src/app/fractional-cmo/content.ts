/**
 * `/fractional-cmo` copy.
 *
 * Source of truth for the wording: `tasks/repositioning/copy/fractional-cmo.md`.
 *
 * The page uses the category's language to be found and then argues against the
 * format. Four fractional terms sit in the 500 tier, one at competition index 12,
 * and the brand pack does not mention the category once. The risk is equally real:
 * fractional implies one functional seat, and Orange Jelly is deliberately
 * cross-functional.
 *
 * It is honest about when a fractional CMO IS right, because a page saying "never
 * hire one" would be exactly as unbelievable as one saying "always".
 */
export const RIGHT_ANSWER = [
  {
    title: 'You know the problem is marketing.',
    body: 'Not enough demand is genuinely the thing holding you back, the rest of the business works, and what is missing is somebody senior to own it.',
  },
  {
    title: 'You have a team to lead.',
    body: 'There are people doing marketing already and the gap is direction, standards and someone accountable for the number.',
  },
  {
    title: 'The work is continuous.',
    body: 'Marketing is not a project for you, it is an operating function that needs running week after week.',
  },
] as const;

export const WRONG_SHAPE = [
  {
    title: 'The problem crosses functions and only one of them gets a seat.',
    body: "This is the common case and it is the reason this page exists. A business decides it needs marketing leadership because not enough demand is the symptom it can see. Underneath, enquiries are not turning into customers because nobody follows them up properly, margin is thin because pricing was never revisited, and the team is doing by hand what a system should do. A fractional CMO will spot that correctly and then be able to act on roughly a third of it. The other two thirds are somebody else's job, and the honest ones will tell you so. Now you are hiring a fractional COO as well, and the two of them are working out the boundary between them at your expense.",
  },
  {
    title: 'Nobody is accountable for the whole number.',
    body: 'Split the problem across two part-time department heads and you have split the accountability with it. Each can succeed at their own job while the thing you actually wanted does not move.',
  },
  {
    title: 'A seat is not a diagnosis.',
    body: 'Deciding you need a CMO is deciding what the answer is before anybody has established what the question was. That is the same mistake as buying software before defining the problem, and it is more expensive.',
  },
] as const;

export const QUESTIONS_TO_ASK = [
  'What would you look at first, and why that?',
  'What would make you say this is not a marketing problem?',
  'What does success look like, as a number, and when would we know?',
  'What happens to this when you are not here any more?',
  'What would make you tell me to stop paying you?',
] as const;
