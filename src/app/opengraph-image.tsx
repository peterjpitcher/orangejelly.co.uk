import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export const alt = 'Orange Jelly: websites, applications and AI for business growth';

/**
 * The default share card.
 *
 * It said "Hospitality marketing that works" and "Fill tables for pubs,
 * restaurants, and bars" until the repositioning. This is the image every link to
 * the site renders in Slack, LinkedIn and iMessage, so it was the old position
 * travelling further than any page.
 *
 * Drawn in the repositioning palette, without a webfont: `next/og` would need the
 * font file fetched and embedded at request time, and a share card that sometimes
 * fails to render is worse than one in a system face. The colours carry the brand.
 */
export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#F76B0C',
        padding: 72,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ display: 'flex', fontSize: 34, fontWeight: 800, color: '#23252E' }}>
        orange jelly
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: 92,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: '#23252E',
          maxWidth: 940,
        }}
      >
        websites and systems built for growth.
      </div>

      <div style={{ display: 'flex', fontSize: 30, color: '#23252E' }}>
        Websites. Bespoke applications. Useful AI.
      </div>
    </div>,
    {
      ...size,
    }
  );
}
