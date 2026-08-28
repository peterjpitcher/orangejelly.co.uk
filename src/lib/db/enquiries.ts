import { randomUUID } from 'crypto';

import { type LeadSourceInput } from '@/lib/lead-source';
import {
  type EnquiryStep1,
  type EnquiryStep2,
  type LeadState,
  type QualificationPayload,
  QUALIFICATION_SCHEMA_VERSION,
  countCompletedFields,
  isLeadState,
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

/**
 * One enquiry as the admin view needs it.
 *
 * The qualification answers are the commercially sensitive half and are why this
 * lives behind auth rather than in the notification email.
 */
export interface AdminEnquiry {
  id: string;
  name: string;
  email: string;
  company: string | null;
  situation: string | null;
  role: string | null;
  sizeBand: string | null;
  website: string | null;
  qualification: QualificationPayload;
  status: LeadState;
  completedStep: number;
  sourcePage: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  createdAt: string;
  updatedAt: string;
  /** Historic pub-era fields. Read-only, and only ever populated on old rows. */
  legacy: { pubName: string | null; packageInterest: string | null; message: string | null };
}

const ADMIN_COLUMNS =
  'id, name, email, company, situation, role, size_band, website, qualification, status, ' +
  'completed_step, source_page, utm_source, utm_campaign, created_at, updated_at, ' +
  'pub_name, package_interest, message';

/* eslint-disable @typescript-eslint/no-explicit-any -- one row shape, mapped once. */
function toAdminEnquiry(row: any): AdminEnquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    situation: row.situation,
    role: row.role,
    sizeBand: row.size_band,
    website: row.website,
    qualification: (row.qualification ?? {}) as QualificationPayload,
    status: isLeadState(row.status) ? row.status : 'new',
    completedStep: row.completed_step ?? 1,
    sourcePage: row.source_page,
    utmSource: row.utm_source,
    utmCampaign: row.utm_campaign,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    legacy: {
      pubName: row.pub_name,
      packageInterest: row.package_interest,
      message: row.message,
    },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface ListEnquiriesOptions {
  status?: LeadState;
  limit?: number;
}

/** Newest first. Admin only: this returns every answer someone gave. */
export async function listEnquiries(
  options: ListEnquiriesOptions = {}
): Promise<{ enquiries: AdminEnquiry[]; error?: string }> {
  if (!isSupabaseAdminConfigured()) {
    return { enquiries: [], error: 'Enquiry storage is not configured.' };
  }

  const supabase = getSupabaseAdminClient();
  let query = supabase
    .from('contacts')
    .select(ADMIN_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(Math.min(options.limit ?? 50, 200));

  if (options.status) query = query.eq('status', options.status);

  const { data, error } = await query;
  if (error) return { enquiries: [], error: error.message };

  return { enquiries: (data ?? []).map(toAdminEnquiry) };
}

/**
 * Moves a lead along the pipeline.
 *
 * The state is validated here as well as by the database constraint. The
 * constraint is the guarantee; this is what turns a bad value into a useful
 * message instead of a 500.
 */
export async function setEnquiryStatus(leadId: string, status: LeadState): Promise<StoredEnquiry> {
  if (!isSupabaseAdminConfigured()) {
    return { stored: false, error: 'Enquiry storage is not configured.' };
  }
  if (!isLeadState(status)) {
    return { stored: false, error: 'Unknown lead state.' };
  }

  const supabase = getSupabaseAdminClient();
  // updated_at is maintained by a trigger, so it cannot be forgotten here. It is
  // what measures the 24-month retention window.
  const { error } = await supabase.from('contacts').update({ status }).eq('id', leadId);

  if (error) return { stored: false, error: error.message };
  return { stored: true, id: leadId };
}
