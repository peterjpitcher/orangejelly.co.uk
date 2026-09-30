import { escapeHtml } from '@/lib/email';
import { buildInviteePrivacyNoticeHtml, buildInviteePrivacyNoticeText } from './privacyNotice';
import {
  MUTED,
  fallbackLink,
  manageEmailsHtml,
  manageEmailsText,
  primaryButton,
  sanitiseSubjectValue,
  wrapHtml,
  wrapText,
  type BuiltEmail,
} from './shell';

export interface InvitationEmailInput {
  organiserName: string;
  pollTitle: string;
  description?: string | null;
  location?: string | null;
  /** Each option as prose, from formatOptionForEmail(). */
  optionLabels: string[];
  /** The organiser's deadline in words, when they set one. */
  deadlineLabel?: string | null;
  /** This person's own link, /availability/i/<invite_token>. */
  inviteUrl: string;
  /** Where "stop emails about this poll" lands, on their own poll page. */
  stopEmailsUrl: string;
  /** True for the one reminder, false for the first invitation. */
  isReminder?: boolean;
}

/**
 * "<Organiser> wants to find a time": the invitation a signed-in admin asked us
 * to send, and the one reminder that follows it.
 *
 * This is the only poll email that goes to an address the recipient did not give
 * us, so three things are load-bearing rather than polish:
 *  - it says plainly who asked and why they are getting it (the Article 14 notice
 *    below, and the first line);
 *  - it carries a visible way to stop, as well as the List-Unsubscribe header the
 *    sender adds;
 *  - reply-to is the organiser (set by the sender), so a reply reaches the person
 *    who knows them, not an unwatched mailbox.
 *
 * The link is personal: it fills in their address and marks them answered. It is
 * a capability like every poll link, so the email asks them not to forward it.
 */
export function buildInvitationEmail(input: InvitationEmailInput): BuiltEmail {
  const {
    organiserName,
    pollTitle,
    description,
    location,
    optionLabels,
    deadlineLabel,
    inviteUrl,
    stopEmailsUrl,
    isReminder = false,
  } = input;

  const subject = isReminder
    ? `Reminder: when can you make "${sanitiseSubjectValue(pollTitle)}"?`
    : `${sanitiseSubjectValue(organiserName)} wants to find a time for "${sanitiseSubjectValue(pollTitle)}"`;

  const opening = isReminder
    ? `A quick reminder: ${organiserName} is still waiting to hear which times work for you.`
    : `${organiserName} is arranging this and wants to know which times work for you.`;

  const deadlineText = deadlineLabel ? `\nPlease answer by ${deadlineLabel}.\n` : '';

  const text = wrapText(`Hi,

${opening}

  ${pollTitle}
${location ? `  ${location}\n` : ''}${description ? `\n${description}\n` : ''}
The times on offer:

${optionLabels.map((label) => `  - ${label}`).join('\n')}
${deadlineText}
Say which ones work for you. It takes a minute and there is no account to make:

  ${inviteUrl}

This link is yours, so please don't forward it. Reply to this email and it goes
to ${organiserName}.

${manageEmailsText(stopEmailsUrl)}

${buildInviteePrivacyNoticeText({ organiserName })}`);

  const html = wrapHtml(`  <p style="margin:0 0 16px;">Hi,</p>
  <p style="margin:0 0 16px;">${escapeHtml(opening)}</p>
  <p style="margin:0 0 ${location ? '4px' : '16px'};font-size:18px;font-weight:700;">${escapeHtml(pollTitle)}</p>
  ${location ? `<p style="margin:0 0 16px;color:${MUTED};">${escapeHtml(location)}</p>` : ''}
  ${description ? `<p style="margin:0 0 16px;">${escapeHtml(description)}</p>` : ''}
  <p style="margin:0 0 8px;font-weight:700;">The times on offer</p>
  <ul style="margin:0 0 16px;padding-left:20px;">
${optionLabels.map((label) => `    <li style="margin:0 0 4px;">${escapeHtml(label)}</li>`).join('\n')}
  </ul>
  ${deadlineLabel ? `<p style="margin:0 0 16px;font-weight:700;">Please answer by ${escapeHtml(deadlineLabel)}.</p>` : ''}
  <p style="margin:0 0 24px;">Say which ones work for you. It takes a minute and there is no account to make.</p>
  ${primaryButton(inviteUrl, 'Give your availability')}
  ${fallbackLink(inviteUrl, 'Button not working? Paste this into your browser:')}
  <p style="margin:0 0 16px;font-size:14px;">
    This link is yours, so please don&rsquo;t forward it. Reply to this email and it goes to
    ${escapeHtml(organiserName)}.
  </p>
  ${manageEmailsHtml(stopEmailsUrl)}
  ${buildInviteePrivacyNoticeHtml({ organiserName })}`);

  return { subject, html, text };
}
