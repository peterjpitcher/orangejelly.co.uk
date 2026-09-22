import { ImageResponse } from 'next/og';

import { getSurveyForVisitor } from '@/lib/db/surveys';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'An Orange Jelly survey';

// Drawn per request from the database, so a survey renamed in a row gets a new
// card without a release. Social sites cache the card themselves once fetched.
export const dynamic = 'force-dynamic';

/**
 * The share card for a survey: the picture WhatsApp, Facebook and LinkedIn show
 * under a pasted link, and most of the reason anybody taps it.
 *
 * The survey's own question, big, on the brand orange, in the same system face
 * and palette as the site's default card (see src/app/opengraph-image.tsx for why
 * no webfont). A draft or unknown slug gets a neutral card rather than an error,
 * and never the draft's title.
 */
export default async function SurveyOGImage({
  params,
}: {
  params: { slug: string };
}): Promise<ImageResponse> {
  let title = 'a quick survey from orange jelly.';
  let footer = 'orangejelly.co.uk';
  let eyebrow = 'survey';

  try {
    const access = await getSurveyForVisitor(params.slug);
    if (access) {
      title = access.survey.title.toLowerCase();
      eyebrow = access.survey.eyebrow.toLowerCase();
      footer = `About ${access.survey.minutes} minute${access.survey.minutes === 1 ? '' : 's'}. orangejelly.co.uk/survey/${access.survey.slug}`;
    }
  } catch (error) {
    // A card with the generic title is better than no card at all.
    console.error('[surveys] share card could not load the survey:', error);
  }

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
        color: '#23252E',
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', fontSize: 32, fontWeight: 800 }}
      >
        <span>orange jelly</span>
        <span
          style={{
            display: 'flex',
            background: '#23252E',
            color: '#F7F5F1',
            padding: '8px 18px',
            fontSize: 26,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}
        >
          {eyebrow}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: title.length > 60 ? 76 : 88,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.02,
          maxWidth: 1040,
        }}
      >
        {title}
      </div>

      <div style={{ display: 'flex', fontSize: 30 }}>{footer}</div>
    </div>,
    { ...size }
  );
}
