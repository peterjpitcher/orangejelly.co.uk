/**
 * The site loading screen, shown while the insights list renders on request. See
 * `SiteLoadingScreen` for why it lives per page rather than at the app root.
 *
 * The `(list)` route group exists only to hold this file. A `loading.tsx` wraps
 * every route below its folder, so in `src/app/insights/` it would also wrap
 * `[slug]`, and an unknown insight would go back to answering 200 instead of 404.
 */
export { default } from '@/components/SiteLoadingScreen';
