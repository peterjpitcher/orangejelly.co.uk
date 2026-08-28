import type { Metadata } from 'next';

import { Band, Breadcrumb, Button, OjFooter, OjHeader } from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import { CAUSES, WOULD_NOT_DO } from './content';

/**
 * `/pub-rescue`. Where the four problem-shaped hospitality landing pages
 * consolidate.
 *
 * The page opens by refusing the emergency framing it used to carry. A venue that
 * genuinely cannot pay this month needs its BDM, its accountant and the Licensed
 * Trade Charity, and saying so is both true and the reason to trust the rest of the
 * page. It also keeps Orange Jelly out of engagements where nobody can win: the
 * pack's own ideal-client work says complete financial distress destroys the ability
 * to act, which is exactly the case a rescue page attracts if it oversells itself.
 *
 * Copy: `tasks/repositioning/copy/sector-hospitality.md`.
 */
const TITLE = 'Trade is falling | Orange Jelly';
const DESCRIPTION =
  'For a venue that is still trading and sliding for reasons nobody has correctly identified. The six causes that account for most of it, and what we would actually do.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/pub-rescue` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/pub-rescue`,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

export default function PubRescuePage(): JSX.Element {
  return (
    <>
      <OjHeader />

      <main id="main-content">
        <section className="border-b-1.5 border-oj-ink bg-oj-band py-12 sm:py-16 text-oj-on-band">
          <div className="page-shell">
            <Breadcrumb
              tone="orange"
              className="mb-7"
              items={[{ label: 'Home', href: '/' }, { label: 'Trade is falling' }]}
            />
            <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-on-band">
              hospitality
            </p>
            <h1 className="oj-display mt-2.5 text-[clamp(38px,7.5vw,72px)] leading-[0.94] text-oj-on-band">
              trade is falling and you need it to stop.
            </h1>
            <p className="measure mt-5 text-[19px] leading-relaxed text-oj-on-band">
              This page is for the version of the problem that is not a project. Takings are down
              week on week, the wage bill is not, and every day it continues costs more than the
              last one.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" arrow variant="ink" href="/start-here">
                Bring us the problem
              </Button>
              <Button variant="ghost-band" href="/how-we-work">
                How we work
              </Button>
            </div>
          </div>
        </section>

        <Band heading="first, the honest part." tone="paper">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              We are not an emergency service and we will not pretend to be one. If the business
              genuinely cannot pay its bills this month, the useful call is to your BDM, your
              accountant and the{' '}
              <a
                href="https://www.licensedtradecharity.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                Licensed Trade Charity
              </a>
              <span className="sr-only"> (opens in a new tab)</span>, not to us.
            </p>
            <p>
              What we are good at is the situation just before that: a venue that is still trading,
              still has some money to work with, and is sliding for reasons nobody has correctly
              identified.
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
              takings by session, covers, spend per head, where enquiries come from and where they
              stop. Then the one or two changes with the largest effect, built and measured against
              that baseline.
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
                  &mdash;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
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
