import VoteForm from '@/components/polls/vote/vote-form';
import OptionResults from '@/components/polls/vote/option-results';
import PollHeader from '@/components/polls/vote/poll-header';
import PollPrivacyNotice from '@/components/polls/vote/privacy-notice';
import InviteeEmailsControl from '@/components/polls/vote/invitee-emails-control';
import { formatOptionLabel, type TallyCounts } from '@/components/polls/vote/poll-display';
import BackOfficeBand from '@/components/admin/BackOfficeBand';
import { Alert, Button } from '@/components/oj';
import { canVote } from '@/lib/poll-state';
import type { getVoteView } from '@/app/availability/p/poll-data';

/**
 * Screen 3, the participant vote, for both ways in: the shared link
 * (`/availability/p/<token>`) and an invited person's own link
 * (`/availability/i/<token>`). One screen so the two cannot drift.
 *
 * A Server Component. It renders the header and the privacy notice and hands the
 * options and tallies to <VoteForm />, which owns the answer state.
 */

export interface VoteScreenInvite {
  inviteToken: string;
  /** The address they were invited at, filled into the form. */
  email: string;
  /** Their edit link once they have answered; null until then. */
  answeredEditUrl: string | null;
  /** False once they have asked us to stop emailing them about this poll. */
  emailsOn: boolean;
}

export interface VoteScreenProps {
  view: NonNullable<Awaited<ReturnType<typeof getVoteView>>>;
  participantToken: string;
  invite?: VoteScreenInvite;
}

export default function VoteScreen({
  view,
  participantToken,
  invite,
}: VoteScreenProps): JSX.Element {
  const { poll, options, tallies, responderCount } = view;

  const tallyMap: Record<string, TallyCounts> = {};
  for (const tally of tallies) {
    tallyMap[tally.option_id] = { yes: tally.yes, if_need_be: tally.if_need_be, no: tally.no };
  }

  // `closes_at` is advisory (nothing flips `status` when it passes) so the
  // page has to apply the deadline itself, exactly as `submitResponse` does.
  const pastDeadline = Boolean(poll.closes_at && new Date(poll.closes_at).getTime() <= Date.now());
  const open = canVote(poll.status) && !pastDeadline;
  const alreadyAnswered = Boolean(invite?.answeredEditUrl);

  const confirmedOption = poll.confirmed_option_id
    ? options.find((option) => option.id === poll.confirmed_option_id)
    : undefined;

  return (
    // The poll's own title and details open on the ink hero, as every public
    // reading page does; the answering happens on the paper band below it.
    <main id="main-content">
      <PollHeader
        title={poll.title}
        organiserName={poll.organiser_name}
        description={poll.description}
        location={poll.location}
        agenda={poll.agenda}
      />

      <BackOfficeBand tone="paper" divider={false}>
        <div className="space-y-6">
          {/* The heading stays an <h2> inside the Alert rather than moving to the
            component's `title` prop, which renders a <p>: it is a real section
            heading under the poll title and a screen-reader user navigates by it. */}
          {poll.status === 'confirmed' && confirmedOption && (
            <Alert tone="ok" role="status">
              <h2 className="m-0 text-[19px] font-black leading-snug tracking-[-0.02em] text-oj-ink">
                Confirmed for {formatOptionLabel(confirmedOption, poll.option_kind)} UK time
              </h2>
              <p className="mt-1 text-oj-ink-2">This time is confirmed. The voting is done.</p>
            </Alert>
          )}

          {/* `closed` and a passed deadline read the same to a participant: replies
            are over and the organiser is deciding. The distinction between the two
            is the organiser's, and it is not this screen's to explain. */}
          {(poll.status === 'closed' || (pastDeadline && poll.status === 'open')) && (
            <Alert tone="info" role="status">
              <h2 className="m-0 text-[19px] font-black leading-snug tracking-[-0.02em] text-oj-ink">
                Voting has closed
              </h2>
              <p className="mt-1 text-oj-ink-2">{poll.organiser_name} is picking a time.</p>
            </Alert>
          )}

          {/* An invited person coming back to their own link after answering. One
            answer per person: they change it rather than add a second one. */}
          {open && alreadyAnswered && invite?.answeredEditUrl && (
            <Alert tone="ok" role="status">
              <h2 className="m-0 text-[19px] font-black leading-snug tracking-[-0.02em] text-oj-ink">
                You&rsquo;ve answered
              </h2>
              <p className="mt-1 text-oj-ink-2">
                Thanks. {poll.organiser_name} can see your answers.
              </p>
              <div className="mt-3">
                <Button variant="ghost" size="md" href={invite.answeredEditUrl}>
                  Change your answers
                </Button>
              </div>
            </Alert>
          )}

          {open && !alreadyAnswered && (
            <VoteForm
              participantToken={participantToken}
              optionKind={poll.option_kind}
              options={options}
              tallies={tallyMap}
              responderCount={responderCount}
              organiserName={poll.organiser_name}
              inviteToken={invite?.inviteToken}
              defaultEmail={invite?.email}
            />
          )}

          {(!open || alreadyAnswered) && (
            <OptionResults
              optionKind={poll.option_kind}
              options={options}
              tallies={tallyMap}
              responderCount={responderCount}
              confirmedOptionId={poll.confirmed_option_id}
            />
          )}

          {invite && (
            <InviteeEmailsControl inviteToken={invite.inviteToken} emailsOn={invite.emailsOn} />
          )}

          {(open || invite) && (
            <PollPrivacyNotice organiserName={poll.organiser_name} invited={Boolean(invite)} />
          )}
        </div>
      </BackOfficeBand>
    </main>
  );
}
