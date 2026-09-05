import { describe, it, expect, vi } from 'vitest';
import {
  getGuideConversion,
  getGuideEnquiryHref,
  isGuideConversionEnabled,
} from '@/lib/guide-conversion';
import { resolveGuideConversionContext } from '@/lib/guide-conversion-server';

vi.mock('@/lib/blog-md', () => ({
  getAllPostSlugs: () => ['autumn-pub-event-ideas', 'draft-guide', 'future-guide'],
  getPostBySlug: (slug: string) =>
    slug === 'autumn-pub-event-ideas'
      ? { slug, title: 'Autumn pub event ideas', category: 'events' }
      : null,
}));

describe('guide conversion context', () => {
  it('resolves only published guide metadata and allowed single placements', () => {
    expect(
      resolveGuideConversionContext({ guide: 'autumn-pub-event-ideas', placement: 'early' })
    ).toEqual({
      guideSlug: 'autumn-pub-event-ideas',
      title: 'Autumn pub event ideas',
      category: 'events',
      placement: 'early',
    });
    for (const guide of [
      'missing',
      'draft-guide',
      'future-guide',
      '../secret',
      'x'.repeat(161),
      ['autumn-pub-event-ideas'],
    ]) {
      expect(resolveGuideConversionContext({ guide, placement: 'early' })).toBeUndefined();
    }
    for (const placement of ['unknown', ['early'], undefined]) {
      expect(
        resolveGuideConversionContext({ guide: 'autumn-pub-event-ideas', placement })
      ).toBeUndefined();
    }
  });
  it('builds a canonical enquiry path with approved context only', () => {
    expect(getGuideEnquiryHref('autumn-pub-event-ideas', 'end')).toBe(
      '/start-here?guide=autumn-pub-event-ideas&placement=end#enquiry'
    );
    expect(getGuideEnquiryHref('../private', 'end')).toBe('/start-here#enquiry');
  });
  it('gates all-guide expansion and maps pilot proof correctly', () => {
    expect(isGuideConversionEnabled('autumn-pub-event-ideas')).toBe(true);
    expect(isGuideConversionEnabled('quiz-night-ideas')).toBe(false);
    expect(getGuideConversion('profitable-pub-food-menu-ideas', 'revenue-growth').proof).toBe(
      'food-revenue'
    );
    expect(getGuideConversion('oktoberfest-pub-guide', 'events').proof).toBe('bookings');
    expect(getGuideConversion('a-guide', 'marketing', 'A public title').whatsappMessage).toContain(
      'A public title'
    );
    for (const category of ['operations', 'people', 'property', 'turnaround', 'unknown'])
      expect(getGuideConversion('a-guide', category).proof).toBe('none');
  });
});
