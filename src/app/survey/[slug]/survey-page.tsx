import type { Metadata } from 'next';
import { cache } from 'react';

import { Alert, Button, GroundProvider, OjFooter, OjHeader } from '@/components/oj';
import { getSurveyForVisitor, type SurveyAccess } from '@/lib/db/surveys';
import { getBaseUrl } from '@/lib/site-config';

import SurveyPlayer from './SurveyPlayer';

/**
 * What the public survey page and its preview link share.
 *
 * Two routes, one body: `/survey/<slug>` for everyone, and
 * `/survey/<slug>/preview/<token>` for checking a draft before it is public. The
 * token lives in the path, not a query string, so the token-route rules in
 * src/lib/token-routes.ts apply to it: no referrer, and no third-party script
 * that would carry the URL off the site.
 */

// One database read per request, shared by the metadata and the page. With the
// fetch cache off, Next would otherwise run the query twice.
export const loadSurvey = cache(getSurveyForVisitor);

export const surveyPublicUrl = (slug: string): string => `${getBaseUrl()}/survey/${slug}`;

export function surveyMetadata(access: SurveyAccess | null): Metadata {
  const robots = { index: false, follow: false, googleBot: { index: false, follow: false } };
  if (!access) return { title: 'Survey not found | Orange Jelly', robots };

  const { survey } = access;
  if (access.mode === 'preview') {
    // Nothing a crawler or unfurler could pick up from a preview link.
    return { title: `Preview: ${survey.title} | Orange Jelly`, robots };
  }

  const url = surveyPublicUrl(survey.slug);
  return {
    title: `${survey.title} | Orange Jelly`,
    description: survey.shareText,
    alternates: { canonical: url },
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
    openGraph: {
      title: survey.title,
      description: survey.shareText,
      url,
      type: 'website',
      locale: 'en_GB',
      siteName: 'Orange Jelly',
    },
    twitter: {
      card: 'summary_large_image',
      title: survey.title,
      description: survey.shareText,
    },
  };
}

interface SurveyPageBodyProps {
  access: SurveyAccess;
  /** Set only on the preview route, where it came from the path. */
  previewToken?: string;
}

export function SurveyPageBody({ access, previewToken }: SurveyPageBodyProps): JSX.Element {
  const { survey, mode } = access;

  return (
    <>
      <OjHeader />

      <main id="main-content">
        <GroundProvider value="ink">
          <section className="bg-oj-ink py-8 text-oj-cream sm:py-14">
            <div className="page-shell">
              <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-peach">
                {survey.eyebrow}
              </p>
              <h1 className="oj-display mt-2.5 max-w-[20ch] text-[clamp(34px,6.5vw,60px)] leading-[0.98] text-oj-cream">
                {survey.title}
              </h1>
              <p className="measure mt-4 text-[16px] leading-relaxed text-oj-cream/85 sm:mt-5 sm:text-[18px]">
                {survey.intro}
              </p>
            </div>
          </section>
        </GroundProvider>

        <section className="bg-oj-cream py-8 sm:py-14">
          <div className="page-shell">
            <div className="measure-wide">
              {mode === 'preview' ? (
                <div className="mb-8">
                  <Alert tone="info" title="Preview">
                    Answers sent from this link are kept apart and never counted, and nothing here
                    is measured. Once the survey is live, share /survey/{survey.slug}, never this
                    link.
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
                  shareUrl={surveyPublicUrl(survey.slug)}
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
