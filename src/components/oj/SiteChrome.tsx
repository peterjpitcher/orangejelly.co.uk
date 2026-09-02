'use client';

import Image from 'next/image';

import * as React from 'react';

import { Footer } from './Footer';
import { Header } from './Header';

/**
 * The repositioned site navigation, in one place.
 *
 * Every page that opts into the new chrome renders these rather than declaring its
 * own item list. A nav defined per page drifts within a week: one page gains a link
 * and the others do not, and the site quietly stops agreeing with itself about what
 * it contains.
 *
 * `current` is passed by the page rather than read from the pathname, so these stay
 * usable from a server component and the page keeps deciding what it is.
 *
 * @see src/lib/oj-routes.ts, which decides where the legacy chrome is suppressed
 */
/**
 * Only pages in the primary nav have a key.
 *
 * About is deliberately not in it and therefore has no key: the nav's job is to move
 * someone towards their own problem, not towards the company, and About is reachable
 * from the footer and from the pages that earn it. A key for a page with no nav item
 * would type-check and then silently mark nothing.
 */
export type OjNavKey =
  | 'growth-problems'
  | 'how-we-work'
  | 'solutions'
  | 'results'
  | 'pubs'
  | 'insights'
  | 'guides'
  | 'start-here';

/**
 * BOTH LIBRARIES ARE IN HERE, and that is deliberate.
 *
 * The first version of this nav had four items and neither of them. The 105
 * hospitality guides earn 92.9% of the site's search clicks and were reachable only
 * through a footer link mislabelled "Insights", and the insights collection was not
 * linked from the chrome at all. Peter went looking for the guides and could not
 * find them, which is the only test that matters.
 *
 * Six items is more than I would choose from nothing. The old navigation carried
 * seven, and burying the biggest content asset the business owns to keep a tidier
 * bar is the wrong trade.
 */
const ITEMS: Array<{ key: OjNavKey; label: string; href: string }> = [
  /*
   * "Growth problems", not "Unlock growth".
   *
   * "Unlock growth" was chosen because it points at the outcome, and it read well
   * to the people who wrote it. To a reader it said nothing: the September 2026
   * language review, read as a pub owner, found it was the one menu label nobody
   * could guess the destination of. The button beside it is now "Let's talk", so
   * the two-problems-in-a-row objection that moved it no longer applies.
   *
   * The URL stays `/growth-problems`. It is accurate, people search that way, and
   * moving it would mean redirects, eight child pages and the mapping that connects
   * all 105 guide articles to a growth problem, for nothing a visitor would notice.
   */
  { key: 'growth-problems', label: 'Growth problems', href: '/growth-problems' },
  { key: 'how-we-work', label: 'How we work', href: '/how-we-work' },
  /*
   * `/solutions` was unreachable from the site's own navigation.
   *
   * It is live, it sits in the sitemap at priority 0.8, and it is the page that
   * answers "what do you actually build", which section 10 of the positioning
   * overview says is the thing Orange Jelly sells and section 11 says must stay
   * visible. Nothing linked to it from the header or the footer, so the only way in
   * was a search result.
   *
   * Labelled "What we build" rather than "Solutions": it says what the page is, and
   * it keeps the bar reading as outcomes rather than as a services menu, which is
   * the distinction section 36 turns on.
   */
  { key: 'solutions', label: 'What we build', href: '/solutions' },
  { key: 'results', label: 'Results', href: '/results' },
  /*
   * The hospitality page, in the bar.
   *
   * Every published number on the site is from a pub, the guides that earn most of
   * the search traffic are for pubs, and the one page written in a licensee's own
   * words was reachable only from the guides page and a search result. A publican
   * landing on the homepage read "small and mid-sized businesses" and left. One
   * word in the bar fixes that.
   */
  { key: 'pubs', label: 'Pubs', href: '/pub-marketing' },
  { key: 'insights', label: 'Insights', href: '/insights' },
  { key: 'guides', label: 'Guides', href: '/guides' },
  /*
   * "Start here" is deliberately NOT in the bar.
   *
   * It was a navigation item pointing at /start-here sitting a few pixels from a
   * button pointing at /start-here. Two controls, one destination, two different
   * names, which asks the reader to work out whether they are the same thing. Peter
   * put it plainly: we do not need both.
   *
   * The button is the one that stays, because D11 makes it the single call to action
   * and it is the louder control. The key stays in OjNavKey so /start-here can still
   * mark itself current, and the footer keeps a link for anyone reading the site as a
   * sitemap.
   */
];

export interface OjHeaderProps {
  current?: OjNavKey;
  tone?: 'orange';
  /** Where the call to action goes. Defaults to the enquiry page. */
  ctaHref?: string;
}

