'use server';

import { type LeadSourceInput } from '@/lib/lead-source';
import { storeContactLead } from '@/lib/db/leads';
import { sendLeadNotification, escapeHtml } from '@/lib/email';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  pubName: string;
  package?: string;
  message: string;
  leadSource?: LeadSourceInput;
  website?: string;
}

function leadRows(data: ContactFormData): Array<[string, string]> {
  return (
    [
      ['Name', data.name],
      ['Email', data.email],
      ['Phone', data.phone],
      ['Venue', data.pubName],
      ['Package', data.package],
      ['Message', data.message],
      ['Source page', data.leadSource?.sourcePage],
    ] as Array<[string, string | undefined]>
  ).filter((entry): entry is [string, string] => Boolean(entry[1] && entry[1].trim()));
}

function buildLeadNotificationHtml(data: ContactFormData): string {
  return leadRows(data)
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
    .join('\n');
}

function buildLeadNotificationText(data: ContactFormData): string {
  return leadRows(data)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
}

export async function submitContactForm(
  data: ContactFormData
): Promise<{ success?: boolean; error?: string }> {
  if (data.website) {
    return { success: true };
  }

  // Validate required fields server-side
  if (!data.name || data.name.trim().length < 2) {
    return { error: 'Name must be at least 2 characters' };
  }
  if (!data.email || !data.email.includes('@')) {
    return { error: 'A valid email address is required' };
  }
  if (!data.pubName || data.pubName.trim().length < 2) {
    return { error: 'Venue name must be at least 2 characters' };
  }
  if (!data.message || data.message.trim().length < 10) {
    return { error: 'Message must be at least 10 characters' };
  }

  const result = await storeContactLead(data);
  if (!result.stored) {
    return { error: 'Something went wrong. Please try again or message Peter on WhatsApp.' };
  }

  // Best-effort alert: the lead is already captured in Supabase, so a failed or
  // unconfigured notification must never turn a stored lead into a user-facing error.
  try {
    const notification = await sendLeadNotification({
      subject: `New pub enquiry — ${data.pubName.replace(/[\r\n]+/g, ' ').trim()}`,
      html: buildLeadNotificationHtml(data),
      text: buildLeadNotificationText(data),
      replyTo: data.email,
    });
    if (notification.error) {
      console.error('[contact] Lead stored but notification not sent:', notification.error);
    }
  } catch (err) {
    console.error('[contact] Lead stored but notification threw:', err);
  }

  return { success: true };
}
