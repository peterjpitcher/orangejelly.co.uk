'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/oj';
import { clearSession, readSession } from '@/lib/admin-session';

/**
 * The bar across the top of the signed-in organiser screens, so you can move
 * between the dashboard, the polls list, a new poll and a poll's results without
 * editing the URL by hand.
 *
 * It renders ONLY when a session exists. That is what lets it sit safely on the
 * pages that are technically public but are really yours in practice: the create
 * form and a poll's organiser results. A signed-in organiser gets the nav; a
 * guest who followed a link sees nothing, so those pages stay clean for them.
 *
 * The session is only known on the client (localStorage), so the bar renders
 * nothing on the server and on first paint, then appears once mount confirms a
 * session. That avoids a hydration mismatch and a flash of the wrong nav.
 *
 * It is the public site's own Header rather than a bar of its own. This was the
 * last place still showing the navy bar and the OJ roundel the public pages
 * dropped on 31 August, and a second header component is how that happened: the
 * public one moved on and nothing told this one. Same cream bar, same logo at the
 * same size, same orange marker under the current item, same ink drawer on a
 * phone. Only the items and the action differ.
 */

/**
 * The horizontal logo at the public header's size. Exported for the signed-out
 * sign-in screen, which shows the bar with the logo and nothing else.
 */
export function BackOfficeLogo(): JSX.Element {
  // The same asset and size as the public header. See OjHeader in SiteChrome for
  // why it is next/image and why 44px.
  return (
    <Image
      src="/brand/logo-horizontal.png"
      alt="Orange Jelly"
      width={1200}
      height={260}
      priority
      className="h-11 w-auto"
    />
  );
}

interface NavItem {
  href: string;
  label: string;
  /** Treat as active when the path starts with this, not only on exact match. */
  matchPrefix?: boolean;
}

const ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/availability', label: 'Polls' },
  { href: '/availability/new', label: 'New poll' },
];

export default function AuthedNav(): JSX.Element | null {
  const pathname = usePathname();
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    setHasSession(Boolean(readSession()));
  }, [pathname]);

  // Render nothing until a session is confirmed on the client. Guests on the
  // public create/results pages therefore see no organiser chrome.
  if (!hasSession) return null;

  function isActive(item: NavItem): boolean {
    if (item.href === '/availability') {
      // "Polls" owns the dashboard but not the create page, which has its own item.
      return pathname === '/availability';
    }
    return item.matchPrefix ? pathname.startsWith(item.href) : pathname === item.href;
  }

  function handleSignOut(): void {
    clearSession();
    router.push('/admin');
    router.refresh();
  }

  return (
    <Header
      // The logo goes to the dashboard, not the marketing home page: from in here,
      // home is the back office.
      home="/admin"
      logo={<BackOfficeLogo />}
      items={ITEMS.map((item) => ({
        label: item.label,
        href: item.href,
        current: isActive(item),
      }))}
      cta={{ label: 'Sign out', onClick: handleSignOut, variant: 'ghost' }}
    />
  );
}
