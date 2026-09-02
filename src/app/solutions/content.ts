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
 *
 * GROUPED, same day. Thirteen items in one flat grid read as a menu. They now sit
 * under five headings in the order an owner thinks about the business: decide
 * where to go, get found, turn interest into sales, keep the money, make the place
 * run without you. Each group names the growth areas it serves, so the grouping
 * joins up with the six areas above it rather than adding a third vocabulary.
 */
export interface CapabilityGroup {
  id: string;
  /** Plain heading, in the owner's words. */
  heading: string;
  /** The growth areas this group serves, as a small label. */
  areas: string;
  /** One line on what the group is for. */
  intro: string;
}

export const CAPABILITY_GROUPS: readonly CapabilityGroup[] = [
  {
    id: 'direction',
    heading: 'Deciding where to go',
    areas: 'Every area',
    intro:
      'What the business is trying to become, and the few numbers that tell you whether it is getting there.',
  },
  {
    id: 'demand',
    heading: 'Getting found',
    areas: 'Create demand',
    intro: 'Making enough of the right people know you exist, and know why they should pick you.',
  },
  {
    id: 'conversion',
    heading: 'Turning interest into sales, and keeping customers',
    areas: 'Convert more, Improve the experience',
    intro: 'What happens between someone asking and someone buying, and what brings them back.',
  },
  {
    id: 'margin',
    heading: 'Keeping more of the money',
    areas: 'Protect margin',
    intro: 'What is left after the sale, and where it goes.',
  },
  {
    id: 'operations',
    heading: 'Making the business run without you',
    areas: 'Remove operational drag, Build for scale',
    intro:
      'Taking the work off people that a system should be doing, and making the improvement stick.',
  },
] as const;

export const CAPABILITIES = [
  {
    group: 'direction',
    name: 'Growth and commercial strategy',
    body: 'Where the business is going, and what it stops doing to get there.',
  },
  {
    group: 'direction',
    name: 'Numbers you can act on',
    body: 'The three numbers that would change a decision, not the ninety that will not.',
  },
  {
    group: 'demand',
    name: 'What you offer, and how you describe it',
    body: 'What you actually sell, in words a customer would use.',
  },
  {
    group: 'demand',
    name: 'Marketing and getting found',
    body: 'Making enough of the right people know and care.',
  },
  {
    group: 'conversion',
    name: 'Turning interest into sales',
    body: 'Closing the gap between someone asking and someone buying.',
  },
  {
    group: 'conversion',
    name: 'Websites and booking systems',
    body: 'The place the decision usually gets made, or lost.',
  },
  {
    group: 'conversion',
    name: 'Keeping in touch with customers',
    body: 'Staying useful to people who have already bought, so they come back.',
  },
  {
    group: 'margin',
    name: 'Pricing and margin',
    body: 'What is left after the sale, and why more of it is not.',
  },
  {
    group: 'margin',
    name: 'Supplier costs and contracts',
    body: 'The cost line nobody has looked at in three years.',
  },
  {
    group: 'operations',
    name: 'How the work gets done',
    body: 'Removing the jobs that should not exist.',
  },
  {
    group: 'operations',
    name: 'Automation and internal tools',
    body: "Software instead of somebody's Tuesday.",
  },
  {
    group: 'operations',
    name: 'Where AI would genuinely help',
    body: 'Where it earns its place, and an honest answer where it does not.',
  },
  {
    group: 'operations',
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
