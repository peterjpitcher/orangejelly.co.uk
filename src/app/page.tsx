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

import { BUILDS, METHOD, PRESSURE_POINTS, PROOF, WORK_EXAMPLES } from './home-content';

const TITLE = 'Websites, Applications & AI for Business Growth | Orange Jelly';
const DESCRIPTION =
  'We build websites, bespoke applications and connected systems, using AI where it adds value, to drive bookings, better customer experiences and business growth.';

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
                websites, applications and useful AI
              </p>
              <h1 className="oj-display mt-3 max-w-[16ch] text-[clamp(42px,8.5vw,88px)] leading-[0.92] text-oj-on-band">
                Websites and connected systems that grow your business.
              </h1>
              <p className="measure mt-6 text-[19px] leading-relaxed text-oj-on-band">
                We build websites, bespoke applications and AI-powered workflows that help customers
                find you, book with you and come back.
              </p>
              <p className="measure mt-4 text-[17px] leading-relaxed text-oj-on-band">
                From your website to the systems behind it, we connect the customer experience and
                make everyday work simpler.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  arrow
                  href="/start-here#enquiry"
                  className="max-w-full whitespace-normal text-left"
                >
                  Tell us what you want to build or improve
                </Button>
                <Button variant="ghost" href="/solutions">
                  See what we build
                </Button>
              </div>
            </div>
          </section>
        </GroundProvider>

        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-14 sm:py-20">
          <div className="page-shell">
            <h2 className="oj-display text-[clamp(30px,5.5vw,52px)] leading-[0.98]">
              what we build.
            </h2>
            <p className="measure mt-5 text-[17px] leading-relaxed text-oj-ink-2">
              Start with the part you need: a website, a bespoke application or a useful AI
              workflow. We connect it to the way your business works.
            </p>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {BUILDS.map((build) => (
                <PressureCard
                  key={build.title}
                  eyebrow={build.area}
                  title={build.title}
                  desc={build.desc}
                  href={build.href}
                />
              ))}
            </div>
            <p className="measure mt-7 text-[17px] leading-relaxed">
              Your digital backbone means the systems behind the customer experience: bookings,
              customer records, guest portals and follow-up. AI belongs where it performs a useful
              task. Using AI during development does not make every website an AI product.
            </p>
            <div className="mt-7">
              <Button variant="ghost" href="/solutions/booking-systems">
                Explore booking systems
              </Button>
            </div>
          </div>
        </section>
        <section className="border-b-1.5 border-oj-ink bg-oj-paper py-14 sm:py-20">
          <div className="page-shell">
            <h2 className="oj-display text-[clamp(30px,5.5vw,52px)] leading-[0.98]">
              see the work behind the results.
            </h2>
            <p className="measure mt-5 text-[17px] leading-relaxed text-oj-ink-2">
              These examples come from The Anchor, our own venue. Each case study explains what
              changed and what we measured.
            </p>
            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              {WORK_EXAMPLES.map((work) => (
                <PressureCard
                  key={work.title}
                  eyebrow={work.area}
                  title={work.title}
                  desc={work.desc}
                  href={work.href}
                />
              ))}
            </div>
          </div>
        </section>

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
              These results reflect the combined work at The Anchor. They are not results from a
              website or an AI feature alone, and they are not a forecast for another business.
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

        <section className="border-b-1.5 border-oj-ink bg-oj-paper py-14 sm:py-20">
          <div className="page-shell">
            <h2 className="oj-display max-w-[20ch] text-[clamp(30px,5.5vw,52px)] leading-[0.98]">
              for businesses ready to build something better.
            </h2>
            <div className="measure mt-6 space-y-4 text-[17px] leading-relaxed">
              <p>
                We work with small and mid-sized businesses that need a stronger website, connected
                customer systems or software built around how they operate. Hospitality is one
                sector we know through running our own venue.
              </p>
              <p>
                You can arrive with a clear project or a problem to work through. We check what your
                existing software can do before recommending a new build.
              </p>
            </div>
            <div className="mt-7">
              <Button variant="ghost" href="/start-here">
                Discuss your project
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
                what do you want to build or improve?
              </h2>
              <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
                Tell us about the website, application or customer journey you have in mind. The
                first conversation is an hour, and it's free.
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
