import { getSurveyForVisitor } from '@/lib/db/surveys';
import { SHARE_CARD_SIZE } from '@/lib/share-card/constants';
import { renderShareCard } from '@/lib/share-card/render';

export const size = SHARE_CARD_SIZE;
export const contentType = 'image/png';
export const alt = 'An Orange Jelly survey';

// Drawn per request from the database, so a survey renamed in a row gets a new card
// without a release. The page names it with the title in its `?v=` (survey-page.tsx),
// so the renamed card also arrives at a new URL rather than behind a cached one.
export const dynamic = 'force-dynamic';

/**
 * The share card for a survey: the picture WhatsApp, Facebook and LinkedIn show
 * under a pasted link, and most of the reason anybody taps it.
 *
 * The survey's own question on the square brand card, drawn by the same layout as the
 * default and guide cards (src/lib/share-card). A draft or unknown slug gets a neutral
 * card rather than an error, and never the draft's title.
 */
export default async function SurveyOGImage({
  params,
}: {
  params: { slug: string };
}): Promise<Response> {
  let title = 'A quick survey from Orange Jelly.';
  let eyebrow = 'Survey';
  let note: string | undefined;
  let address: string | undefined;
  let fellBack = false;

  try {
    const access = await getSurveyForVisitor(params.slug);
    if (access) {
      title = access.survey.title;
      eyebrow = access.survey.eyebrow;
      note = `About ${access.survey.minutes} minute${access.survey.minutes === 1 ? '' : 's'}.`;
      address = `orangejelly.co.uk/survey/${access.survey.slug}`;
    }
  } catch (error) {
    // A card with the generic title is better than no card at all.
    console.error('[surveys] share card could not load the survey:', error);
    fellBack = true;
  }

  // Next.js serves every card `immutable` for a year. The stand-in drawn during an outage
  // must not be kept like that, or the survey's real question never replaces it.
  return renderShareCard(
    { kind: 'titled', eyebrow, title, note, address },
    fellBack ? { headers: { 'cache-control': 'no-store' } } : undefined
  );
}
