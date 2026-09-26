import { DEFAULT_SHARE_IMAGE_ALT, SHARE_CARD_SIZE } from '@/lib/share-card/constants';
import { renderShareCard } from '@/lib/share-card/render';

export const size = SHARE_CARD_SIZE;
export const contentType = 'image/png';
export const alt = DEFAULT_SHARE_IMAGE_ALT;

/**
 * The default share card, used by every page without a card of its own.
 *
 * It said "Hospitality marketing that works" until the repositioning, then became a
 * flat orange rectangle in a system face with no logo. Since 26 September 2026 it is the
 * square brand card: the supplied logo artwork, Schibsted Grotesk from files in the
 * repo rather than a request to Google at render time, and the palette tokens. The
 * layout lives in src/lib/share-card so the guide and survey cards cannot drift from it.
 */
export default function OGImage(): Promise<Response> {
  return renderShareCard({ kind: 'brand' });
}
