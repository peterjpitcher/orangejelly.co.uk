import type { Metadata } from 'next';

import {
  Button,
  GroundProvider,
  MethodStep,
  OjFooter,
  OjHeader,
  PressureCard,
  ProofCard,
} from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import { METHOD, PRESSURE_POINTS, PROOF, SYMPTOMS } from './home-content';

/**
 * The homepage.
 *
 * Replaces a page that sold four named packages at published prices and described
 * Orange Jelly as a hospitality marketing company. Both were true and neither is
 * any more: D3 removed pricing because a published estimate reads as high and puts
 * the right client off before a conversation, and the repositioning makes the
 * sector one market rather than the company's definition.
 *
 * The proof stays hospitality-specific on purpose. It is the only place the
 * numbers are real, and pretending otherwise would be the exact thing this
 * repositioning is supposed to stop.
 *
 * Copy: `tasks/repositioning/copy/homepage.md`, held to it by a test.
 */
const TITLE = 'Orange Jelly | Find what stops your business growing. Fix it.';
const DESCRIPTION =
  'We find what is stopping your business growing, then fix it. Sometimes that is marketing. Often it is not. Proven first in a business we run ourselves.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: getBaseUrl() },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: getBaseUrl(),
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

export default function HomePage(): JSX.Element {
  return (
    <>
      <OjHeader />

      <main id="main-content">
        <GroundProvider value="band">
          <section className="border-b-1.5 border-oj-ink bg-oj-band py-16 sm:py-24 text-oj-on-band">
            <div className="page-shell">
              <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-on-band">
                strategic growth partner for ambitious businesses
              </p>
              <h1 className="oj-display mt-3 max-w-[16ch] text-[clamp(42px,8.5vw,88px)] leading-[0.92] text-oj-on-band">
                find what's stopping your business growing, and fix it.
              </h1>
              <p className="measure mt-6 text-[19px] leading-relaxed text-oj-on-band">
                We work out what is really holding a business back, agree the plan, and then do the
                work. Sometimes that's marketing. Often it isn't.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button size="lg" arrow href="/start-here">
                  Let's talk
                </Button>
                <Button variant="ghost" href="/how-we-work">
                  See how we work
                </Button>
              </div>
            </div>
          </section>
        </GroundProvider>

        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-14 sm:py-20">
          <div className="page-shell">
            <h2 className="oj-display max-w-[22ch] text-[clamp(30px,5.5vw,52px)] leading-[0.98]">
              you don't need more activity. you need to know what will move the numbers.
            </h2>
            <p className="measure mt-5 text-[17px] leading-relaxed text-oj-ink-2">
              Most businesses that come to us can describe the symptom precisely and the cause not
              at all.
            </p>
            <ul className="measure-wide mt-8 grid list-none gap-x-10 gap-y-4 p-0 sm:grid-cols-2">
              {SYMPTOMS.map((symptom) => (
                <li key={symptom} className="flex gap-3 text-[17px] leading-relaxed">
                  <span aria-hidden="true" className="font-black text-oj-orange-deep">
                    &mdash;
                  </span>
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
            <p className="measure mt-8 text-[17px] font-semibold leading-relaxed">
              Any one of those is worth an hour. The hour is free.
            </p>
          </div>
        </section>

        <section className="border-b-1.5 border-oj-ink bg-oj-paper py-14 sm:py-20">
          <div className="page-shell">
            <h2 className="oj-display text-[clamp(30px,5.5vw,52px)] leading-[0.98]">
              where growth usually gets stuck.
            </h2>
            <p className="measure mt-5 text-[17px] leading-relaxed text-oj-ink-2">
              Six areas we check in every business. Most problems are a mix of two or three.
            </p>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            {/*
              The site has six areas and eight problem pages. The two extra pages,
              "growth has stalled" and "where would AI help", are combinations, and a
              reader who counted six here and eight on the next page assumed they had
              missed two. Saying so is cheaper than making them wonder.
            */}
            <div className="mt-8">
              <Button variant="ghost" href="/growth-problems">
                See all eight growth problems
              </Button>
            </div>
          </div>
        </section>

        <GroundProvider value="ink">
          <section className="border-b-1.5 border-oj-ink bg-oj-ink py-14 text-oj-cream sm:py-20">
            <div className="page-shell">
              <h2 className="oj-display text-[clamp(30px,5.5vw,52px)] leading-[0.98]">
                how it works.
              </h2>
              <p className="measure mt-5 text-[17px] leading-relaxed text-oj-cream/80">
                Listen, check the numbers, build the fix, measure it. Four steps, in that order,
                every time.
              </p>
              <ol className="mt-9 grid list-none gap-6 p-0 sm:grid-cols-2">
                {METHOD.map((step, index) => (
                  <li key={step.word}>
                    <MethodStep index={index + 1} word={step.word} text={step.text} tone="dark" />
                  </li>
                ))}
              </ol>
              <div className="mt-9">
                <Button variant="solid" href="/how-we-work">
                  How we work in full
                </Button>
              </div>
            </div>
          </section>
        </GroundProvider>

        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-14 sm:py-20">
          <div className="page-shell">
            <h2 className="oj-display text-[clamp(30px,5.5vw,52px)] leading-[0.98]">
              proven where the risk was ours.
            </h2>
            <p className="measure mt-5 text-[17px] leading-relaxed text-oj-ink-2">
              The Anchor is our own venue, a real trading business we run, and it's where this
              thinking was built and tested before it was ever sold to anybody. Every number below
              comes from it.
            </p>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PROOF.map((proof) => (
                <ProofCard
                  key={proof.label}
                  value={proof.value}
                  label={proof.label}
                  context={proof.context}
                  area={proof.area}
                />
              ))}
            </div>
            <p className="measure mt-9 text-[17px] leading-relaxed">
              We proved this in a pub. The same problems, and the same fixes, show up in every kind
              of business.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Button variant="ghost" href="/results">
                See the work
              </Button>
              <Button variant="ghost" href="/pub-marketing">
                Run a pub? Start here
              </Button>
            </div>
          </div>
        </section>

        <section className="border-b-1.5 border-oj-ink bg-oj-paper py-14 sm:py-20">
          <div className="page-shell">
            <h2 className="oj-display max-w-[20ch] text-[clamp(30px,5.5vw,52px)] leading-[0.98]">
              for anyone who is open to change.
            </h2>
            <div className="measure mt-6 space-y-4 text-[17px] leading-relaxed">
              <p>
                This works for any business that has built something real, feels a ceiling, and can
                act once a direction is agreed. Any sector, any size. The only thing we need is that
                something inside the business can actually change.
              </p>
              <p>
                It doesn't work if you want three posts a week, a pair of hands for a plan already
                decided, or AI because it's AI. We say all of that plainly before anyone spends
                anything.
              </p>
            </div>
            <div className="mt-7">
              <Button variant="ghost" href="/start-here">
                Who this is and isn't for
              </Button>
            </div>
          </div>
        </section>

        <GroundProvider value="ink">
          {/*
            Hand-rolled rather than a Band, so it needs the closing-band padding
            written out. Miss this and the busiest page on the site keeps the full
            841px dark block while every lesser page gets the shorter one.
          */}
          <section className="bg-oj-ink pb-10 pt-14 sm:pb-10 sm:pt-20">
            <div className="page-shell">
              <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
                stop circling the problem.
              </h2>
              <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
                Tell us what's happening, what you've tried, and what needs to change. The first
                conversation is an hour, and it's free.
              </p>
              <div className="mt-8">
                <Button size="lg" arrow href="/start-here">
                  Let's talk
                </Button>
              </div>
            </div>
          </section>
        </GroundProvider>
      </main>

      <OjFooter />
    </>
  );
}
