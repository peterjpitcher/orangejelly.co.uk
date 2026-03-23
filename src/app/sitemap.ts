import { type MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog-md';
import { blogCategories } from '@/lib/blog';
import { getBaseUrl } from '@/lib/site-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Landing pages are handled as static pages

  // Services are represented on a single page; avoid fragment URLs in sitemap

  // Define static pages with meaningful last-modified dates
  // reflecting when content was actually updated
  const staticPages = [
    {
      url: baseUrl,
      lastModified: '2026-03-17',
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: '2026-03-10',
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: '2026-03-10',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: '2026-02-15',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: '2026-03-10',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/licensees-guide`,
      lastModified: '2026-03-17',
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  const marketingRoutes: Array<{
    slug: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }> = [
    { slug: 'services/social-media-marketing-for-pubs', changeFrequency: 'monthly', priority: 0.8 },
    { slug: 'services/instagram-services-for-pubs', changeFrequency: 'monthly', priority: 0.75 },
    { slug: 'services/facebook-services-for-pubs', changeFrequency: 'monthly', priority: 0.75 },
    { slug: 'services/paid-social-for-pubs', changeFrequency: 'monthly', priority: 0.75 },
    { slug: 'services/content-creation-for-pubs', changeFrequency: 'monthly', priority: 0.75 },
    { slug: 'fix-my-pub', changeFrequency: 'monthly', priority: 0.8 },
    { slug: 'pub-marketing', changeFrequency: 'weekly', priority: 0.85 },
    { slug: 'pub-marketing-london', changeFrequency: 'monthly', priority: 0.65 },
    { slug: 'pub-marketing-surrey', changeFrequency: 'monthly', priority: 0.6 },
    { slug: 'pub-marketing-berkshire', changeFrequency: 'monthly', priority: 0.6 },
    { slug: 'pub-marketing-buckinghamshire', changeFrequency: 'monthly', priority: 0.6 },
    { slug: 'pub-marketing-hertfordshire', changeFrequency: 'monthly', priority: 0.6 },
    { slug: 'pub-marketing-kent', changeFrequency: 'monthly', priority: 0.6 },
    { slug: 'pub-marketing-hampshire', changeFrequency: 'monthly', priority: 0.6 },
    { slug: 'pub-marketing-oxfordshire', changeFrequency: 'monthly', priority: 0.6 },
    { slug: 'quiet-midweek-solutions', changeFrequency: 'monthly', priority: 0.75 },
    { slug: 'empty-pub-solutions', changeFrequency: 'monthly', priority: 0.75 },
    { slug: 'pub-marketing-no-budget', changeFrequency: 'monthly', priority: 0.7 },
    { slug: 'compete-with-pub-chains', changeFrequency: 'monthly', priority: 0.7 },
    { slug: 'pub-marketing-agency', changeFrequency: 'monthly', priority: 0.8 },
  ];

  const marketingPages = marketingRoutes.map((route) => ({
    url: `${baseUrl}/${route.slug}`,
    lastModified: '2026-03-17',
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Dynamically get all blog posts
  const allPosts = getAllPosts();
  const blogPages = allPosts.map((post) => ({
    url: `${baseUrl}/licensees-guide/${post.slug}`,
    lastModified: post.updatedDate || post.publishedDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamically get all categories
  const categoryPages = blogCategories.map((category) => ({
    url: `${baseUrl}/licensees-guide/category/${category.slug}`,
    lastModified: '2026-03-17',
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...marketingPages, ...blogPages, ...categoryPages];
}
