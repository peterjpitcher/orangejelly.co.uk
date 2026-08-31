import { Skeleton } from '@/components/oj';

/**
 * The streamed shell while verification runs.
 *
 * One Skeleton, not four bars: the component carries a single `role="status"`
 * with a "Loading" label and hides the placeholder blocks from assistive
 * technology, so a screen-reader user is told the page is loading once instead
 * of being read a wall of empty boxes.
 *
 * It opens the `<main>` landmark itself, matching the page and the error
 * boundary. `MainGate` hands the tool routes straight through without one.
 */
export default function VerifyLoading(): JSX.Element {
  return (
    <main id="main-content" className="py-14 md:py-20">
      <div className="page-shell">
        <div className="mx-auto max-w-md">
          <Skeleton variant="article" lines={3} />
        </div>
      </div>
    </main>
  );
}
