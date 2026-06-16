'use server';

import { type LeadSourceInput } from '@/lib/lead-source';
import { storeContactLead } from '@/lib/db/leads';

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

  return { success: true };
}
