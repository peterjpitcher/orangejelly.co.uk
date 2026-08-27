/**
 * Stacking order for everything that pins itself to the viewport.
 *
 * Five surfaces can be on screen at once: the sticky header, its mobile drawer, the
 * sticky conversion bar, the cookie notice and a modal. Without one place deciding
 * the order they collide, and the collisions are the kind nobody notices until a
 * real person cannot dismiss a cookie banner because the CTA bar is over the top of
 * it.
 *
 * The order, bottom to top, and why:
 *
 *   STICKY_CTA (50)     Lowest. It is an offer, and everything else outranks an offer.
 *   MOBILE_DRAWER (59)  Above the page, deliberately BELOW the header, so the Close
 *                       control stays visible and reachable while the drawer is open.
 *   HEADER (60)         Above its own drawer, for the reason above.
 *   COOKIE_NOTICE (80)  Above the CTA bar. A consent choice must never be obscured
 *                       by something trying to sell.
 *   MODAL (100)         Top. It is the only surface that takes over the page.
 *
 * COMBINED FOOTPRINT. The sticky CTA and the cookie notice both occupy the bottom
 * edge and can appear together. Between them they must not take more than about a
 * quarter of a short viewport, or reading becomes a letterbox. The cookie notice is
 * answered once and then gone, so where both are present it wins the bottom and the
 * CTA bar sits above it.
 *
 * SAFE AREAS. Both bottom-pinned surfaces pad by env(safe-area-inset-bottom) so they
 * clear the iOS home indicator rather than sitting under it.
 */
export const LAYERS = {
  STICKY_CTA: 50,
  MOBILE_DRAWER: 59,
  HEADER: 60,
  COOKIE_NOTICE: 80,
  MODAL: 100,
} as const;

export type LayerName = keyof typeof LAYERS;
