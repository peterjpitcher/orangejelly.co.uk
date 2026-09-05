'use server';

import { storeConversionEvent } from '@/lib/db/leads';
import { type LeadSourceInput } from '@/lib/lead-source';
import { cleanEnquirySource } from '@/lib/enquiry-source';
import { resolveGuideConversionContext } from '@/lib/guide-conversion-server';

/**
 * The server side of the event dictionary.
 *
 * @see tasks/repositioning/SUB-SPECS.md part 3.2
 *
 * Each event declares the properties it is allowed to carry, and anything else is
 * dropped rather than sanitised. The rule the dictionary sets is "no free text in
 * any property, ever", and an allowlist is the only way to hold that: sanitising
 * still stores whatever arrives, and a client bug that puts someone's answer to
 * "what is blocking growth" into an event property would sail straight through a
 * redactor that is only looking for email addresses.
 *
 * The five legacy events keep the older behaviour, where any property is accepted
 * and scrubbed. Tightening them is a separate change with its own risk.
 */
const LEGACY_EVENTS = new Set([
  'whatsapp_click',
  'package_cta_click',
  'guide_cta_click',
  'site_search',
  'search_result_click',
  'contact_submit',
]);

/** `session_id` is permitted on every dictionary event, so it is not repeated. */
const EVENT_PROPERTIES: Record<string, readonly string[]> = {
  enquiry_started: ['entry_point'],
  // enquiry_submitted and enquiry_qualified are absent on purpose. They are
  // operational records written server-side once the row exists, and this route is
  // public: listing them here would let anyone post a conversion Orange Jelly never
  // received.
  scorecard_started: [],
  scorecard_completed: ['pressure_bands', 'duration_seconds'],
  scorecard_to_enquiry: ['pressure_bands'],
  pressure_check_used: ['symptom', 'interaction_index'],
  next_step_click: ['from_stage', 'to_stage', 'from_slug', 'to_slug'],
  bring_us_the_problem_click: ['surface', 'page_template'],
  search_performed: ['result_count', 'had_results'],
  article_to_problem: ['from_slug', 'to_slug'],
};

const ALWAYS_ALLOWED = ['session_id'];

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

/**
 * Keeps only the properties the event declares, then bounds what survives.
 *
 * Strings are capped hard because every declared string property is an enum or a
 * slug. Nothing in the dictionary is a sentence, so anything sentence-length is a
 * bug and is truncated rather than stored.
 */
function allowlistProperties(
  eventName: string,
  properties?: Record<string, unknown>
): Record<string, unknown> {
  const declared = EVENT_PROPERTIES[eventName];
  if (!declared || !properties) return {};

  const permitted = new Set([...declared, ...ALWAYS_ALLOWED]);

  return Object.fromEntries(
    Object.entries(properties)
      .filter(([key]) => permitted.has(key))
      .map(([key, value]) => {
        if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
          return [key, value];
        }
        if (Array.isArray(value)) {
          return [key, value.slice(0, 12).map((item) => String(item).slice(0, 40))];
        }
        return [key, String(value).slice(0, 120)];
      })
  );
}

export async function trackConversionEvent({
  eventName,
  leadSource,
  properties,
}: TrackConversionEventInput): Promise<{ success?: boolean; error?: string }> {
  if (typeof eventName !== 'string') return { error: 'Unknown event.' };
  const legacy = LEGACY_EVENTS.has(eventName);
  if (!legacy && !(eventName in EVENT_PROPERTIES)) {
    return { error: 'Unknown event.' };
  }

  const contextual = properties?.version === 'guide-enquiry-v1';
  if (
    !contextual &&
    properties &&
    ['version', 'guide_slug', 'placement', 'channel'].some((key) => key in properties) &&
    ['guide_cta_click', 'whatsapp_click', 'enquiry_started'].includes(eventName)
  ) {
    return { error: 'Unsupported guide event version.' };
  }
  let contextualProperties: Record<string, unknown> = {};
  if (contextual) {
    if (!['guide_cta_click', 'whatsapp_click', 'enquiry_started'].includes(eventName)) {
      return { error: 'Invalid guide event.' };
    }
    const placement = properties?.placement;
    if (
      typeof placement !== 'string' ||
      !['early', 'end', 'sticky', 'enquiry', 'contact'].includes(placement)
    ) {
      return { error: 'Invalid guide placement.' };
    }
    const guide = properties?.guide_slug;
    if (guide !== undefined) {
      const context = resolveGuideConversionContext({
        guide: typeof guide === 'string' ? guide : '',
        placement,
      });
      if (!context) return { error: 'Invalid guide context.' };
      contextualProperties.guide_slug = context.guideSlug;
    } else if (eventName === 'guide_cta_click') return { error: 'Missing guide context.' };
    const channel = properties?.channel;
    const expectedChannel = eventName === 'whatsapp_click' ? 'whatsapp' : 'form';
    if (channel !== undefined && channel !== expectedChannel)
      return { error: 'Invalid guide channel.' };
    contextualProperties = { ...contextualProperties, placement, version: 'guide-enquiry-v1' };
    if (channel !== undefined) contextualProperties.channel = channel;
    if (
      eventName === 'enquiry_started' &&
      ['page', 'contact', 'guide', 'sticky'].includes(String(properties?.entry_point))
    ) {
      contextualProperties.entry_point = properties?.entry_point;
    }
    const sessionId = properties?.session_id;
    if (typeof sessionId === 'string' && /^[a-z0-9-]{1,80}$/i.test(sessionId))
      contextualProperties.session_id = sessionId;
  }

  const result = await storeConversionEvent({
    eventName,
    leadSource: contextual ? cleanEnquirySource(leadSource) : leadSource,
    properties: contextual
      ? contextualProperties
      : legacy
        ? sanitizeProperties(properties)
        : allowlistProperties(eventName, properties),
  });

  if (!result.stored) {
    return { error: 'Event was not stored.' };
  }

  return { success: true };
}
