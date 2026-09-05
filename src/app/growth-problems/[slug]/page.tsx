import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  Band,
  Breadcrumb,
  Button,
  CategoryTag,
  GroundProvider,
  KeepCase,
  OjFooter,
  OjHeader,
  PressureMap,
} from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import { GROWTH_PROBLEMS, getGrowthProblem } from '../content';

/**
 * One growth problem.
 *
 * The order is deliberate and it is the method: the symptom you recognise, then
 * what it is actually connected to, then what we would look at, and only then what
 * we can prove. Leading with proof would make it a case study; leading with what we
 * would do would make it a service page. It is neither.
 *
 * THE PROOF SECTION SAYS WHEN THERE IS NO PROOF. Three of the eight have no
 * measured result behind them: operations, AI and scale. None of the five approved
 * claims measures hours, capacity, or anything attributable to AI, and the metrics
 * that would have covered them were retired for being unverifiable. Those pages say
 * so plainly and offer the method and a baseline instead of a number. That is the
 * whole argument of the site applied to itself.
 */
type CategoryId = React.ComponentProps<typeof CategoryTag>['category'];

interface Params {
  params: { slug: string };
}

export function generateStaticParams(): Array<{ slug: string }> {
  return GROWTH_PROBLEMS.map((problem) => ({ slug: problem.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const problem = getGrowthProblem(params.slug);
  if (!problem) return {};

  const title = `${problem.metaTitle} | Orange Jelly`;
  const url = `${getBaseUrl()}/growth-problems/${problem.slug}`;

  return {
    title,
    description: problem.intro,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: problem.intro,
      url,
      type: 'article',
      locale: 'en_GB',
      siteName: 'Orange Jelly',
    },
  };
}

export default function GrowthProblemPage({ params }: Params): JSX.Element {
  const problem = getGrowthProblem(params.slug);
  if (!problem) notFound();

  const areas = problem.areas as readonly CategoryId[];

  return (
    <>
      <OjHeader current="growth-problems" />

      <main id="main-content">
        <GroundProvider value="ink">
          <section className="bg-oj-ink py-12 text-oj-cream sm:py-16">
            <div className="page-shell">
              {/*
               * Breadcrumb has no ink tone, and its light one is built for cream:
               * muted grey links, ink current page, orange-deep arrow. All three
               * are unreadable here, so the ground recolours them from outside.
               */}
              <Breadcrumb
                tone="ink"
                className="mb-7"
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Growth problems', href: '/growth-problems' },
                  { label: problem.title },
                ]}
              />
              <h1 className="oj-display max-w-[16ch] text-[clamp(38px,7.5vw,72px)] leading-[0.94] text-oj-cream">
                <KeepCase>{problem.titleLead}</KeepCase>{' '}
                {/*
                 * The highlight was a half-height orange band behind ink type, which
                 * is a device for paper: it needs the ink to read against both the
                 * orange and the cream around it. On ink neither colour can do both
                 * jobs. Cream over the brand orange is 2.82:1, under even the 3:1
                 * large-text floor, and ink over the ink half of the glyph is 1:1.
                 * So the emphasis becomes colour rather than highlight, in the peach
                 * this site already uses for accents on a dark ground: 11.03:1.
                 */}
                <span className="text-oj-peach">
                  <KeepCase>{problem.titleMark}</KeepCase>
                </span>
              </h1>
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-cream/85">
                {problem.intro}
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {areas.map((area) => (
                  <CategoryTag key={area} category={area} filled />
                ))}
              </div>
            </div>
          </section>
        </GroundProvider>

        <Band heading="does this sound familiar?" tone="paper">
          <ul className="measure-wide grid list-none gap-4 p-0 sm:grid-cols-2">
            {problem.symptoms.map((symptom) => (
              <li
                key={symptom}
                className="rounded-oj border-1.5 border-oj-ink bg-oj-cream p-5 text-[16.5px] leading-relaxed shadow-press-sm"
              >
                {symptom}
              </li>
            ))}
          </ul>
        </Band>

        <Band heading="what is usually causing it." tone="ink">
          <p className="measure text-[18px] leading-relaxed text-oj-cream/85">{problem.causes}</p>
          <div className="mt-9">
            <PressureMap
              areas={[
                { id: 'demand', label: 'Demand', pressure: areas.includes('demand') ? 3 : 0 },
                {
                  id: 'conversion',
                  label: 'Conversion',
                  pressure: areas.includes('conversion') ? 3 : 0,
                },
                { id: 'margin', label: 'Margin', pressure: areas.includes('margin') ? 3 : 0 },
                {
                  id: 'operations',
                  label: 'Operations',
                  pressure: areas.includes('operations') ? 3 : 0,
                },
                {
                  id: 'experience',
                  label: 'Experience',
                  pressure: areas.includes('experience') ? 3 : 0,
                },
                { id: 'scale', label: 'Scale', pressure: areas.includes('scale') ? 3 : 0 },
              ]}
              caption="Where this problem usually shows up. Yours won't look exactly like this, which is what the first conversation is for."
            />
          </div>
        </Band>

        <Band heading="what we would check first.">
          <ol className="measure-wide grid list-none gap-6 p-0 sm:grid-cols-3">
            {problem.examine.map((item, index) => (
              <li key={item.what}>
                <p className="font-oj text-[15px] font-bold tabular-nums text-oj-orange-deep">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="mt-1.5 font-oj text-[18px] font-black leading-snug text-oj-ink">
                  {item.what}
                </p>
                <p className="mt-2 text-[16px] leading-relaxed text-oj-ink-2">{item.why}</p>
              </li>
            ))}
          </ol>
          <p className="measure mt-9 text-[16.5px] font-semibold leading-relaxed text-oj-ink">
            We find the cause first. The fix comes after the evidence, not before it.
          </p>
        </Band>

        <Band heading={problem.proof.heading} tone="paper">
          <p className="measure text-[17px] leading-relaxed text-oj-ink-2">{problem.proof.body}</p>
          {problem.proof.hasNumbers ? (
            <div className="mt-7">
              <Button variant="ghost" href="/results">
                How each number was measured
              </Button>
            </div>
          ) : null}
        </Band>

        {problem.relatedBuilds?.length ? (
          <Band heading="what we can build around this." tone="paper">
            <div className="flex flex-wrap gap-4">
              {problem.relatedBuilds.map((build) => (
                <Button
                  key={build.href}
                  href={build.href}
                  variant="ghost"
                  arrow
                  className="max-w-full whitespace-normal text-left"
                >
                  {build.label}
                </Button>
              ))}
            </div>
          </Band>
        ) : null}

        <Band tone="orange" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(32px,6.5vw,58px)] leading-[0.95]">
            tell us what's happening.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed">
            It starts as a conversation, and the first one is an hour and free. We work out what's
            actually causing this against your numbers, then tell you what would move them.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" arrow href="/start-here">
              Let's talk
            </Button>
            <Button variant="ghost" href="/growth-problems">
              See the other seven
            </Button>
          </div>
        </Band>
      </main>

      <OjFooter />
    </>
  );
}
