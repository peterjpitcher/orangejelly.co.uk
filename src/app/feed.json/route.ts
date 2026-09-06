import { generateJSONFeed } from '@/lib/feeds';

export const dynamic = 'force-static';

/**
 * The JSON Feed, a route for the same reason `rss.xml` is. See that file for what
 * drifted while both were committed artefacts in `public/`.
 *
 * Content-Type stays `application/json`, which is what Vercel served the static file
 * as. JSON Feed registers `application/feed+json` and readers accept both, but nothing
 * on the site links to this feed, so any consumer of it found the URL when it was
 * served as plain JSON. Changing the type is a decision of its own, not a side effect
 * of moving the file.
 */
export function GET(): Response {
  return new Response(generateJSONFeed(), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
