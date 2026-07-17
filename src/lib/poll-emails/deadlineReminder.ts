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

export interface DeadlineReminderInput {
  organiserName: string;
  pollTitle: string;
  /** The number who have answered, so the nudge says whether it is worth picking yet. */
  totalResponders: number;
  organiserUrl: string;
}

/**
 * "Your poll's deadline has passed, come and pick a time."
 *
 * This is the human step in the deadline flow, and the flow is deliberately
 * built around it. Nothing sends the invitation automatically: a machine that
 * confirmed the moment the clock struck would pick the wrong date on a tie, on a
 * thin turnout, or before the one person the meeting is for had voted, and
 * un-inviting people is worse than a nudge. So the deadline nudges the
 * organiser, once, and the organiser decides.
 *
 * It goes only to the organiser, at the address they verified, and carries the
 * private organiser link. No reply-to, and no participant address ever appears.
 *
 * The copy states the turnout plainly rather than cheerleading, because the
 * honest answer to "should I confirm now?" is sometimes "not yet, only two
 * people have replied", and the tool should help the organiser see that rather
 * than push them to close.
 */
export function buildDeadlineReminderEmail(input: DeadlineReminderInput): BuiltEmail {
  const { organiserName, pollTitle, totalResponders, organiserUrl } = input;

  const respondedPhrase =
    totalResponders === 0
      ? 'No one has answered yet'
      : totalResponders === 1
        ? '1 person has answered'
        : `${totalResponders} people have answered`;

  const subject = `Time to pick a time for "${sanitiseSubjectValue(pollTitle)}"`;

  const text = wrapText(`Hi ${organiserName},

The deadline you set for this poll has passed:

  ${pollTitle}

${respondedPhrase}. Nothing has been sent to anyone yet. When you're ready,
open the poll, pick the time that works best, and confirm it. Everyone who
answered then gets the calendar invite.

  ${organiserUrl}

That link is private to you. Anyone who has it can confirm the time, close the
poll and delete responses.

We won't send this reminder again. The poll stays open until you confirm or
close it, so there's no rush if you'd rather wait for a few more answers.`);

  const html = wrapHtml(`  <p style="margin:0 0 16px;">Hi ${escapeHtml(organiserName)},</p>
  <p style="margin:0 0 8px;font-size:18px;font-weight:700;">Time to pick a time</p>
  <p style="margin:0 0 24px;">
    The deadline you set for <strong>${escapeHtml(pollTitle)}</strong> has passed.
  </p>

  <p style="margin:0 0 24px;">
    ${escapeHtml(respondedPhrase)}. Nothing has gone out to anyone yet. When you&rsquo;re
    ready, open the poll, pick the time that works best, and confirm it &mdash; everyone who
    answered then gets the calendar invite.
  </p>

  ${primaryButton(organiserUrl, 'Pick a time')}
  ${fallbackLink(organiserUrl, 'Or paste this into your browser:')}
  <p style="margin:0 0 16px;font-size:14px;">
    That link is private to you. Anyone who has it can confirm the time, close the
    poll and delete responses.
  </p>
  <p style="margin:0 0 16px;font-size:14px;color:${MUTED};">
    We won&rsquo;t send this reminder again. The poll stays open until you confirm or close
    it, so there&rsquo;s no rush if you&rsquo;d rather wait for a few more answers.
  </p>`);

  return { subject, html, text };
}
