import { getBrowserLeadSource } from '@/lib/lead-source';

const CONSENT_STORAGE_KEY = 'oj-cookie-consent';

type TrackableEvent =
  | 'whatsapp_click'
  | 'package_cta_click'
  | 'guide_cta_click'
  | 'site_search'
  | 'search_result_click';

interface TrackClientEventOptions {
  properties?: Record<string, unknown>;
}

type DataLayerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

function hasAnalyticsConsent(): boolean {
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

export function trackClientEvent(
  eventName: TrackableEvent,
  options: TrackClientEventOptions = {}
): void {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;

  const leadSource = getBrowserLeadSource();
  const properties = options.properties || {};

  pushDataLayerEvent(eventName, properties, leadSource);

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
