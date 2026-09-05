import { getBrowserLeadSource } from '@/lib/lead-source';

const CONSENT_STORAGE_KEY = 'oj-cookie-consent';
const SESSION_ID_KEY = 'oj_session_id';
const SENT_ONCE_KEY = 'oj_events_sent';

/**
 * The client event dictionary.
 *
 * @see tasks/repositioning/SUB-SPECS.md part 3.2
 *
 * `enquiry_submitted` and `enquiry_qualified` are deliberately absent. They are
 * operational records written server-side after the row exists, keyed on the lead
 * id, which is the only way they cannot double-count.
 */
export type TrackableEvent =
  | 'whatsapp_click'
  | 'package_cta_click'
  | 'guide_cta_click'
  | 'site_search'
  | 'search_result_click'
  // Mirrors the server-side conversion event of the same name in db/leads.ts. The
  // server has always recorded contact_submit; nothing was reaching GA4, so the
  // enquiry was invisible in analytics while sitting in the database. The names match
  // deliberately: an event in one store and not the other is a defect, not a variant.
  | 'contact_submit'
  | 'enquiry_started'
  | 'scorecard_started'
  | 'scorecard_completed'
  | 'scorecard_to_enquiry'
  | 'pressure_check_used'
  | 'next_step_click'
  | 'bring_us_the_problem_click'
  | 'search_performed'
  | 'article_to_problem';

interface TrackClientEventOptions {
  properties?: Record<string, unknown>;
  /**
   * De-duplication key. The first call wins and later calls with the same key are
   * dropped for the rest of the session.
   *
   * Every event in the dictionary has one. Without it `enquiry_started` fires on
   * every keystroke and `next_step_click` fires twice on a double click, and the
   * numbers quietly stop meaning anything.
   */
  dedupeKey?: string;
}

type DataLayerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;

  let stored: string | null = null;

  try {
    stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return false;

    const parsed = JSON.parse(stored) as { analytics?: unknown } | string;
    if (typeof parsed === 'string') {
      return parsed === 'accepted';
    }

    return parsed.analytics === true;
  } catch {
    return stored === 'accepted';
  }
}

/**
 * An anonymous per-session id, used to join one visit's events together.
 *
 * It is sessionStorage, so it is device storage and only exists once analytics
 * consent has been given. It never persists across sessions and never joins to a
 * person: at the point an enquiry is submitted the lead id takes over.
 */
function getSessionId(): string | undefined {
  try {
    const existing = window.sessionStorage.getItem(SESSION_ID_KEY);
    if (existing) return existing;

    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `s-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(SESSION_ID_KEY, id);
    return id;
  } catch {
    return undefined;
  }
}

/**
 * De-duplication.
 *
 * Backed by sessionStorage when consent allows, so it survives a page navigation,
 * and by an in-memory set otherwise. The in-memory version is weaker across
 * navigations, which is the correct trade: a duplicate event is a smaller problem
 * than writing to someone's device without their agreement.
 */
const sentThisPage = new Set<string>();

function alreadySent(key: string, persist: boolean): boolean {
  if (sentThisPage.has(key)) return true;
  sentThisPage.add(key);

  if (!persist) return false;

  try {
    const raw = window.sessionStorage.getItem(SENT_ONCE_KEY);
    const seen: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    if (seen.includes(key)) return true;
    // Capped so a long session cannot grow this without bound.
    window.sessionStorage.setItem(SENT_ONCE_KEY, JSON.stringify([...seen, key].slice(-200)));
  } catch {
    return false;
  }

  return false;
}

function pushDataLayerEvent(
  eventName: TrackableEvent,
  properties: Record<string, unknown>,
  leadSource: ReturnType<typeof getBrowserLeadSource>
) {
  const browserWindow = window as DataLayerWindow;
  browserWindow.dataLayer = browserWindow.dataLayer || [];
  browserWindow.dataLayer.push({
    event: eventName,
    event_name: eventName,
    event_properties: properties,
    source_page: leadSource.sourcePage,
    landing_page: leadSource.landingPage,
    referrer: leadSource.referrer,
    utm_source: leadSource.utmSource,
    utm_medium: leadSource.utmMedium,
    utm_campaign: leadSource.utmCampaign,
    utm_term: leadSource.utmTerm,
    utm_content: leadSource.utmContent,
  });
}

/**
 * Records an event.
 *
 * The consent split follows D24: it is drawn by whether the tool touches the
 * device, not by whether the data is personal.
 *
 * - **Without consent** the event is still written to Orange Jelly's own store. It
 *   carries no device identifier, sets nothing, and reads nothing, so PECR
 *   regulation 6 is not engaged. This is the change from the previous behaviour,
 *   which threw the event away entirely and left the site blind to its own funnel.
 * - **With consent** the same event also goes to GTM, and gains the session id that
 *   lets one visit's events be joined up.
 *
 * Never put free text in `properties`. Booleans, enums, counts, durations and slugs
 * only. The server drops anything not declared for the event, but the first line of
 * defence is here.
 */
export function trackClientEvent(
  eventName: TrackableEvent,
  options: TrackClientEventOptions = {}
): void {
  if (typeof window === 'undefined') return;

  const consented = hasAnalyticsConsent();

  if (options.dedupeKey && alreadySent(`${eventName}:${options.dedupeKey}`, consented)) {
    return;
  }

  const leadSource = getBrowserLeadSource({ persist: consented });
  if (options.properties?.version === 'guide-enquiry-v1') {
    // The new journey carries public context only, including on the GTM path.
    for (const key of ['sourcePage', 'landingPage'] as const) {
      const value = leadSource[key];
      if (!value) continue;
      try {
        const url = new URL(value, window.location.origin);
        const query = new URLSearchParams();
        const guide = options.properties.guide_slug;
        const placement = options.properties.placement;
        if (
          ['/start-here', '/contact'].includes(url.pathname) &&
          typeof guide === 'string' &&
          /^[a-z0-9-]{1,160}$/.test(guide) &&
          typeof placement === 'string' &&
          ['early', 'end', 'sticky', 'enquiry', 'contact'].includes(placement)
        ) {
          query.set('guide', guide);
          query.set('placement', placement);
        }
        leadSource[key] = url.pathname + (query.size ? `?${query.toString()}` : '');
      } catch {
        delete leadSource[key];
      }
    }
    if (leadSource.referrer) {
      try {
        leadSource.referrer = new URL(leadSource.referrer).origin;
      } catch {
        delete leadSource.referrer;
      }
    }
  }
  const sessionId = consented ? getSessionId() : undefined;
  const properties = {
    ...(options.properties || {}),
    ...(sessionId ? { session_id: sessionId } : {}),
  };

  if (consented) {
    pushDataLayerEvent(eventName, properties, leadSource);
  }

  const payload = JSON.stringify({
    eventName,
    leadSource,
    properties,
  });

  try {
    if (navigator.sendBeacon) {
      const sent = navigator.sendBeacon(
        '/api/events',
        new Blob([payload], { type: 'application/json' })
      );
      if (sent) return;
    }
  } catch {
    // Fall back to fetch below.
  }

  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}
