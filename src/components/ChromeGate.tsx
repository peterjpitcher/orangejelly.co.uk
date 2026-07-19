'use client';

import { usePathname } from 'next/navigation';

/**
 * Hides the marketing site chrome (the main nav and footer) on the organiser
 * tool and the poll pages.
 *
 * The tool is not the marketing site. Stacking the marketing nav (Home, Ways to
 * Work, Capabilities, and so on) on top of a poll's results makes two competing
 * navigations and a page that does not know what it is. On these routes the
 * organiser gets the AuthedNav instead, and a guest voting gets a clean, focused
 * page. Everywhere else the marketing chrome renders exactly as before.
 *
 * The children are still rendered on the server and handed in; this gate only
 * decides whether to show them, so the marketing site is untouched.
 */
export default function ChromeGate({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element | null {
  const pathname = usePathname();

  const isToolRoute = pathname === '/admin' || pathname.startsWith('/availability');
  if (isToolRoute) return null;

  return <>{children}</>;
}
