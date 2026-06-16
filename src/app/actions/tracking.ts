'use server';

import { storeConversionEvent } from '@/lib/db/leads';
import { type LeadSourceInput } from '@/lib/lead-source';

const ALLOWED_EVENTS = new Set([
  'whatsapp_click',
  'package_cta_click',
  'guide_cta_click',
  'site_search',
  'search_result_click',
]);

interface TrackConversionEventInput {
  eventName: string;
  leadSource?: LeadSourceInput;
  properties?: Record<string, unknown>;
}

function sanitizePropertyKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9_:-]/g, '_').slice(0, 60);
}

function sanitizeStringProperty(value: string): string {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted_email]')
    .replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, '[redacted_phone]')
    .slice(0, 500);
}

function sanitizeProperties(properties?: Record<string, unknown>): Record<string, unknown> {
  if (!properties) return {};

  return Object.fromEntries(
    Object.entries(properties)
      .slice(0, 20)
      .map(([key, value]) => {
        const cleanKey = sanitizePropertyKey(key);
        if (typeof value === 'string') {
          return [cleanKey, sanitizeStringProperty(value)];
        }
        if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
          return [cleanKey, value];
        }
        return [cleanKey, sanitizeStringProperty(JSON.stringify(value))];
      })
  );
}

export async function trackConversionEvent({
  eventName,
  leadSource,
  properties,
}: TrackConversionEventInput): Promise<{ success?: boolean; error?: string }> {
  if (!ALLOWED_EVENTS.has(eventName)) {
    return { error: 'Unknown event.' };
  }

  const result = await storeConversionEvent({
    eventName,
    leadSource,
    properties: sanitizeProperties(properties),
  });

  if (!result.stored) {
    return { error: 'Event was not stored.' };
  }

  return { success: true };
}
