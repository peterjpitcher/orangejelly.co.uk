import { notFound } from 'next/navigation';
import { buildInvitationText } from '@/lib/poll-invitation';
import { formatOptionForEmail } from '@/lib/poll-emails/formatOptionForEmail';
import { formatSlotInLondon } from '@/lib/dateUtils';
import type { Metadata } from 'next';

import { Alert, Button, EmptyState } from '@/components/oj';
import AuthedNav from '@/components/admin/AuthedNav';
import BestOptionCard from '@/components/polls/organiser/best-option-card';
import ClosePollControl from '@/components/polls/organiser/close-poll-control';
import DeletePollControl from '@/components/polls/organiser/delete-poll-control';
import DeleteResponseControl from '@/components/polls/organiser/delete-response-control';
import ResultsLegend from '@/components/polls/organiser/results-legend';
import ResultsTable from '@/components/polls/organiser/results-table';
import ShareBlock from '@/components/polls/organiser/share-block';
import { optionFullLabel, replyCountLine } from '@/components/polls/organiser/results-display';
import { bestOption } from '@/lib/poll-aggregate';
import { getAbsoluteUrl } from '@/lib/site-config';
import { getOrganiserResults } from '../organiser-data';

/**
 * Screen 4: the organiser's results.
 *
 * A SERVER COMPONENT, and the matrix ships no JavaScript at all: at most 8
 * columns of read-only data does not need hydrating, and server-rendering means
 * the organiser sees results the instant the page paints. Only the controls that
 * need a dialogue or a pending state cross the client boundary.
 *
 * `force-dynamic` because results must never be a stale cached number, and
 * because the token in the path must never key a cache entry.
 */
export const dynamic = 'force-dynamic';
// `force-dynamic` alone was not enough. supabase-js reads through `fetch`, which
// Next.js caches in its Data Cache, and that cache PERSISTS ACROSS DEPLOYS on
// Vercel. The symptom: a freshly deployed results page kept serving a snapshot
// of the responses from an earlier moment (missing the latest voters) even on a
// CDN cache MISS, because the underlying Supabase read was served from the Data
// Cache. `force-no-store` opts every fetch on this route out of that cache, so
// the organiser always sees who has actually replied.
export const fetchCache = 'force-no-store';

/**
 * The confirm fan-out sends one email per recipient, paced at 600ms for Resend's
 * 2/second limit, about twelve seconds for a 20-person poll. Well inside the
 * default, but stated explicitly rather than left to depend on it.
 */
export const maxDuration = 60;

/**
 * The organiser token is a bearer credential sitting in the URL, and it is the
 * strongest one this feature issues: whoever holds it can confirm the time,
 * close the poll and delete every response. Anything that indexes, previews or
 * archives this page leaks it. `Referrer-Policy: no-referrer` is applied by
 * `src/middleware.ts` via `isTokenRoute`, whose pattern already covers
 * `/availability/o/`.
 */
