import type { Metadata } from 'next';

import { Band, Breadcrumb, Button, OjFooter, OjHeader } from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import { METHOD_DETAIL, PRESSURE_AREAS_EXPLAINED, PREVENTS, STARTING_AGREEMENT } from './content';

/**
 * `/how-we-work`. The method in full.
 *
 * The page exists because the range would otherwise look unfocused: a company that
 * does marketing, commercial change, operations, systems and AI reads as a company
 * that will do anything. The method is what connects them, and it is the same
 * sequence whatever the answer turns out to be.
 *
 * Copy: `tasks/repositioning/copy/how-we-work.md`, held to it by a test.
 */
const TITLE = 'How we work | Orange Jelly';
const DESCRIPTION =
  'Hear, challenge, build, optimise. Four steps in that order, every time, because the order is what stops us fixing the loudest symptom instead of the cause.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/how-we-work` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/how-we-work`,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

export default function HowWeWorkPage(): JSX.Element {
  return (
    <>
      <OjHeader current="how-we-work" />

      <main id="main-content">
        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-12 sm:py-16">
          <div className="page-shell">
            <Breadcrumb
              className="mb-7"
              items={[{ label: 'Home', href: '/' }, { label: 'How we work' }]}
            />
            <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-orange-deep">
              the method
            </p>
            <h1 className="oj-display mt-2.5 text-[clamp(40px,8vw,78px)] leading-[0.92] text-oj-ink">
              hear. challenge. build. optimise.
            </h1>
            <p className="measure mt-5 text-[19px] leading-relaxed text-oj-ink-2">
              Four steps, in that order, every time. Not because process is comforting, but because
              the order is what stops us solving the loudest symptom instead of the real problem.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button size="lg" arrow href="/start-here">
                Let's talk
              </Button>
            </div>
          </div>
        </section>

        <Band heading="why a method, and not just experience." tone="paper">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              Orange Jelly works across marketing, commercial change, operations, systems and AI.
              Without a method that looks like a company that will do anything, which is another way
              of saying a company that is good at nothing.
            </p>
            <p>
              The method is what connects them. It starts with the problem and ends with evidence,
              and it is the same sequence whether the answer turns out to be a campaign, a pricing
              change or a piece of software.
            </p>
            <p>It also decides when to stop, which most engagements never do.</p>
          </div>
        </Band>

        {METHOD_DETAIL.map((step, index) => (
          <Band key={step.word} tone={index % 2 === 0 ? 'page' : 'paper'}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
              <div>
                <p className="font-oj text-[15px] font-bold tabular-nums text-oj-orange-deep">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="oj-display mt-1 text-[clamp(34px,6vw,58px)] leading-[0.95] text-oj-ink">
                  {step.word}
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-[19px] font-semibold leading-snug text-oj-ink">{step.line}</p>
                <p className="text-[17px] leading-relaxed text-oj-ink-2">{step.body}</p>
                {step.outcome ? (
                  <p className="text-[17px] leading-relaxed text-oj-ink-2">
                    <strong className="text-oj-ink">What you end up with:</strong> {step.outcome}
                  </p>
                ) : null}
                <p className="rounded-oj border-1.5 border-oj-ink bg-oj-paper p-4 text-[16px] font-semibold leading-relaxed text-oj-ink shadow-press-sm">
                  {step.discipline}
                </p>
              </div>
            </div>
          </Band>
        ))}

        <Band
          heading="the growth pressure map."
          intro="The artefact that comes out of CHALLENGE. It maps the business across six connected areas and says, for each one, where the pressure actually is."
          tone="ink"
        >
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRESSURE_AREAS_EXPLAINED.map((item) => (
              <div key={item.area}>
                <dt className="font-oj text-[19px] font-black text-oj-orange">{item.area}</dt>
                <dd className="mt-1.5 text-[16px] leading-relaxed text-oj-cream/80">{item.body}</dd>
              </div>
            ))}
          </dl>
          <p className="measure mt-9 text-[17px] leading-relaxed text-oj-cream/80">
            It is not a generic scorecard with a total at the bottom. A score invites a league table
            and false precision. The map is built around your business model and is there to focus
            the next move, not to grade you.
          </p>
        </Band>

        <Band heading="what we agree before anything is built.">
          <ul className="measure-wide grid list-none gap-x-10 gap-y-3 p-0 sm:grid-cols-2">
            {STARTING_AGREEMENT.map((item) => (
              <li key={item} className="flex gap-3 text-[17px] leading-relaxed">
                <span aria-hidden="true" className="font-black text-oj-orange-deep">
                  &mdash;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="measure mt-8 text-[17px] leading-relaxed">
            Every one of those is agreed in writing before the first day of build. It is not
            paperwork: it is the list of things that, left unsaid, turn into the argument at the
            end.
          </p>
        </Band>

        <Band heading="what this stops happening." tone="paper">
          <ul className="measure-wide grid list-none gap-x-10 gap-y-3 p-0 sm:grid-cols-2">
            {PREVENTS.map((item) => (
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
            the order is the method.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            It starts with an hour on the phone and no charge. Tell us what is happening and we will
            tell you what we think.
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
