import { escapeHtml } from '@/lib/email';
import {
  buildInviteePrivacyNoticeHtml,
  buildInviteePrivacyNoticeText,
  buildPrivacyNoticeHtml,
  buildPrivacyNoticeText,
} from './privacyNotice';
import {
  BRAND_BLUE,
  BRAND_ORANGE,
  BUTTON_LINE_HEIGHT_PX,
  BUTTON_VERTICAL_PADDING_PX,
  MUTED,
  sanitiseSubjectValue,
  wrapHtml,
  wrapText,
  type BuiltEmail,
} from './shell';

/**
 * Input for the confirmation email.
 *
 * NOTE WHAT IS ABSENT, DELIBERATELY: there is no organiserToken field, and there
 * must never be one. This is the only participant-facing template in the
 * feature, and "no organiser link in a participant email" is enforced here by
 * the type rather than by review. The poll record is never passed in whole; the
 * caller destructures the fields it needs at the call site. Widening this type
 * is how the private link ends up in twenty strangers' inboxes.
 */
export interface ConfirmEmailInput {
  /** The recipient's own name, for the greeting. Varies per recipient. */
  displayName: string;
  pollTitle: string;
  description: string | null;
  location: string | null;
  organiserName: string;
  /** Already prose, from formatOptionForEmail(). Carries the zone label. */
  whenInWords: string;
  /** Short form for the subject: 'Sat 4 Jul'. */
  whenShort: string;
  /** The poll page. Poll-level, so loop-invariant across the fan-out. */
  participantUrl: string;
  /** Built by the caller. No shorteners: a full www.orangejelly.co.uk URL. */
  googleUrl: string;
  outlookUrl: string;
  /**
   * False when the .ics build failed. The copy must not promise an attachment
   * that is not there: a calendar file that will not build must never suppress
   * the notification that the meeting is happening.
   */
  icsAttached: boolean;
  /**
   * The organiser's own copy. They typed their details into the create form and
   * were told what we do with them at verification, so the Article 13 notice is
   * dropped and the opening line changes. Everything else is identical.
   */
  isOrganiserCopy?: boolean;
  /**
   * Someone invited by email who never answered. We did not collect their
   * address from them, so they get the Article 14 notice, and the opening says
   * why they are hearing about a time they did not vote on. Peter's decision,
   * 30 September 2026: everyone invited is told the outcome.
   */
  isInviteeCopy?: boolean;
  /**
   * The organiser's copy only: whether this poll invited anyone by email, so
   * "who has been told" is described truthfully.
   */
  invitedByEmail?: boolean;
}

/**
 * "It's confirmed": the only email a participant ever gets.
 *
 * It fires only after a verified organiser confirms a time, and every address in
 * the set was typed by the person who owns it. Reply-to is the organiser: a
 * "can't make it after all" needs to reach a human, and they are the only human
 * involved.
 *
 * The time is rendered three times over: short in the subject, as full prose
 * with the zone named in the body, and as machine data in the .ics. That
 * redundancy is deliberate: the .ics is the thing that silently goes wrong, and
 * the words are what a person can sanity-check it against.
 */
