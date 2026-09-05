import { describe, expect, it, vi } from 'vitest';
import { cleanEnquirySource } from '@/lib/enquiry-source';

vi.mock('@/lib/guide-conversion-server', () => ({
  resolveGuideConversionContext: ({ guide, placement }: { guide?: string; placement?: string }) =>
    guide === 'autumn-pub-event-ideas' && placement === 'early'
      ? { guideSlug: guide, placement }
      : undefined,
}));

describe('enquiry source context', () => {
  it('keeps approved journey context without arbitrary query text or fragments', () => {
    expect(
      cleanEnquirySource({
        sourcePage:
          '/start-here?guide=autumn-pub-event-ideas&placement=early&email=private%40example.com#enquiry',
        utmSource: 'google',
      })
    ).toEqual({
      sourcePage: '/start-here?guide=autumn-pub-event-ideas&placement=early',
      utmSource: 'google',
    });
  });
  it('falls back to generic attribution for unknown or repeated context', () => {
    expect(cleanEnquirySource({ sourcePage: '/start-here?guide=unknown&placement=early' })).toEqual(
      { sourcePage: '/start-here' }
    );
    expect(
      cleanEnquirySource({
        sourcePage: '/start-here?guide=autumn-pub-event-ideas&guide=other&placement=early',
      })
    ).toEqual({ sourcePage: '/start-here' });
  });
  it('rejects external paths and reduces referrer to its origin', () => {
    expect(
      cleanEnquirySource({
        sourcePage: '//evil.example',
        referrer: 'https://google.com/search?q=private',
      })
    ).toEqual({ referrer: 'https://google.com' });
    expect(cleanEnquirySource(null)).toEqual({});
  });
});