export const metadata: Metadata = {
  title: 'Your poll results',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

interface OrganiserPageProps {
  params: { token: string };
}

export default async function OrganiserPage({ params }: OrganiserPageProps): Promise<JSX.Element> {
  const view = await getOrganiserResults(params.token);

  // ONE outcome for unknown, expired, deleted and draft alike. `notFound()`
  // renders a real 404; rendering error copy inline would return 200 and make a
  // soft-404 that tells a token guesser they guessed right.
  if (!view) {
    notFound();
  }

  const { poll, options, participants, responses, tallies, responderCount } = view;

  const participantUrl = getAbsoluteUrl(`/availability/p/${poll.participant_token}`);

  // The pasteable message the share block offers. Labels come from the same
  // formatter the emails use, so the invitation and the confirm email cannot
  // describe one option two ways.
  const invitationText = buildInvitationText({
    title: poll.title,
    organiserName: poll.organiser_name,
    description: poll.description ?? undefined,
    agenda: poll.agenda ?? undefined,
    location: poll.location ?? undefined,
    optionLabels: options.map((option) =>
      formatOptionForEmail({
        optionKind: poll.option_kind,
        optionDate: option.option_date,
        startsAt: option.starts_at,
        endsAt: option.ends_at,
      })
    ),
    participantUrl,
    deadlineLabel: poll.entries_close_at ? formatSlotInLondon(poll.entries_close_at) : undefined,
  });

  const best = bestOption(tallies);
  const hasReplies = participants.length > 0;

  const confirmedOption = poll.confirmed_option_id
    ? options.find((option) => option.id === poll.confirmed_option_id)
    : undefined;
  const isConfirmed = poll.status === 'confirmed' && Boolean(confirmedOption);

  // `bestOption` returns [] when no option has a single yes or if-need-be. That
  // is "no signal yet", not "no data", and badging all eight as joint winners
  // would be worse than badging none.
  const showBest = hasReplies && best.length > 0 && !isConfirmed;

  // Everybody said no to everything. The tool does not pretend otherwise, and it
  // does not overrule the organiser either: confirm stays available below.
  const showNothingWorks = hasReplies && best.length === 0 && !isConfirmed;

  return (
    <>
      {/* Shows only when you are signed in, so you can get back to your polls
          rather than being stranded on your own results page. Invisible to a
          guest who followed the link. */}
      <AuthedNav />
      {/* Rendered outside <Section>: Section.tsx applies `overflow-hidden`, which
          would clip the sticky headers and kill the horizontal scroll. */}
      <main id="main-content" className="min-h-screen bg-oj-paper py-8">
        {/*
        One column, in flow. This was a 2fr/1fr grid with the card in the right
        column, which floated it as an island beside a near-empty header column:
        a short title, a reply count, and a page of whitespace underneath. The
        card caps its own width instead, so it reads as the next thing to look
        at rather than furniture parked beside nothing.
      */}
        <div className="page-shell">
          <div>
            {/* Sentence case and no `.oj-display`: this is a tool screen, and the
                heading is somebody's poll title rather than a marketing line. */}
            <h1 className="text-3xl font-black tracking-[-0.02em] text-oj-ink">{poll.title}</h1>
            <p className="mt-2 text-oj-ink-2">{replyCountLine(responderCount)}</p>

            {poll.status === 'closed' && (
              <Alert tone="info" role="status" className="mt-4" title="Closed">
                Nobody can vote or change their answer.
              </Alert>
            )}

            {isConfirmed && confirmedOption && (
              <Alert
                tone="ok"
                role="status"
                className="mt-4"
                title={<>You&rsquo;ve picked a time</>}
              >
                Confirmed for{' '}
                {poll.option_kind === 'slots'
                  ? `${optionFullLabel(confirmedOption, poll.option_kind)} UK time`
                  : optionFullLabel(confirmedOption, poll.option_kind)}
                . If it falls through, tell people yourself and build a fresh poll. We won&rsquo;t
                quietly move a date that&rsquo;s already in their calendar.
              </Alert>
            )}

            {/* The count, and nothing else. `confirm_notify_failures` is an
              integer: we deliberately do not keep the addresses the fan-out
              could not reach, so there is no list to render and no copyable
              block of addresses to offer. */}
            {isConfirmed && poll.confirm_notify_failures > 0 && (
              <Alert tone="info" role="status" className="mt-4">
                We couldn&rsquo;t reach {poll.confirm_notify_failures}{' '}
                {poll.confirm_notify_failures === 1 ? 'person' : 'people'} with the confirmation.
                Tell them yourself if you can.
              </Alert>
            )}

            {showNothingWorks && (
              <Alert
                tone="info"
                role="status"
                className="mt-4"
                title="Nothing here works for anyone"
              >
                Build a fresh poll with different times.
              </Alert>
            )}
          </div>

          {showBest && (
            <div className="max-w-xl">
              <BestOptionCard
                organiserToken={params.token}
                optionKind={poll.option_kind}
                best={best}
                options={options}
                responderCount={responderCount}
              />
            </div>
          )}

          {isConfirmed && (
            <div className="mt-6">
              {/* There is no un-confirm control, and there will not be one:
                twenty people already hold the date. A fresh poll is the honest
                route. */}
              <Button variant="ghost" size="md" href="/availability/new">
                Build a fresh poll
              </Button>
            </div>
          )}
        </div>

        <div className="page-shell mt-8 space-y-6">
          {/* The share block renders above the matrix in EVERY state: the empty
            state is precisely when the organiser needs this link most. */}
          <ShareBlock participantUrl={participantUrl} invitationText={invitationText} />

          {hasReplies ? (
            <>
              <ResultsTable
                optionKind={poll.option_kind}
                options={options}
                participants={participants}
                responses={responses}
                attendance={view.attendance}
                tallies={tallies}
                confirmedOptionId={poll.confirmed_option_id}
              />
              <ResultsLegend />

              {/* Not rendered once confirmed: the matrix is a read-only record
                from that point, and `deleteResponse` refuses server-side too. */}
              {!isConfirmed && (
                <section
                  aria-labelledby="remove-heading"
                  className="border-t-1.5 border-oj-ink/20 pt-6"
                >
                  <h2
                    id="remove-heading"
                    className="text-lg font-black tracking-[-0.02em] text-oj-ink"
                  >
                    Remove someone&rsquo;s answers
                  </h2>
                  <p className="mt-1 text-sm text-oj-ink-2">
                    Deletes them and everything they answered. They can vote again with your
                    team&rsquo;s link.
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {participants.map((participant) => (
                      // Cream needs a rule to exist. Cream on paper is 1.05:1,
                      // so a borderless chip is not a quiet chip, it is no chip
                      // at all: the name floats loose beside a bordered button.
                      // The soft ink rule is the same treatment the create
                      // screen's unselected slots use, and it stays out of the
                      // way of the ghost button's full-strength ink border.
                      <li
                        key={participant.id}
                        className="flex items-center gap-2 rounded-oj border-1.5 border-oj-ink/20 bg-oj-cream px-2 py-1"
                      >
                        <span className="pl-1 text-sm font-semibold text-oj-ink">
                          {participant.display_name}
                        </span>
                        <DeleteResponseControl
                          organiserToken={params.token}
                          participantId={participant.id}
                          displayName={participant.display_name}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          ) : (
            // Never an empty <tbody> with sticky headers: that is a confusing
            // artefact, not an empty state.
            <div>
              {/* The heading stays outside the EmptyState, which renders its own
                  title as a paragraph. That is right for a block on a page that
                  already has an h1, and it is right here too: this is a real
                  section of the page and wants a real h2. */}
              <h2 className="mb-4 text-center text-xl font-black tracking-[-0.02em] text-oj-ink">
                Nobody has voted yet
              </h2>
              <EmptyState
                glyph="0"
                body="Here’s your participant link again, and a nudge is usually all it takes."
              />
            </div>
          )}

          <div className="flex flex-col gap-4 border-t-1.5 border-oj-ink/20 pt-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Confirm stays available on a closed poll, so closing stays
              reversible and non-destructive. */}
            {!isConfirmed && (
              <ClosePollControl organiserToken={params.token} isOpen={poll.status === 'open'} />
            )}
            <DeletePollControl organiserToken={params.token} pollTitle={poll.title} />
          </div>
        </div>
      </main>
    </>
  );
}
