/**
 * Theme Colors Constants
 *
 * These colors are used throughout the application and match the CSS variables
 * defined in globals.css. Use these constants for server-side rendering or
 * where CSS variables are not available (e.g., ImageResponse, email templates).
 */

export const THEME_COLORS = {
  // Canonical brand colors
  base: '#1A2F49',
  blueSupport: '#01619E',
  accent: '#F16F23',
  accentSecondary: '#FF8901',
  highlight: '#FFBD28',
  grounded: '#736F26',
  surface: '#F2F8FC',
  surfaceAlt: '#E7F1F8',
  text: '#1A2F49',
  white: '#FFFFFF',

  // The backward-compatible aliases that used to sit here (orange, orangeLight,
  // orangeDark, teal, tealLight, tealDark, cream, charcoal, charcoalLight) are gone.
  // Only THEME_COLORS.base was ever read, by app/icon.tsx and app/apple-icon.tsx, so
  // the rest was dead weight, and orangeDark had drifted to #FF8901 while the real
  // token moved down the ramp. A dead alias holding a stale value is worse than no
  // alias: the next person to reach for it gets a colour the site stopped using.

  // External Brand Colors
  whatsapp: '#25D366',
  whatsappHover: '#128C7E',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  instagram: '#E4405F',

  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

// Semantic color mappings
export const SEMANTIC_COLORS = {
  primary: THEME_COLORS.base,
  primaryHover: THEME_COLORS.blueSupport,
  secondary: THEME_COLORS.blueSupport,
  secondaryHover: THEME_COLORS.base,
  background: THEME_COLORS.surface,
  text: THEME_COLORS.text,
  textMuted: 'rgba(26, 47, 73, 0.72)',
  border: 'rgba(26, 47, 73, 0.18)',
  accent: THEME_COLORS.accent,
  accentSecondary: THEME_COLORS.accentSecondary,
} as const;

// Export type for TypeScript
export type ThemeColor = keyof typeof THEME_COLORS;
export type SemanticColor = keyof typeof SEMANTIC_COLORS;
