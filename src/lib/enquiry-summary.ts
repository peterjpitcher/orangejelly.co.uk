import {
  getTodayIsoDate,
  isValidIsoDate,
  londonWallClockToInstant,
  toLocalIsoDate,
} from '@/lib/dateUtils';
import { GUIDE_CONVERSION_VERSION, isEnquiryPlacement, isGuideSlug } from '@/lib/guide-conversion';
import { isLeadState, LEAD_STATES, type LeadState } from '@/lib/schemas/enquiry';

export interface SummaryPeriod {
  from: string;
  to: string;
  excludedIds: string[];
}

/** Calendar arithmetic is pinned to UTC; these values are dates, not instants. */
function shiftDate(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return toLocalIsoDate(value);
}

export function defaultSummaryPeriod(today = getTodayIsoDate()): SummaryPeriod {
  return { from: shiftDate(today, -28), to: shiftDate(today, -1), excludedIds: [] };
}

export function parseSummaryPeriod(
  params: URLSearchParams,
  today = getTodayIsoDate()
): SummaryPeriod {
  const defaults = defaultSummaryPeriod(today);
  for (const key of params.keys()) {
    if (!['from', 'to', 'exclude'].includes(key) || params.getAll(key).length !== 1) {
      throw new Error('Use one start date, end date and test exclusion list.');
    }
  }
  const from = params.get('from') ?? defaults.from;
  const to = params.get('to') ?? defaults.to;
  if (!isValidIsoDate(from) || !isValidIsoDate(to) || from > to || to >= today) {
    throw new Error('Choose valid complete dates, with the start before the end.');
  }
  if (from < shiftDate(to, -365)) throw new Error('Choose no more than 366 days.');
  const raw = params.get('exclude') ?? '';
  const excludedIds = raw ? raw.split(',') : [];
  if (
    excludedIds.length > 50 ||
    excludedIds.some((id) => !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id))
  ) {
    throw new Error('Enter up to 50 test enquiry UUIDs, separated by commas.');
  }
  return { from, to, excludedIds: [...new Set(excludedIds.map((id) => id.toLowerCase()))] };
}

export function summaryBounds(period: SummaryPeriod): { start: string; end: string } {
  return {
    start: londonWallClockToInstant(period.from, '00:00').toISOString(),
    end: londonWallClockToInstant(shiftDate(period.to, 1), '00:00').toISOString(),
  };
}

export interface SummaryContact {
  id: string;
  created_at: string;
  source_page: string | null;
  status: string | null;
}

export interface SummaryEvent {
  id: string;
  created_at: string;
  event_name: string;
  owner_id: string | null;
  properties: Record<string, unknown> | null;
}

export interface SummaryCounts {
  total: number;
  states: Record<LeadState | 'unknown', number>;
  qualifiedOrLater: number;
}

export interface EnquirySummaryData {
  period: { from: string; to: string };
  observedAt: string;
  excludedTests: number;
  excludedTestIdsSupplied: number;
  enquiries: SummaryCounts;
  guides: Array<SummaryCounts & { guide: string }>;
  events: { currentVersion: Record<string, number>; legacy: Record<string, number> };
  unavailable: { googleClicks: string; consentedSessions: string; conversionRate: string };
}

function emptyCounts(): SummaryCounts {
  return {
    total: 0,
    states: { ...Object.fromEntries(LEAD_STATES.map((state) => [state, 0])), unknown: 0 } as Record<
      LeadState | 'unknown',
      number
    >,
    qualifiedOrLater: 0,
  };
}

function addContact(counts: SummaryCounts, status: string | null): void {
  counts.total += 1;
  counts.states[isLeadState(status) ? status : 'unknown'] += 1;
  if (status === 'qualified' || status === 'conversation_booked' || status === 'client') {
    counts.qualifiedOrLater += 1;
  }
}

/** Only recognised published guide context can leave this boundary. */
function guideFromSource(source: string | null, publishedSlugs: Set<string>): string {
  if (!source || source.length > 2048) return 'unknown';
  try {
    const url = new URL(source, 'https://www.orangejelly.co.uk');
    if (!['www.orangejelly.co.uk', 'orangejelly.co.uk'].includes(url.hostname)) return 'unknown';
    const guide = url.searchParams.get('guide');
    const placement = url.searchParams.get('placement');
    if (
      !['/start-here', '/contact'].includes(url.pathname) ||
      url.searchParams.getAll('guide').length !== 1 ||
      url.searchParams.getAll('placement').length !== 1 ||
      !guide ||
      !placement ||
      !isEnquiryPlacement(placement)
    )
      return 'unknown';
    return publishedSlugs.has(guide) ? guide : 'unknown';
  } catch {
    return 'unknown';
  }
}

export const SUMMARY_EVENT_NAMES = [
  'guide_cta_click',
  'whatsapp_click',
  'enquiry_started',
] as const;

export function aggregateEnquiries(
  contacts: SummaryContact[],
  events: SummaryEvent[],
  period: SummaryPeriod,
  publishedSlugs: Set<string>,
  observedAt: string
): EnquirySummaryData {
  const { start, end } = summaryBounds(period);
  const inPeriod = (date: string): boolean =>
    Date.parse(date) >= Date.parse(start) && Date.parse(date) < Date.parse(end);
  const excluded = new Set(period.excludedIds);
  const enquiries = emptyCounts();
  const guides = new Map<string, SummaryCounts>();
  let excludedTests = 0;
  for (const row of contacts) {
    if (!inPeriod(row.created_at)) continue;
    if (excluded.has(row.id.toLowerCase())) {
      excludedTests += 1;
      continue;
    }
    addContact(enquiries, row.status);
    const guide = guideFromSource(row.source_page, publishedSlugs);
    const counts = guides.get(guide) ?? emptyCounts();
    addContact(counts, row.status);
    guides.set(guide, counts);
  }
  const eventCounts = {
    currentVersion: Object.fromEntries(SUMMARY_EVENT_NAMES.map((name) => [name, 0])),
    legacy: Object.fromEntries(SUMMARY_EVENT_NAMES.map((name) => [name, 0])),
  };
  for (const row of events) {
    if (!inPeriod(row.created_at) || (row.owner_id && excluded.has(row.owner_id.toLowerCase())))
      continue;
    if (!SUMMARY_EVENT_NAMES.some((name) => name === row.event_name)) continue;
    const props = row.properties;
    const validContext =
      props?.version === GUIDE_CONVERSION_VERSION &&
      isEnquiryPlacement(props.placement) &&
      props.channel === (row.event_name === 'whatsapp_click' ? 'whatsapp' : 'form') &&
      (props.guide_slug === undefined ||
        (isGuideSlug(props.guide_slug) && publishedSlugs.has(props.guide_slug))) &&
      (row.event_name !== 'guide_cta_click' || props.guide_slug !== undefined);
    const group = validContext ? 'currentVersion' : 'legacy';
    eventCounts[group][row.event_name] += 1;
  }
  return {
    period: { from: period.from, to: period.to },
    observedAt,
    excludedTests,
    excludedTestIdsSupplied: excluded.size,
    enquiries,
    guides: [...guides]
      .map(([guide, counts]) => ({ guide, ...counts }))
      .sort((a, b) => b.total - a.total),
    events: eventCounts,
    unavailable: {
      googleClicks:
        'Unavailable here. Use a dated Search Console export with its latest complete date.',
      consentedSessions:
        'Unavailable here. No compatible consented session denominator is connected.',
      conversionRate: 'Unavailable. Stored enquiries must not be divided by consented sessions.',
    },
  };
}
