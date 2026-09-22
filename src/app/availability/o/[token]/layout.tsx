import { notFound } from 'next/navigation';
import { isLiveOrganiserToken } from '../organiser-data';

/**
 * The gate that lets a dead organiser link answer a real 404.
 *
 * `loading.tsx` beside this file is a Suspense boundary around the page, and Next
 * 14 sends the 200 headers as soon as everything outside a Suspense boundary is
 * ready. A `notFound()` inside it can only swap the screen, never the status. A
 * layout sits outside its own folder's `loading.tsx`, so checking the token here
 * decides the status before the skeleton streams, and the skeleton still covers
 * the four-table results read that follows.
 *
 * Unknown, expired and draft all fail here with the same `notFound()`, which
 * renders `availability/not-found.tsx`: one outcome, so a guesser learns nothing.
 * The page keeps its own check for a poll deleted between the two reads.
 */

// The poll's liveness must be read fresh on every request, for the reasons the
// page gives: the token must never key a cache entry, and the Data Cache outlives
// deploys.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface OrganiserGateProps {
  children: React.ReactNode;
  params: { token: string };
}

export default async function OrganiserGate({
  children,
  params,
}: OrganiserGateProps): Promise<JSX.Element> {
  if (!(await isLiveOrganiserToken(params.token))) {
    notFound();
  }

  return <>{children}</>;
}
