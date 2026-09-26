/**
 * The share card: the picture WhatsApp, iMessage, LinkedIn, Facebook, X and Slack show
 * under a pasted link.
 *
 * Square since 26 September 2026, when Peter asked for square cards on the new logo. A
 * square previews large in WhatsApp, iMessage and Slack. LinkedIn, Facebook and X crop it
 * to a 1.91:1 strip through the middle, so every card keeps the logo and its words inside
 * `SHARE_CARD_SAFE_BAND` and only colour and supporting lines outside it.
 *
 * Kept free of `next/og` and of Node APIs so page metadata can import it without pulling
 * the renderer in.
 */
export const SHARE_CARD_SIZE = { width: 1200, height: 1200 } as const;

/**
 * The rows a centred 1.91:1 crop of the square keeps: 1200 / 1.91 is 628 rows, from 286
 * to 914. The band is 14px inside that on each side, so nothing essential touches a cut.
 */
export const SHARE_CARD_SAFE_BAND = { top: 300, bottom: 900 } as const;

/**
 * The look of the cards: layout, palette, fonts and logo. Change it whenever any of those
 * change, and src/test/share-card-metadata.test.ts fails until you do.
 *
 * It matters because every card is served `immutable` for a year, and Facebook, LinkedIn
 * and Slack key their own image caches on the URL. A card that changes behind an
 * unchanged URL keeps showing the old picture wherever it was already fetched: the bare
 * `/opengraph-image` had served the old 1200x630 card for weeks before this.
 */
export const SHARE_CARD_VERSION = '2026-09-26';

/** FNV-1a, 32 bit, in base 36. A short, stable fingerprint, not a security boundary. */
function fingerprint(text: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

/**
 * An og:image entry for a card route, with a `?v=` that changes when the card does.
 *
 * `content` is everything the route draws that can change without a release (a guide's
 * title and category, a survey's question), so an edit reaches every platform as a new
 * URL. Next.js serves the route whatever the query. Relative, so it resolves against
 * `metadataBase` like every other URL.
 *
 * Pages name their card here rather than leaning on the `?<hash>` Next.js adds to an
 * `opengraph-image` file: that hash covers only the route file's own source, not the
 * layout, the fonts or the title it draws, and a page that sets `openGraph.images`
 * overrides the file anyway.
 */
export function shareImage(
  route: string,
  alt: string,
  ...content: string[]
): { url: string; width: number; height: number; type: string; alt: string } {
  return {
    url: `${route}?v=${fingerprint([SHARE_CARD_VERSION, ...content].join('\n'))}`,
    ...SHARE_CARD_SIZE,
    type: 'image/png',
    alt,
  };
}

/**
 * The default card's words, carried over from the card this replaced (set on 5 September
 * 2026 with the websites, applications and AI offer). Written in sentence case so the alt
 * text reads properly; the card sets them in lowercase, as `.oj-display` does on the site
 * (decision D10, lowercase display headings site-wide).
 */
export const DEFAULT_SHARE_CARD_COPY = {
  headline: 'Websites and systems built for growth.',
  subline: 'Websites. Bespoke applications. Useful AI.',
} as const;

export const DEFAULT_SHARE_IMAGE_ALT = 'Orange Jelly: websites and systems built for growth';

/**
 * The site-wide card, drawn by `src/app/opengraph-image.tsx`.
 *
 * Every page that declares its own `openGraph` has to name an image, because Next.js
 * replaces the parent's `openGraph` object wholesale rather than merging it. Until this
 * existed, 28 pages set a title and description and no image, so they shared with no
 * picture at all.
 */
export const DEFAULT_SHARE_IMAGE = shareImage(
  '/opengraph-image',
  DEFAULT_SHARE_IMAGE_ALT,
  DEFAULT_SHARE_CARD_COPY.headline,
  DEFAULT_SHARE_CARD_COPY.subline
);

/** The label a guide's card carries, shared by the card route and the guide's metadata. */
export const guideCardEyebrow = (categoryName: string): string => `Guides · ${categoryName}`;
