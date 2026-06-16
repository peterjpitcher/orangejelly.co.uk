/**
 * Guide → service bridge map.
 *
 * Each blog (guide) category maps to the single most relevant commercial page,
 * so every guide carries one contextual, on-brand link to the service most
 * likely to help a reader who has just finished that guide. This complements
 * — and does not replace — the sitewide footer links.
 *
 * Category slugs are the canonical 8-category taxonomy defined in
 * `src/lib/blog.ts` (`blogCategories`) / `content/data/categories.json`:
 *   revenue-growth, operations, marketing, events, food-drink, people,
 *   property, turnaround.
 */

export interface GuideServiceBridge {
  /** Destination commercial page (root-relative). */
  href: string;
  /** Short, descriptive anchor text (used as the accessible link label). */
  label: string;
}

/** Default bridge used when a category has no specific mapping. */
const DEFAULT_BRIDGE: GuideServiceBridge = {
  href: '/ways-to-work',
  label: 'See the ways we work with pubs',
};

const CATEGORY_BRIDGES: Record<string, GuideServiceBridge> = {
  marketing: {
    href: '/pub-marketing-agency',
    label: 'See how we do pub marketing',
  },
  events: {
    href: '/pub-marketing-agency',
    label: 'See how we market pub events',
  },
  turnaround: {
    href: '/fix-my-pub',
    label: 'See how we help turn a quiet pub around',
  },
  'revenue-growth': {
    href: '/ways-to-work',
    label: 'See the ways we work with pubs',
  },
  operations: {
    href: '/ways-to-work',
    label: 'See the ways we work with pubs',
  },
  property: {
    href: '/ways-to-work',
    label: 'See the ways we work with pubs',
  },
};

/**
 * Returns the most relevant commercial page for a given guide category slug,
 * falling back to a sensible default (`/ways-to-work`).
 */
export function getGuideServiceBridge(categorySlug: string): GuideServiceBridge {
  return CATEGORY_BRIDGES[categorySlug] ?? DEFAULT_BRIDGE;
}
