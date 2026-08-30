import { describe, expect, it } from 'vitest';

/**
 * Titles and meta descriptions on the repositioned pages, held to a length.
 *
 * These are the two strings a search result is made of, and both were drifting long.
 * Nine of the repositioned pages carried a description between 168 and 190
 * characters, against roughly 155 that Google will show. Nothing was broken, so
 * nothing complained: the pages simply got cut off mid-sentence in the results, and
 * the cut always lands at the end, which is where the reason to click lives.
 *
 * The window is the project's own, from CLAUDE.md: descriptions 150-160 characters,
 * titles 50-60. This is lenient at the bottom because a genuinely short description
 * is fine and a truncated one is not, so the floor is about having written one at
 * all rather than about hitting a number.
 *
 * Imported as modules rather than fetched, so this runs without a server. Every page
 * here exports a static `metadata`; a page that moves to `generateMetadata` will fail
 * this loudly rather than silently drop out of the check.
 */
const TITLE_MAX = 65;
const DESCRIPTION_MIN = 70;
const DESCRIPTION_MAX = 160;

const PAGES: Array<[string, () => Promise<{ metadata?: unknown }>]> = [
  ['/', () => import('@/app/page')],
  ['/about', () => import('@/app/about/page')],
  ['/results', () => import('@/app/results/page')],
  ['/solutions', () => import('@/app/solutions/page')],
  ['/start-here', () => import('@/app/start-here/page')],
  ['/how-we-work', () => import('@/app/how-we-work/page')],
  ['/growth-problems', () => import('@/app/growth-problems/page')],
  ['/fractional-cmo', () => import('@/app/fractional-cmo/page')],
  ['/pub-marketing', () => import('@/app/pub-marketing/page')],
  ['/small-business-rescue', () => import('@/app/small-business-rescue/page')],
  ['/sectors/professional-services', () => import('@/app/sectors/professional-services/page')],
  ['/tools/ai-readiness', () => import('@/app/tools/ai-readiness/page')],
  ['/insights', () => import('@/app/insights/page')],
  ['/contact', () => import('@/app/contact/page')],
];

interface PageMetadata {
  title?: unknown;
  description?: unknown;
  alternates?: { canonical?: unknown };
  openGraph?: { title?: unknown; description?: unknown };
}

async function metadataFor(load: () => Promise<{ metadata?: unknown }>): Promise<PageMetadata> {
  const mod = await load();
  return (mod.metadata ?? {}) as PageMetadata;
}

describe('page metadata', () => {
  it.each(PAGES)('%s has a title short enough to survive a search result', async (_path, load) => {
    const { title } = await metadataFor(load);
    expect(typeof title).toBe('string');
    expect((title as string).length).toBeLessThanOrEqual(TITLE_MAX);
  });

  it.each(PAGES)('%s has a description inside the readable window', async (_path, load) => {
    const { description } = await metadataFor(load);
    expect(typeof description).toBe('string');
    const length = (description as string).length;
    expect(length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
    expect(length).toBeLessThanOrEqual(DESCRIPTION_MAX);
  });

  it.each(PAGES)('%s declares a canonical', async (_path, load) => {
    const { alternates } = await metadataFor(load);
    expect(typeof alternates?.canonical).toBe('string');
  });

  it('gives every page its own title', async () => {
    // Two pages sharing a title means one of them is not worth ranking, and it is
    // usually a copy-paste rather than a decision.
    const titles = await Promise.all(
      PAGES.map(async ([path, load]) => [path, (await metadataFor(load)).title] as const)
    );
    const byTitle = new Map<unknown, string[]>();
    for (const [path, title] of titles) {
      byTitle.set(title, [...(byTitle.get(title) ?? []), path]);
    }
    const duplicated = [...byTitle.entries()].filter(([, paths]) => paths.length > 1);
    expect(duplicated).toEqual([]);
  });

  it('gives every page its own description', async () => {
    const descriptions = await Promise.all(
      PAGES.map(async ([path, load]) => [path, (await metadataFor(load)).description] as const)
    );
    const byDescription = new Map<unknown, string[]>();
    for (const [path, description] of descriptions) {
      byDescription.set(description, [...(byDescription.get(description) ?? []), path]);
    }
    const duplicated = [...byDescription.entries()].filter(([, paths]) => paths.length > 1);
    expect(duplicated).toEqual([]);
  });
});
