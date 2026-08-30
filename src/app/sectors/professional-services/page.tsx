import type { Metadata } from 'next';

import { GROWTH_PROBLEMS } from '@/app/growth-problems/content';
import { Anchor, Band, Breadcrumb, Button, CategoryTag, OjFooter, OjHeader } from '@/components/oj';
import { getAllInsights } from '@/lib/insights';
import { getBaseUrl } from '@/lib/site-config';

import { TRANSLATIONS, WHAT_WE_DO_NOT_HAVE } from './content';

/**
 * `/sectors/professional-services`.
 *
 * The mirror of what `/licensees-guide` is for hospitality, with one difference the
 * page has to be honest about: there is no professional services case study,
 * because there is not yet a professional services client.
 *
 * So the page does the thing it legitimately can, which is translate. It takes the
 * six growth areas and says what each looks like inside an accountancy practice or
 * a law firm, in the language those firms use about themselves: realisation,
 * utilisation, write-offs, referral pipelines. That is genuinely useful, and it is
 * defensible from the outside in a way that implied sector experience would not be.
 *
 * The "what we do not have" section is the reason the rest of it is believable.
 */
const TITLE = 'Growth for professional services firms | Orange Jelly';
const DESCRIPTION =
  'What stalled growth looks like inside an accountancy practice, a law firm or a consultancy, in their own language. Including what we do not have.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/sectors/professional-services` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/sectors/professional-services`,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

export default function ProfessionalServicesPage(): JSX.Element {
  const related = getAllInsights().filter((insight) => insight.sector === 'professional-services');

  return (
    <>
      <OjHeader />

      <main id="main-content">
        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-12 sm:py-16">
          <div className="page-shell">
            <Breadcrumb
              className="mb-7"
              items={[{ label: 'Home', href: '/' }, { label: 'Professional services' }]}
            />
            <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-orange-deep">
              professional services
            </p>
            <h1 className="oj-display mt-2.5 max-w-[17ch] text-[clamp(38px,7.5vw,72px)] leading-[0.94] text-oj-ink">
              the growth problem is rarely the one on the agenda.
            </h1>
            <p className="measure mt-5 text-[19px] leading-relaxed text-oj-ink-2">
              Accountancy practices, law firms, consultancies and agencies. Businesses built on
              expertise and referral, where the constraint is almost never expertise and almost
              always something nobody has had time to look at.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" arrow href="/start-here">
                Bring us the problem
              </Button>
              <Button variant="ghost" href="/growth-problems">
                The eight growth problems
              </Button>
            </div>
          </div>
        </section>

        <Band
          heading="six problems, in your language."
          intro="The same six areas the rest of this site talks about, translated into what they look like inside a firm."
          tone="paper"
        >
          <div className="flex flex-col gap-7">
            {TRANSLATIONS.map((item) => (
              <article
                key={item.area}
                className="rounded-oj border-1.5 border-oj-ink bg-oj-cream p-6 shadow-press-sm"
              >
                <CategoryTag category={item.area as never} filled />
                <h3 className="oj-display mt-3.5 text-[25px] leading-[1.05] text-oj-ink">
                  {item.heading}
                </h3>
                <p className="measure mt-3 text-[16.5px] leading-relaxed text-oj-ink-2">
                  {item.body}
                </p>
                <p className="measure mt-3 text-[15.5px] leading-relaxed text-oj-ink">
                  <span className="font-bold">The tell:</span> {item.tell}
                </p>
              </article>
            ))}
          </div>
        </Band>

        {/*
         * The reason the rest of the page is believable. A sector page with no
         * sector client that did not say so would be the exact behaviour this
         * repositioning is meant to remove.
         */}
        <Band
          heading="what we do not have."
          intro="Said here rather than discovered on the call."
          tone="ink"
        >
          <ul className="measure-wide flex list-none flex-col gap-4 p-0">
            {WHAT_WE_DO_NOT_HAVE.map((item) => (
              <li key={item} className="flex gap-3 text-[17px] leading-relaxed text-oj-cream/85">
                <span aria-hidden="true" className="font-black text-oj-orange">
                  &mdash;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="measure mt-8 text-[17px] leading-relaxed text-oj-cream">
            What we do have is a way of working that was built and measured in a business we own,
            and six problems that behave the same way in a practice as they do in a pub. Demand,
            conversion, margin and drag do not care what you sell.{' '}
            <Anchor href="/results" className="font-semibold underline">
              The numbers, and how they were measured
            </Anchor>
            .
          </p>
        </Band>

        {related.length > 0 ? (
          <Band heading="written for firms like yours.">
            <ul className="grid list-none gap-5 p-0 sm:grid-cols-2">
              {related.map((insight) => (
                <li key={insight.slug}>
                  <Anchor
                    href={`/insights/${insight.slug}`}
                    className="oj-press oj-focus flex h-full flex-col gap-2.5 rounded-oj border-1.5 border-oj-ink bg-oj-paper p-6 no-underline"
                  >
                    <span className="oj-display text-[22px] leading-[1.06] text-oj-ink">
                      {insight.title}
                    </span>
                    <span className="text-[15.5px] leading-relaxed text-oj-ink-2">
                      {insight.excerpt}
                    </span>
                  </Anchor>
                </li>
              ))}
            </ul>
          </Band>
        ) : null}

        <Band heading="where to start." tone="paper">
          <p className="measure text-[17px] leading-relaxed text-oj-ink-2">
            If one of the six above made you wince, that is the one. Each has its own page with what
            we would examine first.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {GROWTH_PROBLEMS.slice(0, 6).map((problem) => (
              <Anchor
                key={problem.slug}
                href={`/growth-problems/${problem.slug}`}
                className="oj-focus font-semibold text-oj-orange-deep underline"
              >
                {problem.title}
              </Anchor>
            ))}
          </div>
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
            you will know within the hour.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            Whether we are useful to a firm like yours is a short conversation, and it is free. If
            the answer is no we will say so inside it.
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
