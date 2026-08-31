import type { Metadata } from 'next';

import {
  Anchor,
  Band,
  Breadcrumb,
  Button,
  GroundProvider,
  OjFooter,
  OjHeader,
} from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import { FACTS, LESSONS, REFUSALS } from './content';

/**
 * `/about`.
 *
 * Replaces a page built around "I'm Peter", a packages price and a hospitality
 * consultancy description. D21 makes the brand the company rather than the founder,
 * so the structure is what Orange Jelly is, where the thinking came from, what it
 * refuses to do, and who you would actually deal with.
 *
 * The refusals section is the point of the page. An about page that only says what
 * a company does is a brochure; the useful half is what it will not take money for.
 *
 * Copy: `tasks/repositioning/copy/about.md`, held to it by a test.
 */
const TITLE = 'About | Orange Jelly';
const DESCRIPTION =
  'A strategic growth partner for ambitious businesses, small on purpose. Where the thinking came from, what we will not do, and who you would be dealing with.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/about` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/about`,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

export default function AboutPage(): JSX.Element {
  return (
    <>
      {/* About is not in the primary nav, so nothing is marked current. See SiteChrome. */}
      <OjHeader />

      <main id="main-content">
        <GroundProvider value="ink">
          <section className="bg-oj-ink py-12 text-oj-cream sm:py-16">
            <div className="page-shell">
              <Breadcrumb
                tone="ink"
                className="mb-7"
                items={[{ label: 'Home', href: '/' }, { label: 'About' }]}
              />
              <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-peach">
                the company
              </p>
              <h1 className="oj-display mt-2.5 text-[clamp(44px,9vw,84px)] leading-[0.92] text-oj-cream">
                small on purpose.
              </h1>
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-cream/85">
                Orange Jelly is a strategic growth partner for ambitious small and mid-sized
                businesses. There's no account team, no layer between you and the people doing the
                work, and no incentive to sell you more of something that isn't working.
              </p>
            </div>
          </section>
        </GroundProvider>

        <Band heading="what we actually are." tone="paper">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              We get under the skin of a business, work out what's genuinely blocking growth, and
              build the thing that fixes it. The fix might be marketing. It might be a pricing
              change, a process, a system, an automation, or a piece of software with some AI in it.
              The problem decides, and it isn't usually what the brief says it is.
            </p>
            <p>
              That range is only defensible because of the method. Without it, a company that does
              marketing, commercial change, operations and technology reads as a company that will
              do anything. Four steps, in the same order, every time:{' '}
              <Anchor href="/how-we-work" className="font-semibold underline">
                hear, challenge, build, optimise
              </Anchor>
              .
            </p>
          </div>
        </Band>

        <Band heading="we run a business, not just a practice.">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              The Anchor is our own venue in Stanwell Moor, run as a Greene King tenancy since 2019.
              It is not a case study we bought and it is not a client. It's a business that has to
              trade every week, with a wage bill, a cellar, suppliers who put prices up and
              customers who go elsewhere when it isn't good enough.
            </p>
            <p>
              Everything on this site was built and tested there first. Search visibility grew 828%,
              table bookings 403%, private hire 567%, food revenue 98% in three months and no-shows
              fell 89%: all measured against a baseline, all in a business where getting it wrong
              cost us rather than a client.
            </p>
            <p>
              That's a different kind of experience from advising. It's the difference between
              knowing a booking that doesn't turn up is expensive and having stood in a kitchen at
              seven o&rsquo;clock with the food already prepped.
            </p>
            <p>
              <Anchor href="/results" className="font-semibold underline">
                The numbers, and how they were measured
              </Anchor>
              .
            </p>
          </div>
        </Band>

        <Band
          heading="what running one teaches you."
          intro="Three things keep showing up, in our own business and in everybody else's."
          tone="ink"
        >
          <dl className="grid gap-7 lg:grid-cols-3">
            {LESSONS.map((lesson) => (
              <div key={lesson.title}>
                <dt className="font-oj text-[19px] font-black leading-snug text-oj-orange">
                  {lesson.title}
                </dt>
                <dd className="mt-2.5 text-[16px] leading-relaxed text-oj-cream/80">
                  {lesson.body}
                </dd>
              </div>
            ))}
          </dl>
        </Band>

        {/*
         * The point of the page. An about page that only says what a company does is
         * a brochure; the useful half is what it will not take money for.
         */}
        <Band heading="what we will not do." tone="paper">
          <ul className="measure-wide grid list-none gap-5 p-0 sm:grid-cols-2">
            {REFUSALS.map((refusal) => (
              <li
                key={refusal.title}
                className="rounded-oj border-1.5 border-oj-ink bg-oj-cream p-5 shadow-press-sm"
              >
                <p className="font-oj text-[17px] font-black leading-snug text-oj-ink">
                  {refusal.title}
                </p>
                <p className="mt-2 text-[15.5px] leading-relaxed text-oj-ink-2">{refusal.body}</p>
              </li>
            ))}
          </ul>
        </Band>

        <Band heading="who you deal with.">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              Orange Jelly is deliberately small, so the people you meet are the people doing the
              work. There's no account manager, no team you never see, and no handover to somebody
              more junior once the contract is signed.
            </p>
            <p>
              Day to day, The Anchor is run by Billy Summers and the growth work is led by Peter
              Pitcher. That's the whole company, and it's a constraint we are honest about: we take
              on what we can do properly and say no to the rest.
            </p>
          </div>
        </Band>

        <Band heading="the facts." tone="paper">
          <dl className="measure-wide grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {FACTS.map((fact) => (
              <div key={fact.label} className="border-t-1.5 border-oj-ink pt-3">
                <dt className="font-oj text-[13px] font-bold uppercase tracking-[0.1em] text-oj-ink-3">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-[17px] font-semibold text-oj-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <p className="measure mt-8 text-[17px] leading-relaxed">
            That last line is deliberate. Orange Jelly spent six years doing this in a business we
            owned before we offered it to anybody else. That's why the proof is real, and why
            there's one business on the results page rather than twenty.
          </p>
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
            the shortest way to find out.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            An hour on the phone, free, no pitch. If we're not the right people we will tell you
            inside the hour.
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
