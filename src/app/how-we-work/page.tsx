import type { Metadata } from 'next';

import { Band, Breadcrumb, Button, GroundProvider, OjFooter, OjHeader } from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import {
  METHOD_DETAIL,
  PRESSURE_AREAS_EXPLAINED,
  PREVENTS,
  STARTING_AGREEMENT,
  TIMELINE,
} from './content';

const TITLE = 'How we work | Orange Jelly';
const DESCRIPTION =
  'From your brief to a working website, application or connected system. How we agree the build, test the journey and measure the result.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/how-we-work` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/how-we-work`,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

export default function HowWeWorkPage(): JSX.Element {
  return (
    <>
      <OjHeader current="how-we-work" />

      <main id="main-content">
        <GroundProvider value="ink">
          <section className="bg-oj-ink py-12 text-oj-cream sm:py-16">
            <div className="page-shell">
              <Breadcrumb
                tone="ink"
                className="mb-7"
                items={[{ label: 'Home', href: '/' }, { label: 'How we work' }]}
              />
              <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-peach">
                the method: hear, challenge, build, optimise
              </p>
              <h1 className="oj-display mt-2.5 max-w-[14ch] text-[clamp(40px,8vw,78px)] leading-[0.92] text-oj-cream">
                agree the build. make it work. measure the result.
              </h1>
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-cream/85">
                Bring a clear brief or an idea that needs shaping. We work out what to build,
                connect it to the business and agree how to judge the result.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" arrow href="/start-here">
                  Let's talk
                </Button>
              </div>
            </div>
          </section>
        </GroundProvider>

        <Band heading="why the same four steps every time." tone="paper">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              A website, a booking journey and a bespoke application each need a clear brief,
              practical testing and a way to measure the result. These steps keep the work focused.
            </p>
            <p>
              Discovery is sized to the questions the project needs answered. If you already know
              what you want built, we start there and check the assumptions together.
            </p>
          </div>
        </Band>

        <Band heading="how long it takes.">
          <dl className="measure-wide grid gap-6 sm:grid-cols-3">
            {TIMELINE.map((item) => (
              <div key={item.stage} className="border-t-1.5 border-oj-ink pt-3.5">
                <dt className="font-oj text-[18px] font-black leading-snug text-oj-ink">
                  {item.stage}
                </dt>
                <dd className="mt-1.5 text-[17px] font-semibold text-oj-orange-deep">
                  {item.length}
                </dd>
                <dd className="mt-2 text-[16px] leading-relaxed text-oj-ink-2">{item.body}</dd>
              </div>
            ))}
          </dl>
        </Band>

        {METHOD_DETAIL.map((step, index) => (
          <Band key={step.word} tone={index % 2 === 0 ? 'page' : 'paper'}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
              <div>
                <p className="font-oj text-[15px] font-bold tabular-nums text-oj-orange-deep">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="oj-display mt-1 text-[clamp(34px,6vw,58px)] leading-[0.95] text-oj-ink">
                  {step.word}
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-[19px] font-semibold leading-snug text-oj-ink">{step.line}</p>
                <p className="text-[17px] leading-relaxed text-oj-ink-2">{step.body}</p>
                {step.outcome ? (
                  <p className="text-[17px] leading-relaxed text-oj-ink-2">
                    <strong className="text-oj-ink">What you end up with:</strong> {step.outcome}
                  </p>
                ) : null}
                <p className="rounded-oj border-1.5 border-oj-ink bg-oj-paper p-4 text-[16px] font-semibold leading-relaxed text-oj-ink shadow-press-sm">
                  {step.discipline}
                </p>
              </div>
            </div>
          </Band>
        ))}

        <Band
          heading="the growth pressure map."
          intro="When the brief needs more investigation, these areas help us connect the build to the business outcome."
          tone="ink"
        >
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRESSURE_AREAS_EXPLAINED.map((item) => (
              <div key={item.area}>
                <dt className="font-oj text-[19px] font-black text-oj-orange">{item.area}</dt>
                <dd className="mt-1.5 text-[16px] leading-relaxed text-oj-cream/80">{item.body}</dd>
              </div>
            ))}
          </dl>
          <p className="measure mt-9 text-[17px] leading-relaxed text-oj-cream/80">
            It's not a scorecard with a total at the bottom. A score invites a league table and
            false precision. The map is built around how your business actually works and is there
            to focus the next move, not to grade you.
          </p>
        </Band>

        <Band heading="what we agree before anything is built.">
          <ul className="measure-wide grid list-none gap-x-10 gap-y-3 p-0 sm:grid-cols-2">
            {STARTING_AGREEMENT.map((item) => (
              <li key={item} className="flex gap-3 text-[17px] leading-relaxed">
                <span aria-hidden="true" className="font-black text-oj-orange-deep">
                  &#8226;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="measure mt-8 text-[17px] leading-relaxed">
            Every one of those is agreed in writing before the first day of build. It's not
            paperwork: it's the list of things that, left unsaid, turn into the argument at the end.
          </p>
        </Band>

        <Band heading="what this avoids." tone="paper">
          <ul className="measure-wide grid list-none gap-x-10 gap-y-3 p-0 sm:grid-cols-2">
            {PREVENTS.map((item) => (
              <li key={item} className="flex gap-3 text-[17px] leading-relaxed">
                <span aria-hidden="true" className="font-black text-oj-orange-deep">
                  &#8226;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
            it starts with an hour, free.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            Tell us what you want to build or improve and what it needs to achieve.
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
