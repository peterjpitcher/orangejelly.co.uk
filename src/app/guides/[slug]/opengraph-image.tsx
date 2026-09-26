import path from 'node:path';

import { guideCategoryOf } from '@/lib/blog';
import { getAllBlogPosts } from '@/lib/markdown/index';
import { guideCardEyebrow, SHARE_CARD_SIZE } from '@/lib/share-card/constants';
import { renderShareCard } from '@/lib/share-card/render';

/**
 * A guide's share card: its own title and category on the square brand card.
 *
 * Guides used to share their hero photograph, 1600 by 900, with no name on it. The
 * photograph stays on the page and in the Article schema, where Google wants a large
 * photo; the card is what a pasted link shows.
 *
 * Drawn at build time for every published guide, the same list the page builds, so a
 * card never costs a request. A guide that is not published has no page either, which
 * is what `dynamicParams = false` mirrors.
 */
export const size = SHARE_CARD_SIZE;
export const contentType = 'image/png';
// Only a fallback: the guide page names its card with the guide's title as the alt text.
export const alt = 'An Orange Jelly guide';
export const dynamicParams = false;

const CONTENT_DIR = path.join(process.cwd(), 'content/blog');

const published = () => getAllBlogPosts(CONTENT_DIR, { draft: false, dateTo: new Date() });

export function generateStaticParams(): Array<{ slug: string }> {
  return published().map((post) => ({ slug: post.slug }));
}

export default async function GuideShareCard({
  params,
}: {
  params: { slug: string };
}): Promise<Response> {
  const guide = published().find((post) => post.slug === params.slug);
  if (!guide) return renderShareCard({ kind: 'brand' });

  return renderShareCard({
    kind: 'titled',
    eyebrow: guideCardEyebrow(guideCategoryOf(guide.frontMatter as Record<string, unknown>).name),
    title: guide.frontMatter.title,
  });
}
