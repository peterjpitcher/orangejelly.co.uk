import Link from 'next/link';
import Text from '@/components/Text';
import { CONTACT } from '@/lib/constants';

/**
 * The Article 13 privacy notice, shown on the vote screen before you submit.
 *
 * ARTICLE 13, NOT ARTICLE 14 — and the distinction is the whole point.
 * Article 14 covers data obtained from someone OTHER than the data subject, and
 * its notice says "here is where we got your details". We have no invitee list
 * and no address book: a participant opens a shared link and types their own
 * name, their own answers and — if they choose — their own email into our form.
 * That is direct collection from the data subject, which is Article 13. Any
 * wording claiming the organiser supplied their details is a false statement
 * about our own processing, made to a third party. It must never appear.
 *
 * This is on the page because most participants never receive an email at all,
 * so the page is what discharges the obligation for them (§1 P1.12).
 *
 * Processors named here are the three that actually touch a participant's data.
 * Cloudflare Turnstile is deliberately NOT named: it runs on the poll-create
 * form only (see the CSP note in `src/middleware.ts`), so it never sees a
 * participant. Naming a processor that does not process your data is as wrong as
 * omitting one that does. `/privacy` covers Turnstile for the organiser.
 */

export interface PollPrivacyNoticeProps {
  organiserName: string;
}

export default function PollPrivacyNotice({ organiserName }: PollPrivacyNoticeProps): JSX.Element {
  return (
    <section
      aria-labelledby="poll-privacy-heading"
      className="rounded-lg border border-charcoal/15 bg-surface p-4"
    >
      <h2 id="poll-privacy-heading" className="mb-2 text-base font-semibold text-charcoal">
        How we handle your details
      </h2>

      <div className="space-y-2">
        <Text size="sm" color="muted">
          Orange Jelly Limited runs this poll tool and is the controller of your data. You give us
          these details yourself when you answer this poll.
        </Text>

        <Text size="sm" color="muted">
          We hold the name you type, your answers, and your email address, so the group can find a
          time that works. Our lawful basis is legitimate interests: arranging a meeting people have
          chosen to take part in.
        </Text>

        <Text size="sm" color="muted">
          Your name and your answers are visible to {organiserName}, who set this poll up. Other
          people answering see the totals only — never who answered what. Your email address is not
          shown to anyone else, and it is used for exactly one thing: telling you the time once it
          is picked. Nothing else emails you.
        </Text>

        <Text size="sm" color="muted">
          We use Supabase to store the poll, Vercel to run the site, and Resend to send that one
          email. They may process your details outside the UK under the standard protections in
          their contracts with us. We do not sell your details and we do not use them for marketing.
        </Text>

        <Text size="sm" color="muted">
          We delete the whole poll 60 days after the last answer or the last proposed date,
          whichever is later.
        </Text>

        <Text size="sm" color="muted">
          To see, correct or delete your data, write to{' '}
          <a className="underline hover:no-underline" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
          . You can also complain to the ICO at{' '}
          <a
            className="underline hover:no-underline"
            href="https://ico.org.uk"
            rel="noopener noreferrer"
            target="_blank"
          >
            ico.org.uk
          </a>
          .{' '}
          <Link className="underline hover:no-underline" href="/privacy">
            Read the full privacy policy
          </Link>
          .
        </Text>
      </div>
    </section>
  );
}
