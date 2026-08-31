import type { Metadata } from 'next';

import { Band, Button, EmptyState, OjFooter, OjHeader, PressureCard } from '@/components/oj';
import { PRESSURE_POINTS } from '@/app/home-content';

/**
 * The 404.
 *
 * This is a real destination, not an apology. Phase 4 retires nine URLs and ten
 * years of links point at things that have moved, so somebody arriving here has
 * usually followed a link that used to work rather than mistyped something.
 *
 * It therefore offers the six places growth gets stuck rather than a search box and
 * a shrug: whatever they were looking for, one of those six is closer to it than
 * the homepage is.
 *
 * It renders its own chrome, so it is listed in `src/lib/oj-routes.ts` under the
 * catch-all rather than by path. Next serves it for any unmatched route, which is
 * why `MainGate` cannot know its pathname in advance and why the page opens its own
 * `<main>` unconditionally.
 */
export const metadata: Metadata = {
  title: 'Not found | Orange Jelly',
  description: 'That page is not here. These probably are.',
  robots: { index: false, follow: true },
};

export default function NotFound(): JSX.Element {
  return (
    <>
      <OjHeader />

      <main id="main-content">
        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-16 sm:py-24">
          <div className="page-shell">
            <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-orange-deep">
              404
            </p>
            <h1 className="oj-display mt-2.5 text-[clamp(40px,8vw,78px)] leading-[0.92] text-oj-ink">
              that page is not here.
            </h1>
            <p className="measure mt-5 text-[19px] leading-relaxed text-oj-ink-2">
              It has either moved or it never existed. If you followed a link from somewhere else,
              the link is probably older than the page it pointed at.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" arrow href="/">
                Start at the beginning
              </Button>
              <Button variant="ghost" href="/start-here">
                Start the conversation
              </Button>
            </div>
          </div>
        </section>

        <Band
          heading="or start from the problem."
          intro="Whatever you were looking for, one of these is closer to it than the homepage."
          tone="paper"
          divider={false}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRESSURE_POINTS.map((point) => (
              <PressureCard
                key={point.title}
                title={point.title}
                desc={point.desc}
                href={point.href}
              />
            ))}
          </div>
          <div className="mt-9">
            <EmptyState
              title="Still nothing?"
              body="Tell us what you were looking for and we will point you at it, or tell you honestly that it is not here any more."
              action={{ label: 'Start the conversation', href: '/start-here' }}
            />
          </div>
        </Band>
      </main>

      <OjFooter />
    </>
  );
}
