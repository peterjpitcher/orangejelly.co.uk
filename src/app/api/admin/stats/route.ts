import { NextResponse } from 'next/server';

import { getAllowedAdminEmails, isAllowedAdmin } from '@/lib/admin-auth';
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from '@/lib/db/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type EventRow = {
  event_name: string;
  source_page: string | null;
  landing_page: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  properties: Record<string, unknown> | null;
  created_at: string;
};

type CountRow = {
  label: string;
  count: number;
};

type LeadDataTable = 'contacts' | 'newsletter_subscribers' | 'conversion_events';

function increment(map: Map<string, number>, key?: string | null) {
  const normalized = key?.trim() || 'Unknown';
  map.set(normalized, (map.get(normalized) || 0) + 1);
}

function toRows(map: Map<string, number>, limit = 10): CountRow[] {
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

async function countTable(table: LeadDataTable, since?: string): Promise<number> {
  const supabase = getSupabaseAdminClient();
  const query = supabase.from(table).select('id', { count: 'exact', head: true });
  const { count, error } = since ? await query.gte('created_at', since) : await query;
  if (error) throw error;
  return count || 0;
}

export async function GET(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 });
  }

  const allowedEmails = getAllowedAdminEmails();
  if (allowedEmails.length === 0) {
    return NextResponse.json(
      { error: 'Admin email allowlist is not configured.' },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  if (!isAllowedAdmin(authData.user.email, allowedEmails)) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  }

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    totalContacts,
    totalSubscribers,
    totalEvents,
    contacts30d,
    subscribers30d,
    events30d,
    recentContacts,
    recentSubscribers,
    eventRows,
  ] = await Promise.all([
    countTable('contacts'),
    countTable('newsletter_subscribers'),
    countTable('conversion_events'),
    countTable('contacts', since),
    countTable('newsletter_subscribers', since),
    countTable('conversion_events', since),
    supabase
      .from('contacts')
      .select(
        'id, name, email, pub_name, package_interest, source_page, utm_source, utm_campaign, created_at, status'
      )
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('newsletter_subscribers')
      .select('id, email, status, source_page, utm_source, utm_campaign, created_at, last_seen_at')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('conversion_events')
      .select(
        'event_name, source_page, landing_page, referrer, utm_source, utm_medium, utm_campaign, properties, created_at'
      )
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(1000),
  ]);

  for (const result of [recentContacts, recentSubscribers, eventRows]) {
    if (result.error) {
      throw result.error;
    }
  }

  const byEvent = new Map<string, number>();
  const bySourcePage = new Map<string, number>();
  const byCampaign = new Map<string, number>();
  const bySearchTerm = new Map<string, number>();

  for (const event of (eventRows.data || []) as EventRow[]) {
    increment(byEvent, event.event_name);
    increment(bySourcePage, event.source_page);
    if (event.utm_campaign) increment(byCampaign, event.utm_campaign);

    if (event.event_name === 'site_search') {
      const query = event.properties?.query;
      if (typeof query === 'string') {
        increment(bySearchTerm, query);
      }
    }
  }

  return NextResponse.json({
    user: {
      email: authData.user.email,
    },
    totals: {
      contacts: totalContacts,
      subscribers: totalSubscribers,
      events: totalEvents,
    },
    last30Days: {
      contacts: contacts30d,
      subscribers: subscribers30d,
      events: events30d,
    },
    eventCounts: toRows(byEvent),
    sourcePages: toRows(bySourcePage),
    campaigns: toRows(byCampaign),
    searchTerms: toRows(bySearchTerm),
    recentContacts: recentContacts.data || [],
    recentSubscribers: recentSubscribers.data || [],
    generatedAt: new Date().toISOString(),
  });
}
