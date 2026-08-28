import type { Metadata } from 'next';

import { PRESSURE_POINTS } from '@/app/home-content';
import { Band, Breadcrumb, Button, OjFooter, OjHeader, PressureCard } from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import { CAPABILITIES, DECLINED } from './content';

/**
 * `/solutions`.
 *
 * Built ahead of its place in the plan because the phase 4 redirect table sends
 * `/capabilities` here, so the release could not ship without it.
 *
 * The page leads with the six places growth gets stuck and puts the capabilities
 * underneath. Thirteen capabilities as a headline reads as a company that will do
 * anything, which is the impression the method exists to correct.
 *
 * The pressure points are imported from the homepage rather than restated. Two
 * lists of the same six things drift, and the day they drift the site disagrees
 * with itself about what it works on.
 *
 * Copy: `tasks/repositioning/copy/solutions.md`.
 */
const TITLE = 'What we build | Orange Jelly';
const DESCRIPTION =
  'Orange Jelly builds fixes, not services. What a fix is made of depends on what is actually blocking growth, which is why this starts with the problem rather than a list of things we sell.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/solutions` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/solutions`,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

export default function SolutionsPage(): JSX.Element {
  return (
    <>
      <OjHeader />

      <main id="main-content">
        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-12 sm:py-16">
          <div className="page-shell">
            <Breadcrumb
              className="mb-7"
              items={[{ label: 'Home', href: '/' }, { label: 'What we build' }]}
            />
            <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-orange-deep">
              what we build
            </p>
            <h1 className="oj-display mt-2.5 text-[clamp(40px,8vw,78px)] leading-[0.92] text-oj-ink">
              the problem decides the tool.
            </h1>
            <p className="measure mt-5 text-[19px] leading-relaxed text-oj-ink-2">
              Orange Jelly builds fixes, not services. What a fix is made of depends entirely on
              what is actually blocking growth, which is why this page starts with the problem and
              not with a list of things we sell.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" arrow href="/start-here">
                Bring us the problem
              </Button>
              <Button variant="ghost" href="/how-we-work">
                How we work
              </Button>
            </div>
          </div>
        </section>

        <Band heading="start with where it is stuck." tone="paper">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRESSURE_POINTS.map((point) => (
              <PressureCard
                key={point.title}
                title={point.title}
                desc={point.desc}
                href={point.href}
              />
            ))}
          </div>
        </Band>

        <Band
          heading="what a fix can be made of."
          intro="Thirteen things we build with. Nobody buys one of them on its own, and if somebody asks us for one before we have understood the problem we will say so."
        >
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((capability) => (
              <div key={capability.name} className="border-t-1.5 border-oj-ink pt-3.5">
                <dt className="font-oj text-[17px] font-black leading-snug text-oj-ink">
                  {capability.name}
                </dt>
                <dd className="mt-1.5 text-[15.5px] leading-relaxed text-oj-ink-2">
                  {capability.body}
                </dd>
              </div>
            ))}
          </dl>
        </Band>

        <Band heading="what we normally decline." tone="paper">
          <ul className="measure-wide grid list-none gap-3 p-0">
            {DECLINED.map((item) => (
              <li key={item} className="flex gap-3 text-[17px] leading-relaxed">
                <span aria-hidden="true" className="font-black text-oj-orange-deep">
                  &mdash;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Band>

        <Band heading="it always starts the same way.">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              Nobody buys a solution from this page. Every engagement starts with a conversation
              about what is actually happening, and the first one is an hour and free. What gets
              built, and what it costs, is agreed after that and in writing.
            </p>
          </div>
          <div className="mt-7">
            <Button arrow href="/start-here">
              Bring us the problem
            </Button>
          </div>
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
            the tool is the last decision, not the first.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            Tell us what is happening and we will tell you what we think it needs.
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
