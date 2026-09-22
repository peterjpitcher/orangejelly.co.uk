import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SurveyPageBody, loadSurvey, surveyMetadata } from '../../survey-page';

/**
 * `/survey/<slug>/preview/<token>`: the survey before it is public, or a live
 * one answered without being counted.
 *
 * The token is a capability, and it sits in the path so that
 * src/lib/token-routes.ts covers it: middleware sends no referrer, and the
 * script gate keeps GTM, Vercel Analytics and Speed Insights off the page.
 * The player records no events here either, so Peter's test runs never reach
 * the analytics.
 */
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface PreviewPageProps {
  params: { slug: string; token: string };
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const access = await loadSurvey(params.slug, params.token);
  return surveyMetadata(access?.mode === 'preview' ? access : null);
}

export default async function SurveyPreviewPage({
  params,
}: PreviewPageProps): Promise<JSX.Element> {
  const access = await loadSurvey(params.slug, params.token);

  // A wrong token looks exactly like a missing survey.
  if (!access || access.mode !== 'preview') notFound();

  return <SurveyPageBody access={access} previewToken={params.token} />;
}
