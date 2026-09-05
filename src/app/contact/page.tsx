import type { Metadata } from 'next';

import {
  Band,
  Breadcrumb,
  Button,
  EnquiryForm,
  GroundProvider,
  OjFooter,
  OjHeader,
} from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

import { EnquiryActions } from '@/components/oj/EnquiryActions';
import { EnquiryProof } from '@/components/oj/EnquiryProof';
import { getGuideConversion } from '@/lib/guide-conversion';
import { resolveGuideConversionContext } from '@/lib/guide-conversion-server';
import { ENQUIRY_INTRO, ENQUIRY_REASSURANCE } from '../start-here/content';

const TITLE = 'Contact | Orange Jelly';
const DESCRIPTION =
  "Tell us what's happening. A person reads every enquiry and replies. No list, no sequence, no account manager.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${getBaseUrl()}/contact` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${getBaseUrl()}/contact`,
    type: 'website',
    locale: 'en_GB',
    siteName: 'Orange Jelly',
  },
};

interface ContactPageProps {
  searchParams?: { guide?: string | string[]; placement?: string | string[] };
}

export default function ContactPage({ searchParams = {} }: ContactPageProps): JSX.Element {
  const context = resolveGuideConversionContext(searchParams);
  const config = context
    ? getGuideConversion(context.guideSlug, context.category, context.title)
    : undefined;
  return (
    <>
      <OjHeader />

      <main id="main-content">
        <GroundProvider value="ink">
          <section className="bg-oj-ink py-12 text-oj-cream sm:py-16">
            <div className="page-shell">
              {/*
               * Breadcrumb has no ink tone, and its light one is built for cream:
               * muted grey links, ink current page, orange-deep arrow. All three
               * are unreadable here, so the ground recolours them from outside.
               */}
              <Breadcrumb
                tone="ink"
                className="mb-7"
                items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
              />
              <h1 className="oj-display mt-1 text-[clamp(40px,8vw,72px)] leading-[0.94] text-oj-cream">
                tell us what's happening.
              </h1>
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-cream/85">
                {ENQUIRY_INTRO}
              </p>
            </div>
          </section>
        </GroundProvider>

        <Band tone="paper">
          <div id="enquiry" className="measure scroll-mt-28">
            {config && (
              <h2 className="oj-display mb-4 text-[32px] leading-tight">{config.heading}</h2>
            )}
            <p className="mb-7 text-[17px] leading-relaxed text-oj-ink-2">{ENQUIRY_REASSURANCE}</p>
            <EnquiryForm
              entryPoint="page"
              context={context}
              sourcePath="/contact"
              formPlacement="contact"
            />
            <div className="mt-8">
              <EnquiryActions context={context} placement="contact" showPrimary={false} />
            </div>
            <div className="mt-7">
              <EnquiryProof proof={config?.proof ?? 'none'} />
            </div>
          </div>
        </Band>

        <Band heading="what happens next." divider={false}>
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              If you want to know what happens next, who this works for and who it doesn't, that's
              all on{' '}
              <Button variant="ghost" size="sm" href="/start-here">
                Start here
              </Button>
              .
            </p>
          </div>
        </Band>
      </main>

      <OjFooter />
    </>
  );
}
