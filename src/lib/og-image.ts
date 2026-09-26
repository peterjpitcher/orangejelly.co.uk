import fs from 'fs';
import path from 'path';

import { DEFAULT_SHARE_IMAGE } from './share-card/constants';

/**
 * Site-wide fallback: the square default share card, a PNG route that always renders.
 * It was `/images/og-default.jpg` until 26 September 2026, a picture still selling
 * "AI-Powered Marketing for UK Pubs".
 */
const DEFAULT_OG_IMAGE = DEFAULT_SHARE_IMAGE.url;

/**
 * Extensions tried in preference order when a post has no usable featuredImage.
 * Raster formats come first deliberately: Facebook, LinkedIn and X do not render
 * SVG OpenGraph images, so an SVG is only ever a last resort for on-page use and
 * is never a valid og:image.
 */
const RASTER_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'] as const;

function publicFileExists(relativePath: string): boolean {
  if (!relativePath.startsWith('/')) return false;
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', relativePath));
  } catch {
    return false;
  }
}

/**
 * Resolve the hero image for a guide, which is also the image its Article schema names.
 *
 * It was the guide's og:image too until 26 September 2026. Guides now share a square
 * card drawn from their title (src/app/guides/[slug]/opengraph-image.tsx); the photo
 * stays on the page and in the schema, where a large photograph is what Google wants.
 *
 * The previous behaviour assumed `/images/blog/<slug>.svg` always existed. It did
 * not for 23 of 105 guides, which shipped a 404 to every crawler and social
 * scraper, and the SVGs that did exist could not be rendered by the major
 * platforms anyway.
 *
 * Resolution order:
 *   1. An explicit featuredImage, if it is a remote URL or a file that exists.
 *   2. `/images/blog/<slug>.{png,jpg,jpeg,webp}`, first match wins.
 *   3. The site default OG image.
 *
 * Only ever returns a path that resolves, so og:image cannot 404.
 */
export function resolveOgImage(slug: string, featuredImage?: unknown): string {
  if (typeof featuredImage === 'string' && featuredImage.length > 0) {
    if (featuredImage.startsWith('http')) return featuredImage;
    // An explicit SVG is skipped: it exists, but no major social platform renders it.
    if (!featuredImage.endsWith('.svg') && publicFileExists(featuredImage)) {
      return featuredImage;
    }
  }

  for (const extension of RASTER_EXTENSIONS) {
    const candidate = `/images/blog/${slug}${extension}`;
    if (publicFileExists(candidate)) return candidate;
  }

  return DEFAULT_OG_IMAGE;
}
