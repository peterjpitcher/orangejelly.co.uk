import fs from 'fs';
import path from 'path';
import { getAllPosts, getCategories } from './blog-md';
import { getBaseUrl } from './site-config';

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  author: {
    name: string;
    email: string;
  };
  language: string;
}

const siteConfig: SiteConfig = {
  title: 'Orange Jelly - Pub Marketing & Business Growth',
  description:
    'Expert pub marketing strategies, business growth tips, and practical advice for UK publicans. From empty pub solutions to premium positioning.',
  url: getBaseUrl(),
  author: {
    name: 'Peter Pitcher',
    email: 'peter@orangejelly.co.uk',
  },
  language: 'en-GB',
};

/**
 * Generate RSS feed for blog posts
 */
export function generateRSSFeed(): string {
  const posts = getAllPosts()
    .filter((post) => post && post.title && post.slug) // Filter out invalid posts
    .slice(0, 20); // Latest 20 posts
  const buildDate = new Date().toUTCString();
  const lastBuildDate =
    posts.length > 0 && posts[0].publishedDate
      ? new Date(posts[0].publishedDate).toUTCString()
      : buildDate;

  const rssItems = posts
    .map((post) => {
      const postUrl = `${siteConfig.url}/licensees-guide/${post.slug}`;
      const pubDate = new Date(post.publishedDate || Date.now()).toUTCString();

      return `
    <item>
      <title><![CDATA[${post.title || 'Untitled'}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${post.excerpt || 'No description available'}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>${siteConfig.author.email} (${siteConfig.author.name})</author>
      <category><![CDATA[${post.category || 'uncategorized'}]]></category>
      ${(post.tags || []).map((tag) => `<category><![CDATA[${tag}]]></category>`).join('')}
      ${post.featuredImage ? `<enclosure url="${siteConfig.url}${post.featuredImage}" type="image/svg+xml" />` : ''}
    </item>`.trim();
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title><![CDATA[${siteConfig.title}]]></title>
    <link>${siteConfig.url}</link>
    <description><![CDATA[${siteConfig.description}]]></description>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <language>${siteConfig.language}</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>Orange Jelly RSS Generator</generator>
    <managingEditor>${siteConfig.author.email} (${siteConfig.author.name})</managingEditor>
    <webMaster>${siteConfig.author.email} (${siteConfig.author.name})</webMaster>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteConfig.url}/logo.png</url>
      <title><![CDATA[${siteConfig.title}]]></title>
      <link>${siteConfig.url}</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return rss.trim();
}

/**
 * Generate JSON feed (modern alternative to RSS)
 */
export function generateJSONFeed(): string {
  const posts = getAllPosts()
    .filter((post) => post && post.title && post.slug) // Filter out invalid posts
    .slice(0, 20);

  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: siteConfig.title,
    description: siteConfig.description,
    home_page_url: siteConfig.url,
    feed_url: `${siteConfig.url}/feed.json`,
    language: siteConfig.language,
    author: {
      name: siteConfig.author.name,
      email: siteConfig.author.email,
    },
    icon: `${siteConfig.url}/icon-512.png`,
    favicon: `${siteConfig.url}/favicon.ico`,
    items: posts.map((post) => ({
      id: `${siteConfig.url}/licensees-guide/${post.slug}`,
      url: `${siteConfig.url}/licensees-guide/${post.slug}`,
      title: post.title || 'Untitled',
      content_html: post.content || '',
      summary: post.excerpt || 'No description available',
      date_published: new Date(post.publishedDate || Date.now()).toISOString(),
      date_modified: (post.updatedDate
        ? new Date(post.updatedDate)
        : new Date(post.publishedDate || Date.now())
      ).toISOString(),
      author: {
        name: siteConfig.author.name,
        email: siteConfig.author.email,
      },
      tags: post.tags || [],
      image: post.featuredImage ? `${siteConfig.url}${post.featuredImage}` : undefined,
    })),
  };

  return JSON.stringify(jsonFeed, null, 2);
}

/**
 * Generate XML sitemap
 */
export function generateSitemap(): string {
  const posts = getAllPosts().filter((post) => post && post.slug); // Filter out invalid posts
  const categories = getCategories();

  const staticPages = [
    { url: '', priority: 1.0, changefreq: 'weekly' },
    { url: '/about', priority: 0.8, changefreq: 'monthly' },
    { url: '/services', priority: 0.9, changefreq: 'monthly' },
    { url: '/contact', priority: 0.7, changefreq: 'monthly' },
    { url: '/results', priority: 0.8, changefreq: 'monthly' },
    { url: '/licensees-guide', priority: 0.9, changefreq: 'daily' },
  ];

  const currentDate = new Date().toISOString();

  const staticUrls = staticPages
    .map(
      (page) => `
  <url>
    <loc>${siteConfig.url}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('');

  const categoryUrls = categories
    .map(
      (category) => `
  <url>
    <loc>${siteConfig.url}/licensees-guide/category/${category.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('');

  const postUrls = posts
    .map((post) => {
      const lastmod = post.updatedDate || post.publishedDate || new Date().toISOString();
      return `
  <url>
    <loc>${siteConfig.url}/licensees-guide/${post.slug}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${staticUrls}
  ${categoryUrls}
  ${postUrls}
</urlset>`;

  return sitemap.trim();
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  return `# Orange Jelly - Pub Marketing
User-agent: *
Allow: /

# Important pages
Allow: /licensees-guide/
Allow: /services/
Allow: /results/
Allow: /about/

# Sitemaps
Sitemap: ${siteConfig.url}/sitemap.xml

# Crawl-delay for politeness
Crawl-delay: 1

# Specific bot instructions
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Block admin and private areas
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /private/

# Block sensitive files
Disallow: /*.json$
Disallow: /search-index.json`;
}

/**
 * Save feeds and sitemap to public directory
 */
export function saveFeeds(): void {
  const publicDir = path.join(process.cwd(), 'public');

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  try {
    // Generate and save RSS feed
    const rss = generateRSSFeed();
    fs.writeFileSync(path.join(publicDir, 'rss.xml'), rss, 'utf8');
    console.log('RSS feed generated: /public/rss.xml');

    // Generate and save JSON feed
    const jsonFeed = generateJSONFeed();
    fs.writeFileSync(path.join(publicDir, 'feed.json'), jsonFeed, 'utf8');
    console.log('JSON feed generated: /public/feed.json');

    console.log(`\nFeeds generated successfully:`);
    console.log(`- RSS Feed: ${siteConfig.url}/rss.xml`);
    console.log(`- JSON Feed: ${siteConfig.url}/feed.json`);
    console.log(`- Sitemap route: ${siteConfig.url}/sitemap.xml`);
    console.log(`- Robots route: ${siteConfig.url}/robots.txt`);
  } catch (error) {
    console.error('Error generating feeds:', error);
    throw error;
  }
}

/**
 * Get feed statistics
 */
export function getFeedStats() {
  const posts = getAllPosts();
  const categories = getCategories();

  return {
    totalPosts: posts.length,
    totalCategories: categories.length,
    latestPost: posts.length > 0 ? posts[0].publishedDate : null,
    oldestPost: posts.length > 0 ? posts[posts.length - 1].publishedDate : null,
    postsThisMonth: posts.filter((post) => {
      const postDate = new Date(post.publishedDate);
      const now = new Date();
      return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
    }).length,
    categoriesWithPosts: categories.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      count: posts.filter((post) => post.category === cat.slug).length,
    })),
  };
}
