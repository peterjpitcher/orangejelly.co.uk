/**
 * `/solutions` copy.
 *
 * Source of truth for the wording: `tasks/repositioning/copy/solutions.md`.
 *
 * The page refuses to lead with the capability list. Thirteen capabilities read as
 * a company that will do anything, which is the exact impression the method exists
 * to correct, so the problems come first and these sit underneath as the things a
 * fix might be made of.
 */
export const CAPABILITIES = [
  {
    name: 'Growth and commercial strategy',
    body: 'Where the business is going, and what it stops doing to get there.',
  },
  {
    name: 'Brand and proposition',
    body: 'What you actually offer, in words a customer would use.',
  },
  {
    name: 'Marketing and demand',
    body: 'Making enough of the right people know and care.',
  },
  {
    name: 'Conversion and customer journeys',
    body: 'Closing the gap between interest and a decision.',
  },
  {
    name: 'Websites and booking systems',
    body: 'The place the decision usually gets made, or lost.',
  },
  {
    name: 'CRM and communications',
    body: 'Staying useful to people who have already bought.',
  },
  {
    name: 'Pricing and margin',
    body: 'What is left after the sale, and why more of it is not.',
  },
  {
    name: 'Procurement and supplier terms',
    body: 'The cost line nobody has looked at in three years.',
  },
  {
    name: 'Operations and workflows',
    body: 'Removing the work that should not exist.',
  },
  {
    name: 'Data and dashboards',
    body: 'The three numbers that would change a decision, not the ninety that will not.',
  },
  {
    name: 'Automation and internal tools',
    body: "Software instead of somebody's Tuesday.",
  },
  {
    name: 'AI use cases and prototypes',
    body: 'Where it earns its place, and an honest answer where it does not.',
  },
  {
    name: 'Team standards, playbooks and SOPs',
    body: 'Making the improvement survive the person who made it.',
  },
] as const;

export const DECLINED = [
  'Executing a plan that is already decided, where the value we would add is speed and nothing else.',
  'Any engagement where we cannot reach the people, the data or the customers.',
  'Work with no agreed measure of success, because there is then no honest way to end it.',
  'Technology chosen before the problem was defined, including ours.',
  'Anything we would be the second-best supplier for. There is usually somebody better and we would rather say who.',
] as const;
