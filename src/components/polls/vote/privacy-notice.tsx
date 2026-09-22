import Link from 'next/link';
import { BLOCK_HEADING } from '@/components/admin/BackOfficeBand';
import { CONTACT } from '@/lib/constants';

/**
 * The Article 13 privacy notice, shown on the vote screen before you submit.
 *
 * ARTICLE 13, NOT ARTICLE 14. The distinction is the whole point.
 * Article 14 covers data obtained from someone OTHER than the data subject, and
 * its notice says "here is where we got your details". We have no invitee list
 * and no address book: a participant opens a shared link and types their own
 * name, their own answers and, if they choose, their own email into our form.
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
      // A quiet block: the soft ink rule and no shadow, so the notice reads as
      // small print beside the form rather than as another thing to answer.
      className="rounded-oj border-1.5 border-oj-ink/20 bg-oj-cream p-5"
    >
      <h2 id="poll-privacy-heading" className={`mb-2 text-base ${BLOCK_HEADING}`}>
        How we handle your details
      </h2>

      <div className="space-y-2">
        <p className="text-sm text-oj-ink-2">
          Orange Jelly Limited runs this poll tool and is the controller of your data. You give us
          these details yourself when you answer this poll.
        </p>

        <p className="text-sm text-oj-ink-2">
          We hold the name you type, your answers, and your email address, so the group can find a
          time that works. Our lawful basis is legitimate interests: arranging a meeting people have
          chosen to take part in.
        </p>

        <p className="text-sm text-oj-ink-2">
          Your name and your answers are visible to {organiserName}, who set this poll up. Other
          people answering see the totals only, never who answered what. Your email address is not
          shown to anyone else, and it is used for exactly one thing: telling you the time once it
          is picked. Nothing else emails you.
        </p>

        <p className="text-sm text-oj-ink-2">
          Trusted providers host the poll and deliver that one email on our behalf; the full list is
          in our privacy policy. We do not sell your details and we do not use them for marketing.
        </p>

        <p className="text-sm text-oj-ink-2">
          We delete the whole poll 60 days after the last answer or the last proposed date,
          whichever is later.
        </p>

        <p className="text-sm text-oj-ink-2">
          To see, correct or delete your data, write to{' '}
          <a
            className="font-semibold text-oj-ink underline hover:no-underline"
            href={`mailto:${CONTACT.email}`}
          >
            {CONTACT.email}
          </a>
          .{' '}
          <Link className="font-semibold text-oj-ink underline hover:no-underline" href="/privacy">
            Read the full privacy policy
          </Link>
          , which also covers your right to complain.
        </p>
      </div>
    </section>
  );
}
