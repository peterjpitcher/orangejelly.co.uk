import type { Metadata } from 'next';

import { PRESSURE_POINTS } from '@/app/home-content';
import {
  Band,
  Breadcrumb,
  Button,
  GroundProvider,
  OjFooter,
  OjHeader,
  PressureCard,
} from '@/components/oj';
import { PRICING } from '@/lib/constants';
import { getBaseUrl } from '@/lib/site-config';

import { CAPABILITIES, CAPABILITY_GROUPS, DECLINED } from './content';

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
  'Once we know what is stopping growth, we build the fix. What that is made of depends on the problem, so this page starts there, not with a list of services.';

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
      <OjHeader current="solutions" />

      <main id="main-content">
        <GroundProvider value="ink">
          <section className="bg-oj-ink py-12 text-oj-cream sm:py-16">
            <div className="page-shell">
              <Breadcrumb
                tone="ink"
                className="mb-7"
                items={[{ label: 'Home', href: '/' }, { label: 'What we build' }]}
              />
              <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-peach">
                what we build
              </p>
              <h1 className="oj-display mt-2.5 max-w-[16ch] text-[clamp(40px,8vw,78px)] leading-[0.92] text-oj-cream">
                once we know the problem, we build the fix.
              </h1>
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-cream/85">
                What you end up buying depends entirely on what's actually stopping growth. That is
                why this page starts with the problem and not with a list of things we sell.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" arrow href="/start-here">
                  Let's talk
                </Button>
                <Button variant="ghost" href="/how-we-work">
                  How we work
                </Button>
              </div>
            </div>
          </section>
        </GroundProvider>

        <Band
          heading="start with where it's stuck."
          intro="Six areas we check in every business. Most problems are a mix of two or three."
          tone="paper"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRESSURE_POINTS.map((point) => (
              <PressureCard
                key={point.title}
                eyebrow={point.area}
                title={point.title}
                desc={point.desc}
                href={point.href}
              />
            ))}
          </div>
          <div className="mt-8">
            <Button variant="ghost" href="/growth-problems">
              See all eight growth problems
            </Button>
          </div>
        </Band>

        <Band
          heading="what a fix can be made of."
          intro="Thirteen things we build with, in five groups. Nobody buys one of them on its own, and if somebody asks us for one before we've understood the problem, we'll say so."
        >
          {/*
            Five groups, in the order an owner thinks about the business, rather
            than thirteen tiles in a grid. A flat grid of thirteen read as a menu,
            which is the one thing this page argues it is not.
          */}
          <div className="flex flex-col gap-12">
            {CAPABILITY_GROUPS.map((group) => (
              <section key={group.id} aria-labelledby={`capability-group-${group.id}`}>
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                  <div>
                    <p className="font-oj text-[13px] font-bold uppercase tracking-[0.14em] text-oj-orange-deep">
                      {group.areas}
                    </p>
                    <h3
                      id={`capability-group-${group.id}`}
                      className="oj-display mt-1.5 text-[clamp(24px,4vw,34px)] leading-[1.02] text-oj-ink"
                    >
                      {group.heading}
                    </h3>
                    <p className="measure mt-3 text-[16px] leading-relaxed text-oj-ink-2">
                      {group.intro}
                    </p>
                  </div>
                  <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    {CAPABILITIES.filter((capability) => capability.group === group.id).map(
                      (capability) => (
                        <div key={capability.name} className="border-t-1.5 border-oj-ink pt-3.5">
                          <dt className="font-oj text-[17px] font-black leading-snug text-oj-ink">
                            {capability.name}
                          </dt>
                          <dd className="mt-1.5 text-[15.5px] leading-relaxed text-oj-ink-2">
                            {capability.body}
                          </dd>
                        </div>
                      )
                    )}
                  </dl>
                </div>
              </section>
            ))}
          </div>
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
              Nobody buys a solution from this page. Every piece of work starts with a conversation
              about what's actually happening, and the first one is an hour and free.
            </p>
            <p>
              On cost: the rate is {PRICING.hourly.display}, and that is the only number we
              advertise. You get the hours for any piece of work in writing before it starts.
            </p>
          </div>
          <div className="mt-7">
            <Button arrow href="/start-here">
              Let's talk
            </Button>
          </div>
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
            what to build is the last decision, not the first.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            Tell us what's happening and we'll tell you what we think it needs.
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
