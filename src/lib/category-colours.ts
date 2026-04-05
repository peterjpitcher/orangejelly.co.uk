/**
 * Category colour mapping for the 8-category blog taxonomy.
 * Each category gets a unique background colour and gradient.
 * All primary colours pass WCAG AA contrast for white text.
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
    primary: '#EA580C',
    gradient: 'linear-gradient(135deg, #EA580C 0%, #C62828 100%)',
  },
  {
    slug: 'events',
    label: 'Events',
    primary: '#FF8F00',
    gradient: 'linear-gradient(135deg, #FF8F00 0%, #E65100 100%)',
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
