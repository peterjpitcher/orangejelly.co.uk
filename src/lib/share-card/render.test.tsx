import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAllBlogPosts } from '@/lib/markdown/index';

import sharp from 'sharp';

import { SHARE_CARD_SAFE_BAND, SHARE_CARD_SIZE } from './constants';
import { titleSize } from './layout';
import { renderShareCard, type ShareCard } from './render';

/**
 * The cards are drawn by next/og, which fails in ways a type check cannot see: a font
 * it cannot parse, a logo path that does not resolve, a flex rule satori rejects. These
 * draw each kind of card for real and read the PNG header back.
 */
async function png(response: Response): Promise<{ width: number; height: number; type: string }> {
  const bytes = Buffer.from(await response.arrayBuffer());
  expect(bytes.subarray(1, 4).toString()).toBe('PNG');
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    type: response.headers.get('content-type') ?? '',
  };
}

const SQUARE = { ...SHARE_CARD_SIZE, type: 'image/png' };

const longestGuideTitle = (): string =>
  getAllBlogPosts(path.join(process.cwd(), 'content/blog'), { draft: false, dateTo: new Date() })
    .map((post) => String(post.frontMatter.title))
    .sort((a, b) => b.length - a.length)[0];

describe('renderShareCard', () => {
  it('draws the default card as a square PNG', async () => {
    expect(await png(await renderShareCard({ kind: 'brand' }))).toEqual(SQUARE);
  });

  it('draws the longest published guide title', async () => {
    const title = longestGuideTitle();
    expect(title.length).toBeGreaterThan(60);
    expect(
      await png(await renderShareCard({ kind: 'titled', eyebrow: 'Revenue & Growth', title }))
    ).toEqual(SQUARE);
  });

  it('draws a survey card with its footer', async () => {
    expect(
      await png(
        await renderShareCard({
          kind: 'titled',
          eyebrow: 'Survey',
          title: 'Which tools would make running your pub easier?',
          note: 'About 3 minutes.',
          address: 'orangejelly.co.uk/survey/pub-apps',
        })
      )
    ).toEqual(SQUARE);
  });
});

/**
 * Where the logo and the words actually landed, read back from the pixels.
 *
 * The logo is the only white on the card and the title the only ink between the running
 * head and the footer band, so their rows can be found by colour alone.
 */
async function footprint(card: ShareCard) {
  const response = await renderShareCard(card);
  const { data, info } = await sharp(Buffer.from(await response.arrayBuffer()))
    .raw()
    .toBuffer({ resolveWithObject: true });
  const logo = { top: Infinity, bottom: -1 };
  const words = { top: Infinity, bottom: -1, right: -1 };
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const i = (y * info.width + x) * info.channels;
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      if (r > 240 && g > 240 && b > 240 && y < 600) {
        logo.top = Math.min(logo.top, y);
        logo.bottom = Math.max(logo.bottom, y);
      }
      if (r < 90 && g < 90 && b < 90 && y >= 200 && y < 930) {
        words.top = Math.min(words.top, y);
        words.bottom = Math.max(words.bottom, y);
        words.right = Math.max(words.right, x);
      }
    }
  }
  return { logo, words };
}

describe('the crop-safe band', () => {
  /*
   * LinkedIn, Facebook and X show only the middle 1.91:1 strip of a square card, so the
   * logo and every word of the title have to land inside SHARE_CARD_SAFE_BAND. The
   * title's size steps down with its length; the longest real title in each step is
   * where a step would first overflow, so those are the ones drawn.
   */
  const titles = getAllBlogPosts(path.join(process.cwd(), 'content/blog'), {
    draft: false,
    dateTo: new Date(),
  }).map((post) => String(post.frontMatter.title));
  const longestPerStep = [...new Set(titles.map(titleSize))].map(
    (size) =>
      titles.filter((title) => titleSize(title) === size).sort((a, b) => b.length - a.length)[0]
  );

  it.each([['the default card', null], ...longestPerStep.map((title) => [title, title])])(
    'keeps %s inside the band',
    async (_label, title) => {
      const card: ShareCard = title
        ? { kind: 'titled', eyebrow: 'Guides · Revenue & Growth', title }
        : { kind: 'brand' };
      const { logo, words } = await footprint(card);
      expect(logo.top).toBeGreaterThanOrEqual(SHARE_CARD_SAFE_BAND.top);
      expect(logo.bottom).toBeLessThanOrEqual(SHARE_CARD_SAFE_BAND.bottom);
      expect(words.top).toBeGreaterThanOrEqual(SHARE_CARD_SAFE_BAND.top);
      expect(words.bottom).toBeLessThanOrEqual(SHARE_CARD_SAFE_BAND.bottom);
      expect(words.right).toBeLessThan(SHARE_CARD_SIZE.width - 40);
    },
    20_000
  );
});

describe('the card routes', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('@/lib/db/surveys');
  });

  it('draws the default route', async () => {
    const route = await import('@/app/opengraph-image');
    expect(route.size).toEqual(SHARE_CARD_SIZE);
    expect(await png(await route.default())).toEqual(SQUARE);
  });

  it('draws a card for every published guide it will pre-render', async () => {
    const route = await import('@/app/guides/[slug]/opengraph-image');
    const params = route.generateStaticParams();
    expect(params.length).toBeGreaterThan(100);
    expect(await png(await route.default({ params: params[0] }))).toEqual(SQUARE);
  });

  it('still draws a survey card when the database is down', async () => {
    // The card is best-effort by design: a neutral card beats a broken image under a
    // link somebody has already shared. The error is logged, not swallowed.
    vi.doMock('@/lib/db/surveys', () => ({
      getSurveyForVisitor: vi.fn().mockRejectedValue(new Error('connection refused')),
    }));
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    const route = await import('@/app/survey/[slug]/opengraph-image');
    expect(await png(await route.default({ params: { slug: 'pub-apps' } }))).toEqual(SQUARE);
    expect(logged).toHaveBeenCalled();
    logged.mockRestore();
  });
});
