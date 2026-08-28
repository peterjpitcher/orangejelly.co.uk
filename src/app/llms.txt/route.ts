import { buildLlmsTxt } from '@/lib/llms';

export const dynamic = 'force-static';

/**
 * Served as a route rather than a file in `public/`, so it is generated from the
 * same data the pages use and cannot drift away from them. The hand-maintained
 * version it replaces had five services at prices that no longer exist.
 */
export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
