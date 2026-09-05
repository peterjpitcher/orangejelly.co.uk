import type { LeadSourceInput } from '@/lib/lead-source';
import { resolveGuideConversionContext } from '@/lib/guide-conversion-server';

/** Only public path context belongs in enquiry attribution, never arbitrary URL text. */
export function cleanEnquiryPage(value: unknown): string | undefined {
  if (
    typeof value !== 'string' ||
    value.length > 2048 ||
    !value.startsWith('/') ||
    value.startsWith('//')
  )
    return undefined;
  try {
    const url = new URL(value, 'https://www.orangejelly.co.uk');
    if (!/^\/[a-z0-9/-]*$/i.test(url.pathname)) return undefined;
    const query = new URLSearchParams();
    if (url.pathname === '/start-here' || url.pathname === '/contact') {
      const context = resolveGuideConversionContext({
        guide:
          url.searchParams.getAll('guide').length === 1
            ? (url.searchParams.get('guide') ?? undefined)
            : undefined,
        placement:
          url.searchParams.getAll('placement').length === 1
            ? (url.searchParams.get('placement') ?? undefined)
            : undefined,
      });
      if (context) {
        query.set('guide', context.guideSlug);
        query.set('placement', context.placement);
      }
    }
    return url.pathname + (query.size ? `?${query.toString()}` : '');
  } catch {
    return undefined;
  }
}

export function cleanEnquirySource(input: unknown): LeadSourceInput {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {};
  const raw = input as Record<string, unknown>;
  const result: LeadSourceInput = {};
  const sourcePage = cleanEnquiryPage(raw.sourcePage);
  const landingPage = cleanEnquiryPage(raw.landingPage);
  if (sourcePage) result.sourcePage = sourcePage;
  if (landingPage) result.landingPage = landingPage;
  // Preserve acquisition labels separately from internal guide context.
  for (const key of ['utmSource', 'utmMedium', 'utmCampaign', 'utmTerm', 'utmContent'] as const) {
    const value = raw[key];
    if (typeof value === 'string' && value.length <= 120 && /^[a-z0-9 _.:/-]+$/i.test(value))
      result[key] = value;
  }
  if (typeof raw.referrer === 'string') {
    try {
      const referrer = new URL(raw.referrer);
      if (['http:', 'https:'].includes(referrer.protocol)) result.referrer = referrer.origin;
    } catch {
      /* An invalid referrer does not invalidate an enquiry. */
    }
  }
  return result;
}
