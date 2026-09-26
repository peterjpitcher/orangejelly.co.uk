import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

import { SHARE_CARD_SIZE } from './constants';
import { SHARE_CARD_FONT, ShareCardLayout, type ShareCard, type ShareCardAssets } from './layout';

export type { ShareCard } from './layout';

/*
 * Every path is a literal joined to `process.cwd()`, the form Next.js traces into the
 * serverless bundle. The survey card is drawn per request, so a file the trace misses
 * would be missing at runtime, not at build.
 */
const FONT_700 = path.join(process.cwd(), 'src/lib/share-card/fonts/SchibstedGrotesk-700.ttf');
const FONT_900 = path.join(process.cwd(), 'src/lib/share-card/fonts/SchibstedGrotesk-900.ttf');
const LOGO_WHITE = path.join(process.cwd(), 'public/brand/logo-horizontal-white.png');

const dataUri = (png: Buffer): string => `data:image/png;base64,${png.toString('base64')}`;

let loading: Promise<ShareCardAssets> | undefined;

/**
 * Fonts and logo, read once per server instance.
 *
 * A failed read is not cached, so a transient error costs one card rather than every
 * card until the next deploy. It still throws: a card in the wrong face or without the
 * logo is the thing being replaced, so it fails loudly instead of degrading quietly.
 */
function loadAssets(): Promise<ShareCardAssets> {
  loading ??= Promise.all([readFile(FONT_700), readFile(FONT_900), readFile(LOGO_WHITE)])
    .then(([bold, black, logoWhite]) => ({
      fonts: [
        { name: SHARE_CARD_FONT, data: bold, weight: 700 as const, style: 'normal' as const },
        { name: SHARE_CARD_FONT, data: black, weight: 900 as const, style: 'normal' as const },
      ],
      logoWhite: dataUri(logoWhite),
    }))
    .catch((error: unknown) => {
      loading = undefined;
      throw error;
    });
  return loading;
}

/** Draws a share card: a 1200 by 1200 PNG in the brand face, with the supplied logo. */
export async function renderShareCard(card: ShareCard): Promise<ImageResponse> {
  const assets = await loadAssets();
  return new ImageResponse(<ShareCardLayout card={card} assets={assets} />, {
    ...SHARE_CARD_SIZE,
    fonts: assets.fonts,
  });
}
