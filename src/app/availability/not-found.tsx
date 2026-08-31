import type { Metadata } from 'next';
import { Button } from '@/components/oj';

/**
 * ONE outcome for every dead poll link.
 *
 * Unknown, expired, consumed, deleted and draft all land here, and they all get
 * a byte-identical response with an HTTP 404. That is the whole point: these
 * tokens are bearer credentials with no login behind them, so any difference
 * between "no such poll" and "that poll isn't live yet" is an oracle telling a
 * guesser they guessed right. There is deliberately nothing here to tell the
 * causes apart: not the copy, not the status code, not the page title.
 *
 * Reached via `notFound()` from the poll routes. It must be `notFound()` and not
 * inline error copy: rendering a message returns 200, which is a soft-404 that
 * both leaks the distinction and invites indexing.
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
      The same centred column the two error boundaries under /availability use, so
      every dead end in this app is one shape. An EmptyState was tried here and is
      wrong for a whole page: it is a dashed block for a hole inside a screen, and
      run at the page measure it becomes an empty panel with a lost sentence in it.

      A real `h1`, not the EmptyState title, which renders as a paragraph. A 404
      with no h1 gives a screen-reader user nothing to land on.
    */
    <main id="main-content" className="py-14 md:py-20">
      <div className="page-shell">
        <div className="mx-auto max-w-md space-y-6 text-center">
          <h1 className="text-3xl font-black tracking-[-0.02em] text-oj-ink">
            This link isn&rsquo;t live
          </h1>

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
      </div>
    </main>
  );
}
