import type { Metadata } from 'next';

import { Band, Breadcrumb, Button, EnquiryForm, OjFooter, OjHeader } from '@/components/oj';
import { getBaseUrl } from '@/lib/site-config';

/**
 * `/contact`. A reduced `/start-here`.
 *
 * It is not the main conversion route and should not compete with one: same form,
 * same server action, no fit language, no FAQ, no method. Somebody who arrived here
 * from a footer link or an old bookmark wants to send a message, not read an
 * argument, and the argument already exists one link away.
 *
 * The old page led with WhatsApp and a phone number and described Orange Jelly by
 * its founder. Both are still offered, below the form rather than instead of it,
 * because a message sent through the form is recorded as a lead and a WhatsApp is
 * not.
 */
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

export default function ContactPage(): JSX.Element {
  return (
    <>
      <OjHeader />

      <main id="main-content">
        <section className="border-b-1.5 border-oj-ink bg-oj-cream py-12 sm:py-16">
          <div className="page-shell">
            <Breadcrumb
              className="mb-7"
              items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
            />
            <h1 className="oj-display mt-1 text-[clamp(40px,8vw,72px)] leading-[0.94] text-oj-ink">
              tell us what's happening.
            </h1>
            <p className="measure mt-5 text-[19px] leading-relaxed text-oj-ink-2">
              A person reads every enquiry and replies. Not a filter, not a sequence, and not an
              account manager.
            </p>
          </div>
        </section>

        <Band tone="paper">
          <div className="measure">
            <EnquiryForm entryPoint="page" />
          </div>
        </Band>

        <Band heading="if you'd rather not use a form." divider={false}>
          <div className="measure space-y-4 text-[17px] leading-relaxed">
            <p>
              Email{' '}
              <a href="mailto:peter@orangejelly.co.uk" className="font-semibold underline">
                peter@orangejelly.co.uk
              </a>
              . It's the only mailbox we have, so it reaches the same person either way.
            </p>
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
