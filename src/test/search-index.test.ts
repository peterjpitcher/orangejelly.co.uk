import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { searchItemUrl, type SearchableItem } from '@/lib/search';

/**
 * The search index is fetched by the browser on first use, and mobile is 78% of
 * this site's search clicks. It used to carry every article in full, which made a
 * 936KB file: most of a megabyte spent on a feature most visitors never open.
 *
 * These hold the two things that regressed silently before: the size, and the
 * assumption that every item lives under /licensees-guide.
 */
describe('search index', () => {
  const file = path.join(process.cwd(), 'public', 'search-index.json');
  const items = JSON.parse(readFileSync(file, 'utf8')) as SearchableItem[];

  it('stays small enough to send to a phone', () => {
    const kb = statSync(file).size / 1024;
    // Was 936KB. The cap is generous against the current 196KB so ordinary content
    // growth does not trip it, but a return to full-text indexing will.
    expect(kb, `search index is ${Math.round(kb)}KB`).toBeLessThan(400);
  });

  it('tags every item with its collection', () => {
    const untagged = items.filter((item) => !item.collection).map((item) => item.slug);
    expect(untagged).toEqual([]);
  });

  it('derives urls from the collection rather than hard-coding one', () => {
    const wrong = items
      .filter((item) => item.url !== searchItemUrl(item.collection, item.slug))
      .map((item) => item.url);
    expect(wrong).toEqual([]);
  });

  it('keeps enough of each article to match on phrasing', () => {
    const empty = items.filter((item) => !item.content || item.content.length < 100);
    expect(empty.map((i) => i.slug)).toEqual([]);
  });

  it('indexes every protected post, since those are the ones people search for', () => {
    const slugs = new Set(items.map((item) => item.slug));
    for (const slug of [
      'quiz-night-ideas',
      'summer-pub-event-ideas',
      'profitable-pub-food-menu-ideas',
    ]) {
      expect(slugs.has(slug), `${slug} missing from the search index`).toBe(true);
    }
  });
});
