'use client';

import BackOfficeBand from '@/components/admin/BackOfficeBand';
import BackOfficeHero from '@/components/admin/BackOfficeHero';
import { Alert, Button } from '@/components/oj';

/**
 * The error boundary for a genuine data-layer exception.
 *
 * An invalid, expired or consumed token is NOT this: that outcome is rendered
 * by the page, not thrown. This boundary only catches the database being
 * unreachable and similar. It deliberately says nothing about the token: the
 * poll may or may not have been published, and guessing either way in the copy
 * would be a lie half the time.
 *
 * It opens the `<main>` landmark itself, for the same reason the page does:
 * `MainGate` hands the tool routes straight through without one, so the skip
 * link at the top of every page had nothing to land on here.
 */
export default function VerifyError({ reset }: { error: Error; reset: () => void }): JSX.Element {
  return (
    <main id="main-content">
      <BackOfficeHero eyebrow="confirm your email" title="something went wrong." />
      <BackOfficeBand tone="paper" divider={false}>
        <div className="max-w-xl space-y-6">
          <Alert tone="danger" title="That's at our end, not yours">
            Try the link from your email again in a minute.
          </Alert>

          <Button variant="ghost" size="md" type="button" onClick={reset}>
            Try again
          </Button>
        </div>
      </BackOfficeBand>
    </main>
  );
}
