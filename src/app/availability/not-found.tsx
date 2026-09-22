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
 * The anti-oracle property is the identical outcome, and it holds. THE STATUS IS
 * NOT PART OF IT, whatever this comment said before 5 September 2026. These
 * routes answer HTTP 200, not 404: `src/app/loading.tsx` sits at the app root,
 * so Next 14 wraps every route in a Suspense boundary and flushes the shell with
 * a 200 before the page runs, and a render-time `notFound()` cannot change a
 * status once the headers are sent. Every invalid token gets the same 200, so
 * nothing leaks, but do not reason about token enumeration on the basis of a 404
 * that is not there.
 *
 * Fixing it means a route-segment `loading.tsx` under `/availability`, or
 * narrowing the app-root one. Both are user-experience decisions rather than
 * security ones, and neither was made in the 5 September indexing release, which
 * fixed the same defect on `/results/[slug]`, `/growth-problems/[slug]` and
 * `/dev/components` where it cost search visibility. Recorded in
 * `tasks/gsc-indexing/SPEC.md` section 7.
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
