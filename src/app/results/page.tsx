import type { Metadata } from 'next';

import { Band, Breadcrumb, Button, OjFooter, OjHeader, ProofCard, Tag } from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import { CASE_STUDIES, getFeaturedCaseStudy } from './case-studies';

/**
 * `/results`.
 *
 * Every case study here is The Anchor, our own venue, and the page says so in the
 * first sentence rather than hoping nobody notices. That is the stronger position:
 * the numbers are real, they were measured against a baseline, and the risk of
 * getting them wrong was ours. A wall of anonymous logos says less.
 *
 * Replaces a page built from `content/data/results.json`, whose stats the CLAIMS
 * rewrite had already retired.
 *
 * Copy: `tasks/repositioning/copy/results.md`, held to it by a test.
 */
const TITLE = 'Results | Orange Jelly';
const DESCRIPTION =
  'What changed, by how much, and how it was measured. Every number here comes from The Anchor, the business we run ourselves, where the risk of getting it wrong was ours.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/results` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/results`,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

export default function ResultsPage(): JSX.Element {
  const featured = getFeaturedCaseStudy();
  const rest = CASE_STUDIES.filter((study) => study.slug !== featured.slug);

  return (
    <>
      <OjHeader current="results" />

      <main>
        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-12 sm:py-16">
          <div className="page-shell">
            <Breadcrumb
              className="mb-7"
              items={[{ label: 'Home', href: '/' }, { label: 'Results' }]}
            />
            <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-orange-deep">
              the work
            </p>
            <h1 className="oj-display mt-2.5 text-[clamp(40px,8vw,78px)] leading-[0.92] text-oj-ink">
              proven where the risk was ours.
            </h1>
            <p className="measure mt-5 text-[19px] leading-relaxed text-oj-ink-2">
              Every number on this page comes from The Anchor, our own venue and a real trading
              business we run. It is where this way of working was built and tested before it was
              ever sold to anybody, and where getting it wrong cost us rather than a client.
            </p>
          </div>
        </section>

        <Band tone="paper" className="!py-12 sm:!py-14">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CASE_STUDIES.flatMap((study) =>
              study.stats.map((stat) => (
                <ProofCard
                  key={`${study.slug}-${stat.label}`}
                  value={stat.value}
                  label={stat.label}
                  context={stat.context}
                  area={study.area}
                />
              ))
            )}
          </div>
        </Band>

        <Band heading="the one that changed the most.">
          <article className="rounded-oj border-1.5 border-oj-ink bg-oj-paper p-6 shadow-press sm:p-9">
            <Tag size="sm" variant="outline" dot={false}>
              {featured.area}
            </Tag>
            <h3 className="oj-display mt-4 text-[clamp(28px,5vw,44px)] leading-[1] text-oj-ink">
              {featured.title}
            </h3>
            <p className="measure mt-3.5 text-[18px] leading-relaxed text-oj-ink-2">
              {featured.summary}
            </p>
            <p className="mt-6 font-oj text-[clamp(40px,7vw,64px)] font-black leading-none tracking-[-0.03em] text-oj-orange-deep">
              {featured.headline.value}
            </p>
            <p className="mt-1 text-[17px] font-bold text-oj-ink">{featured.headline.label}</p>
            <p className="mt-1 text-[14.5px] text-oj-ink-3">{featured.headline.context}</p>
            <div className="mt-7">
              {/*
               * The visible label is short; the accessible name carries the title.
               * "Read what happened" on its own is one of several links on this page
               * that all say the same thing, which is exactly the case screen-reader
               * users navigate by link list.
               */}
              <Button
                arrow
                href={`/results/${featured.slug}`}
                aria-label={`Read what happened: ${featured.title}`}
              >
                Read what happened
              </Button>
            </div>
          </article>
        </Band>

        <Band heading="the rest of it." tone="paper">
          <div className="grid gap-5 sm:grid-cols-2">
            {rest.map((study) => (
              <a
                key={study.slug}
                href={`/results/${study.slug}`}
                className="oj-press oj-focus flex flex-col gap-3 rounded-oj border-1.5 border-oj-ink bg-oj-cream p-6 no-underline"
              >
                <span className="font-oj text-[13px] font-bold uppercase tracking-[0.1em] text-oj-orange-deep">
                  {study.area}
                </span>
                <span className="oj-display text-[26px] leading-[1.02] text-oj-ink">
                  {study.title}
                </span>
                <span className="text-[16px] leading-relaxed text-oj-ink-2">{study.summary}</span>
                <span className="mt-1 font-oj text-[30px] font-black leading-none tracking-[-0.02em] text-oj-ink">
                  {study.headline.value}{' '}
                  <span className="text-[15px] font-bold">{study.headline.label}</span>
                </span>
              </a>
            ))}
          </div>
        </Band>

        <Band heading="why they are all one business.">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              Because that is the truth, and the alternative is worse. We could show you a wall of
              logos from work we cannot describe, or numbers with no baseline behind them. Neither
              would tell you anything.
            </p>
            <p>
              The Anchor is where the method was built, and it is the one place we can show you the
              before as well as the after, say exactly how it was measured, and answer any question
              about it. Client work joins this page as it becomes publishable, with permission, and
              not before.
            </p>
            <p>
              A pub is not a professional services firm. Demand, conversion and margin behave the
              same way in both, which is why each of these ends with what the mechanism actually
              was, rather than what industry it happened in.
            </p>
          </div>
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
            your numbers, not ours.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            None of this tells you what would happen in your business. An hour on the phone gets
            closer to that than any case study will.
          </p>
          <div className="mt-8">
            <Button size="lg" arrow href="/start-here">
              Bring us the problem
            </Button>
          </div>
        </Band>
      </main>

      <OjFooter />
    </>
  );
}
