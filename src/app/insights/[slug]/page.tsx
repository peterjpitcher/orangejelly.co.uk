import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  Alert,
  Band,
  Breadcrumb,
  Button,
  CategoryTag,
  FAQ,
  GroundProvider,
  KeepCase,
  NextStep,
  OjFooter,
  OjHeader,
  ShareRow,
} from '@/components/oj';
import { GROWTH_PROBLEMS } from '@/app/growth-problems/content';
import { getAllInsights, getInsightBySlug } from '@/lib/insights';
import { markdownToHtml } from '@/lib/markdown/markdown';
import { getBaseUrl } from '@/lib/site-config';

/**
 * One insight.
 *
 * Every one hands over to a growth problem, which is enforced in the front matter
 * rather than left to whoever writes it. An article that leads nowhere is the thing
 * this collection exists to avoid: the hospitality library spent years being
 * excellent and leading only to a contact form.
 *
 * `researchLed` is surfaced on the page rather than kept in the front matter. The
 * pack's rule is that no claim goes out without evidence behind it, and implied
 * experience is a claim.
 */
interface Params {
  params: { slug: string };
}

/**
 * Published, non-future insights only.
 *
 * It used to list every file in the directory, which meant a piece scheduled for
 * next week was excluded from the index and the sitemap and still reachable by
 * URL. Anyone with the link, and anyone guessing the slug, could read it early.
 */
export function generateStaticParams(): Array<{ slug: string }> {
  return getAllInsights().map((insight) => ({ slug: insight.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const insight = getInsightBySlug(params.slug);
  if (!insight) return {};

  const url = `${getBaseUrl()}/insights/${insight.slug}`;
  return {
    title: `${insight.title} | Orange Jelly`,
    description: insight.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: insight.title,
      description: insight.excerpt,
      url,
      type: 'article',
      locale: 'en_GB',
      siteName: 'Orange Jelly',
      publishedTime: insight.publishedDate,
    },
  };
}

export default async function InsightPage({ params }: Params): Promise<JSX.Element> {
  const insight = getInsightBySlug(params.slug);
  // Drafts and anything dated ahead of today are not published, and the check is
  // here as well as in the params so a stale build cannot serve one.
  if (!insight || insight.status === 'draft' || new Date(insight.publishedDate) > new Date()) {
    notFound();
  }

  const html = await markdownToHtml(insight.content);
  const problem = GROWTH_PROBLEMS.find((p) => p.slug === insight.problemPage);

  return (
    <>
      <OjHeader current="insights" />

      <main id="main-content">
        <GroundProvider value="ink">
          <section className="bg-oj-ink py-12 text-oj-cream sm:py-16">
            <div className="page-shell">
              <Breadcrumb
                tone="ink"
                className="mb-7"
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Insights', href: '/insights' },
                  { label: insight.title },
                ]}
              />
              <h1 className="oj-display measure text-[clamp(34px,6.5vw,60px)] leading-[0.98] text-oj-cream">
                <KeepCase>{insight.title}</KeepCase>
              </h1>
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-cream/85">
                {insight.excerpt}
              </p>
              <p className="mt-6 text-[14.5px] text-oj-cream/60">
                {new Intl.DateTimeFormat('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(new Date(insight.publishedDate))}
                {' · '}
                {insight.readingTime} min read
                {insight.author?.name ? ` · ${insight.author.name}` : ''}
              </p>
            </div>
          </section>
        </GroundProvider>

        <Band tone="paper">
          <div className="measure">
            {insight.quickAnswer ? (
              <p className="mb-8 rounded-oj border-1.5 border-oj-ink bg-oj-cream p-5 text-[17px] font-semibold leading-relaxed text-oj-ink shadow-press-sm">
                {insight.quickAnswer}
              </p>
            ) : null}

            {/*
             * Said on the page, not just recorded in the front matter. Implied
             * experience is a claim, and the pack's evidence rule covers claims.
             */}
            {insight.researchLed ? (
              <div className="mb-8">
                <Alert tone="info" title="Written from research, not from our own work">
                  Orange Jelly has not run this engagement itself. Everything here is from published
                  practice and from what we have seen adjacent to it, and it is flagged so you can
                  weigh it accordingly.
                </Alert>
              </div>
            ) : null}

            <div className="oj-prose" dangerouslySetInnerHTML={{ __html: html }} />

            {insight.faqs.length > 0 ? (
              <div className="mt-12">
                <h2 className="oj-display text-[28px] leading-none text-oj-ink">
                  questions people ask.
                </h2>
                <div className="mt-5">
                  <FAQ items={insight.faqs.map((faq) => ({ q: faq.question, a: faq.answer }))} />
                </div>
              </div>
            ) : null}

            {problem ? (
              <div className="mt-12">
                <NextStep
                  from="article"
                  links={[
                    {
                      stage: 'The problem underneath',
                      title: problem.title,
                      href: `/growth-problems/${problem.slug}`,
                    },
                  ]}
                />
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <ShareRow url={`${getBaseUrl()}/insights/${insight.slug}`} title={insight.title} />
              {problem ? <CategoryTag category={problem.areas[0] as never} /> : null}
            </div>
          </div>
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(32px,6.5vw,56px)] leading-[0.95] text-oj-cream">
            recognise the problem?
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            An hour on the phone gets further than another article. Free, and not a pitch.
          </p>
          <div className="mt-8">
            <Button size="lg" arrow href="/start-here">
              Let's talk
            </Button>
          </div>
        </Band>
      </main>

      <OjFooter />
    </>
  );
}
