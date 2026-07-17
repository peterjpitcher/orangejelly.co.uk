/**
 * Availability-poll email templates.
 *
 * Every builder returns { subject, html, text } and builds both parts from one
 * source of wording, so the two cannot drift. That is not tidiness: HTML-only
 * mail is the single strongest spam signal this feature could send, and poll
 * mail shares the auth.orangejelly.co.uk sender with Peter's other mail.
 *
 * Every user-supplied string is escaped on the way into the HTML. Poll titles,
 * organiser names, participant names, descriptions and locations are all
 * attacker-controlled.
 *
 * None of these functions sends anything. They build payloads; sendPollEmail and
 * sendPollEmails in src/lib/email.ts do the sending.
 */

export { formatOptionForEmail, formatOptionShortForSubject } from './formatOptionForEmail';
export type { OptionForEmail } from './formatOptionForEmail';

export { buildVerifyEmail, buildLinksEmail } from './verify';
export type { VerifyEmailInput, LinksEmailInput } from './verify';

export { buildDigestEmail } from './digest';
export type { DigestEmailInput, DigestOptionTally } from './digest';

export { buildConfirmEmail } from './confirm';
export type { ConfirmEmailInput } from './confirm';

export { buildNudgeEmail } from './nudge';
export type { NudgeEmailInput } from './nudge';

export { buildDeadlineReminderEmail } from './deadlineReminder';
export type { DeadlineReminderInput } from './deadlineReminder';

export {
  buildPrivacyNoticeHtml,
  buildPrivacyNoticeText,
  PRIVACY_NOTICE_HEADING,
  PRIVACY_POLICY_URL,
  PRIVACY_RIGHTS_EMAIL,
} from './privacyNotice';
export type { PrivacyNoticeInput } from './privacyNotice';

export { buildUnsubscribeHeaders } from './unsubscribe';

export type { BuiltEmail } from './shell';
