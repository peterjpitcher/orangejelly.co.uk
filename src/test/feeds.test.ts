import { existsSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { generateJSONFeed, generateRSSFeed } from '@/lib/feeds';

/**
 * The RSS and JSON feeds.
 *
 * Both were committed files in `public/` that only `npm run build:feeds` rebuilt, and
 * `npm run build` never called it. They shipped stale for five days in September 2026:
 * a section name changed 31 August, a company description changed 2 September, and
 * 13 of 20 articles still linking to a page phase 4 had deleted.
 *
 * The first test is the one that keeps them fixed. A file at `public/rss.xml` is
 * served in preference to `src/app/rss.xml/route.ts` and would shadow it silently,
 * which is the same trap `src/test/robots.test.ts` guards for robots.txt.
 *
 * Nothing here asserts the wording. The feed description is company copy and belongs
 * to `scripts/check-positioning.mjs`; restating it in a second place is what left the
 * llms.txt synthetic check asserting a phrase the site had stopped using.
 */
describe('the feeds', () => {
  it('has no static file in public/ to shadow either route', () => {
    for (const name of ['rss.xml', 'feed.json']) {
      expect(existsSync(path.join(process.cwd(), 'public', name))).toBe(false);
    }
  });

  it('builds RSS that is well formed and carries items', () => {
    const rss = generateRSSFeed();
    expect(rss.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(rss.trimEnd().endsWith('</rss>')).toBe(true);
    expect(rss.match(/<item>/g)?.length ?? 0).toBeGreaterThan(0);
  });

  it('builds JSON that parses and carries the same items as the RSS', () => {
    const rss = generateRSSFeed();
    const feed = JSON.parse(generateJSONFeed());

    expect(feed.version).toBe('https://jsonfeed.org/version/1.1');
    expect(feed.items).toHaveLength(rss.match(/<item>/g)?.length ?? 0);

    // A feed item with no id or url is one a reader cannot open or de-duplicate.
    for (const item of feed.items) {
      expect(item.id).toBeTruthy();
      expect(item.url).toBeTruthy();
      expect(item.title).toBeTruthy();
    }
  });

  it('points every feed URL at the live site', () => {
    // Built from getBaseUrl(), which falls back to production, so what this catches is
    // a deployment configured with a localhost or otherwise wrong NEXT_PUBLIC_BASE_URL.
    const feed = JSON.parse(generateJSONFeed());
    for (const url of [
      feed.home_page_url,
      feed.feed_url,
      ...feed.items.map((i: { url: string }) => i.url),
    ]) {
      expect(new URL(url).hostname.endsWith('orangejelly.co.uk')).toBe(true);
    }
  });
});
