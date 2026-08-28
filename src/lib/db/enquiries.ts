import { randomUUID } from 'crypto';

import { type LeadSourceInput } from '@/lib/lead-source';
import {
  type EnquiryStep1,
  type EnquiryStep2,
  QUALIFICATION_SCHEMA_VERSION,
  countCompletedFields,
  toQualificationPayload,
} from '@/lib/schemas/enquiry';

import { getSupabaseAdminClient, isSupabaseAdminConfigured } from './supabase-admin';

/**
 * The two-step enquiry write path.
 *
 * Step one writes the lead and returns its id. Step two is an UPDATE against that
 * id, which is what makes the whole thing idempotent for free: a double submit of
 * step two overwrites the same row rather than creating a second enquiry.
 *
 * ORDER MATTERS IN STEP ONE. The contact row is the authoritative success
 * condition, and it is written first and alone. Everything after it (lead source,
 * conversion event, notification) is retryable secondary work whose failure must
 * never reach the user. The existing contact flow writes them in sequence and can
 * therefore show an error after the row already exists, which invites a duplicate.
 *
 * @see tasks/repositioning/SUB-SPECS.md part 1.5
 */

export interface StoredEnquiry {
  stored: boolean;
  id?: string;
  error?: string;
}

function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Writes the enquiry. Returns as soon as the row is safely stored, because that is
 * the point past which the enquiry cannot be lost.
 */
export async function storeEnquiryStep1(
  input: EnquiryStep1,
  leadSource?: LeadSourceInput
): Promise<StoredEnquiry> {
  if (!isSupabaseAdminConfigured()) {
    return { stored: false, error: 'Enquiry storage is not configured.' };
  }

  const supabase = getSupabaseAdminClient();
  const id = randomUUID();

  const { error } = await supabase.from('contacts').insert({
    id,
    name: input.name,
    email: input.email,
    email_normalized: normaliseEmail(input.email),
    company: input.company,
    situation: input.situation,
    // pub_name and message lost their NOT NULL in the August migration but stay in
    // the table so the historic pub leads remain readable. They are not written.
    status: 'new',
    completed_step: 1,
    schema_version: QUALIFICATION_SCHEMA_VERSION,
    source_page: leadSource?.sourcePage,
    landing_page: leadSource?.landingPage,
    referrer: leadSource?.referrer,
    utm_source: leadSource?.utmSource,
    utm_medium: leadSource?.utmMedium,
    utm_campaign: leadSource?.utmCampaign,
    utm_term: leadSource?.utmTerm,
    utm_content: leadSource?.utmContent,
  });

  if (error) {
    return { stored: false, error: error.message };
  }

  return { stored: true, id };
}

/**
 * Enriches an existing enquiry with the optional answers.
 *
 * Scoped to rows still on step one, so a late or replayed submission cannot
 * overwrite a lead that has already been worked.
 */
export async function storeEnquiryStep2(
  leadId: string,
  input: EnquiryStep2
): Promise<StoredEnquiry> {
  if (!isSupabaseAdminConfigured()) {
    return { stored: false, error: 'Enquiry storage is not configured.' };
  }

  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from('contacts')
    .update({
      role: input.role || null,
      size_band: input.sizeBand || null,
      website: input.companyWebsite || null,
      qualification: toQualificationPayload(input),
      schema_version: QUALIFICATION_SCHEMA_VERSION,
      completed_step: 2,
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId)
    .eq('completed_step', 1);

  if (error) {
    return { stored: false, error: error.message };
  }

  return { stored: true, id: leadId };
}

export { countCompletedFields };
