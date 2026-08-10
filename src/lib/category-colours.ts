/**
 * Category colour mapping for the 8-category blog taxonomy.
 * Each category gets a unique background colour and gradient.
 *
 * Every primary carries white text at 4.5:1 or better, and
 * src/test/design-tokens.contrast.test.ts asserts it rather than taking this
 * comment's word for it. That check was added after this header turned out to be
 * wrong about two of the nine: Marketing was 3.56:1 and Events 2.29:1, and the
 * Events gradient ended on a stop that was worse than either.
 *
 * Gradient end stops need the same treatment, since white text sits over the
 * whole sweep, not just the start of it.
 */

export interface CategoryColourConfig {
  slug: string;
  label: string;
  primary: string;
  gradient: string; // CSS linear-gradient
}

const CATEGORY_CONFIGS: CategoryColourConfig[] = [
  {
    slug: 'revenue-growth',
    label: 'Revenue & Growth',
    primary: '#006064',
    gradient: 'linear-gradient(135deg, #006064 0%, #004D40 100%)',
  },
  {
    slug: 'operations',
    label: 'Operations',
    primary: '#0D47A1',
    gradient: 'linear-gradient(135deg, #0D47A1 0%, #0A3470 100%)',
  },
  {
    slug: 'marketing',
    label: 'Marketing',
    primary: '#BF360C',
    gradient: 'linear-gradient(135deg, #BF360C 0%, #9A2020 100%)',
  },
  {
    slug: 'events',
    label: 'Events',
    primary: '#A85D00',
    gradient: 'linear-gradient(135deg, #A85D00 0%, #7A3E00 100%)',
  },
  {
    slug: 'food-drink',
    label: 'Food & Drink',
    primary: '#1B5E20',
    gradient: 'linear-gradient(135deg, #1B5E20 0%, #0D3B12 100%)',
  },
  {
    slug: 'people',
    label: 'People',
    primary: '#6A1B9A',
    gradient: 'linear-gradient(135deg, #6A1B9A 0%, #4A148C 100%)',
  },
  {
    slug: 'property',
    label: 'Property',
    primary: '#4E342E',
    gradient: 'linear-gradient(135deg, #4E342E 0%, #3E2723 100%)',
  },
  {
    slug: 'turnaround',
    label: 'Turnaround',
    primary: '#880E4F',
    gradient: 'linear-gradient(135deg, #880E4F 0%, #6A0036 100%)',
  },
];

/** Lookup map for O(1) access by slug. */
const configBySlug = new Map<string, CategoryColourConfig>(
  CATEGORY_CONFIGS.map((c) => [c.slug, c])
);

/** Default used when a category slug is not recognised. */
const DEFAULT_CONFIG: CategoryColourConfig = {
  slug: 'general',
  label: 'General',
  primary: '#37474F',
  gradient: 'linear-gradient(135deg, #37474F 0%, #263238 100%)',
};

/**
 * Returns the hex colour for a given category slug.
 * Falls back to a neutral charcoal if the slug is unknown.
 */
export function getCategoryColour(categorySlug: string): string {
  return configBySlug.get(categorySlug)?.primary ?? DEFAULT_CONFIG.primary;
}

/**
 * Returns a CSS linear-gradient string for a given category slug.
 */
export function getCategoryGradient(categorySlug: string): string {
  return configBySlug.get(categorySlug)?.gradient ?? DEFAULT_CONFIG.gradient;
}

/**
 * Returns the human-readable display label for a given category slug.
 */
export function getCategoryLabel(categorySlug: string): string {
  return configBySlug.get(categorySlug)?.label ?? DEFAULT_CONFIG.label;
}

/**
 * Returns the full config for a given category slug.
 */
export function getCategoryConfig(categorySlug: string): CategoryColourConfig {
  return configBySlug.get(categorySlug) ?? DEFAULT_CONFIG;
}

/**
 * Returns all 8 category configs for building legends and navigation.
 */
export function getAllCategoryConfigs(): CategoryColourConfig[] {
  return [...CATEGORY_CONFIGS];
}

/**
 * @deprecated Use getAllCategoryConfigs() instead. Kept for backward compatibility.
 */
export function getAllCategoryColours(): Array<{ slug: string; colour: string; label: string }> {
  return CATEGORY_CONFIGS.map((c) => ({
    slug: c.slug,
    colour: c.primary,
    label: c.label,
  }));
}
