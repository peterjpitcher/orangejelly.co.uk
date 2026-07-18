import { Skeleton } from '@/components/ui/skeleton';

/**
 * The results page reads four tables before it can render a single cell, so a
 * blank screen is a real possibility on a cold connection. The shapes below
 * mirror the finished layout — heading, sub-line, summary card, matrix — so the
 * page does not visibly jump when the data lands.
 */
export default function OrganiserLoading(): JSX.Element {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <Skeleton className="h-9 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
