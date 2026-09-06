import { generateRSSFeed } from '@/lib/feeds';

export const dynamic = 'force-static';

/**
 * Served as a route rather than a file in `public/`, for the reason llms.txt is.
 *
 * `public/rss.xml` was a committed build artefact that `npm run build` never
 * regenerated, and only `npm run build:feeds` did, by hand. So it drifted, and on
 * 5 September 2026 the live feed was still titled "The Licensee's Guide" five days
 * after the section was renamed to Guides, still described the company by a position
 * that had been replaced on 2 September, and 13 of its 20 articles still linked to
 * /ways-to-work, which phase 4 deleted on 31 August. Every subscriber had all of it.
 *
 * A route is built from the same posts the pages are, on every build, and cannot fall
 * behind them. `src/test/feeds.test.ts` asserts no static file returns to shadow it.
 */
export function GET(): Response {
  return new Response(generateRSSFeed(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
