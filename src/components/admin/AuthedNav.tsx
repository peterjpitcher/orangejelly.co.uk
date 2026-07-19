'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession } from '@/lib/admin-session';

/**
 * The bar across the top of every signed-in screen, so the organiser can move
 * between the dashboard, the polls list and a new poll without editing the URL
 * by hand. It appears only on authed pages; the public poll pages (a
 * participant's ballot, a shared organiser link) never render it.
 *
 * Sign out clears the shared session and returns to the admin login, so it
 * behaves the same wherever the bar is shown.
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

export default function AuthedNav(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();

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
    <nav aria-label="Organiser navigation" className="border-b border-charcoal/10 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <ul className="flex flex-wrap items-center gap-1">
          {ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item) ? 'page' : undefined}
                className={
                  isActive(item)
                    ? 'inline-flex items-center rounded-md bg-orange/10 px-3 py-2 text-sm font-semibold text-orange'
                    : 'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal/5'
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
          className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-charcoal/70 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
