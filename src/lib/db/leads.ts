import { randomUUID } from 'crypto';
import { dbQuery, isDatabaseConfigured } from './client';
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from './supabase-admin';
import { type LeadSourceInput } from '@/lib/lead-source';

type LeadOwnerType = 'contact' | 'newsletter_subscriber';

interface ContactLeadInput {
  name: string;
  email: string;
  phone?: string;
  pubName: string;
  package?: string;
  message: string;
  leadSource?: LeadSourceInput;
}

interface NewsletterSignupInput {
  email: string;
  leadSource?: LeadSourceInput;
}

interface ConversionEventInput {
  eventName: string;
  email?: string;
  ownerType?: LeadOwnerType;
  ownerId?: string;
  leadSource?: LeadSourceInput;
  properties?: Record<string, unknown>;
}

interface StoredResult {
  stored: boolean;
  id?: string;
  error?: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function cleanText(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function sourceValues(leadSource?: LeadSourceInput): Array<string | null> {
  return [
    cleanText(leadSource?.sourcePage),
    cleanText(leadSource?.landingPage),
    cleanText(leadSource?.referrer),
    cleanText(leadSource?.utmSource),
    cleanText(leadSource?.utmMedium),
    cleanText(leadSource?.utmCampaign),
    cleanText(leadSource?.utmTerm),
    cleanText(leadSource?.utmContent),
  ];
}

function sourceRecord(leadSource?: LeadSourceInput) {
  const [
    sourcePage,
    landingPage,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
  ] = sourceValues(leadSource);

  return {
    source_page: sourcePage,
    landing_page: landingPage,
    referrer,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_term: utmTerm,
    utm_content: utmContent,
  };
}

async function insertLeadSource(
  ownerType: LeadOwnerType | 'conversion_event',
  ownerId: string,
  leadSource?: LeadSourceInput
) {
  await dbQuery(
    `
      INSERT INTO lead_sources (
        id, owner_type, owner_id, source_page, landing_page, referrer,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
    [randomUUID(), ownerType, ownerId, ...sourceValues(leadSource)]
  );
}

async function insertSupabaseLeadSource(
  ownerType: LeadOwnerType | 'conversion_event',
  ownerId: string,
  leadSource?: LeadSourceInput
) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('lead_sources').insert({
    id: randomUUID(),
    owner_type: ownerType,
    owner_id: ownerId,
    ...sourceRecord(leadSource),
  });

  if (error) {
    throw error;
  }
}

async function insertConversionEvent({
  eventName,
  ownerType,
  ownerId,
  email,
  leadSource,
  properties = {},
}: {
  eventName: string;
  ownerType?: LeadOwnerType;
  ownerId?: string;
  email?: string;
  leadSource?: LeadSourceInput;
  properties?: Record<string, unknown>;
}): Promise<string> {
  const eventId = randomUUID();

  await dbQuery(
    `
      INSERT INTO conversion_events (
        id, event_name, owner_type, owner_id, email_normalized, source_page,
        landing_page, referrer, utm_source, utm_medium, utm_campaign,
        utm_term, utm_content, properties
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::jsonb)
    `,
    [
      eventId,
      eventName,
      ownerType ?? null,
      ownerId ?? null,
      email ? normalizeEmail(email) : null,
      ...sourceValues(leadSource),
      JSON.stringify(properties),
    ]
  );

  await insertLeadSource('conversion_event', eventId, leadSource);
  return eventId;
}

async function insertSupabaseConversionEvent({
  eventName,
  ownerType,
  ownerId,
  email,
  leadSource,
  properties = {},
}: {
  eventName: string;
  ownerType?: LeadOwnerType;
  ownerId?: string;
  email?: string;
  leadSource?: LeadSourceInput;
  properties?: Record<string, unknown>;
}): Promise<string> {
  const supabase = getSupabaseAdminClient();
  const eventId = randomUUID();
  const { error } = await supabase.from('conversion_events').insert({
    id: eventId,
    event_name: eventName,
    owner_type: ownerType ?? null,
    owner_id: ownerId ?? null,
    email_normalized: email ? normalizeEmail(email) : null,
    ...sourceRecord(leadSource),
    properties,
  });

  if (error) {
    throw error;
  }

  await insertSupabaseLeadSource('conversion_event', eventId, leadSource);
  return eventId;
}

async function storeNewsletterSignupWithSupabase({
  email,
  leadSource,
}: NewsletterSignupInput): Promise<StoredResult> {
  const supabase = getSupabaseAdminClient();
  const emailNormalized = normalizeEmail(email);
  const incomingSource = sourceRecord(leadSource);

  const existing = await supabase
    .from('newsletter_subscribers')
    .select(
      'id, source_page, landing_page, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content'
    )
    .eq('email_normalized', emailNormalized)
    .maybeSingle();

  if (existing.error) {
    throw existing.error;
  }

  const existingSubscriber = existing.data;
  let subscriberId = existingSubscriber?.id as string | undefined;
  if (subscriberId && existingSubscriber) {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({
        email: email.trim(),
        status: 'active',
        source_page: incomingSource.source_page ?? existingSubscriber.source_page,
        landing_page: incomingSource.landing_page ?? existingSubscriber.landing_page,
        referrer: incomingSource.referrer ?? existingSubscriber.referrer,
        utm_source: incomingSource.utm_source ?? existingSubscriber.utm_source,
        utm_medium: incomingSource.utm_medium ?? existingSubscriber.utm_medium,
        utm_campaign: incomingSource.utm_campaign ?? existingSubscriber.utm_campaign,
        utm_term: incomingSource.utm_term ?? existingSubscriber.utm_term,
        utm_content: incomingSource.utm_content ?? existingSubscriber.utm_content,
        updated_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
      })
      .eq('id', subscriberId);

    if (error) {
      throw error;
    }
  } else {
    subscriberId = randomUUID();
    const { error } = await supabase.from('newsletter_subscribers').insert({
      id: subscriberId,
      email: email.trim(),
      email_normalized: emailNormalized,
      status: 'active',
      ...incomingSource,
    });

    if (error) {
      throw error;
    }
  }

  await insertSupabaseLeadSource('newsletter_subscriber', subscriberId, leadSource);
  await insertSupabaseConversionEvent({
    eventName: 'newsletter_signup',
    ownerType: 'newsletter_subscriber',
    ownerId: subscriberId,
    email,
    leadSource,
  });

  return { stored: true, id: subscriberId };
}

async function storeContactLeadWithSupabase(data: ContactLeadInput): Promise<StoredResult> {
  const supabase = getSupabaseAdminClient();
  const id = randomUUID();

  const { error } = await supabase.from('contacts').insert({
    id,
    name: data.name.trim(),
    email: data.email.trim(),
    email_normalized: normalizeEmail(data.email),
    phone: cleanText(data.phone),
    pub_name: data.pubName.trim(),
    package_interest: cleanText(data.package),
    message: data.message.trim(),
    ...sourceRecord(data.leadSource),
  });

  if (error) {
    throw error;
  }

  await insertSupabaseLeadSource('contact', id, data.leadSource);
  await insertSupabaseConversionEvent({
    eventName: 'contact_submit',
    ownerType: 'contact',
    ownerId: id,
    email: data.email,
    leadSource: data.leadSource,
    properties: {
      package: cleanText(data.package),
    },
  });

  return { stored: true, id };
}

export async function storeNewsletterSignup({
  email,
  leadSource,
}: NewsletterSignupInput): Promise<StoredResult> {
  try {
    if (isSupabaseAdminConfigured()) {
      return await storeNewsletterSignupWithSupabase({ email, leadSource });
    }

    if (!isDatabaseConfigured()) {
      return { stored: false, error: 'Lead database is not configured.' };
    }

    const emailNormalized = normalizeEmail(email);
    const id = randomUUID();

    const result = await dbQuery<{ id: string }>(
      `
        INSERT INTO newsletter_subscribers (
          id, email, email_normalized, status, source_page, landing_page, referrer,
          utm_source, utm_medium, utm_campaign, utm_term, utm_content
        )
        VALUES ($1, $2, $3, 'active', $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (email_normalized)
        DO UPDATE SET
          email = EXCLUDED.email,
          status = 'active',
          source_page = COALESCE(EXCLUDED.source_page, newsletter_subscribers.source_page),
          landing_page = COALESCE(EXCLUDED.landing_page, newsletter_subscribers.landing_page),
          referrer = COALESCE(EXCLUDED.referrer, newsletter_subscribers.referrer),
          utm_source = COALESCE(EXCLUDED.utm_source, newsletter_subscribers.utm_source),
          utm_medium = COALESCE(EXCLUDED.utm_medium, newsletter_subscribers.utm_medium),
          utm_campaign = COALESCE(EXCLUDED.utm_campaign, newsletter_subscribers.utm_campaign),
          utm_term = COALESCE(EXCLUDED.utm_term, newsletter_subscribers.utm_term),
          utm_content = COALESCE(EXCLUDED.utm_content, newsletter_subscribers.utm_content),
          updated_at = now(),
          last_seen_at = now()
        RETURNING id
      `,
      [id, email.trim(), emailNormalized, ...sourceValues(leadSource)]
    );

    const subscriberId = result.rows[0].id;
    await insertLeadSource('newsletter_subscriber', subscriberId, leadSource);
    await insertConversionEvent({
      eventName: 'newsletter_signup',
      ownerType: 'newsletter_subscriber',
      ownerId: subscriberId,
      email,
      leadSource,
    });

    return { stored: true, id: subscriberId };
  } catch (error) {
    console.error('[db] Failed to store newsletter signup:', error);
    return { stored: false, error: 'Failed to store newsletter signup.' };
  }
}

export async function storeContactLead(data: ContactLeadInput): Promise<StoredResult> {
  try {
    if (isSupabaseAdminConfigured()) {
      return await storeContactLeadWithSupabase(data);
    }

    if (!isDatabaseConfigured()) {
      return { stored: false, error: 'Lead database is not configured.' };
    }

    const id = randomUUID();
    const emailNormalized = normalizeEmail(data.email);

    await dbQuery(
      `
        INSERT INTO contacts (
          id, name, email, email_normalized, phone, pub_name, package_interest,
          message, source_page, landing_page, referrer, utm_source, utm_medium,
          utm_campaign, utm_term, utm_content
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `,
      [
        id,
        data.name.trim(),
        data.email.trim(),
        emailNormalized,
        cleanText(data.phone),
        data.pubName.trim(),
        cleanText(data.package),
        data.message.trim(),
        ...sourceValues(data.leadSource),
      ]
    );

    await insertLeadSource('contact', id, data.leadSource);
    await insertConversionEvent({
      eventName: 'contact_submit',
      ownerType: 'contact',
      ownerId: id,
      email: data.email,
      leadSource: data.leadSource,
      properties: {
        package: cleanText(data.package),
      },
    });

    return { stored: true, id };
  } catch (error) {
    console.error('[db] Failed to store contact lead:', error);
    return { stored: false, error: 'Failed to store contact lead.' };
  }
}

export async function storeConversionEvent({
  eventName,
  email,
  ownerType,
  ownerId,
  leadSource,
  properties = {},
}: ConversionEventInput): Promise<StoredResult> {
  try {
    if (isSupabaseAdminConfigured()) {
      const id = await insertSupabaseConversionEvent({
        eventName,
        email,
        ownerType,
        ownerId,
        leadSource,
        properties,
      });
      return { stored: true, id };
    }

    if (!isDatabaseConfigured()) {
      return { stored: false, error: 'Lead database is not configured.' };
    }

    const id = await insertConversionEvent({
      eventName,
      email,
      ownerType,
      ownerId,
      leadSource,
      properties,
    });

    return { stored: true, id };
  } catch (error) {
    console.error('[db] Failed to store conversion event:', error);
    return { stored: false, error: 'Failed to store conversion event.' };
  }
}
