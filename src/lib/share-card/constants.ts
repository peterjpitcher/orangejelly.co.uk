/**
 * The share card: the picture WhatsApp, iMessage, LinkedIn, Facebook, X and Slack show
 * under a pasted link.
 *
 * Square since 26 September 2026, when Peter asked for square cards on the new logo. A
 * square previews large in WhatsApp, iMessage and Slack. LinkedIn, Facebook and X crop it
 * to a 1.91:1 strip through the middle, so every card keeps the logo and its words inside
 * `SHARE_CARD_SAFE_BAND` and only colour and supporting lines outside it.
 *
 * Kept free of `next/og` so page metadata can import it without pulling the renderer in.
 */
export const SHARE_CARD_SIZE = { width: 1200, height: 1200 } as const;

/**
 * The rows a centred 1.91:1 crop of the square keeps: 1200 / 1.91 is 628 rows, from 286
 * to 914. The band is 14px inside that on each side, so nothing essential touches a cut.
 */
export const SHARE_CARD_SAFE_BAND = { top: 300, bottom: 900 } as const;

export const DEFAULT_SHARE_IMAGE_ALT = 'Orange Jelly: websites and systems built for growth';

/**
 * The site-wide card, drawn by `src/app/opengraph-image.tsx`.
 *
 * Every page that declares its own `openGraph` has to name an image, because Next.js
 * replaces the parent's `openGraph` object wholesale rather than merging it. Until this
 * existed, 28 pages set a title and description and no image, so they shared with no
 * picture at all. Relative, so it resolves against `metadataBase` like every other URL.
 */
export const DEFAULT_SHARE_IMAGE = {
  url: '/opengraph-image',
  width: SHARE_CARD_SIZE.width,
  height: SHARE_CARD_SIZE.height,
  type: 'image/png',
  alt: DEFAULT_SHARE_IMAGE_ALT,
};

/**
 * The default card's words, carried over from the card this replaced (set on 5 September
 * 2026 with the websites, applications and AI offer). Only the case changed: the brand
 * sets display type in sentence case.
 */
export const DEFAULT_SHARE_CARD_COPY = {
  headline: 'Websites and systems built for growth.',
  subline: 'Websites. Bespoke applications. Useful AI.',
} as const;
