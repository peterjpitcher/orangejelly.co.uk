import type { Metadata } from 'next';

import { PROOF } from '@/app/home-content';
import {
  Anchor,
  Band,
  Breadcrumb,
  Button,
  FAQ,
  MethodStep,
  OjFooter,
  OjHeader,
  ProofCard,
} from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import { AREAS, FAQS, LOOK_AT_FIRST } from './content';

/**
 * `/pub-marketing`. The hospitality sector landing page.
 *
 * It survives the consolidation because it earns 847 impressions on its own, and
 * because the sector language is genuinely accurate here. Four near-duplicate pages
 * that were splitting authority away from it redirect into it and into /pub-rescue.
 *
 * The old page opened by selling packages from a published price and pushed people
 * into WhatsApp. It now opens by saying most pubs do not have a marketing problem,
 * which is both truer and the argument for the diagnostic.
 *
 * Copy: `tasks/repositioning/copy/sector-hospitality.md`.
 */
const TITLE = 'Pub marketing | Orange Jelly';
const DESCRIPTION =
  'Most pubs do not have a marketing problem, they have a diagnosis problem. What we look at first, what it costs to find out, and the numbers from our own venue.';

const METHOD = [
  {
    word: 'HEAR.',
    text: 'What is actually happening in the venue, from the people in it and the numbers.',
  },
  {
    word: 'CHALLENGE.',
    text: 'The explanation everyone has agreed on, tested against the evidence.',
  },
  {
    word: 'BUILD.',
    text: 'The fix. Visibility, an offer, a booking journey, a menu, a system. Whatever it turns out to need.',
  },
  {
    word: 'OPTIMISE.',
    text: 'Measured against the baseline we took before we started, and kept at until it moves.',
  },
] as const;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/pub-marketing` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/pub-marketing`,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

export default function PubMarketingPage(): JSX.Element {
  return (
    <>
      <OjHeader />

      <main id="main-content">
        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-12 sm:py-16">
          <div className="page-shell">
            <Breadcrumb
              className="mb-7"
              items={[{ label: 'Home', href: '/' }, { label: 'Pub marketing' }]}
            />
            <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-orange-deep">
              hospitality
            </p>
            <h1 className="oj-display mt-2.5 text-[clamp(38px,7.5vw,72px)] leading-[0.94] text-oj-ink">
              pub marketing that starts with the numbers.
            </h1>
            <p className="measure mt-5 text-[19px] leading-relaxed text-oj-ink-2">
              Orange Jelly is a strategic growth partner for ambitious small and mid-sized businesses, and
              hospitality is the sector we know best, because we run one. The Anchor is our own
              venue. Everything here was tested there before it was offered to anybody else.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" arrow href="/start-here">
                Let's talk
              </Button>
              <Button variant="ghost" href="/results">
                See the numbers
              </Button>
            </div>
          </div>
        </section>

        <Band heading="most pubs do not have a marketing problem." tone="paper">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              They have a diagnosis problem. Trade is down, and the explanation everyone agrees on
              is the economy, the weather, the estate, the new place up the road. Sometimes it is.
              Usually the actual cause is somewhere nobody has looked, and more posting will not
              find it.
            </p>
            <p>That is why we start by looking, not by proposing a campaign.</p>
          </div>
        </Band>

        <Band heading="what we look at first.">
          <dl className="measure-wide grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {LOOK_AT_FIRST.map((item) => (
              <div key={item.title}>
                <dt className="font-oj text-[18px] font-black leading-snug text-oj-ink">
                  {item.title}
                </dt>
                <dd className="mt-2 text-[16px] leading-relaxed text-oj-ink-2">{item.body}</dd>
              </div>
            ))}
          </dl>
        </Band>

        <Band
          heading="proven in our own venue."
          intro="Every figure below is from The Anchor, measured against a baseline, in a business where getting it wrong cost us rather than a client."
          tone="paper"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        </Band>

        <Band heading="how it works." tone="ink">
          <ol className="grid list-none gap-6 p-0 sm:grid-cols-2">
            {METHOD.map((step, index) => (
              <li key={step.word}>
                <MethodStep index={index + 1} word={step.word} text={step.text} tone="dark" />
              </li>
            ))}
          </ol>
          <div className="mt-9">
            <Button variant="solid" href="/how-we-work">
              The method in full
            </Button>
          </div>
        </Band>

        <Band heading="if it is not marketing, and it is urgent." tone="paper">
          <p className="measure text-[17px] leading-relaxed text-oj-ink-2">
            Everything above assumes there is time to look properly. If takings are falling week on
            week and the wage bill is not, there is{' '}
            <Anchor href="/why-revenue-is-falling" className="font-semibold">
              a page on finding out why
            </Anchor>
            . It starts by saying what we are not, which matters more in that situation than in this
            one.
          </p>
        </Band>

        <Band heading="where we can get to in person." tone="paper">
          <p className="measure text-[17px] leading-relaxed text-oj-ink-2">
            We work with pubs anywhere in the UK, and most of what we do works the same either way.
            These are the counties close enough to The Anchor for us to turn up.
          </p>
          {/*
            Chips, not links. Each of these counties had its own landing page until
            they were consolidated into this one, and every one of those URLs now
            redirects here. Linking them would either point at a redirect or point
            the page at itself.
          */}
          <ul className="mt-6 flex list-none flex-wrap gap-2.5 p-0">
            {AREAS.map((area) => (
              <li
                key={area}
                className="rounded-oj border-1.5 border-oj-ink bg-oj-cream px-3.5 py-1.5 text-[15px] font-semibold text-oj-ink"
              >
                {area}
              </li>
            ))}
          </ul>
        </Band>

        <Band heading="questions publicans ask.">
          <div className="measure">
            <FAQ items={FAQS} />
          </div>
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
            we are a tenant too.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            Whatever is happening in your venue, we have probably had a version of it in ours. Tell
            us what it is.
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
