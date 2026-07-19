'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
 */

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
    <nav aria-label="Organiser navigation" className="bg-charcoal">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/availability"
          className="flex items-center gap-2 font-heading text-lg font-bold text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange text-sm text-white">
            OJ
          </span>
          <span className="hidden sm:inline">Orange Jelly</span>
        </Link>
        <ul className="flex flex-wrap items-center gap-1">
          {ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item) ? 'page' : undefined}
                className={
                  isActive(item)
                    ? 'inline-flex items-center rounded-md bg-white/15 px-3 py-2 text-sm font-semibold text-white'
                    : 'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white'
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
