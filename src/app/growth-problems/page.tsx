import type { Metadata } from 'next';

import { Anchor, Band, Breadcrumb, Button, KeepCase, OjFooter, OjHeader } from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import { GROWTH_PROBLEMS } from './content';

/**
 * `/growth-problems`. The hub.
 *
 * It lists symptoms rather than services, because that is what somebody arrives
 * with. Nobody types "protect margin"; they think "we are busy and not much better
 * off". The six areas the rest of the site uses are on each problem page as tags,
 * so the two vocabularies stay joined.
 *
 * Copy from the design team's hub template, with the closing call to action changed
 * per D11.
 */
const TITLE = 'Unlock growth: eight places it gets stuck | Orange Jelly';
const DESCRIPTION =
  'Eight growth problems in plain words. Start from the symptom and we will show you what it is connected to, before anyone talks about a solution.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/growth-problems` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/growth-problems`,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

export default function GrowthProblemsHubPage(): JSX.Element {
  return (
    <>
      <OjHeader current="growth-problems" />

      <main id="main-content">
        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-12 sm:py-16">
          <div className="page-shell">
            <Breadcrumb
              className="mb-7"
              items={[{ label: 'Home', href: '/' }, { label: 'Unlock growth' }]}
            />
            <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-orange-deep">
              unlock growth
            </p>
            <h1 className="oj-display mt-2.5 max-w-[18ch] text-[clamp(38px,7.5vw,72px)] leading-[0.94] text-oj-ink">
              which of these sounds like your business?
            </h1>
            <p className="measure mt-5 text-[19px] leading-relaxed text-oj-ink-2">
              You do not need more activity. You need to know what will move the numbers. Start from
              the symptom and we will show you what it is connected to.
            </p>
          </div>
        </section>

        <Band heading="all eight, in plain words." tone="paper">
          <ol className="grid list-none gap-5 p-0 sm:grid-cols-2">
            {GROWTH_PROBLEMS.map((problem) => (
              <li key={problem.slug}>
                <Anchor
                  href={`/growth-problems/${problem.slug}`}
                  className="oj-press oj-focus flex h-full flex-col gap-2 rounded-oj border-1.5 border-oj-ink bg-oj-cream p-6 no-underline"
                >
                  <span className="font-oj text-[13px] font-bold tabular-nums text-oj-orange-deep">
                    {problem.number}
                  </span>
                  <span className="oj-display text-[25px] leading-[1.04] text-oj-ink">
                    <KeepCase>{problem.title}</KeepCase>
                  </span>
                  <span className="text-[16px] leading-relaxed text-oj-ink-2">{problem.line}</span>
                </Anchor>
              </li>
            ))}
          </ol>
        </Band>

        {/*
          The eight above are written for a business that has stalled. A business
          losing revenue week on week has less time and fewer options, and sending it
          through a page about plateaus wastes both. The rescue page is the same
          territory in a different tense, and this is the only place a reader would
          think to look for it.

          It also stops the page being an orphan, which is what its predecessor was:
          the July crawl found /pub-rescue with no contextual inbound links at all.
        */}
        <Band heading="falling rather than flat?" tone="paper">
          <p className="measure text-[17px] leading-relaxed text-oj-ink-2">
            These eight are written for growth that has stopped. If revenue is actively going
            backwards, the clock changes and so does the order things should be done in, so{' '}
            <Anchor href="/why-revenue-is-falling" className="font-semibold">
              finding out why has its own page
            </Anchor>
            , including the part where we say who we are not the right people for.
          </p>
        </Band>

        <Band heading="cannot see yours? bring it anyway." tone="ink" size="lg" divider={false}>
          <p className="measure text-[18px] leading-relaxed text-oj-cream/80">
            Most growth problems are combinations. Tell us what is happening and we will tell you
            where the pressure really is. The first conversation is an hour and it is free.
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
