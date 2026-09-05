import type { Metadata } from 'next';

import {
  Band,
  Breadcrumb,
  Button,
  EnquiryForm,
  FAQ,
  MethodStep,
  OjFooter,
  GroundProvider,
  OjHeader,
} from '@/components/oj';
import { PRICING } from '@/lib/constants';
import { getBaseUrl } from '@/lib/site-config';

import { EnquiryActions } from '@/components/oj/EnquiryActions';
import { EnquiryProof } from '@/components/oj/EnquiryProof';
import { getGuideConversion } from '@/lib/guide-conversion';
import { resolveGuideConversionContext } from '@/lib/guide-conversion-server';

import { ENQUIRY_INTRO, ENQUIRY_REASSURANCE, FIT, FAQS, NEEDS, STEPS, TAKEAWAYS } from './content';

const TITLE = 'Start here | Orange Jelly';
const DESCRIPTION =
  "Every piece of work starts with a conversation about what is actually happening. What that involves, what you get from it, and who it doesn't work for.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/start-here` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/start-here`,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

interface StartHerePageProps {
  searchParams?: { guide?: string | string[]; placement?: string | string[] };
}

export default function StartHerePage({ searchParams = {} }: StartHerePageProps): JSX.Element {
  const context = resolveGuideConversionContext(searchParams);
  const config = context
    ? getGuideConversion(context.guideSlug, context.category, context.title)
    : undefined;
  return (
    <>
      <OjHeader tone="orange" current="start-here" ctaHref="#enquiry" />

      <main id="main-content">
        <GroundProvider value="band">
          <section className="border-b-1.5 border-oj-ink bg-oj-band py-12 sm:py-16 text-oj-on-band">
            <div className="page-shell">
              <Breadcrumb
                tone="orange"
                className="mb-7"
                items={[{ label: 'Home', href: '/' }, { label: 'Start here' }]}
              />
              <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-on-band">
                the first conversation
              </p>
              <h1 className="oj-display mt-2.5 max-w-[14ch] text-[clamp(40px,8vw,76px)] leading-[0.92] text-oj-on-band">
                tell us what's happening. we'll tell you where to look first.
              </h1>
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-on-band">
                {ENQUIRY_INTRO}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" arrow href="#enquiry">
                  Let's talk
                </Button>
                <Button variant="ghost" href="/how-we-work">
                  See how we work
                </Button>
              </div>
            </div>
          </section>
        </GroundProvider>

        <section
          id="enquiry"
          className="scroll-mt-28 border-b-1.5 border-oj-ink bg-oj-cream-2 py-10 sm:py-14"
        >
          <div className="page-shell">
            <div className="measure">
              {config && (
                <h2 className="oj-display mb-4 text-[32px] leading-tight">{config.heading}</h2>
              )}
              <p className="mb-7 text-[17px] leading-relaxed text-oj-ink-2">
                {ENQUIRY_REASSURANCE}
              </p>
              <EnquiryForm entryPoint="page" context={context} />
              <div className="mt-8">
                <EnquiryActions context={context} placement="enquiry" showPrimary={false} />
              </div>
              <div className="mt-7">
                <EnquiryProof proof={config?.proof ?? 'none'} />
              </div>
            </div>
          </div>
        </section>

        <Band
          heading="what you get from the hour."
          intro="You're not buying anything in that conversation, and we're not asking you to."
        >
          <ul className="measure-wide grid list-none gap-4 p-0 sm:grid-cols-3">
            {TAKEAWAYS.map((item) => (
              <li
                key={item}
                className="rounded-oj border-1.5 border-oj-ink bg-oj-paper p-5 text-[16px] leading-relaxed shadow-press-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </Band>

        <Band heading="what actually happens." tone="ink">
          <ol className="grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.word}>
                <MethodStep index={index + 1} word={step.word} text={step.text} tone="dark" />
              </li>
            ))}
          </ol>
        </Band>

        <Band heading="how long, and what it costs.">
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              <strong>The conversation</strong> is an hour, and it is free.
            </p>
            <p>
              <strong>The first proper look</strong> normally takes two to three weeks. Anything
              after that depends on what we find, and we agree the shape of it with you before it
              starts rather than after.
            </p>
            <p>
              <strong>On cost:</strong> the rate is {PRICING.hourly.display}, and that is the only
              number we advertise. There are no packages, because a business of eight with a booking
              problem needs something very different from a business of two hundred with a profit
              problem. What changes is how many hours a piece of work takes, and you get that in
              writing before anything starts.
            </p>
          </div>
        </Band>

        <Band
          heading="who this works for."
          intro="We work best with owners who are ready to act. You'll get the most from this if:"
        >
          <ul className="measure flex list-none flex-col gap-3 p-0">
            {FIT.works.map((item) => (
              <li key={item} className="flex gap-3 text-[17px] leading-relaxed">
                <span aria-hidden="true" className="font-black text-oj-orange-deep">
                  &#8226;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="measure mt-7 text-[16px] leading-relaxed text-oj-ink-2">
            Any sector, any size. A two-person business with something to change fits as well as a
            two-hundred-person one.
          </p>
        </Band>

        <Band heading="what we need from you." tone="paper">
          <dl className="measure-wide grid gap-6 sm:grid-cols-3">
            {NEEDS.map((need) => (
              <div key={need.title}>
                <dt className="font-oj text-[18px] font-black leading-tight text-oj-ink">
                  {need.title}
                </dt>
                <dd className="mt-2 text-[16px] leading-relaxed text-oj-ink-2">{need.body}</dd>
              </div>
            ))}
          </dl>
        </Band>

        <Band
          heading="who this doesn't work for."
          intro="We'd rather say this now than three weeks in. This is not a fit if:"
          tone="paper"
        >
          <ul className="measure-wide grid list-none gap-5 p-0 sm:grid-cols-2">
            {FIT.doesNot.map((item) => (
              <li
                key={item.title}
                className="rounded-oj border-1.5 border-oj-ink bg-oj-cream p-5 shadow-press-sm"
              >
                <p className="font-oj text-[17px] font-black leading-snug text-oj-ink">
                  {item.title}
                </p>
                <p className="mt-2 text-[15.5px] leading-relaxed text-oj-ink-2">{item.body}</p>
              </li>
            ))}
          </ul>
          <p className="measure mt-8 text-[17px] font-semibold leading-relaxed text-oj-ink">
            None of that makes yours a bad business. It makes us the wrong supplier, which is a
            different thing and a much cheaper one to find out early.
          </p>
        </Band>

        <Band heading="questions people ask first." tone="paper">
          <div className="measure">
            <FAQ items={FAQS} />
          </div>
        </Band>

        <Band tone="ink" size="lg" divider={false}>
          <h2 className="oj-display text-[clamp(34px,7vw,64px)] leading-[0.95] text-oj-cream">
            stop circling the problem.
          </h2>
          <p className="measure mt-4 text-[18px] leading-relaxed text-oj-cream/80">
            Tell us what's happening, what you've tried, and what needs to change.
          </p>
          <div className="mt-8">
            <Button size="lg" arrow href="#enquiry">
              Let's talk
            </Button>
          </div>
        </Band>
      </main>

      <OjFooter />
    </>
  );
}
