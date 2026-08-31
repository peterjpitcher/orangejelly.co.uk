import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Band, Breadcrumb, Button, OjFooter, OjHeader, ProofCard } from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import { CASE_STUDIES, getCaseStudy } from '../case-studies';

/**
 * One case study, told in the order the work happened.
 *
 * The four sections are the method, not a narrative device. If the page cannot show
 * what was heard, what was challenged, what was built and what moved, then either
 * the work did not follow the method or it is not worth publishing.
 */
interface Params {
  params: { slug: string };
}

export function generateStaticParams(): Array<{ slug: string }> {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const study = getCaseStudy(params.slug);
  if (!study) return {};

  const title = `${study.title} | Orange Jelly`;
  const url = `${getBaseUrl()}/results/${study.slug}`;

  return {
    title,
    description: study.summary,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: study.summary,
      url,
      type: 'article',
      locale: 'en_GB',
      siteName: 'Orange Jelly',
    },
  };
}

const STEPS = [
  { word: 'HEAR.', key: 'hear' },
  { word: 'CHALLENGE.', key: 'challenge' },
  { word: 'BUILD.', key: 'build' },
  { word: 'OPTIMISE.', key: 'optimise' },
] as const;

export default function CaseStudyPage({ params }: Params): JSX.Element {
  const study = getCaseStudy(params.slug);
  if (!study) notFound();

  return (
    <>
      <OjHeader current="results" />

      <main id="main-content">
        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-12 sm:py-16">
          <div className="page-shell">
            <Breadcrumb
              className="mb-7"
              items={[
                { label: 'Home', href: '/' },
                { label: 'Results', href: '/results' },
                { label: study.title },
              ]}
            />
            <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-orange-deep">
              {study.area}
            </p>
            <h1 className="oj-display mt-2.5 text-[clamp(38px,7.5vw,72px)] leading-[0.94] text-oj-ink">
              {study.title}
            </h1>
            <p className="measure mt-5 text-[19px] leading-relaxed text-oj-ink-2">
              {study.summary}
            </p>
            <p className="mt-6 text-[15px] font-semibold text-oj-ink-2">
              At The Anchor, the business we run ourselves.
            </p>
          </div>
        </section>

        <Band tone="paper" className="!py-12">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {study.stats.map((stat) => (
              <ProofCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                context={stat.context}
                area={study.area}
              />
            ))}
          </div>
        </Band>

        {STEPS.map((step, index) => (
          <Band key={step.word} tone={index % 2 === 0 ? 'page' : 'paper'}>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              <h2 className="oj-display text-[clamp(30px,5vw,46px)] leading-[0.95] text-oj-ink">
                {step.word}
              </h2>
              <p className="text-[18px] leading-relaxed text-oj-ink-2">{study[step.key]}</p>
            </div>
          </Band>
        ))}

        <Band heading="why this travels." tone="ink">
          <p className="measure text-[18px] leading-relaxed text-oj-cream/85">{study.transfer}</p>
        </Band>

        <Band tone="orange" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(32px,6.5vw,58px)] leading-[0.95] text-oj-ink">
            recognise any of that?
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-ink">
            The first conversation is an hour, it is free, and it is not a pitch.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" arrow href="/start-here">
              Let's talk
            </Button>
            <Button variant="ghost" href="/results">
              See the other two
            </Button>
          </div>
        </Band>
      </main>

      <OjFooter />
    </>
  );
}
