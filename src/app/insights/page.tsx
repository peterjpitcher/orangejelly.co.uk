import type { Metadata } from 'next';

import {
  Anchor,
  Band,
  Breadcrumb,
  Button,
  EmptyState,
  KeepCase,
  OjFooter,
  OjHeader,
  Pagination,
} from '@/components/oj';
import { INSIGHTS_PER_PAGE, getInsightPage } from '@/lib/insights';
import { getBaseUrl } from '@/lib/site-config';

/**
 * `/insights`.
 *
 * The second collection, separate from the 105 hospitality guides. Everything here
 * maps to one of the eight growth problems and to one of the keyword research's
 * target terms, both enforced in the front matter, because the pack's rule is that
 * no article exists only to attract traffic.
 *
 * Pagination is real links rather than a load-more button. A button is invisible to
 * a crawler and to anyone arriving from a shared URL of page three.
 */
const TITLE = 'Insights | Orange Jelly';
const DESCRIPTION =
  'Writing about what actually blocks growth in small and mid-sized businesses, and what to do about it. Each piece ends at the problem underneath it.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/insights` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/insights`,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

interface PageProps {
  searchParams?: { page?: string };
}

export default function InsightsPage({ searchParams }: PageProps): JSX.Element {
  const requested = Number(searchParams?.page ?? '1');
  const { insights, total, pages } = getInsightPage(Number.isFinite(requested) ? requested : 1);
  const current = Math.min(Math.max(1, Number.isFinite(requested) ? requested : 1), pages);

  return (
    <>
      <OjHeader current="insights" />

      <main id="main-content">
        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-12 sm:py-16">
          <div className="page-shell">
            <Breadcrumb
              className="mb-7"
              items={[{ label: 'Home', href: '/' }, { label: 'Insights' }]}
            />
            <h1 className="oj-display mt-1 text-[clamp(40px,8vw,72px)] leading-[0.94] text-oj-ink">
              insights.
            </h1>
            <p className="measure mt-5 text-[19px] leading-relaxed text-oj-ink-2">
              Writing about what actually blocks growth, and what to do about it. Every piece ends
              at the problem underneath it rather than at a contact form.
            </p>
            <p className="measure mt-4 text-[16px] leading-relaxed text-oj-ink-3">
              Running a pub or a restaurant? The hospitality library is over at{' '}
              <Anchor href="/guides" className="font-semibold underline">
                The Licensee&rsquo;s Guide
              </Anchor>
              , where there are {105} of these.
            </p>
          </div>
        </section>

        <Band tone="paper" divider={false}>
          {insights.length === 0 ? (
            <EmptyState
              title="Nothing here yet."
              body="We're writing the first pieces. In the meantime the hospitality library has a hundred and five, and most of it isn't hospitality-shaped."
              action={{ label: "Read The Licensee's Guide", href: '/guides' }}
            />
          ) : (
            <>
              <ul className="grid list-none gap-5 p-0 sm:grid-cols-2">
                {insights.map((insight) => (
                  <li key={insight.slug}>
                    <Anchor
                      href={`/insights/${insight.slug}`}
                      className="oj-press oj-focus flex h-full flex-col gap-2.5 rounded-oj border-1.5 border-oj-ink bg-oj-cream p-6 no-underline"
                    >
                      <span className="font-oj text-[13px] font-bold uppercase tracking-[0.1em] text-oj-orange-deep">
                        {insight.readingTime} min read
                      </span>
                      <span className="oj-display text-[24px] leading-[1.06] text-oj-ink">
                        <KeepCase>{insight.title}</KeepCase>
                      </span>
                      <span className="text-[15.5px] leading-relaxed text-oj-ink-2">
                        {insight.excerpt}
                      </span>
                    </Anchor>
                  </li>
                ))}
              </ul>

              {pages > 1 ? (
                <div className="mt-10">
                  <Pagination
                    page={current}
                    total={pages}
                    hrefFor={(n) => (n === 1 ? '/insights' : `/insights?page=${n}`)}
                  />
                </div>
              ) : null}

              <p className="mt-8 text-[14.5px] text-oj-ink-3">
                {total} {total === 1 ? 'piece' : 'pieces'}
                {pages > 1 ? `, ${INSIGHTS_PER_PAGE} per page` : ''}.
              </p>
            </>
          )}
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
            reading about it is the cheap part.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            If any of this sounds like your business, an hour on the phone gets further than another
            article. It is free and it is not a pitch.
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
