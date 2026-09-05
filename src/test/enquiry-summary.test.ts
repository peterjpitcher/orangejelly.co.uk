import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/admin/enquiry-summary/route';
import type * as SummaryDatabase from '@/lib/db/enquiry-summary';
import { getEnquirySummary } from '@/lib/db/enquiry-summary';
import {
  aggregateEnquiries,
  defaultSummaryPeriod,
  parseSummaryPeriod,
  summaryBounds,
  type SummaryContact,
} from '@/lib/enquiry-summary';

const { admin, from } = vi.hoisted(() => ({ admin: vi.fn(), from: vi.fn() }));
vi.mock('@/lib/admin-auth', () => ({ requireAdmin: admin }));
vi.mock('@/lib/db/enquiry-summary', () => ({ getEnquirySummary: vi.fn() }));
vi.mock('@/lib/db/supabase-admin', () => ({
  isSupabaseAdminConfigured: () => true,
  getSupabaseAdminClient: () => ({ from }),
}));
vi.mock('@/lib/blog-md', () => ({ getAllPosts: () => [{ slug: 'autumn-pub-event-ideas' }] }));

const id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const excludedId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const period = { from: '2026-08-08', to: '2026-09-04', excludedIds: [excludedId] };
const observed = '2026-09-05T12:00:00Z';
const published = new Set(['autumn-pub-event-ideas']);
function row(overrides: Partial<SummaryContact> = {}): SummaryContact {
  return {
    id,
    created_at: '2026-08-20T12:00:00Z',
    source_page: '/start-here?guide=autumn-pub-event-ideas&placement=early',
    status: 'new',
    ...overrides,
  };
}

describe('enquiry summary dates and parameters', () => {
  it('defaults to the preceding 28 complete London dates', () => {
    expect(defaultSummaryPeriod('2026-09-05')).toEqual({
      from: '2026-08-08',
      to: '2026-09-04',
      excludedIds: [],
    });
  });
  it('uses London midnight and an exclusive following midnight through DST', () => {
    expect(summaryBounds({ from: '2026-03-29', to: '2026-03-29', excludedIds: [] })).toEqual({
      start: '2026-03-29T00:00:00.000Z',
      end: '2026-03-29T23:00:00.000Z',
    });
    expect(summaryBounds({ from: '2026-10-25', to: '2026-10-25', excludedIds: [] })).toEqual({
      start: '2026-10-24T23:00:00.000Z',
      end: '2026-10-26T00:00:00.000Z',
    });
  });
  it.each([
    'from=2026-02-30',
    'from=2026-09-04&to=2026-09-03',
    'to=2026-09-05',
    'from=2024-01-01',
    'from=2026-08-01&from=2026-08-02',
    'exclude=not-an-id',
    'unexpected=x',
    `exclude=${Array(51).fill(id).join(',')}`,
  ])('rejects invalid or unbounded input %s', (query) => {
    expect(() => parseSummaryPeriod(new URLSearchParams(query), '2026-09-05')).toThrow();
  });
});

describe('aggregate privacy and commercial meaning', () => {
  it('recognises validated guide context on the contact page', () => {
    const summary = aggregateEnquiries(
      [row({ source_page: '/contact?guide=autumn-pub-event-ideas&placement=contact' })],
      [],
      period,
      published,
      observed
    );
    expect(summary.guides[0].guide).toBe('autumn-pub-event-ideas');
  });
  it('does not count malformed versioned event properties as the current journey', () => {
    const summary = aggregateEnquiries(
      [],
      [
        {
          id,
          created_at: '2026-09-04T12:00:00Z',
          owner_id: null,
          event_name: 'whatsapp_click',
          properties: {
            version: 'guide-enquiry-v1',
            placement: 'private-string',
            channel: 'whatsapp',
          },
        },
      ],
      period,
      published,
      observed
    );
    expect(summary.events.currentVersion.whatsapp_click).toBe(0);
    expect(summary.events.legacy.whatsapp_click).toBe(1);
  });
  it('includes the start boundary, excludes the end and explicitly excludes test IDs', () => {
    const summary = aggregateEnquiries(
      [
        row({ created_at: '2026-08-07T23:00:00Z', status: 'qualified' }),
        row({ id: excludedId, status: 'client' }),
        row({ created_at: '2026-08-07T22:59:59Z' }),
        row({ created_at: '2026-09-04T23:00:00Z' }),
        row({ status: 'conversation_booked' }),
        row({ status: 'client' }),
        row({ status: 'declined' }),
      ],
      [],
      period,
      published,
      observed
    );
    expect(summary.enquiries.total).toBe(4);
    expect(summary.excludedTests).toBe(1);
    expect(summary.enquiries.qualifiedOrLater).toBe(3);
    expect(summary.enquiries.states.declined).toBe(1);
  });
  it('buckets missing, unknown and repeated guide context without echoing free text', () => {
    const summary = aggregateEnquiries(
      [
        row(),
        row({ source_page: null }),
        row({ source_page: '/start-here?guide=private-name&placement=early' }),
        row({
          source_page:
            '/start-here?guide=autumn-pub-event-ideas&guide=private-name&placement=early',
        }),
        row({
          source_page:
            'https://untrusted.test/start-here?guide=autumn-pub-event-ideas&placement=early',
          status: 'unexpected',
        }),
      ],
      [],
      period,
      published,
      observed
    );
    expect(summary.guides.find((guide) => guide.guide === 'unknown')?.total).toBe(4);
    expect(summary.enquiries.states.unknown).toBe(1);
    expect(JSON.stringify(summary)).not.toMatch(
      /private-name|untrusted|aaaaaaaa|bbbbbbbb|source_page/
    );
    expect(summary.unavailable.consentedSessions).toContain('Unavailable');
    expect(summary.unavailable.conversionRate).toContain('must not');
  });
  it('separates versioned events and legacy counts without treating clicks as leads', () => {
    const base = {
      id,
      created_at: observed.replace('09-05', '09-04'),
      owner_id: null,
      event_name: 'whatsapp_click',
      properties: null,
    };
    const summary = aggregateEnquiries(
      [],
      [
        base,
        {
          ...base,
          properties: {
            version: 'guide-enquiry-v1',
            placement: 'enquiry',
            channel: 'whatsapp',
            email: 'private@example.test',
          },
        },
        { ...base, owner_id: excludedId },
      ],
      period,
      published,
      observed
    );
    expect(summary.events.currentVersion.whatsapp_click).toBe(1);
    expect(summary.events.legacy.whatsapp_click).toBe(1);
    expect(summary.enquiries.total).toBe(0);
    expect(JSON.stringify(summary)).not.toContain('private@example.test');
  });
});

