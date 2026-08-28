/**
 * `/about` copy.
 *
 * Source of truth for the wording: `tasks/repositioning/copy/about.md`.
 *
 * Written only from facts already recorded in this repository: the Greene King
 * tenancy, BII membership, the dates in content/data/about.json and the project
 * profile, and the approved claims. Nothing about motivation or belief is invented,
 * because inventing it is exactly the thing the pack's own evidence rule forbids.
 *
 * D21 applies throughout: company voice, no founder story as a page structure, and
 * The Anchor is our own venue rather than anybody's pub. The section naming who you
 * deal with is two factual sentences: it is a feature of a small company, not a
 * biography.
 */
export const LESSONS = [
  {
    title: 'The problem is almost never the one being described.',
    body: 'Flat trade was blamed on the economy for a long time before anybody checked what people were actually searching for. Every business has an explanation it has agreed on, and the explanation is usually the thing standing between it and the answer.',
  },
  {
    title: 'The expensive failures are the quiet ones.',
    body: 'A booking that never gets made costs nothing anyone can see. A dish that sells well and contributes little looks like success on the revenue line. Nobody puts either on a report, which is exactly why they persist.',
  },
  {
    title: 'Nothing changes because of a document.',
    body: 'Work is not finished when a deliverable is handed over. It is finished when the change is running, the people using it understand it, and the number has moved or been honestly reported as not having moved.',
  },
] as const;

export const REFUSALS = [
  {
    title: 'Sell you activity because it is easy to sell.',
    body: 'Three posts a week is a product. It is rarely an answer.',
  },
  {
    title: 'Put AI in something because AI is in the brief.',
    body: 'It is part of the toolkit. If the answer is a pricing change and a phone call, that is what you get.',
  },
  {
    title: 'Agree with you for money.',
    body: 'If we think the direction is wrong we will say so, with the reasoning, before the work rather than after it.',
  },
  {
    title: 'Keep going once the useful outcome has arrived.',
    body: 'An engagement that has done its job should end, and we would rather tell you that than let it drift into a retainer.',
  },
  {
    title: 'Take work we cannot do well.',
    body: 'Some of what comes to us is not for us, and saying so early is cheaper for everybody than finding out in month three.',
  },
] as const;

export const FACTS = [
  { label: 'Company', value: 'Orange Jelly Limited' },
  { label: 'Founded', value: 'March 2019' },
  { label: 'Based', value: 'Stanwell Moor, Staines' },
  { label: 'Our own venue', value: 'The Anchor, held as a Greene King tenancy' },
  { label: 'Member of', value: 'The British Institute of Innkeeping' },
  { label: 'First client outside our own business', value: 'September 2025' },
] as const;
