import { type MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog-md';
import { blogCategories } from '@/lib/blog';
import { getBaseUrl } from '@/lib/site-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Landing pages are handled as static pages

  // Individual service pages that render their own self-canonical content.
  // (instagram/facebook are intentionally excluded: they 301 to the social hub.)
  const serviceRoutes = [
    'social-media-marketing-for-pubs',
    'paid-social-for-pubs',
    'content-creation-for-pubs',
  ];
  const servicePages = serviceRoutes.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: '2026-08-09',
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // Static pages carry hand-maintained last-modified dates, so they must be bumped
  // whenever a page's rendered output changes. Every entry below was set to 2026-08-09
  // when titles, meta descriptions and body copy were rewritten across the site; leaving
  // them stale would have told Google there was nothing new to recrawl on exactly the
  // pages whose snippets had just been rewritten to earn more clicks.
  const staticPages = [
    {
      url: baseUrl,
      lastModified: '2026-08-09',
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ways-to-work`,
      lastModified: '2026-08-09',
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ways-to-work/growth-fix`,
      lastModified: '2026-08-09',
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/ways-to-work/momentum-month`,
      lastModified: '2026-08-09',
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/ways-to-work/growth-partner`,
      lastModified: '2026-08-09',
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/ways-to-work/turnaround-intensive`,
      lastModified: '2026-08-09',
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/capabilities`,
      lastModified: '2026-08-09',
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: '2026-08-09',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: '2026-08-09',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: '2026-08-09',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/licensees-guide`,
      lastModified: '2026-08-09',
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  const marketingRoutes: Array<{
    slug: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }> = [
    { slug: 'fix-my-pub', changeFrequency: 'monthly', priority: 0.8 },
    { slug: 'pub-rescue', changeFrequency: 'monthly', priority: 0.75 },
    // The eight county pages were consolidated into /pub-marketing and now 301 to it,
    // so they must not appear here. A sitemap listing redirecting URLs wastes crawl
    // budget and tells Google the redirect was unintended.
    { slug: 'pub-marketing', changeFrequency: 'weekly', priority: 0.85 },
    { slug: 'quiet-midweek-solutions', changeFrequency: 'monthly', priority: 0.75 },
    { slug: 'empty-pub-solutions', changeFrequency: 'monthly', priority: 0.75 },
    { slug: 'pub-marketing-no-budget', changeFrequency: 'monthly', priority: 0.7 },
    { slug: 'compete-with-pub-chains', changeFrequency: 'monthly', priority: 0.7 },
    { slug: 'pub-marketing-agency', changeFrequency: 'monthly', priority: 0.8 },
  ];

  const marketingPages = marketingRoutes.map((route) => ({
    url: `${baseUrl}/${route.slug}`,
    lastModified: '2026-08-09',
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Dynamically get all blog posts. Exclude slugs that 301-redirect/retire so we never
  // advertise a non-200 URL in the sitemap (e.g. cash-flow-crisis-breaking-cycle now
  // redirects to /fix-my-pub via next.config redirects).
  const REDIRECTED_GUIDE_SLUGS = new Set(['cash-flow-crisis-breaking-cycle']);
  const allPosts = getAllPosts();
  const blogPages = allPosts
    .filter((post) => !REDIRECTED_GUIDE_SLUGS.has(post.slug))
    .map((post) => ({
      url: `${baseUrl}/licensees-guide/${post.slug}`,
      lastModified: post.updatedDate || post.publishedDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // Dynamically get all categories
  const categoryPages = blogCategories.map((category) => ({
    url: `${baseUrl}/licensees-guide/category/${category.slug}`,
    lastModified: '2026-08-09',
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...marketingPages, ...servicePages, ...blogPages, ...categoryPages];
}
