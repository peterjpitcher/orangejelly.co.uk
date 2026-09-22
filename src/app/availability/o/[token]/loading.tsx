import BackOfficeBand from '@/components/admin/BackOfficeBand';
import BackOfficeHero from '@/components/admin/BackOfficeHero';
import { Skeleton } from '@/components/oj';

/**
 * The results page reads four tables before it can render a single cell, so a
 * blank screen is a real possibility on a cold connection. The shapes below
 * mirror the finished layout (heading and sub-line, then the summary card and the
 * matrix) so the page does not visibly jump when the data lands.
 *
 * Three `Skeleton`s, one per block, and no more than that. Each one is its own
 * `role="status"` announcing "Loading", so a bar-per-element layout would make a
 * screen-reader user hear it once per rectangle.
 */
export default function OrganiserLoading(): JSX.Element {
  return (
    // The results page's own shape: its ink hero, then the paper band the
    // blocks will land on, so nothing jumps when the data arrives.
    <div className="min-h-screen bg-oj-paper">
      <BackOfficeHero eyebrow="poll results" title="one moment." />
      <BackOfficeBand tone="paper" divider={false}>
        <div className="space-y-8">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </BackOfficeBand>
    </div>
  );
}
