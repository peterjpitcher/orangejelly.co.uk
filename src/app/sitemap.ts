import { type MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog-md';
import { blogCategories } from '@/lib/blog';
import { getBaseUrl } from '@/lib/site-config';
import { getSitemapRoutes, getRedirectedGuideSlugs } from '@/lib/route-manifest';
import { CASE_STUDIES } from '@/app/results/case-studies';

/**
 * The static half of this file used to be a hand-maintained list, alongside a
 * hand-maintained set of guide slugs to exclude because they redirect. Both are now
 * read from src/lib/route-manifest.js, which also generates the redirects in
 * next.config.js. One list cannot disagree with itself, so a redirecting URL can no
 * longer be advertised here as indexable.
 *
 * Blog posts, categories and case studies stay dynamic: they are content, not
 * routing. The manifest holds `/results/[slug]` as a live route with sitemap false,
 * because the pattern is not a URL and listing it would advertise a page that does
 * not exist.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const staticPages = getSitemapRoutes().map((route) => ({
    url: route.path === '/' ? baseUrl : `${baseUrl}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: route.priority,
  }));

  // Guide slugs that redirect are excluded by the manifest rather than by a local list.
  const redirectedGuideSlugs = new Set(getRedirectedGuideSlugs());
  const blogPages = getAllPosts()
    .filter((post) => !redirectedGuideSlugs.has(post.slug))
    .map((post) => ({
      url: `${baseUrl}/licensees-guide/${post.slug}`,
      lastModified: post.updatedDate || post.publishedDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  const caseStudyPages = CASE_STUDIES.map((study) => ({
    url: `${baseUrl}/results/${study.slug}`,
    lastModified: '2026-08-28',
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  const categoryPages = blogCategories.map((category) => ({
    url: `${baseUrl}/licensees-guide/category/${category.slug}`,
    lastModified: '2026-08-09',
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...caseStudyPages, ...blogPages, ...categoryPages];
}
