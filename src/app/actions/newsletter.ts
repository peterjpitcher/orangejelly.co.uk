'use server';

import { type LeadSourceInput } from '@/lib/lead-source';
import { storeNewsletterSignup } from '@/lib/db/leads';

interface NewsletterSignupData {
  email: string;
  leadSource?: LeadSourceInput;
  website?: string;
}

export async function subscribeToNewsletter(
  input: NewsletterSignupData | string
): Promise<{ success?: boolean; error?: string }> {
  const data = typeof input === 'string' ? { email: input } : input;

  if (data.website) {
    return { success: true };
  }

  if (!data.email || !data.email.includes('@')) {
    return { error: 'A valid email address is required' };
  }

  const result = await storeNewsletterSignup({
    email: data.email,
    leadSource: data.leadSource,
  });

  if (!result.stored) {
    return { error: 'Newsletter signup is not configured yet.' };
  }

  return { success: true };
}
