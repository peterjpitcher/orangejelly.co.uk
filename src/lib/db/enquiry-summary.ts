import {
  aggregateEnquiries,
  SUMMARY_EVENT_NAMES,
  summaryBounds,
  type EnquirySummaryData,
  type SummaryContact,
  type SummaryEvent,
  type SummaryPeriod,
} from '@/lib/enquiry-summary';
import { getAllPosts } from '@/lib/blog-md';
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from './supabase-admin';

/** Read only the aggregate inputs, never names, emails or free-text answers. */
async function readCohort<T extends { id: string }>(
  table: 'contacts' | 'conversion_events',
  columns: string,
  period: SummaryPeriod
): Promise<T[]> {
  const { start, end } = summaryBounds(period);
  const client = getSupabaseAdminClient();
  const rows: T[] = [];
  let cursor: string | undefined;
  let expected: number | undefined;
  // Keyset pagination also handles a server row limit below the requested page size.
  // Refuse an oversized report explicitly instead of silently truncating it.
  for (let page = 0; page < 1000 && rows.length <= 100000; page += 1) {
    let query = client
      .from(table)
      .select(columns, page === 0 ? { count: 'exact' } : undefined)
      .gte('created_at', start)
      .lt('created_at', end)
      .order('id', { ascending: true })
      .limit(500);
    if (table === 'conversion_events') query = query.in('event_name', [...SUMMARY_EVENT_NAMES]);
    if (cursor) query = query.gt('id', cursor);
    const { data, error, count } = await query;
    if (error) throw new Error('Could not load the complete enquiry summary. Try again.');
    if (page === 0) {
      if (count === null) throw new Error('Could not verify the report row count. Try again.');
      expected = count;
      if (count > 100000) throw new Error('This report is too large. Choose a shorter period.');
    }
    const batch = (data ?? []) as unknown as T[];
    rows.push(...batch);
    if (rows.length === expected) return rows;
    if (!batch.length || rows.length > (expected ?? 0)) {
      throw new Error('The report changed while loading. Refresh to read it again.');
    }
    const nextCursor = batch[batch.length - 1].id;
    if (nextCursor === cursor) throw new Error('Could not read the full report. Try again.');
    cursor = nextCursor;
  }
  throw new Error('This report is too large. Choose a shorter period.');
}

export async function getEnquirySummary(period: SummaryPeriod): Promise<EnquirySummaryData> {
  if (!isSupabaseAdminConfigured()) throw new Error('Enquiry storage is not configured.');
  const [contacts, events] = await Promise.all([
    readCohort<SummaryContact>('contacts', 'id, created_at, status, source_page', period),
    readCohort<SummaryEvent>(
      'conversion_events',
      'id, created_at, event_name, owner_id, properties',
      period
    ),
  ]);
  return aggregateEnquiries(
    contacts,
    events,
    period,
    new Set(getAllPosts().map((post) => post.slug)),
    new Date().toISOString()
  );
}
