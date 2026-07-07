import { Resend } from 'resend';

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
