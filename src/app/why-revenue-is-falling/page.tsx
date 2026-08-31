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
 * `/why-revenue-is-falling`. Where the four problem-shaped hospitality landing pages
 * consolidate, de-sectored and reframed.
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
const TITLE = 'Why Revenue Is Falling: Find the Cause First | Orange Jelly';
const DESCRIPTION =
  'Revenue down week on week and nobody can say why. The six causes that account for most of it, how we find which one is yours, and what we would do next.';
const CANONICAL = `${getBaseUrl()}/why-revenue-is-falling`;

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

export default function WhyRevenueIsFallingPage(): JSX.Element {
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
                items={[{ label: 'Home', href: '/' }, { label: 'Why revenue is falling' }]}
              />
              <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-on-band">
                a direction, not a verdict
              </p>
              <h1 className="oj-display mt-2.5 text-[clamp(38px,7.5vw,72px)] leading-[0.94] text-oj-on-band">
                find out why revenue is falling.
              </h1>
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-on-band">
                Takings are down week on week and the wage bill is not. What makes that hard to fix
                is rarely the fall itself, it's that nobody can say what is causing it. The cause is
                findable, and once you have it, everything after is easier to decide, quicker to do
                and cheaper to get right.
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

        <Band heading="first, the honest part." tone="paper">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              There's a point at which knowing the cause is not the thing you need next. If the
              business genuinely cannot pay its bills this month, the useful calls are to your
              accountant and to a licensed insolvency practitioner rather than to us. If you run a
              pub, your BDM and the{' '}
              <a
                href="https://www.licensedtradecharity.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                Licensed Trade Charity
              </a>
              <span className="sr-only"> (opens in a new tab)</span> belong on that list too. They
              are better at that month than we are, and we'd rather tell you now than take the
              meeting.
            </p>
            <p>
              Everything below is written for the ground just before that: a business still trading,
              still with money to work with, and sliding for reasons nobody has correctly
              identified. That version has options, and they are widest when somebody looks early.
            </p>
          </div>
        </Band>

        <Band
          heading="the six that account for most of it."
          intro="It's usually one or two of these, rather than the economy and rather than everything at once. Each one is revenue the business is already capable of and is not currently getting, which is why it can come back. Read them as a shortlist to check your own numbers against, not as a diagnosis."
        >
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
              It's not fast in the way a promise is fast. It's fast in the way that stops you paying
              for the wrong fix.
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
          intro="All three are The Anchor, our own venue. That's the whole of our evidence, and we'd rather say so than dress it up."
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
            you don't have to guess at this.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            Bring us what's happening, what you've already tried, and what everybody thinks the
            cause is. The first hour is free, and you leave it with a clearer view of where to look
            than you came in with. If we're not the right people, we will say so inside that hour
            and point you at who is.
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
