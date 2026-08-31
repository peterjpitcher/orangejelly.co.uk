'use client';

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
    <main id="main-content" className="py-14 md:py-20">
      <div className="page-shell">
        <div className="mx-auto max-w-md space-y-6 text-center">
          <h1 className="text-[34px] font-black leading-tight tracking-[-0.02em] text-oj-ink">
            Something went wrong
          </h1>

          <Alert tone="danger" title="That's at our end, not yours" className="text-left">
            Try the link from your email again in a minute.
          </Alert>

          <Button variant="ghost" size="md" type="button" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </main>
  );
}
