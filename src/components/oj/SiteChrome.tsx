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
export type OjNavKey = 'growth-problems' | 'how-we-work' | 'results' | 'about' | 'start-here';

const ITEMS: Array<{ key: OjNavKey; label: string; href: string }> = [
  { key: 'growth-problems', label: 'Growth problems', href: '/growth-problems' },
  { key: 'how-we-work', label: 'How we work', href: '/how-we-work' },
  { key: 'results', label: 'Results', href: '/results' },
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
          title: 'Company',
          links: [
            { label: 'About', href: '/about' },
            { label: 'Insights', href: '/licensees-guide' },
            { label: 'Privacy', href: '/privacy' },
            { label: 'Contact', href: '/contact' },
          ],
        },
      ]}
      legal="Orange Jelly Limited"
    />
  );
}
