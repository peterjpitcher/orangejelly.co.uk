import { Resend } from 'resend';
import { scrubTokens } from './poll-tokens';
import { getBaseUrl } from './site-config';

/**
 * Escape user-supplied text before interpolating it into notification email HTML.
 * Prevents HTML/script injection via form fields.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface LeadNotification {
  subject: string;
  html: string;
  /** Plain-text alternative — improves deliverability and avoids spam filters. */
  text?: string;
  /** The enquirer's address, so a reply goes straight back to them. */
  replyTo?: string;
}

/**
 * Send a lead-notification email via Resend.
 *
 * Configuration comes from environment variables (see .env.example):
 *   RESEND_API_KEY             — Resend API key
 *   CONTACT_NOTIFICATION_EMAIL — where enquiries are delivered (defaults to peter@orangejelly.co.uk)
 *   CONTACT_FROM_EMAIL         — verified Resend sender (required to actually send)
 *
 * Returns `{ error }` (and logs) when delivery is not configured or fails. Callers treat
 * this as best-effort: the lead is already stored in Supabase, so a failed notification
 * must never turn a captured lead into a user-facing error.
 */
export async function sendLeadNotification({
  subject,
  html,
  text,
  replyTo,
}: LeadNotification): Promise<{ success?: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL || 'peter@orangejelly.co.uk';
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey) {
    console.error('[email] Lead notification NOT sent — RESEND_API_KEY is not set.');
    return { error: 'Email delivery is not configured (no API key).' };
  }
  if (!from) {
    console.error(
      '[email] Lead notification NOT sent — CONTACT_FROM_EMAIL is not set. It must be a sender on a Resend-verified domain.'
    );
    return { error: 'Email delivery is not configured (no from address).' };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({ from, to, subject, html, text, replyTo });
    if (error) {
      console.error('[email] Resend rejected the send:', JSON.stringify(error));
      return { error: 'Failed to send email.' };
    }
    console.info('[email] Lead notification sent', { id: data?.id, to });
    return { success: true };
  } catch (err) {
    console.error('[email] Unexpected error sending email:', err);
    return { error: 'Failed to send email.' };
  }
}

/* ------------------------------------------------------------------------- *
 * Availability-poll mail
 *
 * Kept separate from sendLeadNotification rather than folded into it. That
 * function resolves its recipient from CONTACT_NOTIFICATION_EMAIL and takes no
 * `to` at all — correct for a notification that only ever reaches Peter, and
 * exactly wrong for mail addressed to a third party. It also passes neither
 * attachments nor headers, both of which poll mail needs.
 * ------------------------------------------------------------------------- */

/** The only host poll mail may link to. See PRODUCTION_ONLY_REASON below. */
const PRODUCTION_BASE_URL = 'https://www.orangejelly.co.uk';

/** Display name applied when the configured sender is a bare address. */
const FROM_DISPLAY_NAME = 'Orange Jelly';

export interface PollEmail {
  /** Required, unlike LeadNotification — poll mail is addressed, never routed by env. */
  to: string;
  subject: string;
  html: string;
  /**
   * Required, deliberately. Commit ca016bd9 added a plain-text part to the
   * contact flow because HTML-only mail landed in spam. Making this non-optional
   * means the compiler enforces it rather than a reviewer.
   */
  text: string;
  replyTo?: string;
  /** `content` is base64. Used for the confirmation email's .ics. */
  attachments?: Array<{ filename: string; content: string }>;
  /** Passthrough for List-Unsubscribe and Outlook's Content-Class. */
  headers?: Record<string, string>;
}

/**
 * Resolve the sender, always with a display name.
 *
 * POLL_FROM_EMAIL exists so poll mail can be moved to its own verified domain
 * with one Vercel setting and no code change. It is unset in production, and
 * the CONTACT_FROM_EMAIL fallback — noreply@auth.orangejelly.co.uk — is the
 * intended path, not a degraded one.
 *
 * A bare address reads as machine mail to both filters and people, so one is
 * wrapped in a display name here rather than relying on whoever set the env var.
 */
function resolvePollSender(): string | undefined {
  const configured = (process.env.POLL_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL)?.trim();
  if (!configured) return undefined;

  return configured.includes('<') ? configured : `${FROM_DISPLAY_NAME} <${configured}>`;
}

