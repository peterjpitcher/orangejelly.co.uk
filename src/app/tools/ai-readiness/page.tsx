import type { Metadata } from 'next';

import { Band, Breadcrumb, Button, GroundProvider, OjFooter, OjHeader } from '@/components/oj';
// Straight from the data module, not the barrel: the barrel re-exports client
// components, and this page renders the statements on the server.
import { SCORECARD_QUESTIONS } from '@/components/oj/scorecard-questions';
import { getBaseUrl } from '@/lib/site-config';

import AiReadinessTool from './AiReadinessTool';
import { AREA_RESULTS } from './content';

/**
 * `/tools/ai-readiness`.
 *
 * It assesses whether the BUSINESS is in a state where AI would help, which is the
 * honest version of the question and the one that matches "AI is part of the
 * toolkit, not the product". It is not a technical AI assessment and it does not
 * pretend to be.
 *
 * It exists because the keyword research found real demand for the term, and
 * because somebody who has just seen their own pressure map arrives at the first
 * conversation far better prepared than somebody arriving cold at a form.
 *
 * No score, no total, no shareable result URL. A number invites a league table, and
 * a URL invites treating a signal as a verdict.
 */
const TITLE = 'AI readiness assessment | Orange Jelly';
const DESCRIPTION =
  'Twelve statements about how your business actually runs, and an honest read on where AI would help and where it would not. No score, nothing stored.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/tools/ai-readiness` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/tools/ai-readiness`,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

export default function AiReadinessPage(): JSX.Element {
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
                items={[{ label: 'Home', href: '/' }, { label: 'AI readiness' }]}
              />
              {/* Peach, not orange-deep: the eyebrow's own colour is 2.92:1 on ink. */}
              <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-peach">
                assessment
              </p>
              <h1 className="oj-display mt-2.5 max-w-[17ch] text-[clamp(38px,7.5vw,72px)] leading-[0.94] text-oj-cream">
                is your business ready for <span className="oj-keep-case">AI</span>?
              </h1>
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-cream/85">
                Not a technical assessment. This asks whether the business is in a state where{' '}
                <span className="font-semibold">AI</span> would actually help, which is the more
                useful question and the one most tools skip.
              </p>
              <p className="measure mt-4 text-[16px] leading-relaxed text-oj-cream/60">
                Twelve statements, about two minutes. There is no score at the end, nothing is
                stored unless you decide to get in touch, and the result tells you where AI would
                not help as well as where it would.
              </p>
            </div>
          </section>
        </GroundProvider>

        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-14 sm:py-20">
          <div className="page-shell">
            <div className="measure-wide">
              <AiReadinessTool />
            </div>

            {/*
             * Without JavaScript the assessment cannot run, so the page still has to
             * be worth arriving at: the twelve areas in plain words and a way to talk
             * to somebody. A tool that renders an empty box to a third of screen
             * readers and every crawler is worse than a page that explains itself.
             */}
            <noscript>
              <div className="measure-wide rounded-oj border-1.5 border-oj-ink bg-oj-paper p-6">
                <h2 className="oj-display text-[26px] leading-none text-oj-ink">
                  the assessment needs javascript.
                </h2>
                <p className="measure mt-3 text-[16.5px] leading-relaxed text-oj-ink-2">
                  It runs entirely in your browser, which is why nothing is stored. Here are the
                  twelve statements it asks about. If more than a couple of them make you wince,
                  that's the same signal the tool would have given you.
                </p>
                <ol className="mt-5 flex list-decimal flex-col gap-2 pl-5 text-[16px] leading-relaxed">
                  {SCORECARD_QUESTIONS.map((question) => (
                    <li key={question.text}>{question.text}</li>
                  ))}
                </ol>
                <div className="mt-6">
                  <Button arrow href="/start-here">
                    Let's talk
                  </Button>
                </div>
              </div>
            </noscript>
          </div>
        </section>

        <Band
          heading="what this will not tell you."
          intro="Three things, said here rather than discovered afterwards."
          tone="paper"
        >
          <ul className="measure-wide grid list-none gap-5 p-0 sm:grid-cols-3">
            {[
              {
                title: 'A score.',
                body: 'There is no number and no mark out of anything. A score invites a league table and false precision, and neither would tell you what to do on Monday.',
              },
              {
                title: 'A diagnosis.',
                body: "Twelve statements cannot diagnose a business. It's a signal about where to look, which is a genuinely different thing and worth having.",
              },
              {
                title: 'That you need AI.',
                body: 'The result names where AI would not help as well as where it would. On several of these areas the honest answer is that the problem is not a technology problem.',
              },
            ].map((item) => (
              <li
                key={item.title}
                className="rounded-oj border-1.5 border-oj-ink bg-oj-cream p-5 shadow-press-sm"
              >
                <p className="font-oj text-[17px] font-black text-oj-ink">{item.title}</p>
                <p className="mt-2 text-[15.5px] leading-relaxed text-oj-ink-2">{item.body}</p>
              </li>
            ))}
          </ul>
        </Band>

        <Band heading="the six areas it looks at.">
          <dl className="measure-wide grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {AREA_RESULTS.map((area) => (
              <div key={area.id} className="border-t-1.5 border-oj-ink pt-3.5">
                <dt className="font-oj text-[18px] font-black text-oj-ink">{area.label}</dt>
                <dd className="mt-1.5 text-[15.5px] leading-relaxed text-oj-ink-2">
                  {area.pressed.what}
                </dd>
              </div>
            ))}
          </dl>
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
            a signal, not a diagnosis.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            Whatever it says, the useful next step is the same: an hour on the phone, free, where
            somebody asks the follow-up questions twelve statements cannot.
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
