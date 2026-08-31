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
const TITLE = 'Orange Jelly | For owners ready to take control of growth.';
const DESCRIPTION =
  'Growth partner for ambitious small and mid-sized businesses. We work out what is actually blocking growth, then build the thing that fixes it.';

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
                for business owners ready to take control of growth.
              </h1>
              <p className="measure mt-6 text-[19px] leading-relaxed text-oj-on-band">
                We get under the skin of a business, work out what is actually blocking growth,
                build the strategy to move it, and turn that into action. Sometimes that is
                marketing. Often it is not.
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
              you do not need more activity. you need to know what will move the numbers.
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
              Any one of those is worth an hour of our time and none of yours until it is.
            </p>
          </div>
        </section>

        <section className="border-b-1.5 border-oj-ink bg-oj-paper py-14 sm:py-20">
          <div className="page-shell">
            <h2 className="oj-display text-[clamp(30px,5.5vw,52px)] leading-[0.98]">
              six places growth gets stuck.
            </h2>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PRESSURE_POINTS.map((point) => (
                <PressureCard
                  key={point.title}
                  title={point.title}
                  desc={point.desc}
                  href={point.href}
                />
              ))}
            </div>
          </div>
        </section>

        <GroundProvider value="ink">
          <section className="border-b-1.5 border-oj-ink bg-oj-ink py-14 text-oj-cream sm:py-20">
            <div className="page-shell">
              <h2 className="oj-display text-[clamp(30px,5.5vw,52px)] leading-[0.98]">
                hear. challenge. build. optimise.
              </h2>
              <p className="measure mt-5 text-[17px] leading-relaxed text-oj-cream/80">
                Four steps, in that order, every time. The order is the method.
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
              The Anchor is our own venue, a real trading business we run, and it is where this
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
              A pub is not a professional services firm. Demand, conversion, margin and drag behave
              the same way in both, which is why the method travels and the tactics do not.
            </p>
            <div className="mt-7">
              <Button variant="ghost" href="/results">
                See the work
              </Button>
            </div>
          </div>
        </section>

        <section className="border-b-1.5 border-oj-ink bg-oj-paper py-14 sm:py-20">
          <div className="page-shell">
            <h2 className="oj-display max-w-[20ch] text-[clamp(30px,5.5vw,52px)] leading-[0.98]">
              big enough to have real problems. small enough to move fast.
            </h2>
            <div className="measure mt-6 space-y-4 text-[17px] leading-relaxed">
              <p>
                This works best for a business that has built something real, feels a ceiling, and
                can act once a direction is agreed. Roughly 10 to 500 people, as a guide rather than
                a rule.
              </p>
              <p>
                It does not work if you want three posts a week, a pair of hands for a plan already
                decided, or AI because it is AI. We say all of that plainly before anyone spends
                anything.
              </p>
            </div>
            <div className="mt-7">
              <Button variant="ghost" href="/start-here">
                Who this is and is not for
              </Button>
            </div>
          </div>
        </section>

        <GroundProvider value="ink">
          <section className="bg-oj-ink py-16 sm:py-24">
            <div className="page-shell">
              <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
                stop circling the problem.
              </h2>
              <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
                Tell us what is happening, what you have tried, and what needs to change. The first
                conversation is an hour, it is free, and it is not a pitch.
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
