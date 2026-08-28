/**
 * `/pub-rescue` copy: the hospitality page for the version of the problem that is
 * not a project.
 *
 * Source of truth for the wording: `tasks/repositioning/copy/sector-hospitality.md`.
 *
 * The page opens by refusing the emergency framing it used to carry. A venue that
 * genuinely cannot pay this month needs its BDM, its accountant and the Licensed
 * Trade Charity, not a growth partner, and saying so is both true and the reason to
 * trust the rest of the page. It also keeps Orange Jelly out of work where nobody
 * can win.
 */
export const CAUSES = [
  {
    title: 'Nobody local knows you are still worth the trip',
    body: 'Visibility decays quietly and nothing tells you.',
  },
  {
    title: 'The week has one good day propping up five bad ones',
    body: 'The average hides it, so it goes unnoticed for months.',
  },
  {
    title: 'Food is selling and contributing nothing',
    body: "Busy and not much better off is a margin problem wearing a demand problem's clothes.",
  },
  {
    title: 'People book and do not come',
    body: 'Held tables and prepped food, paid for twice.',
  },
  {
    title: 'The team is doing by hand what a system should do',
    body: 'Nobody has time to fix the thing that would give them time.',
  },
  {
    title: 'Everybody has a different theory',
    body: 'The most expensive of the six, because it stops any of the others being addressed.',
  },
] as const;

export const WOULD_NOT_DO = [
  'Sell you a social media retainer for a margin problem.',
  'Start before there is a baseline, because then nobody can tell whether it worked.',
  'Keep going once the slide has stopped and the useful thing is done.',
] as const;
