import type { Metadata } from 'next';

import {
  Anchor,
  Band,
  Breadcrumb,
  Button,
  FAQ,
  OjFooter,
  OjHeader,
  ProofCard,
  GroundProvider,
} from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import { CASE_STUDIES } from '../results/case-studies';

import { CAUSES, FAQS, WOULD_NOT_DO } from './content';

/**
 * `/small-business-rescue`. Where the four problem-shaped hospitality landing pages
 * consolidate, de-sectored.
 *
 * The page opens by refusing the emergency framing its predecessor carried. A
 * business that genuinely cannot pay this month needs an accountant and an
 * insolvency practitioner, and saying so is both true and the reason to trust the
 * rest of the page. It also keeps Orange Jelly out of engagements where nobody can
 * win: the pack's own ideal-client work says complete financial distress destroys
 * the ability to act, which is exactly the case a rescue page attracts if it
 * oversells itself.
 *
 * The case studies are here because two of the three are this page's problem at a
 * later stage, and a page that says "we would look before we change anything" is
 * more believable next to three occasions where that is what happened. They link out
 * rather than retelling, so the numbers live in one place.
 *
 * Copy: `tasks/repositioning/copy/sector-hospitality.md`.
 */
const TITLE = 'Revenue is falling | Orange Jelly';
const DESCRIPTION =
  'For a business still trading and sliding for reasons nobody has identified. The six causes that account for most of it, and what we would actually do.';
const CANONICAL = `${getBaseUrl()}/small-business-rescue`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

/**
 * The FAQ block is the one piece of structured data on this page.
 *
 * These five questions are what the old URL ranked for, so the markup goes with
 * them. The answers are the rewritten ones, not the originals: quoting a price in
 * schema that the site no longer shows would be a claim we cannot stand behind.
 */
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
};

export default function SmallBusinessRescuePage(): JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <OjHeader />

      <main id="main-content">
        <GroundProvider value="band">
          <section className="border-b-1.5 border-oj-ink bg-oj-band py-12 text-oj-on-band sm:py-16">
            <div className="page-shell">
              <Breadcrumb
                tone="orange"
                className="mb-7"
                items={[{ label: 'Home', href: '/' }, { label: 'Revenue is falling' }]}
              />
              <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-on-band">
                when it is going the wrong way
              </p>
              <h1 className="oj-display mt-2.5 text-[clamp(38px,7.5vw,72px)] leading-[0.94] text-oj-on-band">
                revenue is falling and you need it to stop.
              </h1>
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-on-band">
                This page is for the version of the problem that is not a project. Takings are down
                week on week, the wage bill is not, and every day it continues costs more than the
                last one.
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
        </GroundProvider>

        <Band heading="first, the honest part." tone="paper">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              We are not an emergency service and we will not pretend to be one. If the business
              genuinely cannot pay its bills this month, the useful calls are to your accountant and
              to a licensed insolvency practitioner, not to us. If you run a pub, your BDM and the{' '}
              <a
                href="https://www.licensedtradecharity.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                Licensed Trade Charity
              </a>
              <span className="sr-only"> (opens in a new tab)</span> belong on that list too.
            </p>
            <p>
              What we are good at is the situation just before that: a business that is still
              trading, still has some money to work with, and is sliding for reasons nobody has
              correctly identified.
            </p>
          </div>
        </Band>

        <Band heading="the six that account for most of it.">
          <dl className="measure-wide grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {CAUSES.map((cause) => (
              <div key={cause.title}>
                <dt className="font-oj text-[18px] font-black leading-snug text-oj-ink">
                  {cause.title}
                </dt>
                <dd className="mt-2 text-[16px] leading-relaxed text-oj-ink-2">{cause.body}</dd>
              </div>
            ))}
          </dl>
        </Band>

        <Band heading="what we would actually do." tone="paper">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              A week or two of looking, properly, before anything is changed. The baseline first:
              revenue by week, by line and by source, where enquiries come from and where they stop,
              and what each one is worth. Then the one or two changes with the largest effect, built
              and measured against that baseline.
            </p>
            <p>
              It is not fast in the way a promise is fast. It is fast in the way that means you stop
              paying for the wrong fix.
            </p>
          </div>
        </Band>

        <Band heading="what we would not do.">
          <ul className="measure flex list-none flex-col gap-3 p-0">
            {WOULD_NOT_DO.map((item) => (
              <li key={item} className="flex gap-3 text-[17px] leading-relaxed">
                <span aria-hidden="true" className="font-black text-oj-orange-deep">
                  &ndash;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Band>

        <Band
          heading="three times we did exactly that."
          tone="paper"
          intro="All three are The Anchor, our own venue. That is the whole of our evidence and we would rather say so than dress it up."
        >
          <div className="grid gap-5 sm:grid-cols-3">
            {CASE_STUDIES.map((study) => (
              <Anchor
                key={study.slug}
                href={`/results/${study.slug}`}
                className="group block no-underline"
              >
                <ProofCard
                  value={study.headline.value}
                  label={study.headline.label}
                  context={study.headline.context}
                  area={study.area}
                />
                <span className="mt-3 block font-oj text-[17px] font-black leading-snug text-oj-ink group-hover:text-oj-orange-deep">
                  {study.title}
                  <span aria-hidden="true"> &rarr;</span>
                </span>
              </Anchor>
            ))}
          </div>
        </Band>

        <Band heading="questions people ask first.">
          <FAQ className="measure-wide" items={FAQS} openFirst />
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
            the first hour is free.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            Tell us what is happening and what you have already tried. If we are not the right
            people we will tell you that inside the hour, and point you at who is.
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
