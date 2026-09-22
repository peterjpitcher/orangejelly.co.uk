import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Alert, Button, GroundProvider, OjFooter, OjHeader } from '@/components/oj';
import { getSurveyForVisitor } from '@/lib/db/surveys';
import { getBaseUrl } from '@/lib/site-config';

import SurveyPlayer from './SurveyPlayer';

/**
 * `/survey/<slug>`: a survey served from the database.
 *
 * A survey goes live by changing a row, not by shipping code, so this route is
 * dynamic and uncached: a closed survey must stop taking answers the moment it
 * closes, not when a cache entry expires. supabase-js reads land in Next's Data
 * Cache otherwise, which outlives deploys (see the organiser poll page).
 *
 * Not indexed. Surveys are for sharing, and a search result for a survey that
 * closes next month is a dead end for whoever finds it.
 *
 * @see tasks/survey/PLAN.md
 */
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface SurveyPageProps {
  params: { slug: string };
  searchParams: { preview?: string | string[] };
}

function previewTokenFrom(searchParams: SurveyPageProps['searchParams']): string | undefined {
  const value = searchParams.preview;
  return typeof value === 'string' && value.length <= 64 ? value : undefined;
}

export async function generateMetadata({
  params,
  searchParams,
}: SurveyPageProps): Promise<Metadata> {
  const access = await getSurveyForVisitor(params.slug, previewTokenFrom(searchParams));
  const robots = { index: false, follow: true, googleBot: { index: false, follow: true } };
  if (!access) return { title: 'Survey not found | Orange Jelly', robots };

  const url = `${getBaseUrl()}/survey/${access.survey.slug}`;
  return {
    title: `${access.survey.title} | Orange Jelly`,
    description: access.survey.shareText,
    alternates: { canonical: url },
    robots,
    openGraph: {
      title: access.survey.title,
      description: access.survey.shareText,
      url,
      type: 'website',
      locale: 'en_GB',
      siteName: 'Orange Jelly',
    },
    twitter: {
      card: 'summary_large_image',
      title: access.survey.title,
      description: access.survey.shareText,
    },
  };
}

export default async function SurveyPage({
  params,
  searchParams,
}: SurveyPageProps): Promise<JSX.Element> {
  const previewToken = previewTokenFrom(searchParams);
  const access = await getSurveyForVisitor(params.slug, previewToken);

  // One outcome for a missing slug and a draft without its preview link, so a
  // guesser cannot tell a draft exists.
  if (!access) notFound();

  const { survey, mode } = access;
  const shareUrl = `${getBaseUrl()}/survey/${survey.slug}`;

  return (
    <>
      <OjHeader />

      <main id="main-content">
        <GroundProvider value="ink">
          <section className="bg-oj-ink py-10 text-oj-cream sm:py-14">
            <div className="page-shell">
              <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-peach">
                {survey.eyebrow}
              </p>
              <h1 className="oj-display mt-2.5 max-w-[20ch] text-[clamp(34px,6.5vw,60px)] leading-[0.98] text-oj-cream">
                {survey.title}
              </h1>
              <p className="measure mt-5 text-[18px] leading-relaxed text-oj-cream/85">
                {survey.intro}
              </p>
            </div>
          </section>
        </GroundProvider>

        <section className="bg-oj-cream py-10 sm:py-14">
          <div className="page-shell">
            <div className="measure-wide">
              {mode === 'preview' ? (
                <div className="mb-8">
                  <Alert tone="info" title="Preview">
                    Answers sent from this link are kept apart and never counted. Share the link
                    without <code>?preview=</code> once the survey is live.
                  </Alert>
                </div>
              ) : null}

              {mode === 'closed' ? (
                <div>
                  <h2 className="font-oj text-[clamp(24px,4.5vw,32px)] font-black leading-tight text-oj-ink">
                    This survey has closed.
                  </h2>
                  <p className="mt-3 text-[17px] leading-relaxed text-oj-ink-2">
                    Thank you to everyone who answered.
                  </p>
                  <div className="mt-6">
                    <Button arrow href="/">
                      Back to Orange Jelly
                    </Button>
                  </div>
                </div>
              ) : (
                <SurveyPlayer
                  survey={survey}
                  previewToken={mode === 'preview' ? previewToken : undefined}
                  shareUrl={shareUrl}
                />
              )}

              <noscript>
                <p className="mt-6 text-[16px] leading-relaxed text-oj-ink">
                  This survey needs JavaScript. If you would rather, email your thoughts to{' '}
                  <a className="font-bold underline" href="mailto:peter@orangejelly.co.uk">
                    peter@orangejelly.co.uk
                  </a>
                  .
                </p>
              </noscript>
            </div>
          </div>
        </section>
      </main>

      <OjFooter />
    </>
  );
}