export function OjHeader({ current, tone, ctaHref = '/start-here' }: OjHeaderProps): JSX.Element {
  return (
    <Header
      tone={tone}
      /*
       * The real horizontal logo, not the type wordmark the component falls back to.
       * next/image is doing the work here: the supplied asset is 1200x260 and 194KB,
       * and the header renders it at 28px tall, so shipping the raw file would cost
       * every visitor a fifth of a megabyte for something the size of a stamp.
       *
       * `priority` because it is in the header on every page and therefore always
       * the largest contentful paint candidate above the fold.
       */
      logo={
        <Image
          /*
           * A real reversed asset on the orange band, not a filter.
           *
           * This used to be the colour logo with `brightness-0 invert` on it, because
           * the pack shipped a white icon but no white horizontal lockup. It rendered
           * correctly and it was still the wrong thing: a filter is not in the file,
           * so it does not survive being printed, exported, or opened anywhere outside a
           * browser, and it flattens every colour rather than reversing the artwork.
           *
           * The white lockup arrived on 31 August. The supplied file is 1672x941 with
           * the mark occupying 1414x262 in the middle, so nearly three quarters of its
           * height is empty and it would have rendered a third the height of its
           * colour twin. `logo-horizontal-white.png` is that file cropped to its
           * artwork and rebuilt on the same 1200x260 canvas with the same 1154x214
           * inset, so both files size identically from one class.
           */
          src={
            tone === 'orange' ? '/brand/logo-horizontal-white.png' : '/brand/logo-horizontal.png'
          }
          alt="Orange Jelly"
          width={1200}
          height={260}
          priority
          /*
            44px in a 64px bar, which is as large as it goes without moving the bar.
            
            The port shipped 28px and the design system specifies 36px; the owner
            asked for bigger than both. 44 leaves 10px of air above and below, and
            the horizontal lockup carries that better than a square mark would
            because it is wide rather than tall. Measured at 881, 1024 and 1440: the
            mark renders 203x44 at all three with no page overflow and at least 24px
            between it and the first nav item.
            
            Beyond this the bar has to grow with it. At 48px the logo is 75% of the
            bar height and reads as crowded rather than confident, and the header
            height is not a local decision: `--oj-sticky-offset` is set from it and
            every in-page anchor on the site clears the header by that number.
          */
          className="h-11 w-auto"
        />
      }
      items={ITEMS.map((item) => ({
        label: item.label,
        href: item.href,
        current: item.key === current,
      }))}
      cta={{ label: "Let's talk", href: ctaHref }}
    />
  );
}

export function OjFooter(): JSX.Element {
  return (
    <Footer
      /*
        The orange mark, not the reversed white one, at the owner's request.
        
        He pointed at `orange-jelly-icon-square-light.png`, which is the same
        artwork but RGB with no alpha: the white behind it is baked into the file,
        so on an ink footer it would render as a light square block rather than a
        floating mark. Every `-light` file in the brand folder is built that way,
        for use on white. `logo-icon.png` is the identical design with a real
        transparent background, already used elsewhere on the site, and it is what
        he actually asked for.
        
        Contrast is not a constraint here: a logotype is explicitly exempt from
        1.4.11, and brand orange on ink is plainly visible regardless.
      */
      logo={
        <Image
          src="/brand/logo-icon.png"
          alt="Orange Jelly"
          width={640}
          height={667}
          /*
            80px, twice what it was, at the owner's request. The footer brand column
            is the widest track in the grid and the mark is the only thing in it
            above the strapline, so it has the room: at 80px tall the 640x667 file
            renders 77px wide against a 300px column.
          */
          className="h-20 w-auto"
        />
      }
      columns={[
        {
          title: 'Start',
          links: [
            { label: 'Start here', href: '/start-here' },
            { label: 'Growth problems', href: '/growth-problems' },
            { label: 'How we work', href: '/how-we-work' },
            { label: 'Results', href: '/results' },
          ],
        },
        {
          // Named for what each one is. The footer previously labelled the
          // hospitality guide "Insights", which is now a different collection at a
          // different URL, so the one link to 105 articles pointed at the wrong idea.
          title: 'Reading',
          links: [
            { label: 'Pubs', href: '/pub-marketing' },
            { label: 'Guides', href: '/guides' },
            { label: 'Insights', href: '/insights' },
            { label: 'For professional services', href: '/sectors/professional-services' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About', href: '/about' },
            { label: 'Privacy', href: '/privacy' },
            { label: 'Contact', href: '/contact' },
          ],
        },
      ]}
      /*
       * No `legal` override. The Footer's own default is
       * `© <year> Orange Jelly Limited`, and passing the bare company name here
       * replaced it, which silently dropped the copyright notice and the year from
       * every page on the site.
       */
    />
  );
}
