import { BLOCK_HEADING, CARD_ON_PAPER } from '@/components/admin/BackOfficeBand';
import CopyButton from '@/components/polls/copy-button';

/**
 * The participant link, ready to copy.
 *
 * Built from `polls.participant_token`, never the organiser's. The whole feature
 * turns on those two links being different: anyone holding the organiser link
 * can confirm the time, close the poll and delete responses.
 *
 * `select-all` rather than a copy button: a copy button needs JavaScript, a
 * clipboard permission and a success toast to be trustworthy, where one tap on
 * a `select-all` box does the same job on every browser with no client bundle.
 */

export interface ShareBlockProps {
  participantUrl: string;
  /**
   * The poll as one pasteable message: what it is, the times, the link, the
   * deadline. Built server-side by the page, because only the server holds the
   * options and the deadline. The bare link is for people who already know what
   * it is; this is for the ones who do not.
   */
  invitationText: string;
}

export default function ShareBlock({
  participantUrl,
  invitationText,
}: ShareBlockProps): JSX.Element {
  return (
    // The back office's raised block, on the paper results band.
    <section aria-labelledby="share-heading" className={CARD_ON_PAPER}>
      <h2 id="share-heading" className={`mb-1 text-lg ${BLOCK_HEADING}`}>
        Your team&rsquo;s link
      </h2>
      <p className="mb-3 text-sm text-oj-ink-2">
        Send this to anyone you still need an answer from.
      </p>
      {/* Paper inside the cream block, with the soft ink rule the create
          screen's link boxes use. */}
      <p className="select-all break-all rounded-oj border-1.5 border-oj-ink/20 bg-oj-paper p-3 font-mono text-sm text-oj-ink">
        {participantUrl}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <CopyButton text={participantUrl} label="Copy the link" />
        <CopyButton
          text={invitationText}
          label="Copy as an invitation"
          copiedLabel="Invitation copied"
        />
      </div>
      <p className="mt-2 text-sm text-oj-ink-2">
        The invitation is the whole message: what the meeting is, the times on offer, the link and
        the deadline, ready to paste into WhatsApp or an email.
      </p>
    </section>
  );
}
