'use client';

import * as React from 'react';

import { Alert, Band, Button, OjFooter, OjHeader } from '@/components/oj';

/**
 * The route error boundary.
 *
 * There was no `error.tsx` at all before this, which meant an uncaught render error
 * on any page fell through to Next's default: a blank screen in production with no
 * navigation, no way back, and nothing telling the person whether the problem was
 * theirs or ours.
 *
 * It does two things a default cannot. It reports the error, because an error
 * nobody hears about is one nobody fixes, and it gives a way out that is not the
 * browser's back button.
 *
 * `reset()` is offered first because a transient failure is the common case and
 * retrying costs nothing.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  React.useEffect(() => {
    // The digest is what ties this to the server log entry. Without it a report of
    // "it broke" cannot be matched to anything.
    console.error('[error boundary]', error.digest ?? '(no digest)', error);
  }, [error]);

  return (
    <>
      <OjHeader />

      <main id="main-content">
        <Band tone="page" size="lg" divider={false}>
          <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-orange-deep">
            something broke
          </p>
          <h1 className="oj-display mt-2.5 text-[clamp(36px,7vw,68px)] leading-[0.94] text-oj-ink">
            that is our fault, not yours.
          </h1>
          <p className="measure mt-5 text-[18px] leading-relaxed text-oj-ink-2">
            This page did not load properly. Trying again usually works, because most of these are
            momentary. If it does not, the rest of the site is fine and we would rather you told us.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button size="lg" arrow onClick={reset}>
              Try again
            </Button>
            <Button variant="ghost" href="/">
              Go to the homepage
            </Button>
          </div>

          {error.digest ? (
            <div className="measure mt-9">
              <Alert tone="info" title="If you get in touch, this helps">
                Quote reference <code className="font-oj font-bold">{error.digest}</code>. It is how
                we find what actually went wrong.
              </Alert>
            </div>
          ) : null}
        </Band>
      </main>

      <OjFooter />
    </>
  );
}
