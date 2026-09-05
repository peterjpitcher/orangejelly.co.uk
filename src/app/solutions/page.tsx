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

import { CAPABILITIES, CAPABILITY_GROUPS, CORE_BUILDS, DECLINED } from './content';

const TITLE = 'Websites, Applications & Connected Systems | Orange Jelly';
const DESCRIPTION =
  'Website builds, bespoke applications and connected booking systems. Explore practical work that turns customer interest into bookings and repeat business.';

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
                websites, applications and the systems behind them.
              </h1>
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-cream/85">
                We build the websites customers see and the applications and workflows behind them.
                The aim is a clearer customer experience, more bookings and a business that works
                better. AI is part of the build where it has a useful job to do.
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
          heading="choose what you want to build."
          tone="paper"
          intro="Bring a defined project or a customer journey that needs to work better. These are the main ways we can build it."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_BUILDS.map((build) => (
              <PressureCard
                key={build.title}
                eyebrow={build.area}
                title={build.title}
                desc={build.desc}
                href={build.href}
              />
            ))}
          </div>
        </Band>
        <Band
          heading="AI with a clear purpose."
          intro="AI can be part of an application or workflow, for example to organise enquiry information or draft a reply for someone to check. We agree the task, data and human checks before building it."
        >
          <p className="measure text-[17px] leading-relaxed">
            Using AI during development is different from delivering an application with AI
            features. A website does not need AI functionality to be useful.
          </p>
          <div className="mt-7">
            <Button variant="ghost" href="/growth-problems/using-ai-intelligently">
              Explore useful AI
            </Button>
          </div>
        </Band>
        <Band
          heading="see what changed at The Anchor."
          tone="paper"
          intro="Our public case studies explain the work in our own venue: a website rebuilt around customer searches, clearer booking journeys, confirmations and reminders. The results reflect the combined work, not a website or AI feature alone."
        >
          <div className="flex flex-wrap gap-4">
            <Button variant="ghost" href="/results/nobody-could-find-us">
              Website case study
            </Button>
            <Button variant="ghost" href="/results/interest-that-did-not-turn-up">
              Booking case study
            </Button>
          </div>
        </Band>
        <Band
          heading="the wider work that supports a build."
          intro="A website or application also depends on clear offers, sound processes and useful measures. These retained capabilities support the core build where the project needs them."
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

        <Band heading="what we normally decline." tone="paper">
          <ul className="measure-wide grid list-none gap-3 p-0">
            {DECLINED.map((item) => (
              <li key={item} className="flex gap-3 text-[17px] leading-relaxed">
                <span aria-hidden="true" className="font-black text-oj-orange-deep">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Band>

        <Band heading="it always starts the same way.">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              Tell us what you want to build or improve. We discuss the scope, existing systems and
              what success would mean. The first conversation is an hour and free.
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
            bring us the build you have in mind.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            A new website, a bespoke application or a booking journey that needs attention: tell us
            what you want to achieve.
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
