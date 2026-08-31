'use client';

import { usePathname } from 'next/navigation';

import { isLegacyRoute } from '@/lib/legacy-routes';

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
 *
 * The question is asked as "is this still a legacy page?" rather than as a list of
 * everything that opens its own main, for the reason set out in `legacy-routes.ts`:
 * the old form defaulted to opening a `<main>` for any path nobody had declared, and
 * `not-found.tsx` is served at whatever URL the visitor typed. So every 404 got one
 * main from here and a second from the page, which is the exact failure this file
 * exists to prevent, on the one page every stale link in the world lands on.
 *
 * The tool screens no longer need a branch of their own. They are not legacy, so
 * they fall through the same way the repositioned pages do, which is what they
 * always wanted: they open their own main in several places each.
 */
export default function MainGate({ children }: { children: React.ReactNode }): JSX.Element {
  const pathname = usePathname();

  if (!isLegacyRoute(pathname)) {
    /*
     * `oj-root` is the typeface scope, and this is the only place it goes on.
     *
     * The redesigned pages render their own header, main and footer, so there was
     * no single element around them to hang the new family on, and every one of
     * them inherited Open Sans from `<body>` instead. The wrapper is a plain block
     * that sets nothing but the font, so it does not disturb the sticky header or
     * any layout beneath it.
     *
     * It goes here rather than on `<body>` because the layout is a server component
     * with no pathname, and putting it there with an effect would repaint the whole
     * site in the old face on first load. See `.oj-root` in globals.css.
     */
    return <div className="oj-root">{children}</div>;
  }

  return (
    <main id="main-content" className="min-h-screen">
      {children}
    </main>
  );
}
