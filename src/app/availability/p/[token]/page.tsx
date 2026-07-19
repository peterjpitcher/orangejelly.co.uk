import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVoteView } from '../poll-data';
import VoteForm from '@/components/polls/vote/vote-form';
import OptionResults from '@/components/polls/vote/option-results';
import PollHeader from '@/components/polls/vote/poll-header';
import PollPrivacyNotice from '@/components/polls/vote/privacy-notice';
import { formatOptionLabel, type TallyCounts } from '@/components/polls/vote/poll-display';
import Text from '@/components/Text';
import { canVote } from '@/lib/poll-state';

/**
 * Screen 3 — the participant vote.
 *
 * Server Component. Resolves the token, renders the header and the privacy
 * notice, and hands the options and tallies to <VoteForm />, which owns the
 * answer state.
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
  // renders `src/app/availability/not-found.tsx` with a real 404 — rendering
  // error copy inline would return 200 and make a soft-404 that tells a token
  // guesser they guessed right.
  if (!view) {
    notFound();
  }

  const { poll, options, tallies, responderCount } = view;

  const tallyMap: Record<string, TallyCounts> = {};
  for (const tally of tallies) {
    tallyMap[tally.option_id] = { yes: tally.yes, if_need_be: tally.if_need_be, no: tally.no };
  }

  // `closes_at` is advisory — nothing flips `status` when it passes — so the
  // page has to apply the deadline itself, exactly as `submitResponse` does.
  const pastDeadline = Boolean(poll.closes_at && new Date(poll.closes_at).getTime() <= Date.now());
  const open = canVote(poll.status) && !pastDeadline;

  const confirmedOption = poll.confirmed_option_id
    ? options.find((option) => option.id === poll.confirmed_option_id)
    : undefined;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="space-y-6">
        <PollHeader
          title={poll.title}
          organiserName={poll.organiser_name}
          description={poll.description}
          location={poll.location}
          agenda={poll.agenda}
        />

        {poll.status === 'confirmed' && confirmedOption && (
          <div className="rounded-lg border-2 border-orange bg-orange-light p-4" role="status">
            <h2 className="text-lg font-semibold text-charcoal">
              Confirmed for {formatOptionLabel(confirmedOption, poll.option_kind)} UK time
            </h2>
            <Text size="sm" color="charcoal" className="mt-1">
              This time is confirmed. The voting is done.
            </Text>
          </div>
        )}

        {/* `closed` and a passed deadline read the same to a participant: replies
            are over and the organiser is deciding. The distinction between the two
            is the organiser's, and it is not this screen's to explain. */}
        {(poll.status === 'closed' || (pastDeadline && poll.status === 'open')) && (
          <div className="rounded-lg border-2 border-charcoal bg-surface-alt p-4" role="status">
            <h2 className="text-lg font-semibold text-charcoal">Voting has closed</h2>
            <Text size="sm" color="charcoal" className="mt-1">
              {poll.organiser_name} is picking a time.
            </Text>
          </div>
        )}

        {open && (
          <>
            <VoteForm
              participantToken={params.token}
              optionKind={poll.option_kind}
              options={options}
              tallies={tallyMap}
              responderCount={responderCount}
              organiserName={poll.organiser_name}
            />
            <PollPrivacyNotice organiserName={poll.organiser_name} />
          </>
        )}

        {!open && (
          <OptionResults
            optionKind={poll.option_kind}
            options={options}
            tallies={tallyMap}
            responderCount={responderCount}
            confirmedOptionId={poll.confirmed_option_id}
          />
        )}
      </div>
    </main>
  );
}
