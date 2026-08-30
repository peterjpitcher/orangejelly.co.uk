'use client';

import { usePathname } from 'next/navigation';

import { isOjRoute } from '@/lib/oj-routes';
import { isToolRoute } from '@/lib/tool-routes';

/**
 * Decides who owns the `<main>` landmark.
 *
 * The root layout has always wrapped its children in `<main id="main-content">`,
 * which is right for the legacy templates: they render page content and nothing
 * else. The repositioned pages render their own header and footer, so their content
 * cannot sit inside a main the layout opened before the header, and they declare
 * their own `<main>` instead.
 *
 * Without this gate the two nest, which is a real defect and an invisible one: two
 * main landmarks is a WCAG 1.3.1 failure, and a screen-reader user jumping to the
 * main region lands in the wrong place. The page-level axe sweep cannot see it
 * either, because it scans the page component and never the layout around it.
 *
 * Pages that opt out must carry `id="main-content"` themselves, or the skip link at
 * the top of every page stops working. `MainGate.test.tsx` holds that.
 */
export default function MainGate({ children }: { children: React.ReactNode }): JSX.Element {
  const pathname = usePathname();

  if (isOjRoute(pathname)) {
    return <>{children}</>;
  }

  /*
   * The organiser tool and the poll pages open their own main, in several places
   * each, because they render whole screens rather than page content. Opening one
   * here as well gave every one of them two main landmarks, which is the exact
   * 1.3.1 failure this component exists to prevent. ChromeGate already stands back
   * on these routes; this did not, and nothing noticed because the tool has no
   * page-level axe sweep.
   */
  if (isToolRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <main id="main-content" className="min-h-screen">
      {children}
    </main>
  );
}
