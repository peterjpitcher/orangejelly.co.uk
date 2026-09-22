import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SurveyPageBody, loadSurvey, surveyMetadata } from './survey-page';

/**
 * `/survey/<slug>`: a live survey, served from the database.
 *
 * A survey goes live by changing a row, not by shipping code, so this route is
 * dynamic and uncached: a closed survey must stop taking answers the moment it
 * closes, not when a cache entry expires. supabase-js reads land in Next's Data
 * Cache otherwise, which outlives deploys (see the organiser poll page).
 *
 * Not indexed. Surveys are for sharing, and a search result for a survey that
 * closes next month is a dead end for whoever finds it. Drafts are reached only
 * through the preview route beside this one.
 *
 * @see tasks/survey/PLAN.md
 */
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface SurveyPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: SurveyPageProps): Promise<Metadata> {
  return surveyMetadata(await loadSurvey(params.slug));
}

export default async function SurveyPage({ params }: SurveyPageProps): Promise<JSX.Element> {
  const access = await loadSurvey(params.slug);

  // One outcome for a missing slug and a draft, so a guesser cannot tell a draft
  // exists.
  if (!access) notFound();

  return <SurveyPageBody access={access} />;
}
