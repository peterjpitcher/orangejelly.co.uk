/**
 * `/start-here` copy, kept out of the page so the words can be reviewed and tested
 * without reading JSX.
 *
 * Source of truth for the wording: `tasks/repositioning/copy/start-here.md`.
 */
export const STEPS = [
  {
    word: 'YOU TELL US.',
    text: 'Four questions on the form below. A couple of sentences on each is plenty.',
  },
  {
    word: 'WE REPLY.',
    text: 'A person reads it, not a filter, and the reply is about your situation rather than a brochure.',
  },
  {
    word: 'WE TALK.',
    text: 'An hour, free, and not a pitch. We ask about the numbers, the history and what has already been tried. Most of that hour is us listening.',
  },
  {
    word: 'WE SAY IT.',
    text: 'What we think, including when the answer is that you do not need us. That happens, and saying so is worth more than three weeks of finding out.',
  },
  {
    word: 'WE SCOPE IT.',
    text: 'If it is worth going further: a defined piece of work, a fixed fee agreed before anything starts, and a measure we both sign up to.',
  },
] as const;

export const TAKEAWAYS = [
  'Our read on what is actually blocking growth, said plainly.',
  'The two or three things we would look at first, and why those.',
  'A straight answer on whether we are the right people for it.',
] as const;

export const NEEDS = [
  {
    title: 'An hour with someone who can act on the answer.',
    body: 'Not a gatekeeper taking notes back to a committee.',
  },
  {
    title: 'The real numbers.',
    body: 'We cannot find a margin problem in a business that will only show us its revenue.',
  },
  {
    title: 'A willingness to be told something you disagree with.',
    body: 'Politely, with the reasoning, and only when we think it matters. But we will say it.',
  },
] as const;

export const FIT = {
  works: [
    /*
     * Rewritten 31 Aug 2026 towards what the reader wants, not what is wrong.
     *
     * Section 14 of the positioning overview: Orange Jelly should intentionally
     * attract people who want something, not merely people who want a pain removed.
     * Four of the six entries here described something going wrong, which meant the
     * one list that decides who self-selects in was filtering for the reader the
     * document says is the wrong fit.
     *
     * The last two are unchanged. They were already about readiness, which is
     * section 15's non-negotiable, and they are the reason this reads as a filter
     * rather than as flattery.
     */
    'You believe the business is capable of more than it is currently doing.',
    'You want to know what is actually driving the numbers, rather than what everyone assumes.',
    'You are ready to change how the business works, not only how it is marketed.',
    'You want the systems built for the company you are becoming, not the one you started.',
    'You want someone to challenge the thinking, not agree with it.',
    'You can act once a direction is agreed.',
  ],
  doesNot: [
    {
      title: 'You want someone to post three times a week.',
      body: 'Posting more will not fix a proposition, a conversion journey or an offer. If posting is genuinely the gap we will say so, but it is not what you would be hiring us for.',
    },
    {
      title: 'You have decided the plan and need a pair of hands.',
      body: 'We are not the cheapest way to execute a decision that is already made, and we would be bad value doing it.',
    },
    {
      title: 'You cannot give us access to the people, the numbers or the customers.',
      body: 'Diagnosis without access is guessing, and we will not charge for guessing.',
    },
    {
      title: 'You want AI because it is AI.',
      body: 'It is part of the toolkit. If the answer to your problem is a pricing change and a phone call, that is what you will get.',
    },
    {
      title: 'You want the decision validated.',
      body: 'If the direction is set and the question is really whether it is right, a second opinion you have paid for is worth nothing.',
    },
    {
      title: 'Nothing inside the business can actually change.',
      body: 'Growth that requires no change is not something anyone can sell you.',
    },
  ],
} as const;

export const FAQS = [
  {
    q: 'Is the first conversation really free?',
    a: 'Yes, and there is no follow-up sequence attached to it. You get an hour, our honest read, and no obligation. If we both think there is something worth doing, we will tell you what that would look like.',
  },
  {
    q: 'What if we are not sure what the problem is?',
    a: 'That is the normal case, and it is the reason the first step is a conversation rather than a quote. Most businesses can describe the symptom precisely and the cause not at all. Working out which is which is the job.',
  },
  {
    q: 'Do you only work with hospitality?',
    a: 'No. The thinking was built and tested in a real trading business, our own venue, which is why the examples on this site are specific rather than theoretical. The problems it solves are not hospitality-shaped: demand, conversion, margin, operational drag, experience and scale look much the same in a professional services firm or a trade business.',
  },
  {
    q: 'Who will we actually be dealing with?',
    a: 'Orange Jelly is deliberately small, so you are dealing with the people doing the work. There is no account manager between you and the thinking.',
  },
  {
    q: 'What happens to what we tell you?',
    a: 'It is used to have one useful conversation and nothing else. No list, no sequence, no sharing it. The answers you give on the second step of the form are commercially sensitive and are kept where only we can read them. The privacy notice has the detail.',
  },
] as const;
