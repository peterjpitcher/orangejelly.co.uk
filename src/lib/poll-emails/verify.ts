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

export interface VerifyEmailInput {
  organiserName: string;
  pollTitle: string;
  /**
   * Built by getAbsoluteUrl() at the call site and never concatenated from a
   * request header — a Host header is attacker-controlled, and this URL is the
   * one that decides whether a poll goes live.
   */
  verifyUrl: string;
}

/**
 * "Confirm your email to publish" — the first email a poll sends.
 *
 * It carries the verify link and nothing else. No participant link, no
 * organiser link: neither exists to the user until the poll is live, and the
 * recipient has not yet proved they own this address.
 *
 * No reply-to. There is genuinely nobody to reply to, and a reply-to pointing at
 * an unmonitored address is worse than none.
 */
export function buildVerifyEmail(input: VerifyEmailInput): BuiltEmail {
  const { organiserName, pollTitle, verifyUrl } = input;

  const subject = `Confirm your email to publish "${sanitiseSubjectValue(pollTitle)}"`;

  const text = wrapText(`Hi ${organiserName},

You've built a poll on Orange Jelly:

  ${pollTitle}

One step left. Confirm this is your email address and the poll goes live:

  ${verifyUrl}

This link works for 24 hours and once only. After that the poll is removed
and you'd need to build it again.

Once you confirm, you'll get two links: one to share with the people you're
inviting, and a private one for you.

Didn't build this poll? Ignore this email. Nothing goes live and nothing gets
sent to anyone until someone clicks that link.`);

  const html = wrapHtml(`  <p style="margin:0 0 16px;">Hi ${escapeHtml(organiserName)},</p>
  <p style="margin:0 0 16px;">You&rsquo;ve built a poll on Orange Jelly:</p>
  <p style="margin:0 0 24px;font-size:18px;font-weight:700;">${escapeHtml(pollTitle)}</p>
  <p style="margin:0 0 24px;">One step left. Confirm this is your email address and the poll goes live.</p>
  ${primaryButton(verifyUrl, 'Confirm and publish')}
  ${fallbackLink(verifyUrl, 'Button not working? Paste this into your browser:')}
  <p style="margin:0 0 16px;font-size:14px;">
    This link works for 24 hours and once only.
  </p>
  <p style="margin:0 0 16px;font-size:14px;">
    Once you confirm, you&rsquo;ll get two links: one to share with the people
    you&rsquo;re inviting, and a private one for you.
  </p>
  <p style="margin:0 0 16px;font-size:14px;color:${MUTED};">
    Didn&rsquo;t build this poll? Ignore this email. Nothing goes live and nothing
    gets sent to anyone until someone clicks that link.
  </p>`);

  return { subject, html, text };
}

export interface LinksEmailInput {
  organiserName: string;
  pollTitle: string;
  /** The link to share. Poll-level, not per-person. */
  participantUrl: string;
  /** The private link. This email and the digest and nudge are its only carriers. */
  organiserUrl: string;
}

/**
 * "Your poll is live" — sent the moment verification succeeds.
 *
 * The verify link is consumed on first use, so if the organiser's own click was
 * not the one that consumed it, this email is their only route back to the
 * private link. That makes it the load-bearing convenience: the verify page
 * shows both links on screen at the moment of verification, but this is the copy
 * that survives closing the tab. Its send failure is logged loudly.
 *
 * The two links sit under separate headings. That visual separation is the
 * control that stops an organiser forwarding the wrong one, and it is the same
 * separation the nudge uses.
 */
export function buildLinksEmail(input: LinksEmailInput): BuiltEmail {
  const { organiserName, pollTitle, participantUrl, organiserUrl } = input;

  const subject = `Your poll is live — "${sanitiseSubjectValue(pollTitle)}"`;

  const text = wrapText(`Hi ${organiserName},

Your poll is live:

  ${pollTitle}

Send this to the people you're inviting
--------------------------------------

  ${participantUrl}

Private — just for you
----------------------

  ${organiserUrl}

Anyone you send the private link to can close the poll, delete responses and
confirm the time. Keep it to yourself.

We'll email you when people respond — at most one message an hour, however
many people answer.

Keep this email. The private link is not recoverable from anywhere else.`);

  const html = wrapHtml(`  <p style="margin:0 0 16px;">Hi ${escapeHtml(organiserName)},</p>
  <p style="margin:0 0 8px;">Your poll is live:</p>
  <p style="margin:0 0 24px;font-size:18px;font-weight:700;">${escapeHtml(pollTitle)}</p>

  <p style="margin:0 0 8px;font-weight:700;">Send this to the people you&rsquo;re inviting</p>
  ${fallbackLink(participantUrl, 'Share this link however you normally would:')}

  <p style="margin:24px 0 8px;font-weight:700;">Private &mdash; just for you</p>
  ${primaryButton(organiserUrl, 'See the results')}
  ${fallbackLink(organiserUrl, 'Or paste this into your browser:')}
  <p style="margin:0 0 16px;font-size:14px;">
    Anyone you send the private link to can close the poll, delete responses and
    confirm the time. Keep it to yourself.
  </p>
  <p style="margin:0 0 16px;font-size:14px;color:${MUTED};">
    We&rsquo;ll email you when people respond &mdash; at most one message an hour,
    however many people answer.
  </p>
  <p style="margin:0 0 16px;font-size:13px;color:${MUTED};">
    Keep this email. The private link is not recoverable from anywhere else.
  </p>`);

  return { subject, html, text };
}
