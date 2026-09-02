/**
 * `/pub-marketing` copy: the hospitality sector landing page.
 *
 * Source of truth for the wording: `tasks/repositioning/copy/sector-hospitality.md`.
 *
 * THIS IS WHERE THE SECTOR LANGUAGE BELONGS. "Pub marketing" is the strongest term
 * the keyword research found and it is accurate here. What changed is that it now
 * describes a market Orange Jelly works in rather than what the company is, and the
 * page says so rather than leaving it implied.
 */
import { PRICING } from '@/lib/constants';

export const LOOK_AT_FIRST = [
  {
    title: 'Whether people can find you',
    body: "Google Business Profile, the search terms locals actually use, the photos, the review replies. It's the cheapest fix in hospitality and the one most often left undone.",
  },
  {
    title: 'Whether there is a reason to come',
    body: 'A clear midweek hook beats a full content calendar. One repeatable reason is worth more than thirty posts.',
  },
  {
    title: 'Whether people who want to come can actually book',
    body: 'Most venues lose people between wanting to come and having a table. That gap is measurable and almost nobody measures it.',
  },
  {
    title: 'Whether the extra trade is worth having',
    body: 'More covers at the wrong margin is more work for the same money.',
  },
] as const;

export const FAQS = [
  {
    q: 'Do you do it for me, or show me how?',
    a: 'Either, and we decide which in the first conversation. Some venues want a plan and the templates to run it. Others want it done. What we will not do is sell you the hands-on version when the plan would have been enough.',
  },
  {
    q: 'How quickly does pub marketing work?',
    a: "Local visibility moves in days, because it's mostly correcting things that are wrong. Bookings and repeat visits build over weeks, because they depend on people coming back. Anyone promising both in a fortnight is selling you the first and calling it the second.",
  },
  {
    q: 'Can you help with Google Business Profile and reviews?',
    a: "Yes, and it's usually where we start. It is the quickest win for local footfall: accuracy, photos, replies, and posts that actually get seen.",
  },
  {
    /*
     * The one price sentence, the same one Start here uses. This answer used to
     * say "there is no price list", and Start here said the hourly rate "is the
     * whole price list". A reader who saw both trusted neither.
     */
    q: 'What does it cost?',
    a: `The rate is ${PRICING.hourly.display}, and that is the only number we advertise. There are no packages, because what a single quiet midweek session needs is nothing like what a venue where the whole week has slipped needs. The first conversation is an hour and it's free, and you get the hours in writing before anything starts.`,
  },
  {
    q: 'Will this work for a tied pub or a managed house?',
    a: 'Yes. Almost every win here is about how the place runs or what it says about itself: events, local visibility, the booking route, repeat visits. None of it depends on who supplies the beer.',
  },
  {
    q: 'Do you work with restaurants, bars and cafés too?',
    a: 'Yes. The page says pub because that is what we run and what most people search for, but finding you, giving people a reason to come, taking the booking and keeping the margin are the same job in any venue that serves food and drink.',
  },
] as const;

/**
 * Where we can get to in person.
 *
 * Restored from the page this one replaced. Eight county landing pages were
 * consolidated into `/pub-marketing` in August 2026 and now 301 here, and the local
 * intent that earned them is worth keeping on the page that absorbed it.
 *
 * They are chips, not links, and deliberately so: every one of those URLs redirects
 * to this page, so linking them would either point at a redirect or point the page
 * at itself.
 *
 * The wording is careful about what it claims. Orange Jelly works UK-wide and always
 * has. These are the counties close enough to The Anchor for someone to turn up,
 * which is a different and smaller promise.
 */
export const AREAS = [
  'London',
  'Surrey',
  'Berkshire',
  'Buckinghamshire',
  'Hertfordshire',
  'Kent',
  'Hampshire',
  'Oxfordshire',
] as const;
