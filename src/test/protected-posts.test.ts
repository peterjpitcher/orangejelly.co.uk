import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

import baseline from '../../tasks/repositioning/data/baselines/protected-posts-2026-08-27.json';

/**
 * The 30 blog posts that carry 95% of the site's search traffic.
 *
 * The whole site earns 969 clicks a year and the blog is 92.9% of that, so these
 * 30 files are effectively the company's entire organic presence. Fourteen of them
 * carry 80% on their own.
 *
 * WHAT THIS ENFORCES, AND WHAT IT DELIBERATELY DOES NOT. The path is immutable:
 * a protected post must keep its slug and keep existing. Everything else is a
 * change budget rather than a freeze, because WS8 has to rewrite titles and
 * headings on these very posts to fix their rankings. Freezing them would block
 * the highest-yield work in the programme.
 *
 * So this test guards the one thing that can silently destroy value (a URL moving
 * or a file vanishing) and stays out of the way of the work that creates it.
 *
 * @see tasks/repositioning/data/protected-posts-register.csv
 * @see tasks/repositioning/IMPLEMENTATION-SPEC.md WS6, the per-tier change budget
 */
describe('protected blog posts', () => {
  const posts = baseline.posts;

  it('has the expected shape: 30 posts, 14 critical and 16 protected', () => {
    expect(posts).toHaveLength(30);
    expect(posts.filter((p) => p.tier === '1-critical')).toHaveLength(14);
    expect(posts.filter((p) => p.tier === '2-protected')).toHaveLength(16);
  });

  it('never loses a protected post: every slug still has a source file', () => {
    const missing = posts
      .filter((p) => !existsSync(path.join(process.cwd(), 'content', 'blog', `${p.slug}.md`)))
      .map((p) => `${p.url} (${p.search.clicks} clicks/yr, ${p.search.impressions} impressions)`);

    expect(
      missing,
      `a protected post lost its source file. If a merge or rename was intended it needs a redirect in the route manifest and a note in decisions.md:\n${missing.join('\n')}`
    ).toEqual([]);
  });

  it('keeps every protected post published', () => {
    const unpublished = posts
      .map((p) => {
        const file = path.join(process.cwd(), 'content', 'blog', `${p.slug}.md`);
        if (!existsSync(file)) return null;
        const { data } = matter(readFileSync(file, 'utf8'));
        const status = String(data.status ?? 'published').replace(/"/g, '');
        return status === 'published' ? null : `${p.url} is "${status}"`;
      })
      .filter(Boolean);

    expect(unpublished, `a protected post was unpublished:\n${unpublished.join('\n')}`).toEqual([]);
  });

  it('does not let a protected post become a redirect source', async () => {
    const { getNonIndexablePaths } = await import('@/lib/route-manifest');
    const blocked = new Set(getNonIndexablePaths());
    const redirected = posts.filter((p) => blocked.has(p.url)).map((p) => p.url);

    expect(
      redirected,
      `a protected post is being redirected away, which throws its rankings:\n${redirected.join('\n')}`
    ).toEqual([]);
  });

  it('records enough baseline to prove a regression later', () => {
    for (const post of posts) {
      expect(post.search.impressions, `${post.url} has no impression baseline`).toBeGreaterThan(0);
      expect(post.page.title, `${post.url} has no title baseline`).toBeTruthy();
      expect(post.page.wordCount, `${post.url} has no word count baseline`).toBeGreaterThan(200);
    }
  });
});
