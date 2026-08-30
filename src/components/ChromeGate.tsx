'use client';

import { usePathname } from 'next/navigation';

import { isOjRoute } from '@/lib/oj-routes';
import { isToolRoute } from '@/lib/tool-routes';

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

  // Shared with MainGate. Written out twice, the two drifted and the tool ended up
  // with two main landmarks on every page.
  if (isToolRoute(pathname)) return null;

  // Repositioned pages carry their own header and footer. Rendering the legacy
  // chrome as well would stack two navigations on the most important pages on the
  // site, which is why the list lives in one place rather than in this condition.
  if (isOjRoute(pathname)) return null;

  return <>{children}</>;
}
