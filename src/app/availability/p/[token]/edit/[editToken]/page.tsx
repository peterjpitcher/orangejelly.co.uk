import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getEditView } from '../../../poll-data';
import EditAnswersForm from '@/components/polls/vote/edit-answers-form';
import PollHeader from '@/components/polls/vote/poll-header';
import { formatOptionLabel, type TallyCounts } from '@/components/polls/vote/poll-display';
import Text from '@/components/Text';
import { canEditResponse } from '@/lib/poll-state';

/**
 * Screen 3b — change my answers.
 *
 * TOKEN PRECEDENCE, AND IT IS THE THING TO GET RIGHT: the poll is resolved from
 * `[editToken]` ALONE (§1 P2.5). The `[token]` segment is decoration on the URL —
 * not compared, not looked up, not trusted. If the two disagree the page still
 * renders from the edit token, because only one of them is load-bearing and
 * there is no mismatch to detect once that is true.
 *
 * WHY THIS LIVES UNDER `/availability/p/` and not `/availability/e/`:
 * `src/lib/token-routes.ts` matches `^/availability/(p|o|verify)/` and is what
 * drives `Referrer-Policy: no-referrer` in `src/middleware.ts` and the
 * third-party script gate. An `/availability/e/` route would match neither, so
 * the edit token would ride out in the Referer header on every outbound click —
 * the exact leak that file exists to prevent. Both files are outside this
 * stream's ownership, so the route moved to where the protection already is.
 */
export const dynamic = 'force-dynamic';
// The edit form must prefill the participant's CURRENT answers, not a cached
// snapshot. See the organiser page for why force-dynamic alone is not enough.
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Change your answer',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

interface EditPageProps {
  params: { token: string; editToken: string };
}

export default async function EditPage({ params }: EditPageProps): Promise<JSX.Element> {
  const view = await getEditView(params.editToken);

  if (!view) {
    notFound();
  }

  const { poll, options, answers, attendance, tallies, responderCount, displayName } = view;

  const tallyMap: Record<string, TallyCounts> = {};
  for (const tally of tallies) {
    tallyMap[tally.option_id] = { yes: tally.yes, if_need_be: tally.if_need_be, no: tally.no };
  }

  const pastDeadline = Boolean(poll.closes_at && new Date(poll.closes_at).getTime() <= Date.now());
  const editable = canEditResponse(poll.status) && !pastDeadline;

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
          subline={
            editable
              ? `You're updating your answers. ${poll.organiser_name} will see the change straight away.`
              : undefined
          }
        />

        {poll.status === 'confirmed' && confirmedOption && (
          <div className="rounded-lg border-2 border-orange bg-orange-light p-4" role="status">
            <h2 className="text-lg font-semibold text-charcoal">
              Confirmed for {formatOptionLabel(confirmedOption, poll.option_kind)} UK time
            </h2>
            <Text size="sm" color="charcoal" className="mt-1">
              The time is picked, so answers are locked.
            </Text>
          </div>
        )}

        {(poll.status === 'closed' || (pastDeadline && poll.status === 'open')) && (
          <div className="rounded-lg border-2 border-charcoal bg-surface-alt p-4" role="status">
            <h2 className="text-lg font-semibold text-charcoal">
              This poll is closed, so answers are locked
            </h2>
            <Text size="sm" color="charcoal" className="mt-1">
              {poll.organiser_name} is picking a time.
            </Text>
          </div>
        )}

        {/* Locked or not, the same component renders the same answers — the
            read-only mode simply offers no way to change them, and drops the
            Update control entirely rather than disabling it (§1 P2.6).
            `updateResponse` re-reads `status` server-side regardless: a missing
            control is a courtesy, not a defence. */}
        <EditAnswersForm
          editToken={params.editToken}
          optionKind={poll.option_kind}
          options={options}
          tallies={tallyMap}
          responderCount={responderCount}
          initialAnswers={answers}
          initialAttendance={attendance}
          initialDisplayName={displayName}
          readOnly={!editable}
        />
      </div>
    </main>
  );
}
