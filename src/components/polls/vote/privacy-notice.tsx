import Link from 'next/link';
import { BLOCK_HEADING } from '@/components/admin/BackOfficeBand';
import { CONTACT } from '@/lib/constants';

/**
 * The Article 13 privacy notice, shown on the vote screen before you submit.
 *
 * ARTICLE 13 FOR THE SHARED LINK, ARTICLE 14 FOR AN INVITATION. The
 * distinction is the whole point. Someone who opens the shared link types their
 * own name, answers and email into our form: direct collection, Article 13, and
 * telling them the organiser supplied their details would be false. Someone a
 * signed-in admin invited by email (from 30 September 2026) arrives on their
 * own link, and the organiser DID give us their address, so `invited` switches
 * the two sentences that differ and says so.
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
  /** True on an invited person's own link: the organiser gave us their address. */
  invited?: boolean;
}

export default function PollPrivacyNotice({
  organiserName,
  invited = false,
}: PollPrivacyNoticeProps): JSX.Element {
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
          Orange Jelly Limited runs this poll tool and is the controller of your data.{' '}
          {invited
            ? `${organiserName} gave us your email address to invite you. Your name and answers you give us yourself when you answer.`
            : 'You give us these details yourself when you answer this poll.'}
        </p>

        <p className="text-sm text-oj-ink-2">
          We hold the name you type, your answers, and your email address, so the group can find a
          time that works. Our lawful basis is legitimate interests: arranging a meeting people have
          chosen to take part in.
        </p>

        <p className="text-sm text-oj-ink-2">
          Your name and your answers are visible to {organiserName}, who set this poll up. Other
          people answering see the totals only, never who answered what. Your email address is not
          shown to anyone else.{' '}
          {invited
            ? 'We use it for this poll only: your invitation, one reminder if you have not answered, and the time once it is picked.'
            : 'It is used for exactly one thing: telling you the time once it is picked. Nothing else emails you.'}
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
