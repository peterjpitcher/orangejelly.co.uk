/** Public guide metadata only. Incoming query values must be resolved on the server. */
export type GuideCtaPlacement = 'early' | 'end' | 'sticky';
export type EnquiryPlacement = GuideCtaPlacement | 'enquiry' | 'contact';
export type GuideProof = 'bookings' | 'food-revenue' | 'search-visibility' | 'none';
export interface GuideConversionContext {
  guideSlug: string;
  category: string;
  title: string;
  placement: EnquiryPlacement;
}
export interface GuideConversionConfig {
  heading: string;
  body: string;
  primaryLabel: string;
  messageHint: string;
  whatsappMessage: string;
  proof: GuideProof;
}
export const GUIDE_CONVERSION_VERSION = 'guide-enquiry-v1';
export const GUIDE_CONVERSION_ROLLOUT: { mode: 'pilot' | 'all'; pilotSlugs: readonly string[] } = {
  mode: 'pilot',
  pilotSlugs: ['autumn-pub-event-ideas', 'oktoberfest-pub-guide', 'profitable-pub-food-menu-ideas'],
};
export function isGuideSlug(value: unknown): value is string {
  return (
    typeof value === 'string' && value.length <= 160 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  );
}
export function isEnquiryPlacement(value: unknown): value is EnquiryPlacement {
  return (
    typeof value === 'string' && ['early', 'end', 'sticky', 'enquiry', 'contact'].includes(value)
  );
}
export function isGuideConversionEnabled(slug: string): boolean {
  return (
    GUIDE_CONVERSION_ROLLOUT.mode === 'all' || GUIDE_CONVERSION_ROLLOUT.pilotSlugs.includes(slug)
  );
}
const generic = {
  heading: 'Put these ideas to work in your business.',
  body: 'Tell Peter what is happening and where you need a hand.',
  primaryLabel: 'Talk about my business',
  proof: 'none' as GuideProof,
};
const categories: Record<string, typeof generic> = {
  events: {
    heading: 'Turn your next event into a reason to book.',
    body: 'Tell Peter what you are planning and where you need a hand.',
    primaryLabel: 'Talk about my event',
    proof: 'bookings',
  },
  'revenue-growth': {
    heading: 'Turn interest into business growth.',
    body: 'Tell Peter what is happening and what you want to change.',
    primaryLabel: 'Talk about my growth plans',
    proof: 'bookings',
  },
  marketing: {
    heading: 'Turn attention into enquiries and bookings.',
    body: 'Tell Peter where people find you and what happens next.',
    primaryLabel: 'Talk about my marketing',
    proof: 'search-visibility',
  },
  'food-drink': {
    heading: 'Make food and drink a stronger part of your business.',
    body: 'Tell Peter what is selling and where you want to grow.',
    primaryLabel: 'Talk about my food and drink',
    proof: 'food-revenue',
  },
};
const overrides: Record<string, Omit<GuideConversionConfig, 'messageHint'>> = {
  'autumn-pub-event-ideas': {
    heading: 'Turn autumn plans into bookings.',
    body: 'Tell Peter which events you are planning and where you need a hand.',
    primaryLabel: 'Talk about my autumn plans',
    whatsappMessage:
      'Hi Peter, I have been reading your autumn pub events guide. I would like to talk about my autumn plans.',
    proof: 'bookings',
  },
  'oktoberfest-pub-guide': {
    heading: 'Give your Oktoberfest a clear route to bookings.',
    body: 'Tell Peter what you are planning and what is getting in the way.',
    primaryLabel: 'Talk about my Oktoberfest',
    whatsappMessage:
      'Hi Peter, I have been reading your Oktoberfest guide. I would like to talk about plans for my pub.',
    proof: 'bookings',
  },
  'profitable-pub-food-menu-ideas': {
    heading: 'Make your menu work harder for your business.',
    body: 'Tell Peter what is happening with food sales and where you want to grow.',
    primaryLabel: 'Talk about my food sales',
    whatsappMessage:
      'Hi Peter, I have been reading your food menu guide. I would like to talk about food sales at my pub.',
    proof: 'food-revenue',
  },
};
/** The optional title must come from published guide metadata, never a query string. */
export function getGuideConversion(
  slug: string,
  category: string,
  title?: string
): GuideConversionConfig {
  const copy = overrides[slug] ?? {
    ...(categories[category] ?? generic),
    whatsappMessage: title
      ? `Hi Peter, I have been reading your guide: ${title}. I would like to talk about my business.`
      : 'Hi Peter, I would like to talk about my business.',
  };
  return { ...copy, messageHint: copy.body };
}
export function getGuideEnquiryHref(slug: string, placement: EnquiryPlacement): string {
  if (!isGuideSlug(slug) || !isEnquiryPlacement(placement)) return '/start-here#enquiry';
  return `/start-here?${new URLSearchParams({ guide: slug, placement })}#enquiry`;
}
