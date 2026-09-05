import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { trackConversionEvent } from '@/app/actions/tracking';
import { storeConversionEvent } from '@/lib/db/leads';

vi.mock('@/lib/db/leads', () => ({
  storeConversionEvent: vi.fn().mockResolvedValue({ stored: true }),
}));

/**
 * The event dictionary, from both ends.
 *
 * @see tasks/repositioning/SUB-SPECS.md part 3
 */
describe('the public event route', () => {
  beforeEach(() => {
    vi.mocked(storeConversionEvent).mockClear().mockResolvedValue({ stored: true });
  });

  it('accepts an event in the dictionary', async () => {
    const result = await trackConversionEvent({
      eventName: 'next_step_click',
      properties: { from_stage: 'article', to_stage: 'problem', to_slug: 'leads-do-not-convert' },
    });

    expect(result.success).toBe(true);
    expect(vi.mocked(storeConversionEvent).mock.calls[0][0].properties).toEqual({
      from_stage: 'article',
      to_stage: 'problem',
      to_slug: 'leads-do-not-convert',
    });
  });

  it('drops properties the event did not declare', async () => {
    await trackConversionEvent({
      eventName: 'search_performed',
      properties: { result_count: 4, had_results: true, query: 'why are my leads not converting' },
    });

    // The rule is no free text in any property, ever. Sanitising is not enough:
    // it still stores whatever arrives, and a redactor looking for email addresses
    // would wave a search query straight through.
    expect(vi.mocked(storeConversionEvent).mock.calls[0][0].properties).toEqual({
      result_count: 4,
      had_results: true,
    });
  });

  it('refuses an event nobody declared', async () => {
    const result = await trackConversionEvent({ eventName: 'made_up_event' });
    expect(result.error).toBe('Unknown event.');
    expect(storeConversionEvent).not.toHaveBeenCalled();
  });

  it('refuses the operational enquiry events, which only the server may write', async () => {
    // This route is public. Listing them would let anyone post a conversion Orange
    // Jelly never received, straight into the numbers Peter runs the business on.
    for (const eventName of ['enquiry_submitted', 'enquiry_qualified']) {
      expect((await trackConversionEvent({ eventName })).error).toBe('Unknown event.');
    }
    expect(storeConversionEvent).not.toHaveBeenCalled();
  });

  it('truncates a string that is longer than any enum or slug should be', async () => {
    await trackConversionEvent({
      eventName: 'pressure_check_used',
      properties: { symptom: 'x'.repeat(400), interaction_index: 2 },
    });

    const stored = vi.mocked(storeConversionEvent).mock.calls[0][0].properties as Record<
      string,
      unknown
    >;
    expect(String(stored.symptom)).toHaveLength(120);
    expect(stored.interaction_index).toBe(2);
  });

  it('keeps accepting the five legacy events', async () => {
    const result = await trackConversionEvent({
      eventName: 'whatsapp_click',
      properties: { label: 'header' },
    });
    expect(result.success).toBe(true);
  });

  it('allows the session id on any dictionary event', async () => {
    await trackConversionEvent({
      eventName: 'scorecard_started',
      properties: { session_id: 'abc-123' },
    });
    expect(vi.mocked(storeConversionEvent).mock.calls[0][0].properties).toEqual({
      session_id: 'abc-123',
    });
  });
});

