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
   * "Unlock growth", not "Growth problems".
   *
   * The header carried the word "problem" twice a few pixels apart, once as this
   * label and once on the button beside it. D11 fixes the button wording, so the
   * label is the half that moves. Section 34 of the positioning overview flags
   * "problem" as overused in customer-facing copy, and section 33 lists "unlock" as
   * language that fits, because it points at the outcome rather than the symptom.
   *
   * The URL stays `/growth-problems`. It is accurate, people search that way, and
   * moving it would mean redirects, eight child pages and the mapping that connects
   * all 105 guide articles to a growth problem, for nothing a visitor would notice.
   */
  { key: 'growth-problems', label: 'Unlock growth', href: '/growth-problems' },
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
            36px, which is the design system's own header logo height, not a
            preference. The port shipped 28px, so the mark sat at 44% of a 64px bar
            and read as small next to nav labels at 15px semibold. The supplied file
            is 1200x260, so at 36px tall it is 166px wide and still clears the nav by
            a wide margin at every breakpoint the header supports.
          */
          className="h-9 w-auto"
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
      // The reversed mark, because the footer is ink.
      logo={
        <Image
          src="/brand/logo-icon-white.png"
          alt="Orange Jelly"
          width={640}
          height={667}
          className="h-10 w-auto"
        />
      }
      columns={[
        {
          title: 'Start',
          links: [
            { label: 'Start here', href: '/start-here' },
            { label: 'Unlock growth', href: '/growth-problems' },
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
