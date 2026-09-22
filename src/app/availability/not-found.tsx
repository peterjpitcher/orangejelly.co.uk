import type { Metadata } from 'next';
import BackOfficeBand from '@/components/admin/BackOfficeBand';
import BackOfficeHero from '@/components/admin/BackOfficeHero';
import { Button } from '@/components/oj';

/**
 * ONE outcome for every dead poll link.
 *
 * Unknown, expired, consumed, deleted and draft all land here, and they all get
 * a byte-identical response. That is the whole point: these tokens are bearer
 * credentials with no login behind them, so any difference between "no such
 * poll" and "that poll isn't live yet" is an oracle telling a guesser they
 * guessed right. There is deliberately nothing here to tell the causes apart:
 * not the copy, not the status code, not the page title.
 *
 * The anti-oracle property is the identical outcome, and it holds. Every dead link
 * answers HTTP 404, since 22 September 2026. Before that they all answered 200:
 * `src/app/loading.tsx` sat at the app root, Next 14 wrapped every route in its
 * Suspense boundary and sent the 200 headers before the page ran, and a
 * `notFound()` cannot change a status once the headers are sent. The root loading
 * screen now lives per page, on public pages only.
 *
 * The 404 depends on there being NO `loading.tsx` above the `notFound()` call,
 * here or at the app root. `o/[token]` keeps its skeleton by checking the token in
 * its own `layout.tsx`, which sits outside that skeleton's boundary.
 * `src/test/loading-boundaries.test.ts` fails if a boundary goes back above one.
 *
 * Next 14 sends a render-time 404 with an empty HTML body and draws this page from
 * the data that comes with it, so a visitor sees it once scripts run. The status
 * and the page are the same for every cause either way.
 *
 * Still reached via `notFound()` from the poll routes, and it must stay
 * `notFound()` rather than inline error copy, because that is what routes every
 * cause to this one page.
 *
 * This file covers everything under `/availability`, which is why it names no
 * screen in particular.
 */

export const metadata: Metadata = {
  title: 'This link is not live',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AvailabilityNotFound(): JSX.Element {
  return (
    /*
      The same shape as every other dead end under /availability, and as the
      public 404: the ink hero says what happened, the paper band says what to do.
      An EmptyState was tried here and is wrong for a whole page: it is a dashed
      block for a hole inside a screen.

      The hero's heading is a real `h1`. A 404 with no h1 gives a screen-reader
      user nothing to land on.
    */
    <main id="main-content">
      <BackOfficeHero eyebrow="availability poll" title="this link isn’t live." />
      <BackOfficeBand tone="paper" divider={false}>
        <div className="max-w-xl space-y-6">
          <div className="space-y-3 text-oj-ink-2">
            <p>
              It might have expired, or the poll might have been removed. Polls are deleted 60 days
              after the last date on them.
            </p>
            <p>
              If someone sent you this link, ask them for a fresh one. They can see whether the poll
              is still running.
            </p>
          </div>

          <Button href="/" variant="ghost">
            Go to the Orange Jelly home page
          </Button>
        </div>
      </BackOfficeBand>
    </main>
  );
}
