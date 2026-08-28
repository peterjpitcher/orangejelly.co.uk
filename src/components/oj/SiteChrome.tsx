'use client';

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
  { key: 'growth-problems', label: 'Growth problems', href: '/growth-problems' },
  { key: 'how-we-work', label: 'How we work', href: '/how-we-work' },
  { key: 'results', label: 'Results', href: '/results' },
  { key: 'insights', label: 'Insights', href: '/insights' },
  { key: 'guides', label: 'Guides', href: '/licensees-guide' },
  { key: 'start-here', label: 'Start here', href: '/start-here' },
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
      items={ITEMS.map((item) => ({
        label: item.label,
        href: item.href,
        current: item.key === current,
      }))}
      cta={{ label: 'Bring us the problem', href: ctaHref }}
    />
  );
}

export function OjFooter(): JSX.Element {
  return (
    <Footer
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
            { label: "The Licensee's Guide", href: '/licensees-guide' },
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
      legal="Orange Jelly Limited"
    />
  );
}
