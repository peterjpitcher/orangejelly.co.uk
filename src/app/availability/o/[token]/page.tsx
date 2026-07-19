import { notFound } from 'next/navigation';
import { buildInvitationText } from '@/lib/poll-invitation';
import { formatOptionForEmail } from '@/lib/poll-emails/formatOptionForEmail';
import { formatSlotInLondon } from '@/lib/dateUtils';
import type { Metadata } from 'next';

import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
 * Screen 4 — the organiser's results.
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
 * 2/second limit — about twelve seconds for a 20-person poll. Well inside the
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
  // is "no signal yet", not "no data" — and badging all eight as joint winners
  // would be worse than badging none.
  const showBest = hasReplies && best.length > 0 && !isConfirmed;

  // Everybody said no to everything. The tool does not pretend otherwise, and it
  // does not overrule the organiser either — confirm stays available below.
  const showNothingWorks = hasReplies && best.length === 0 && !isConfirmed;

  return (
    <>
      {/* Shows only when you are signed in, so you can get back to your polls
          rather than being stranded on your own results page. Invisible to a
          guest who followed the link. */}
      <AuthedNav />
      {/* Rendered outside <Section>: Section.tsx applies `overflow-hidden`, which
          would clip the sticky headers and kill the horizontal scroll. */}
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {/*
        One column, in flow. This was a 2fr/1fr grid with the card in the right
        column, which floated it as an island beside a near-empty header column:
        a short title, a reply count, and a page of whitespace underneath. The
        card caps its own width instead, so it reads as the next thing to look
        at rather than furniture parked beside nothing.
      */}
        <div>
          <div>
            <Heading level={1}>{poll.title}</Heading>
            <Text color="muted" className="mt-2">
              {replyCountLine(responderCount)}
            </Text>

            {poll.status === 'closed' && (
              <Alert
                variant="default"
                role="status"
                className="mt-4 border-charcoal bg-surface-alt"
              >
                <AlertTitle>Closed</AlertTitle>
                <AlertDescription>Nobody can vote or change their answer.</AlertDescription>
              </Alert>
            )}

            {isConfirmed && confirmedOption && (
              <Alert
                variant="default"
                role="status"
                className="mt-4 border-orange bg-orange-light text-charcoal"
              >
                <AlertTitle>You&rsquo;ve picked a time</AlertTitle>
                <AlertDescription>
                  Confirmed for{' '}
                  {poll.option_kind === 'slots'
                    ? `${optionFullLabel(confirmedOption, poll.option_kind)} UK time`
                    : optionFullLabel(confirmedOption, poll.option_kind)}
                  . If it falls through, tell people yourself and build a fresh poll — we
                  won&rsquo;t quietly move a date that&rsquo;s already in their calendar.
                </AlertDescription>
              </Alert>
            )}

            {/* The count, and nothing else. `confirm_notify_failures` is an
              integer: we deliberately do not keep the addresses the fan-out
              could not reach, so there is no list to render and no copyable
              block of addresses to offer. */}
            {isConfirmed && poll.confirm_notify_failures > 0 && (
              <Alert
                variant="default"
                role="status"
                className="mt-4 border-charcoal bg-surface-alt"
              >
                <AlertDescription>
                  We couldn&rsquo;t reach {poll.confirm_notify_failures}{' '}
                  {poll.confirm_notify_failures === 1 ? 'person' : 'people'} with the confirmation.
                  Tell them yourself if you can.
                </AlertDescription>
              </Alert>
            )}

            {showNothingWorks && (
              <Alert
                variant="default"
                role="status"
                className="mt-4 border-charcoal bg-surface-alt"
              >
                <AlertTitle>Nothing here works for anyone</AlertTitle>
                <AlertDescription>Build a fresh poll with different times.</AlertDescription>
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
              <Button variant="outline" size="medium" href="/availability/new">
                Build a fresh poll
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-6">
          {/* The share block renders above the matrix in EVERY state — the empty
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
                <section aria-labelledby="remove-heading" className="border-t border-border pt-6">
                  <h2 id="remove-heading" className="text-base font-semibold text-charcoal">
                    Remove someone&rsquo;s answers
                  </h2>
                  <Text size="sm" color="muted" className="mt-1">
                    Deletes them and everything they answered. They can vote again with your
                    team&rsquo;s link.
                  </Text>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {participants.map((participant) => (
                      <li
                        key={participant.id}
                        className="flex items-center gap-1 rounded-md border border-charcoal/15 px-2"
                      >
                        <span className="text-sm text-charcoal">{participant.display_name}</span>
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
            // Never an empty <tbody> with sticky headers — that is a confusing
            // artefact, not an empty state.
            <Card variant="bordered" padding="large" className="text-center">
              <Heading level={2} align="center" className="text-xl">
                Nobody has voted yet
              </Heading>
              <Text align="center" color="muted" className="mt-2">
                Here&rsquo;s your participant link again, and a nudge is usually all it takes.
              </Text>
            </Card>
          )}

          <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-start sm:justify-between">
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
