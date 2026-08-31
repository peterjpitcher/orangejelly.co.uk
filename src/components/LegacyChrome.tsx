'use client';

import { usePathname } from 'next/navigation';

import { OjFooter, OjHeader } from '@/components/oj';
import { isLegacyRoute } from '@/lib/legacy-routes';

/**
 * The header and footer for the pages that do not render their own.
 *
 * Fourteen pages are still on the pre-repositioning templates: the priced
 * `/ways-to-work` pages, `/capabilities`, the `/services` pages, the six pub
 * landing pages and the component gallery. They render page content only and
 * relied on the root layout for chrome, so they were the last place on the site
 * showing the old dark navy navigation, the old `OJ` roundel and the old body
 * typeface, with a nav offering "Ways to Work" and "Capabilities" and a footer
 * selling packages at published prices.
 *
 * They now get the same header and footer as everything else. That is a smaller
 * change than restyling fourteen page bodies and it fixes the part a visitor
 * actually reads first: the navigation they arrived into and the footer they leave
 * from. The bodies stay as they are, because phase 4 turns all but the gallery into
 * redirects and restyling a page due for deletion is work nobody gets back.
 *
 * The old `NavigationWrapper` and `FooterWrapper` are no longer rendered anywhere.
 * They are left in the tree for now because the legacy page bodies still import
 * pieces of the old component set, and removing them is a separate clear-out.
 */
export default function LegacyChrome({ slot }: { slot: 'header' | 'footer' }): JSX.Element | null {
  const pathname = usePathname();

  if (!isLegacyRoute(pathname)) return null;

  /*
   * Wrapped in `oj-root` because these two sit outside `MainGate`, which is what
   * carries the typeface everywhere else. Without it the new header rendered the
   * right logo and the right links in the old body face, which looks more broken
   * than the old header did. The page body below stays as it is: it is a legacy
   * template and phase 4 retires it.
   */
  return <div className="oj-root">{slot === 'header' ? <OjHeader /> : <OjFooter />}</div>;
}