describe('the client tracker', () => {
  const store = new Map<string, string>();
  const session = new Map<string, string>();
  let fetchMock: ReturnType<typeof vi.fn>;

  function fakeStorage(map: Map<string, string>) {
    return {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => void map.set(k, v),
      removeItem: (k: string) => void map.delete(k),
      clear: () => map.clear(),
      key: () => null,
      length: 0,
    };
  }

  beforeEach(async () => {
    vi.resetModules();
    store.clear();
    session.clear();
    // jsdom in this project provides neither storage, and the tracker must work
    // where they are missing or blocked as well as where they are present.
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: fakeStorage(store),
    });
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      value: fakeStorage(session),
    });
    fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    (window as unknown as { dataLayer?: unknown[] }).dataLayer = [];
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function bodyOf(call: number): Record<string, unknown> {
    return JSON.parse(fetchMock.mock.calls[call][1].body as string) as Record<string, unknown>;
  }

  it('records to the first-party store without consent, and sends nothing to GTM', async () => {
    const { trackClientEvent } = await import('@/lib/tracking');
    trackClientEvent('bring_us_the_problem_click', { properties: { surface: 'header' } });

    // The previous behaviour threw the event away entirely, which left the site
    // blind to its own funnel. Nothing here touches the device, so PECR
    // regulation 6 is not engaged.
    expect(fetchMock).toHaveBeenCalledWith('/api/events', expect.anything());
    expect((window as unknown as { dataLayer: unknown[] }).dataLayer).toHaveLength(0);
  });

  it('carries no session id and writes nothing to the device without consent', async () => {
    const { trackClientEvent } = await import('@/lib/tracking');
    trackClientEvent('scorecard_started', { dedupeKey: 'once' });

    expect(bodyOf(0).properties).toEqual({});
    expect(session.size).toBe(0);
  });

  it('adds the session id and pushes to GTM once consent is given', async () => {
    store.set('oj-cookie-consent', JSON.stringify({ analytics: true }));
    const { trackClientEvent } = await import('@/lib/tracking');
    trackClientEvent('scorecard_started', { dedupeKey: 'once' });

    const properties = bodyOf(0).properties as Record<string, unknown>;
    expect(properties.session_id).toEqual(expect.any(String));
    expect((window as unknown as { dataLayer: unknown[] }).dataLayer).toHaveLength(1);
  });

  it('joins a visit together under one session id', async () => {
    store.set('oj-cookie-consent', JSON.stringify({ analytics: true }));
    const { trackClientEvent } = await import('@/lib/tracking');
    trackClientEvent('scorecard_started', { dedupeKey: 'a' });
    trackClientEvent('scorecard_completed', { dedupeKey: 'b' });

    const first = bodyOf(0).properties as Record<string, unknown>;
    const second = bodyOf(1).properties as Record<string, unknown>;
    expect(second.session_id).toBe(first.session_id);
  });

  it('sends an event with the same de-duplication key only once', async () => {
    const { trackClientEvent } = await import('@/lib/tracking');
    trackClientEvent('enquiry_started', { dedupeKey: 'page' });
    trackClientEvent('enquiry_started', { dedupeKey: 'page' });
    trackClientEvent('enquiry_started', { dedupeKey: 'sticky' });

    // Without this, enquiry_started fires on every keystroke and the numbers stop
    // meaning anything.
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('remembers the de-duplication across a navigation once consent allows it', async () => {
    store.set('oj-cookie-consent', JSON.stringify({ analytics: true }));
    const first = await import('@/lib/tracking');
    first.trackClientEvent('next_step_click', { dedupeKey: 'a>b' });

    vi.resetModules();
    const second = await import('@/lib/tracking');
    second.trackClientEvent('next_step_click', { dedupeKey: 'a>b' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('versioned guide enquiry events', () => {
  beforeEach(() => vi.mocked(storeConversionEvent).mockClear());

  it('rejects invalid placements without recording a click', async () => {
    expect(
      await trackConversionEvent({
        eventName: 'whatsapp_click',
        properties: { version: 'guide-enquiry-v1', placement: 'private message' },
      })
    ).toEqual({ error: 'Invalid guide placement.' });
    expect(storeConversionEvent).not.toHaveBeenCalled();
  });

  it('allows generic contact WhatsApp intent and discards unapproved free text', async () => {
    await trackConversionEvent({
      eventName: 'whatsapp_click',
      properties: {
        version: 'guide-enquiry-v1',
        placement: 'contact',
        channel: 'whatsapp',
        message: 'private message',
      },
    });
    expect(vi.mocked(storeConversionEvent).mock.calls[0][0].properties).toEqual({
      version: 'guide-enquiry-v1',
      placement: 'contact',
      channel: 'whatsapp',
    });
  });

  it('does not permit mismatched channels or pretend a click is a lead', async () => {
    expect(
      (
        await trackConversionEvent({
          eventName: 'whatsapp_click',
          properties: { version: 'guide-enquiry-v1', placement: 'contact', channel: 'form' },
        })
      ).error
    ).toBeTruthy();
    expect(
      (
        await trackConversionEvent({
          eventName: 'enquiry_submitted',
          properties: { version: 'guide-enquiry-v1', placement: 'contact' },
        })
      ).error
    ).toBeTruthy();
    expect(storeConversionEvent).not.toHaveBeenCalled();
  });
});

it('does not let a malformed guide version use legacy free-text properties', async () => {
  vi.mocked(storeConversionEvent).mockClear();
  const result = await trackConversionEvent({
    eventName: 'whatsapp_click',
    properties: { version: 'unknown', placement: 'private text' },
  });
  expect(result.error).toBe('Unsupported guide event version.');
  expect(storeConversionEvent).not.toHaveBeenCalled();
});
