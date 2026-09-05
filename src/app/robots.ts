import { type MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/site-config';

/**
 * The site's only robots.txt. Next serialises this metadata route at build time, and
 * there is deliberately no `public/robots.txt`, because a static file at that path
 * would collide with the route.
 *
 * FOUR RULES WERE REMOVED ON 5 SEPTEMBER 2026. A crawl of all 145 sitemap URLs
 * measured what each one was actually blocking, and every one of them was blocking
 * something Google needs to render or display the site:
 *
 * - `Disallow: /_next/` blocked every stylesheet and script chunk under
 *   `/_next/static/`: 2 CSS files and 17 JS chunks on the home page alone, 44 distinct
 *   assets sitewide. Search Console had already logged one of those stylesheets under
 *   "Blocked by robots.txt". Google's guidance on CSS and JavaScript is unambiguous:
 *   blocking them stops Google rendering the page as a visitor sees it.
 * - `Disallow: /_next/` also blocked the image optimiser, `/_next/image?url=...`, which
 *   is what 394 of the 398 `<img>` elements on the site point at. The image files
 *   themselves under `/images/**` were always reachable; the URLs the pages actually
 *   reference were not.
 * - `Disallow: /icon` blocked `/icon.png?<hash>`, matched through the query string
 *   because robots patterns are prefixes. There is no `/favicon.ico`, so that file is
 *   the site's only favicon, linked on all 145 pages, and Google will not show a
 *   favicon it may not fetch.
 * - `Disallow: /apple-icon` blocked the apple-touch-icon linked on all 145 pages.
 * - `Disallow: /opengraph-image` blocked the generated social image: the `og:image` on
 *   4 pages and the `twitter:image` on 32.
 *
 * Nothing under `/_next/` is sensitive. It is build output, with no published source
 * maps and no server-only value reaching a client bundle. That was checked, not
 * assumed, before the rule came out.
 *
 * THE FOUR RULES THAT REMAIN, and why each one earns its place:
 *
 * - `/api/` is machinery rather than content. Nothing under it renders a page, and the
 *   admin routes behind it sit behind a bearer gate.
 * - `/admin/` is the Supabase-gated admin area. Note that it does not match the bare
 *   path `/admin`, and that is deliberate: `/admin` is kept out of the index by its own
 *   `noindex, nofollow` metadata, not by robots.
 * - `/private/` is reserved for anything published to the filesystem but not to search.
 * - `/search-index.json` is a build artefact for the on-site search box, not a page.
 *
 * `src/test/robots.test.ts` gates this file by running the serialised output through a
 * Robots Exclusion Protocol matcher, so an asset that quietly stops being crawlable
 * fails a test here rather than surfacing in Search Console weeks later.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/private/', '/search-index.json'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
