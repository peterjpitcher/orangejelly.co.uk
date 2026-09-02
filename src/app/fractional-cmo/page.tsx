import type { Metadata } from 'next';

import { Band, Breadcrumb, Button, GroundProvider, OjFooter, OjHeader } from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import { QUESTIONS_TO_ASK, RIGHT_ANSWER, WRONG_SHAPE } from './content';

/**
 * `/fractional-cmo`.
 *
 * Uses the category's language to be found, then argues against the format. Four
 * fractional terms sit in the 500 tier with one at competition index 12, and the
 * brand pack does not mention the category once, so the demand is real and
 * unclaimed. The risk is equally real: fractional implies one functional seat, and
 * Orange Jelly is deliberately cross-functional.
 *
 * It says plainly when a fractional CMO IS the right hire, and offers to point
 * somewhere else. A page that said "never hire one" would be exactly as
 * unbelievable as one that said "always", and it would fail the same honesty test
 * the rest of the site is built on.
 */
const TITLE = 'Do you need a fractional CMO? | Orange Jelly';
const DESCRIPTION =
  "When a fractional CMO is the right hire, when it's the wrong answer, and five questions to ask first. Including when we would say hire one instead of us.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/fractional-cmo` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/fractional-cmo`,
    type: 'article',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

export default function FractionalCmoPage(): JSX.Element {
  return (
    <>
      <OjHeader />

      <main id="main-content">
        <GroundProvider value="ink">
          <section className="bg-oj-ink py-12 text-oj-cream sm:py-16">
            <div className="page-shell">
              {/*
               * The trail is built for a light ground and every part of it fails on
               * ink: the links are ink-3 at 2.76:1, the current page is ink on ink at
               * 1.00:1, and the arrow is orange-deep at 2.92:1. Recoloured from here
               * because the component has no ink tone yet. Links cream/85 at 10.51:1,
               * current page cream at 14.02:1, hover and arrow peach at 11.03:1.
               */}
              <Breadcrumb
                tone="ink"
                className="mb-7"
                items={[{ label: 'Home', href: '/' }, { label: 'Fractional CMO' }]}
              />
              {/* Peach, not orange-deep: the eyebrow's own colour is 2.92:1 on ink. */}
              <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-peach">
                fractional leadership
              </p>
              <h1 className="oj-display mt-2.5 max-w-[16ch] text-[clamp(38px,7.5vw,72px)] leading-[0.94] text-oj-cream">
                do you really need a fractional <span className="oj-keep-case">CMO</span>?
              </h1>
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-cream/85">
                People search for one when growth has stalled and the in-house team is stretched.
                It's a sensible instinct and often the wrong kind of answer. Here's when it works,
                when it does not, and what to ask before you hire either of us.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" arrow href="/start-here">
                  Let's talk
                </Button>
                <Button variant="ghost" href="/growth-problems">
                  See the eight growth problems
                </Button>
              </div>
            </div>
          </section>
        </GroundProvider>

        <Band heading="what a fractional cmo actually is." tone="paper">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              A senior marketer, part time, on your leadership team. Usually one to three days a
              week, usually on a rolling contract, usually somebody who has done the job full time
              somewhere larger.
            </p>
            <p>
              It's a good model. It exists because a business can need senior marketing judgement
              long before it can justify a full-time salary for it, and the market has correctly
              worked out that the gap is real.
            </p>
          </div>
        </Band>

        {/*
         * This section is load-bearing. A page arguing against the format that never
         * conceded the format works would be a sales pitch, and the reader would
         * know it by the second paragraph.
         */}
        <Band heading="when it's the right answer." intro="Three cases, and they are common.">
          <ul className="measure-wide grid list-none gap-5 p-0 sm:grid-cols-3">
            {RIGHT_ANSWER.map((item) => (
              <li
                key={item.title}
                className="rounded-oj border-1.5 border-oj-ink bg-oj-paper p-5 shadow-press-sm"
              >
                <p className="font-oj text-[17px] font-black leading-snug text-oj-ink">
                  {item.title}
                </p>
                <p className="mt-2 text-[15.5px] leading-relaxed text-oj-ink-2">{item.body}</p>
              </li>
            ))}
          </ul>
          <p className="measure mt-8 text-[17px] font-semibold leading-relaxed text-oj-ink">
            If all three are true, hire one. We will say so on the call, and we can usually suggest
            where to look.
          </p>
        </Band>

        <Band heading="when it's the wrong kind of answer." tone="ink">
          <div className="flex flex-col gap-7">
            {WRONG_SHAPE.map((item) => (
              <div key={item.title}>
                <h3 className="font-oj text-[20px] font-black leading-snug text-oj-orange">
                  {item.title}
                </h3>
                <p className="measure mt-2 text-[16.5px] leading-relaxed text-oj-cream/85">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Band>

        <Band heading="what we do instead." tone="paper">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              We are not a fractional anything and we do not want a seat on your leadership team.
            </p>
            <p>
              We take the problem, work out what is actually causing it across every part of the
              business it touches, and build the fix. Sometimes that's marketing. Often it's a
              pricing change, a process, a system, or three small things in three different places
              that only make sense together.
            </p>
            <p>
              Then we leave. A piece of work that has done its job should end, which is not what a
              monthly retainer for a seat is designed to do.
            </p>
          </div>
        </Band>

        <Band
          heading="the questions to ask either of us."
          intro="Ask these of a fractional CMO and of us. The answers will tell you which kind of help you need."
        >
          <ol className="measure flex list-none flex-col gap-3 p-0">
            {QUESTIONS_TO_ASK.map((question, index) => (
              <li key={question} className="flex gap-3.5 text-[17px] leading-relaxed">
                <span className="font-oj font-bold tabular-nums text-oj-orange-deep">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
          <p className="measure mt-8 text-[17px] font-semibold leading-relaxed text-oj-ink">
            If the answers to the second and the fifth are vague, that's your answer, whoever you
            are talking to.
          </p>
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
            describe the problem, not the role.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            Tell us what is actually happening and we'll tell you what kind of help it needs, even
            when that is not us. The first conversation is an hour and it's free.
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
