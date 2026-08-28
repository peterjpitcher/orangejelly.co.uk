import type { Metadata } from 'next';

import { Breadcrumb, Button, EnquiryForm, FAQ, Footer, Header, MethodStep } from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import { FIT, FAQS, NEEDS, STEPS, TAKEAWAYS } from './content';

/**
 * `/start-here`. The conversion page for the repositioning.
 *
 * It carries the fit language, which is the qualification filter that replaced the
 * price when D3 took pricing off the site. That is why the "who this does not work
 * for" section is specific rather than hedged: with no number to filter on, the
 * only honest filter left is saying plainly who this is not for.
 *
 * Chrome is the `oj` Header and Footer, not the legacy site chrome. `ChromeGate`
 * suppresses the old one here, driven by `src/lib/oj-routes.ts`.
 *
 * Copy: `tasks/repositioning/copy/start-here.md`, held to it by a test.
 */
const TITLE = 'Start here | Orange Jelly';
const DESCRIPTION =
  'Every piece of work starts with a conversation about what is actually happening, before anyone says the word solution. What that involves, what you get from it, and who it does not work for.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/start-here` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/start-here`,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

function Band({
  id,
  heading,
  intro,
  tone = 'page',
  children,
}: {
  id?: string;
  heading: string;
  intro?: React.ReactNode;
  tone?: 'page' | 'paper' | 'ink';
  children: React.ReactNode;
}): JSX.Element {
  // Tone names the role, not the colour. Naming it after the colour is how a
  // palette change turns every page into a rename.
  const surface =
    tone === 'ink' ? 'bg-oj-ink text-oj-cream' : tone === 'paper' ? 'bg-oj-paper' : 'bg-oj-cream';

  return (
    <section id={id} className={`${surface} border-b-1.5 border-oj-ink py-14 sm:py-20`}>
      <div className="page-shell">
        <h2 className="oj-display text-[clamp(30px,5vw,46px)] leading-[0.98]">{heading}</h2>
        {intro ? <p className="measure mt-4 text-[17px] leading-relaxed">{intro}</p> : null}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export default function StartHerePage(): JSX.Element {
  return (
    <>
      <Header
        tone="orange"
        items={[
          { label: 'Growth problems', href: '/growth-problems' },
          { label: 'How we work', href: '/how-we-work' },
          { label: 'Results', href: '/results' },
          { label: 'Start here', href: '/start-here', current: true },
        ]}
        cta={{ label: 'Bring us the problem', href: '#enquiry' }}
      />

      <main>
        <section className="border-b-1.5 border-oj-ink bg-oj-orange py-12 sm:py-16">
          <div className="page-shell">
            <Breadcrumb
              tone="orange"
              className="mb-7"
              items={[{ label: 'Home', href: '/' }, { label: 'Start here' }]}
            />
            <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-ink">
              the first conversation
            </p>
            <h1 className="oj-display mt-2.5 text-[clamp(44px,9vw,84px)] leading-[0.92] text-oj-ink">
              start here.
            </h1>
            <p className="measure mt-5 text-[19px] leading-relaxed text-oj-ink">
              Every piece of work we do starts the same way. A conversation about what is actually
              happening in your business, before anyone says the word solution. This page tells you
              what that involves, what you get out of it, and who it does not work for.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" arrow href="#enquiry">
                Bring us the problem
              </Button>
              <Button variant="ghost" href="/how-we-work">
                See how we work
              </Button>
            </div>
          </div>
        </section>

        <Band heading="what actually happens." tone="ink">
          <ol className="grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.word}>
                <MethodStep index={index + 1} word={step.word} text={step.text} tone="dark" />
              </li>
            ))}
          </ol>
        </Band>

        <Band
          heading="what you get from the hour."
          intro="You are not buying anything in that conversation and we are not asking you to."
        >
          <ul className="measure-wide grid list-none gap-4 p-0 sm:grid-cols-3">
            {TAKEAWAYS.map((item) => (
              <li
                key={item}
                className="rounded-oj border-1.5 border-oj-ink bg-oj-paper p-5 text-[16px] leading-relaxed shadow-press-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </Band>

        <Band heading="what we need from you." tone="paper">
          <dl className="measure-wide grid gap-6 sm:grid-cols-3">
            {NEEDS.map((need) => (
              <div key={need.title}>
                <dt className="font-oj text-[18px] font-black leading-tight text-oj-ink">
                  {need.title}
                </dt>
                <dd className="mt-2 text-[16px] leading-relaxed text-oj-ink-2">{need.body}</dd>
              </div>
            ))}
          </dl>
        </Band>

        <Band
          heading="big enough to have real problems. small enough to move fast."
          intro="You will get the most from this if:"
        >
          <ul className="measure flex list-none flex-col gap-3 p-0">
            {FIT.works.map((item) => (
              <li key={item} className="flex gap-3 text-[17px] leading-relaxed">
                <span aria-hidden="true" className="font-black text-oj-orange-deep">
                  &mdash;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="measure mt-7 text-[16px] leading-relaxed text-oj-ink-2">
            Roughly, that tends to mean 10 to 500 people. It is a guide rather than a rule: a
            smaller business with real scale, urgency and something to invest fits fine.
          </p>
        </Band>

        {/*
         * The fit language, and the reason this page exists in this shape. It is the
         * qualification filter that replaced the price, so it is specific and it
         * names behaviours rather than hedging about "the right partnership".
         */}
        <Band
          heading="who this does not work for."
          intro="We would rather say this now than three weeks in. This is not a fit if:"
          tone="paper"
        >
          <ul className="measure-wide grid list-none gap-5 p-0 sm:grid-cols-2">
            {FIT.doesNot.map((item) => (
              <li
                key={item.title}
                className="rounded-oj border-1.5 border-oj-ink bg-oj-cream p-5 shadow-press-sm"
              >
                <p className="font-oj text-[17px] font-black leading-snug text-oj-ink">
                  {item.title}
                </p>
                <p className="mt-2 text-[15.5px] leading-relaxed text-oj-ink-2">{item.body}</p>
              </li>
            ))}
          </ul>
          <p className="measure mt-8 text-[17px] font-semibold leading-relaxed text-oj-ink">
            None of that makes yours a bad business. It makes us the wrong supplier, which is a
            different thing and a much cheaper one to find out early.
          </p>
        </Band>

        <Band heading="how long, and what it costs.">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              <strong>The conversation</strong> is an hour, and it is free.
            </p>
            <p>
              <strong>A diagnostic</strong> is normally two to three weeks. Longer work depends
              entirely on what we find, and we agree the shape of it with you before it starts
              rather than after.
            </p>
            <p>
              <strong>On cost:</strong> we do not publish prices, because we do not sell packages.
              What we would quote a company of eight with a conversion problem looks nothing like
              what we would quote a company of two hundred with a margin problem, and a number on
              this page would only be wrong for both. Every engagement is priced to the problem and
              agreed in writing before any work begins.
            </p>
          </div>
        </Band>

        <section id="enquiry" className="border-b-1.5 border-oj-ink bg-oj-cream-2 py-14 sm:py-20">
          <div className="page-shell">
            <div className="measure">
              <EnquiryForm entryPoint="page" />
            </div>
          </div>
        </section>

        <Band heading="questions people ask first." tone="paper">
          <div className="measure">
            <FAQ items={FAQS} />
          </div>
        </Band>

        <section className="bg-oj-ink py-16 sm:py-24">
          <div className="page-shell">
            <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
              stop circling the problem.
            </h2>
            <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
              Tell us what is happening, what you have tried, and what needs to change.
            </p>
            <div className="mt-8">
              <Button size="lg" arrow href="#enquiry">
                Bring us the problem
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer
        columns={[
          {
            title: 'Start',
            links: [
              { label: 'Start here', href: '/start-here' },
              { label: 'How we work', href: '/how-we-work' },
              { label: 'Results', href: '/results' },
            ],
          },
          {
            title: 'Company',
            links: [
              { label: 'About', href: '/about' },
              { label: 'Insights', href: '/licensees-guide' },
              { label: 'Privacy', href: '/privacy' },
            ],
          },
        ]}
        legal="Orange Jelly Limited"
      />
    </>
  );
}
