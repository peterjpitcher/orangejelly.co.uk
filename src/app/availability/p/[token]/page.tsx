import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVoteView } from '../poll-data';
import VoteScreen from '@/components/polls/vote/vote-screen';

/**
 * Screen 3: the participant vote.
 *
 * Server Component. Resolves the token and renders <VoteScreen />, which the
 * invited person's own link (/availability/i/<token>) shares.
 *
 * `force-dynamic` because the counts must never be a stale cached number, and
 * because the token in the path must never key a cache entry.
 */
export const dynamic = 'force-dynamic';
// See the organiser page for the full story: supabase-js reads are cached in
// Next's Data Cache, which persists across deploys, so the live vote counts a
// participant sees could be stale. force-no-store keeps them current.
export const fetchCache = 'force-no-store';

/**
 * The token is a bearer credential sitting in the URL. Anything that indexes,
 * previews or archives this page is a leak of it, so nothing here is
 * discoverable. `Referrer-Policy: no-referrer` is applied by `src/middleware.ts`
 * via `isTokenRoute`, whose pattern already covers `/availability/p/`.
 */
export const metadata: Metadata = {
  title: 'Give your availability',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

interface VotePageProps {
  params: { token: string };
}

export default async function VotePage({ params }: VotePageProps): Promise<JSX.Element> {
  const view = await getVoteView(params.token);

  // ONE outcome for unknown, expired, deleted and draft alike. `notFound()`
  // renders `src/app/availability/not-found.tsx` with a real 404. Rendering
  // error copy inline would return 200 and make a soft-404 that tells a token
  // guesser they guessed right.
  if (!view) {
    notFound();
  }

  return <VoteScreen view={view} participantToken={params.token} />;
}
