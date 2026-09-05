import { getPostBySlug, getAllPostSlugs } from '@/lib/blog-md';
import { isEnquiryPlacement, isGuideSlug, type GuideConversionContext } from './guide-conversion';

export interface GuideConversionSearchParams {
  guide?: string | string[];
  placement?: string | string[];
}
/** Repeated, malformed, unpublished and unknown parameters all fall back to generic copy. */
export function resolveGuideConversionContext(
  params: GuideConversionSearchParams
): GuideConversionContext | undefined {
  if (!isGuideSlug(params.guide) || !isEnquiryPlacement(params.placement)) return undefined;
  if (!getAllPostSlugs().includes(params.guide)) return undefined;
  const guide = getPostBySlug(params.guide);
  if (!guide) return undefined;
  return {
    guideSlug: guide.slug,
    category: guide.category,
    title: guide.title,
    placement: params.placement,
  };
}