export function buildConfirmEmail(input: ConfirmEmailInput): BuiltEmail {
  const {
    displayName,
    pollTitle,
    description,
    location,
    organiserName,
    whenInWords,
    whenShort,
    participantUrl,
    googleUrl,
    outlookUrl,
    icsAttached,
    isOrganiserCopy = false,
    isInviteeCopy = false,
    invitedByEmail = false,
  } = input;

  const subject = `Confirmed: "${sanitiseSubjectValue(pollTitle)}", ${whenShort}`;

  const opening = isOrganiserCopy
    ? invitedByEmail
      ? "You've confirmed the time. We've emailed everyone who answered and everyone you invited, apart from anyone who asked us to stop."
      : "You've confirmed the time. Everyone who gave us an email address has been told."
    : isInviteeCopy
      ? `It's confirmed. ${organiserName} invited you, so here is the time in case you can make it.`
      : "It's confirmed.";

  const greeting = displayName ? `Hi ${displayName},` : 'Hi,';

  const calendarLead = icsAttached
    ? "There's a calendar file attached. Open it and the time drops into your diary.\nOr use one of these:"
    : 'Add it to your calendar:';

  const textParts = [
    greeting,
    '',
    opening,
    '',
    `  ${pollTitle}`,
    `  ${whenInWords}`,
    ...(location ? [`  ${location}`] : []),
    '',
    ...(description ? [description, ''] : []),
    calendarLead,
    '',
    `  Google Calendar:  ${googleUrl}`,
    `  Outlook:          ${outlookUrl}`,
    '',
    'The poll page stays live and now shows the confirmed time:',
    '',
    `  ${participantUrl}`,
  ];

  if (!isOrganiserCopy) {
    textParts.push(
      '',
      `Can't make it after all? Reply to this email and it goes straight to`,
      `${organiserName}.`,
      '',
      isInviteeCopy
        ? buildInviteePrivacyNoticeText({ organiserName })
        : buildPrivacyNoticeText({ organiserName })
    );
  }

  const text = wrapText(textParts.join('\n'));

  const htmlCalendarLead = icsAttached
    ? `<p style="margin:0 0 16px;">
    There&rsquo;s a calendar file attached. Open it and the time drops into
    your diary. Or use one of these:
  </p>`
    : `<p style="margin:0 0 16px;">Add it to your calendar:</p>`;

  const htmlBody = `  <p style="margin:0 0 16px;">${escapeHtml(greeting)}</p>
  <p style="margin:0 0 24px;font-size:22px;font-weight:700;">${escapeHtml(opening)}</p>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0"
         style="width:100%;margin:0 0 24px;background:#ffffff;border-radius:8px;
                border-left:4px solid ${BRAND_ORANGE};">
    <tr>
      <td style="padding:20px;">
        <div style="font-size:18px;font-weight:700;margin:0 0 8px;">${escapeHtml(pollTitle)}</div>
        <div style="font-size:17px;font-weight:600;margin:0 0 4px;">${escapeHtml(whenInWords)}</div>
        ${location ? `<div style="font-size:15px;color:${MUTED};">${escapeHtml(location)}</div>` : ''}
      </td>
    </tr>
  </table>

  ${description ? `<p style="margin:0 0 24px;">${escapeHtml(description)}</p>` : ''}

  ${htmlCalendarLead}
  <p style="margin:0 0 24px;">
    <a href="${escapeHtml(googleUrl)}"
       style="display:inline-block;background:${BRAND_BLUE};color:#ffffff;text-decoration:none;
              padding:${BUTTON_VERTICAL_PADDING_PX}px 20px;border-radius:6px;font-weight:600;
              line-height:${BUTTON_LINE_HEIGHT_PX}px;margin:0 8px 8px 0;">Add to Google Calendar</a>
    <a href="${escapeHtml(outlookUrl)}"
       style="display:inline-block;background:${BRAND_BLUE};color:#ffffff;text-decoration:none;
              padding:${BUTTON_VERTICAL_PADDING_PX}px 20px;border-radius:6px;font-weight:600;
              line-height:${BUTTON_LINE_HEIGHT_PX}px;margin:0 8px 8px 0;">Add to Outlook</a>
  </p>

  <p style="margin:0 0 24px;font-size:14px;">
    The poll page stays live and now shows the confirmed time:<br>
    <a href="${escapeHtml(participantUrl)}" style="color:${BRAND_BLUE};word-break:break-all;">${escapeHtml(participantUrl)}</a>
  </p>`;

  const htmlTail = isOrganiserCopy
    ? ''
    : `
  <p style="margin:0 0 24px;font-size:14px;">
    Can&rsquo;t make it after all? Reply to this email and it goes straight to
    ${escapeHtml(organiserName)}.
  </p>

${isInviteeCopy ? buildInviteePrivacyNoticeHtml({ organiserName }) : buildPrivacyNoticeHtml({ organiserName })}`;

  return { subject, html: wrapHtml(`${htmlBody}${htmlTail}`), text };
}
