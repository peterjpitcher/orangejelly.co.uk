/**
 * `/solutions` copy.
 *
 * Source of truth for the wording: `tasks/repositioning/copy/solutions.md`.
 *
 * The page refuses to lead with the capability list. Thirteen capabilities read as
 * a company that will do anything, which is the exact impression the method exists
 * to correct, so the problems come first and these sit underneath as the things a
 * fix might be made of.
 *
 * Names rewritten 2 September 2026 for plain English. "Brand and proposition",
 * "CRM and communications", "Procurement and supplier terms" and "playbooks and
 * SOPs" are trade terms; a business owner reading the list should recognise every
 * line without translating it.
 */
export const CAPABILITIES = [
  {
    name: 'Growth and commercial strategy',
    body: 'Where the business is going, and what it stops doing to get there.',
  },
  {
    name: 'What you offer, and how you describe it',
    body: 'What you actually sell, in words a customer would use.',
  },
  {
    name: 'Marketing and getting found',
    body: 'Making enough of the right people know and care.',
  },
  {
    name: 'Turning interest into sales',
    body: 'Closing the gap between someone asking and someone buying.',
  },
  {
    name: 'Websites and booking systems',
    body: 'The place the decision usually gets made, or lost.',
  },
  {
    name: 'Keeping in touch with customers',
    body: 'Staying useful to people who have already bought, so they come back.',
  },
  {
    name: 'Pricing and margin',
    body: 'What is left after the sale, and why more of it is not.',
  },
  {
    name: 'Supplier costs and contracts',
    body: 'The cost line nobody has looked at in three years.',
  },
  {
    name: 'How the work gets done',
    body: 'Removing the jobs that should not exist.',
  },
  {
    name: 'Numbers you can act on',
    body: 'The three numbers that would change a decision, not the ninety that will not.',
  },
  {
    name: 'Automation and internal tools',
    body: "Software instead of somebody's Tuesday.",
  },
  {
    name: 'Where AI would genuinely help',
    body: 'Where it earns its place, and an honest answer where it does not.',
  },
  {
    name: 'Ways of working the team can follow',
    body: 'Making the improvement survive the person who made it.',
  },
] as const;

/*
 * Cut from five to three. The full list was a fifth block of things the company
 * will not do on a site that already had six of them, and the two dropped ("a plan
 * already decided", "no access") are said on Start here, where the reader decides.
 */
export const DECLINED = [
  'Work with no agreed measure of success, because there is then no honest way to end it.',
  'Technology chosen before the problem was defined, including ours.',
  'Anything we would be the second-best supplier for. There is usually somebody better and we would rather say who.',
] as const;
