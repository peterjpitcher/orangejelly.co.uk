import BackOfficeBand from '@/components/admin/BackOfficeBand';
import BackOfficeHero from '@/components/admin/BackOfficeHero';
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
    // The same ink hero the outcome opens on, so the page does not jump from
    // paper to ink when verification lands.
    <main id="main-content">
      <BackOfficeHero eyebrow="confirm your email" title="one moment." />
      <BackOfficeBand tone="paper" divider={false}>
        <div className="max-w-xl">
          <Skeleton variant="article" lines={3} />
        </div>
      </BackOfficeBand>
    </main>
  );
}
