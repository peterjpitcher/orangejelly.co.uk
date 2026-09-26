import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  DEFAULT_SHARE_IMAGE,
  SHARE_CARD_SAFE_BAND,
  SHARE_CARD_SIZE,
} from '@/lib/share-card/constants';

/**
 * Every page that sets its own `openGraph` names a share image.
 *
 * WHY. Next.js replaces a parent's `openGraph` object with the child's rather than
 * merging the two, so a page that declares a title and description and no `images`
 * throws the root layout's card away. On 26 September 2026, 28 of the 145 URLs in the
 * sitemap shared with no picture at all for exactly this reason: About, Contact,
 * Results, every growth problem and every insight. Nothing looked broken on the page,
 * so nothing caught it until a link was pasted into WhatsApp.
 *
 * Read from source, like src/test/canonical-urls.test.ts and for the same reason: the
 * literal is what a reviewer reads and the literal is what went wrong. A segment with
 * its own `opengraph-image.tsx` is exempt, because Next.js lets that file win over any
 * `openGraph.images` in the same segment.
 */
const APP = path.resolve(__dirname, '../app');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry) ? [full] : [];
  });
}

/** The text of every `openGraph: { ... }` object literal in a file, braces balanced. */
function openGraphBlocks(source: string): string[] {
  const blocks: string[] = [];
  for (const match of source.matchAll(/openGraph:\s*\{/g)) {
    const start = match.index ?? 0;
    let depth = 0;
    for (let at = start + match[0].length - 1; at < source.length; at += 1) {
      if (source[at] === '{') depth += 1;
      if (source[at] === '}') depth -= 1;
      if (depth === 0) {
        blocks.push(source.slice(start, at + 1));
        break;
      }
    }
  }
  return blocks;
}

const hasOwnCard = (file: string): boolean =>
  existsSync(path.join(path.dirname(file), 'opengraph-image.tsx'));

describe('share images in page metadata', () => {
  const declaring = sourceFiles(APP)
    .map((file) => ({ file, blocks: openGraphBlocks(readFileSync(file, 'utf8')) }))
    .filter(({ blocks }) => blocks.length > 0);

  it('finds the metadata it is meant to be checking', () => {
    // A guard that matches nothing passes forever. The layout and the pages fixed on
    // 26 September must all be in view.
    expect(declaring.length).toBeGreaterThanOrEqual(18);
  });

  it.each(
    sourceFiles(APP)
      .filter((file) => openGraphBlocks(readFileSync(file, 'utf8')).length > 0)
      .map((file) => path.relative(APP, file))
  )('%s names an image in every openGraph block', (relative) => {
    const file = path.join(APP, relative);
    if (hasOwnCard(file)) return;
    for (const block of openGraphBlocks(readFileSync(file, 'utf8'))) {
      expect(block, `${relative} sets openGraph without images`).toMatch(/\bimages\s*:/);
    }
  });

  it('no longer points anything at the retired picture', () => {
    // og-default.jpg said "AI-Powered Marketing for UK Pubs": the old position, on
    // every guide listing and in the metadata helper's default.
    const offenders = sourceFiles(path.resolve(__dirname, '..')).filter((file) =>
      /['"]\/images\/og-default\.jpg/.test(readFileSync(file, 'utf8'))
    );
    expect(offenders.map((file) => path.relative(APP, file))).toEqual([]);
    expect(existsSync(path.resolve(__dirname, '../../public/images/og-default.jpg'))).toBe(false);
  });
});

describe('the share card constants', () => {
  it('describes a square', () => {
    expect(SHARE_CARD_SIZE.width).toBe(SHARE_CARD_SIZE.height);
    expect(DEFAULT_SHARE_IMAGE.width).toBe(SHARE_CARD_SIZE.width);
    expect(DEFAULT_SHARE_IMAGE.height).toBe(SHARE_CARD_SIZE.height);
  });

  it('keeps the safe band inside a centred 1.91:1 crop', () => {
    const kept = Math.round(SHARE_CARD_SIZE.width / 1.91);
    const top = (SHARE_CARD_SIZE.height - kept) / 2;
    expect(SHARE_CARD_SAFE_BAND.top).toBeGreaterThan(top);
    expect(SHARE_CARD_SAFE_BAND.bottom).toBeLessThan(top + kept);
  });

  it('points at the default card route', () => {
    expect(existsSync(path.join(APP, 'opengraph-image.tsx'))).toBe(true);
    expect(DEFAULT_SHARE_IMAGE.url).toBe('/opengraph-image');
  });
});