/**
 * Send one availability-poll email via Resend.
 *
 * Best-effort, exactly like sendLeadNotification: the database write has already
 * committed by the time this is called, so a failed send returns `{ error }` and
 * logs. It must never throw and never undo a write.
 *
 * Configuration (see .env.example):
 *   RESEND_API_KEY     — Resend API key
 *   POLL_FROM_EMAIL    — optional; defaults to CONTACT_FROM_EMAIL
 *   CONTACT_FROM_EMAIL — the verified sender on auth.orangejelly.co.uk
 *
 * Every log line is scrubbed: the html and text bodies carry capability URLs,
 * and Resend echoes request detail back in its errors. An unscrubbed dump of one
 * would put a poll token in the logs, which is the one leak we control.
 */
export async function sendPollEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  attachments,
  headers,
}: PollEmail): Promise<{ success?: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = resolvePollSender();

  if (!apiKey) {
    console.error('[poll-email] Not sent — RESEND_API_KEY is not set.');
    return { error: 'Email delivery is not configured (no API key).' };
  }
  if (!from) {
    console.error(
      '[poll-email] Not sent — neither POLL_FROM_EMAIL nor CONTACT_FROM_EMAIL is set. It must be a sender on the Resend-verified auth.orangejelly.co.uk subdomain, or DKIM alignment fails and the mail lands in junk.'
    );
    return { error: 'Email delivery is not configured (no from address).' };
  }

  // PRODUCTION_ONLY_REASON: every link in the body is built by getAbsoluteUrl(),
  // which honours NEXT_PUBLIC_BASE_URL — localhost in dev, a preview host on a
  // branch deployment. A preview build must never put a preview link in a third
  // party's inbox, where it would be dead on arrival or worse. Refuse before
  // calling Resend rather than trusting that preview happens to lack a key.
  if (getBaseUrl() !== PRODUCTION_BASE_URL) {
    console.error(
      `[poll-email] Not sent — base URL is "${getBaseUrl()}", not the production host. Poll links would be unusable.`
    );
    return { error: 'Refusing to send: base URL is not the production host.' };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      replyTo,
      attachments,
      headers,
    });
    if (error) {
      console.error('[poll-email] Resend rejected the send:', scrubTokens(JSON.stringify(error)));
      return { error: 'Failed to send email.' };
    }
    // The recipient is not logged. Poll mail fans out to people whose addresses
    // §4.3's privacy notice promises we do not disclose; a log line naming one
    // undoes that. The Resend id is enough to trace a single send.
    console.info('[poll-email] Sent', { id: data?.id });
    return { success: true };
  } catch (err) {
    console.error('[poll-email] Unexpected error sending email:', scrubTokens(String(err)));
    return { error: 'Failed to send email.' };
  }
}

/**
 * Pacing between fan-out sends, in milliseconds.
 *
 * Resend's documented default is 2 requests per second. 600ms sits comfortably
 * inside that with headroom for the request's own round trip. A 20-person poll
 * therefore takes about twelve seconds, which fits inside the default Vercel
 * function timeout.
 */
export const POLL_EMAIL_SEND_INTERVAL_MS = 600;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fan out one email per recipient.
 *
 * Sequential and paced, not Promise.all. Firing a 20-person poll's confirmations
 * concurrently hits Resend's rate limit, and a 429 half-delivers the one email
 * that tells people the meeting is happening.
 *
 * One send per recipient, never one send with everyone in `to` — that would
 * disclose participants' addresses to each other. There is no bcc passthrough by
 * design.
 *
 * A per-recipient failure is counted and carried past, never rethrown: one bad
 * address must not stop the rest of the fan-out. Callers use the failure count
 * to tell the organiser who still needs telling by hand.
 */
export async function sendPollEmails(
  messages: PollEmail[]
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const [index, message] of messages.entries()) {
    try {
      const result = await sendPollEmail(message);
      if (result.error) {
        failed++;
      } else {
        sent++;
      }
    } catch (err) {
      // sendPollEmail catches its own failures, so reaching here means something
      // unforeseen. Count it and carry on regardless.
      failed++;
      console.error('[poll-email] Fan-out send threw:', scrubTokens(String(err)));
    }

    // No trailing delay after the last send — it would only add latency.
    if (index < messages.length - 1) {
      await sleep(POLL_EMAIL_SEND_INTERVAL_MS);
    }
  }

  return { sent, failed };
}
