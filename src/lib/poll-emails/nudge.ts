import { escapeHtml } from '@/lib/email';
import {
  MUTED,
  fallbackLink,
  primaryButton,
  sanitiseSubjectValue,
  wrapHtml,
  wrapText,
  type BuiltEmail,
} from './shell';

export interface NudgeEmailInput {
  organiserName: string;
  pollTitle: string;
  /** How many people have responded at all. Zero is the commonest case here. */
  responderCount: number;
  /**
   * The leading option as prose, from formatOptionForEmail(), with its yes
   * count. Null when nobody has responded, or when no option has any yes or
   * if-need-be — "the best option right now is <undefined>" is the obvious crash
   * and this is where it is prevented.
   */
  bestOption: { label: string; yesCount: number } | null;
  participantUrl: string;
  organiserUrl: string;
}

/**
 * "A quick nudge" — sent to the ORGANISER, never to participants.
 *
 * WHY THE ORGANISER. The briefed email was meant to chase non-responders, and it
 * cannot exist: a poll_participants row only comes into being once someone has
 * responded, so "participants who have not responded" is an empty set at the
 * schema level. The alternative — an invitee list of addresses the organiser
 * types in — is the address book that turns this tool into an open relay. So the
 * nudge goes to the one person who has verified their address and can chase
 * people through channels they already have.
 *
 * Once per poll, ever. A tool that nudges twice is spam, and the organiser opted
 * into one poll, not a mailing list. Carries List-Unsubscribe (see unsubscribe.ts).
 */
export function buildNudgeEmail(input: NudgeEmailInput): BuiltEmail {
  const { organiserName, pollTitle, responderCount, bestOption, participantUrl, organiserUrl } =
    input;

  const subject = `A quick nudge — "${sanitiseSubjectValue(pollTitle)}" is still open`;

  const standingText =
    responderCount === 0 || !bestOption
      ? 'Nobody has responded yet.'
      : `${responderCount === 1 ? '1 person has' : `${responderCount} people have`} responded so far. The best option right now is\n${bestOption.label}, with ${bestOption.yesCount === 1 ? '1 yes' : `${bestOption.yesCount} yeses`}.`;

  const text = wrapText(`Hi ${organiserName},

Your poll has been quiet for a week:

  ${pollTitle}

${standingText}

Still waiting on people? Here's the link to send them:

  ${participantUrl}

Happy with what you've got? Confirm the time and everyone gets told:

  ${organiserUrl}

This is the only nudge we'll send about this poll.`);

  const standingHtml =
    responderCount === 0 || !bestOption
      ? `<p style="margin:0 0 24px;">Nobody has responded yet.</p>`
      : `<p style="margin:0 0 24px;">
    ${responderCount === 1 ? '1 person has' : `${responderCount} people have`} responded so far.
    The best option right now is <strong>${escapeHtml(bestOption.label)}</strong>, with
    ${bestOption.yesCount === 1 ? '1 yes' : `${bestOption.yesCount} yeses`}.
  </p>`;

  const html = wrapHtml(`  <p style="margin:0 0 16px;">Hi ${escapeHtml(organiserName)},</p>
  <p style="margin:0 0 8px;">Your poll has been quiet for a week:</p>
  <p style="margin:0 0 24px;font-size:18px;font-weight:700;">${escapeHtml(pollTitle)}</p>

  ${standingHtml}

  <p style="margin:0 0 8px;font-weight:700;">Send this to the people you&rsquo;re inviting</p>
  ${fallbackLink(participantUrl, 'Still waiting on people? This is the link to send them:')}

  <p style="margin:24px 0 8px;font-weight:700;">Private &mdash; just for you</p>
  <p style="margin:0 0 16px;">Happy with what you&rsquo;ve got? Confirm the time and everyone gets told.</p>
  ${primaryButton(organiserUrl, 'Confirm the time')}
  ${fallbackLink(organiserUrl, 'Or paste this into your browser:')}

  <p style="margin:0 0 16px;font-size:14px;color:${MUTED};">
    This is the only nudge we&rsquo;ll send about this poll.
  </p>`);

  return { subject, html, text };
}