describe('protected summary route', () => {
  beforeEach(() => {
    vi.mocked(getEnquirySummary).mockReset();
    admin.mockResolvedValue({ email: 'admin@example.test' });
  });
  it.each([401, 403])('reads no data for a rejected %i gate', async (status) => {
    admin.mockResolvedValue({ response: new Response(null, { status }) });
    expect((await GET(new Request('https://oj.test/api/admin/enquiry-summary'))).status).toBe(
      status
    );
    expect(getEnquirySummary).not.toHaveBeenCalled();
  });
  it('rejects invalid parameters before reading data', async () => {
    expect(
      (await GET(new Request('https://oj.test/api/admin/enquiry-summary?from=invalid'))).status
    ).toBe(400);
    expect(getEnquirySummary).not.toHaveBeenCalled();
  });
  it('returns aggregates without caching', async () => {
    const result = aggregateEnquiries([row()], [], period, published, observed);
    vi.mocked(getEnquirySummary).mockResolvedValue(result);
    const response = await GET(
      new Request('https://oj.test/api/admin/enquiry-summary?from=2026-08-08&to=2026-09-04')
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual(result);
  });
  it('fails visibly instead of returning partial or empty success', async () => {
    vi.mocked(getEnquirySummary).mockRejectedValue(new Error('private database detail'));
    const response = await GET(new Request('https://oj.test/api/admin/enquiry-summary'));
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain('private database detail');
  });
});

describe('complete database reads', () => {
  it('continues beyond server page caps and selects no contact PII', async () => {
    const calls: string[] = [];
    let page = 0;
    from.mockImplementation((table: string) => {
      const builder = {
        select: vi.fn((columns: string) => {
          calls.push(columns);
          return builder;
        }),
        gte: vi.fn(() => builder),
        lt: vi.fn(() => builder),
        order: vi.fn(() => builder),
        limit: vi.fn(() => builder),
        gt: vi.fn(() => builder),
        in: vi.fn(() => builder),
        then: (resolve: (value: unknown) => void) => {
          if (table === 'conversion_events') return resolve({ data: [], count: 0, error: null });
          page += 1;
          return resolve({
            data: [row({ id: page === 1 ? id : excludedId })],
            count: page === 1 ? 2 : null,
            error: null,
          });
        },
      };
      return builder;
    });
    const actual = await vi.importActual<typeof SummaryDatabase>('@/lib/db/enquiry-summary');
    const summary = await actual.getEnquirySummary(period);
    expect(page).toBe(2);
    expect(summary.enquiries.total).toBe(1);
    expect(summary.excludedTests).toBe(1);
    expect(calls.join(',')).not.toMatch(/\b(email|name|situation)\b/);
  });
  it('refuses a truncated cohort', async () => {
    from.mockImplementation(() => {
      const builder = {
        select: () => builder,
        gte: () => builder,
        lt: () => builder,
        order: () => builder,
        limit: () => builder,
        gt: () => builder,
        in: () => builder,
        then: (resolve: (value: unknown) => void) => resolve({ data: [], count: 2, error: null }),
      };
      return builder;
    });
    const actual = await vi.importActual<typeof SummaryDatabase>('@/lib/db/enquiry-summary');
    await expect(actual.getEnquirySummary(period)).rejects.toThrow('changed while loading');
  });
});

it('counts the form-start contract without an optional channel as current version', () => {
  const summary = aggregateEnquiries(
    [],
    [
      {
        id,
        created_at: '2026-08-20T12:00:00Z',
        event_name: 'enquiry_started',
        owner_id: null,
        properties: { version: 'guide-enquiry-v1', placement: 'enquiry', entry_point: 'page' },
      },
    ],
    period,
    published,
    observed
  );
  expect(summary.events.currentVersion.enquiry_started).toBe(1);
  expect(summary.events.legacy.enquiry_started).toBe(0);
});
