import type { CSSProperties, ReactNode } from 'react';

import { DEFAULT_SHARE_CARD_COPY, SHARE_CARD_SIZE } from './constants';
import { SHARE_CARD_COLOURS as C } from './palette';

/**
 * The share card layout, drawn by next/og (satori), not by a browser.
 *
 * The square is the site's own chrome in three bands: an orange header carrying the
 * white logo, a cream page carrying the words, and an ink footer carrying the address.
 * Chosen on 26 September 2026 from four rendered directions judged for brand fit,
 * legibility at chat-preview size and survival of a 1.91:1 crop. All cream vanished
 * against WhatsApp's pale green bubble and all ink vanished in dark mode; the bands
 * keep an edge on both.
 *
 * Everything essential sits between y 300 and 900 (see SHARE_CARD_SAFE_BAND), so the
 * strip LinkedIn, Facebook and X crop out of the middle still shows the logo and the
 * whole title. The running head and the footer are the only things outside it.
 *
 * Satori's rules apply: every element with more than one child is `display: flex`, and
 * positions are absolute pixels because there is no document flow to lean on.
 */
export type ShareCard =
  | { kind: 'brand' }
  | {
      kind: 'titled';
      /** Small uppercase label in the orange band, e.g. "Guides · Marketing". */
      eyebrow: string;
      title: string;
      /** A line above the address in the footer, e.g. "About 3 minutes." */
      note?: string;
      /** Defaults to the site's own address. */
      address?: string;
    };

export interface ShareCardAssets {
  fonts: Array<{ name: string; data: Buffer; weight: 700 | 900; style: 'normal' }>;
  /** logo-horizontal-white.png as a data URI. */
  logoWhite: string;
}

export const SHARE_CARD_FONT = 'Schibsted Grotesk';
const SITE_ADDRESS = 'orangejelly.co.uk';

const WIDTH = SHARE_CARD_SIZE.width;
const HEIGHT = SHARE_CARD_SIZE.height;
const MARGIN = 80;
const MEASURE = WIDTH - 2 * MARGIN;

/** The orange band ends inside the crop, so the crop reads as a header over a headline. */
const HEADER_END = 460;
/** The ink band starts below the crop (which keeps rows 286 to 914), so no sliver shows. */
const FOOTER_START = 940;
/** The title box: clear of the header, and ending 28px above the safe band's floor. */
const TITLE_TOP = HEADER_END + 36;
const TITLE_BOTTOM = 872;

/*
 * logo-horizontal-white.png is a 1200x260 canvas with 23px of padding round a 1154x214
 * mark, so the logo is sized and placed by its visible edges. At 600px wide its top sits
 * at y 322, which keeps 22px of clearance even under a 2:1 crop (rows 300 to 900).
 */
const LOGO_SCALE = 600 / 1154;
const LOGO_VISIBLE_TOP = 322;

/**
 * Title size from its length, measured against all 106 guide titles on 26 September
 * 2026: every one fits the box on at most four lines. The second rule stops a single
 * long word running past the measure, since satori will not break inside a word.
 */
export function titleSize(title: string): number {
  const n = title.length;
  const tier =
    n <= 24 ? 120 : n <= 36 ? 104 : n <= 48 ? 92 : n <= 62 ? 82 : n <= 74 ? 76 : n <= 88 ? 70 : 60;
  const longestWord = Math.max(...title.split(/[\s-]+/).map((word) => word.length));
  return Math.min(tier, Math.floor(MEASURE / (longestWord * 0.6)));
}

const at = (style: CSSProperties): CSSProperties => ({
  position: 'absolute',
  display: 'flex',
  ...style,
});

/** The brand's display setting: weight 900, tight leading, -0.025em tracking. */
const display = (size: number): CSSProperties => ({
  fontSize: size,
  fontWeight: 900,
  lineHeight: 1,
  letterSpacing: '-0.025em',
  color: C.ink,
});

function Frame({
  eyebrow,
  note,
  address,
  logo,
  children,
}: {
  eyebrow: string;
  note?: string;
  address: string;
  logo: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        background: C.cream,
        fontFamily: SHARE_CARD_FONT,
      }}
    >
      <div style={at({ left: 0, top: 0, width: WIDTH, height: HEADER_END, background: C.orange })}>
        {/* The site's eyebrow: 700, uppercase, 0.14em. Ink on orange is 5.13:1. */}
        <div
          style={at({
            left: MARGIN,
            top: 104,
            width: MEASURE,
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.ink,
          })}
        >
          {eyebrow}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- satori draws <img>, not next/image */}
        <img
          src={logo}
          alt=""
          width={Math.round(1200 * LOGO_SCALE)}
          height={Math.round(260 * LOGO_SCALE)}
          style={{
            position: 'absolute',
            left: MARGIN - 23 * LOGO_SCALE,
            top: LOGO_VISIBLE_TOP - 23 * LOGO_SCALE,
          }}
        />
      </div>

      <div
        style={at({
          left: MARGIN,
          top: TITLE_TOP,
          width: MEASURE,
          height: TITLE_BOTTOM - TITLE_TOP,
          flexDirection: 'column',
          justifyContent: 'center',
        })}
      >
        {children}
      </div>

      <div
        style={at({
          left: 0,
          top: FOOTER_START,
          width: WIDTH,
          height: HEIGHT - FOOTER_START,
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: MARGIN,
          paddingRight: MARGIN,
          background: C.ink,
          fontSize: 44,
          fontWeight: 700,
          lineHeight: 1.25,
        })}
      >
        {note ? <div style={{ display: 'flex', color: C.cream }}>{note}</div> : null}
        <div style={{ display: 'flex', color: C.peach }}>{address}</div>
      </div>
    </div>
  );
}

/**
 * The default headline, set word by word so the last word can carry the site's orange
 * Mark: a solid band behind the lower part of the line (55% to 96%), which is how the
 * Mark component draws it on the page.
 */
function MarkedHeadline({ text }: { text: string }): JSX.Element {
  const words = text.split(' ');
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', width: MEASURE, ...display(120) }}>
      {words.map((word, index) => {
        const marked = index === words.length - 1;
        return (
          <div
            key={`${word}-${index}`}
            style={{
              display: 'flex',
              position: 'relative',
              padding: marked ? '0 0.08em' : 0,
              marginLeft: marked ? '-0.08em' : 0,
              marginRight: marked ? 0 : '0.2em',
            }}
          >
            {marked ? (
              <div
                style={at({ left: 0, right: 0, top: '55%', bottom: '4%', background: C.orange })}
              />
            ) : null}
            <div style={{ display: 'flex' }}>{word}</div>
          </div>
        );
      })}
    </div>
  );
}

export function ShareCardLayout({
  card,
  assets,
}: {
  card: ShareCard;
  assets: ShareCardAssets;
}): JSX.Element {
  if (card.kind === 'brand') {
    return (
      <Frame
        eyebrow={DEFAULT_SHARE_CARD_COPY.subline}
        address={SITE_ADDRESS}
        logo={assets.logoWhite}
      >
        <MarkedHeadline text={DEFAULT_SHARE_CARD_COPY.headline} />
      </Frame>
    );
  }

  return (
    <Frame
      eyebrow={card.eyebrow}
      note={card.note}
      address={card.address ?? SITE_ADDRESS}
      logo={assets.logoWhite}
    >
      {/* Balanced wrapping keeps a lone word off the last line without adding a line. */}
      <div
        style={{
          display: 'flex',
          width: MEASURE,
          textWrap: 'balance',
          ...display(titleSize(card.title)),
        }}
      >
        {card.title}
      </div>
    </Frame>
  );
}
