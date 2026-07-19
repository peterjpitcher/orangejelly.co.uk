import type { Metadata } from 'next';
import PollsDashboard from './PollsDashboard';

// A signed-in surface listing organiser links: never for search engines.
export const metadata: Metadata = {
  title: 'Your polls | Orange Jelly',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AvailabilityDashboardPage(): JSX.Element {
  return <PollsDashboard />;
}
