'use client';

import BackOfficeBand from '@/components/admin/BackOfficeBand';
import BackOfficeHero from '@/components/admin/BackOfficeHero';
import { Alert, Button } from '@/components/oj';

/**
 * The error boundary for a genuine data-layer exception.
 *
 * An invalid, expired or unknown organiser token is NOT this: that outcome is a
 * 404 from the page, not a throw. This boundary only catches the database being
 * unreachable and similar.
 *
 * It says nothing about the poll's state and nothing about the token, matching
 * the verify boundary: the poll is almost certainly fine, and this screen is the
 * wrong place to speculate. The copy the organiser needs is "try again", because
 * their results are still there.
 *
 * It opens its own `<main id="main-content">`, the way `availability/not-found`
 * does. The boundary replaces the page, so without it the skip link at the top of
 * every page has nothing to skip to.
 */
export default function OrganiserError({
  reset,
}: {
  error: Error;
  reset: () => void;
}): JSX.Element {
  return (
    <main id="main-content" className="min-h-screen bg-oj-paper">
      <BackOfficeHero eyebrow="poll results" title="something went wrong." />
      <BackOfficeBand tone="paper" divider={false}>
        <div className="max-w-xl space-y-6">
          <Alert tone="danger" title={<>That&apos;s at our end, not yours</>}>
            Your poll and everyone&apos;s answers are safe. Try again in a minute.
          </Alert>
          <Button variant="ghost" size="md" type="button" onClick={reset}>
            Try again
          </Button>
        </div>
      </BackOfficeBand>
    </main>
  );
}
