import Heading from '@/components/Heading';
import Text from '@/components/Text';
import { CONTACT, COMPANY } from '@/lib/constants';
import { generateStaticMetadata } from '@/lib/metadata';

/**
 * The privacy policy.
 *
 * This route did not exist before the availability poll shipped, and the poll is
 * what made the gap untenable: its participant screen carries an Article 13
 * notice, and a notice that links to nothing is not defensible (§1 P1.13,
 * Peter's decision, 16 July 2026).
 *
 * The on-page poll notice is self-sufficient — it delegates no required
 * disclosure to this page. This page is the fuller picture for the whole site.
 *
 * Everything here is deliberately limited to what the code actually does. The
 * processors named are the ones this repo genuinely calls: Supabase
 * (`src/lib/db`), Resend (`src/lib/email.ts`), Vercel (the host), Cloudflare
 * Turnstile (the poll-create bot check only — see the CSP note in
 * `src/middleware.ts`) and Google Tag Manager (site analytics, which
 * `src/components/GoogleTagManager.tsx` switches off entirely on poll routes).
 * Do not add a processor here that the code does not use, and do not drop one it
 * does.
 */

export const metadata = generateStaticMetadata({
  title: 'Privacy Policy',
  description:
    'How Orange Jelly Limited handles your personal data — what we collect, why, who processes it, how long we keep it, and your rights.',
  path: '/privacy',
});

function Section({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <section className="space-y-3">
      <Heading level={2}>{title}</Heading>
      {children}
    </section>
  );
}

export default function PrivacyPage(): JSX.Element {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="space-y-8">
        <div className="space-y-3">
          <Heading level={1}>Privacy policy</Heading>
          <Text color="muted">Last updated: 16 July 2026</Text>
          <Text>
            This explains what personal data Orange Jelly Limited collects through{' '}
            {COMPANY.website.replace('https://', '')}, why we collect it, who else handles it, how
            long we keep it, and what you can ask us to do about it.
          </Text>
        </div>

        <Section title="Who we are">
          <Text>
            Orange Jelly Limited is the controller of the personal data described here. We are a
            small business based in {CONTACT.location}, and we run one mailbox. For anything to do
            with your data, write to{' '}
            <a className="underline hover:no-underline" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>
            .
          </Text>
        </Section>

        <Section title="What we collect, and why">
          <Text weight="semibold">When you send us an enquiry</Text>
          <Text>
            Our contact form asks for your name, email address, venue name and your message, and
            optionally your phone number. We use these to reply to you and to keep track of the
            conversation. Our lawful basis is legitimate interests: responding to someone who has
            asked us to get in touch.
          </Text>

          <Text weight="semibold">When you set up an availability poll</Text>
          <Text>
            We hold your name, your email address, the poll title and whatever you write in the
            description, agenda and location fields. We email you a link to confirm the address is
            yours, and later to tell you how people have answered. Our lawful basis is legitimate
            interests: running the tool you asked us to run.
          </Text>

          <Text weight="semibold">When you answer someone&rsquo;s availability poll</Text>
          <Text>
            We hold the name you type, your answers, and your email address if you choose to give
            one. You give us all of this yourself, directly, by typing it into the form — nobody
            hands us a list of invitees, and we have no address book. Your name and answers are
            visible to the person who set the poll up. Everyone else answering sees the totals only,
            never who answered what. Your email address is used for exactly one thing: telling you
            the time once it is picked. Our lawful basis is legitimate interests: arranging a
            meeting people have chosen to take part in.
          </Text>

          <Text weight="semibold">When you browse the site</Text>
          <Text>
            We use Google Tag Manager and Google Analytics to understand which pages are useful.
            These are switched off entirely on poll pages, because the poll link in the address bar
            is itself a credential and we will not hand it to a third party.
          </Text>
        </Section>

        <Section title="Who else handles it">
          <Text>
            We do not sell your details, and we do not use them for marketing you did not ask for.
            We do rely on a small number of suppliers to run the site, and they process your data on
            our instructions:
          </Text>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <Text as="span">
                <strong>Supabase</strong> — stores enquiries, polls, answers and email addresses.
              </Text>
            </li>
            <li>
              <Text as="span">
                <strong>Vercel</strong> — runs and serves the site.
              </Text>
            </li>
            <li>
              <Text as="span">
                <strong>Resend</strong> — delivers the emails we send you.
              </Text>
            </li>
            <li>
              <Text as="span">
                <strong>Cloudflare</strong> — its Turnstile check confirms a person, not a bot, is
                setting up a poll. It runs on the poll set-up form only, and never on the page where
                you answer a poll.
              </Text>
            </li>
            <li>
              <Text as="span">
                <strong>Google</strong> — analytics on the marketing pages, never on poll pages.
              </Text>
            </li>
          </ul>
          <Text>
            Some of these process data outside the UK, including in the United States. Where they
            do, the transfer is covered by the standard protections in our contracts with them — the
            UK International Data Transfer Agreement or the EU Standard Contractual Clauses, as
            applicable.
          </Text>
        </Section>

        <Section title="How long we keep it">
          <Text>
            <strong>Availability polls</strong> — we delete the whole poll, including every answer,
            every name and every email address on it, 60 days after the last answer or the last
            proposed date, whichever is later. That deletion runs automatically.
          </Text>
          <Text>
            <strong>Enquiries</strong> — we keep these for as long as we may need them for the
            conversation and any work that follows, and no longer than is useful. Ask us to remove
            yours and we will.
          </Text>
        </Section>

        <Section title="Your rights">
          <Text>
            You can ask us for a copy of your data, ask us to correct it, ask us to delete it, or
            object to us holding it. Write to{' '}
            <a className="underline hover:no-underline" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>{' '}
            and we will deal with it within a month.
          </Text>
          <Text>
            If you have answered someone&rsquo;s poll, please do not reply to the confirmation email
            to make that request — replies to it go to the organiser, who is a different person with
            no obligation to action it, and it would hand them your message. Write to us directly at
            the address above.
          </Text>
          <Text>
            If you think we have got it wrong, you can complain to the Information
            Commissioner&rsquo;s Office at{' '}
            <a
              className="underline hover:no-underline"
              href="https://ico.org.uk"
              rel="noopener noreferrer"
              target="_blank"
            >
              ico.org.uk
            </a>
            . We would rather you told us first so we can put it right.
          </Text>
        </Section>
      </div>
    </main>
  );
}
