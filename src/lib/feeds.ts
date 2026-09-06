import { getAllPosts } from './blog-md';
import { getBaseUrl } from './site-config';

/**
 * The two feeds, built from the same posts the pages are.
 *
 * These were written to `public/rss.xml` and `public/feed.json` by `npm run
 * build:feeds`, which `npm run build` never called. Whether a subscriber saw the
 * current site depended on somebody remembering to run a second command, and on
 * 5 September 2026 nobody had for five days. They are routes now, in
 * `src/app/rss.xml` and `src/app/feed.json`, so a build cannot produce a site and a
 * stale feed at the same time.
 *
 * Deleted with that change: `saveFeeds()`, which wrote the files, and three functions
 * nothing had ever called. `generateSitemap()` and `generateRobotsTxt()` were second
 * copies of rules that `src/app/sitemap.ts` and `src/app/robots.ts` own, and the
 * robots one still allowed `/services/`, a path retired in the repositioning, and
 * disallowed `/*.json, which would have blocked the JSON feed. `src/test/robots.test.ts`
 * had already flagged it as needing to go. `getFeedStats()` had no caller either.
 */

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

/*
 * This describes the FEED, not the company.
 *
 * The feed carries the licensees' guide, which is genuinely a hospitality article
 * library, so naming the sector here is accurate rather than the old position
 * leaking through. What changed is the title: it said "Orange Jelly - Pub Marketing
 * & Business Growth", which described the company by the collection.
 */
const siteConfig: SiteConfig = {
  title: 'Guides | Orange Jelly',
  description:
    'Practical guides for people running pubs: filling quiet sessions, protecting margin, and getting found locally. Published by Orange Jelly, which builds websites, bespoke applications and connected systems for business growth.',
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
      const postUrl = `${siteConfig.url}/guides/${post.slug}`;
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
      id: `${siteConfig.url}/guides/${post.slug}`,
      url: `${siteConfig.url}/guides/${post.slug}`,
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
