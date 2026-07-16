import type { Metadata } from 'next';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Button from '@/components/Button';

/**
 * ONE outcome for every dead poll link.
 *
 * Unknown, expired, consumed, deleted and draft all land here, and they all get
 * a byte-identical response with an HTTP 404. That is the whole point: these
 * tokens are bearer credentials with no login behind them, so any difference
 * between "no such poll" and "that poll isn't live yet" is an oracle telling a
 * guesser they guessed right. There is deliberately nothing here to tell the
 * causes apart — not the copy, not the status code, not the page title.
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
    <main className="mx-auto w-full max-w-2xl px-4 py-16">
      <div className="space-y-4">
        <Heading level={1}>This link isn&rsquo;t live</Heading>

        <Text color="muted">
          It might have expired, or the poll might have been removed. Polls are deleted 60 days
          after the last date on them.
        </Text>

        <Text color="muted">
          If someone sent you this link, ask them for a fresh one — they can see whether the poll is
          still running.
        </Text>

        <div className="pt-2">
          <Button href="/" variant="secondary" size="medium">
            Go to the Orange Jelly home page
          </Button>
        </div>
      </div>
    </main>
  );
}
