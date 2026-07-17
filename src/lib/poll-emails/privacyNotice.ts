import { escapeHtml } from '@/lib/email';
import { BRAND_BLUE, HAIRLINE, MUTED } from './shell';

/**
 * The Article 13 privacy notice, in one place.
 *
 * THIS IS ARTICLE 13, NOT ARTICLE 14, and the distinction is the whole point.
 * Article 14 covers data obtained from someone other than the data subject, and
 * its notice says "here is where we got your details". We have no invitee list
 * and no address book: a participant opens the shared poll link and types their
 * own name, their own answers and — optionally — their own email address into
 * our form. That is direct collection from the data subject. Any wording
 * claiming the organiser supplied their details is a false statement about our
 * own processing, shipped to a third party's inbox.
 *
 * One exported wording source, rendered two ways, so the confirmation email and
 * the poll page cannot drift apart. The poll page carrying this notice is what
 * discharges the obligation for the participants who never get an email at all,
 * which is most of them.
 *
 * THE RIGHTS ADDRESS IS peter@orangejelly.co.uk AND NOTHING ELSE. Orange Jelly
 * runs one mailbox. There is no privacy@; a notice pointing at a dead inbox is
 * worse than one naming no address.
 *
 * ON THE REPLY-TO WARNING, which is not padding. The confirmation email sets
 * Reply-to: polls.organiser_email. A reply reaches the ORGANISER — a third party
 * with no obligation to action a subject-access request, and who would then hold
 * the data subject's message and address. This notice names Orange Jelly Limited
 * as controller two paragraphs earlier, so "just reply" would route a reader's
 * Article 15-17 rights to the wrong controller. The reply-to makes the natural
 * assumption the wrong one, so the notice says so plainly rather than letting it
 * surprise someone.
 */

export const PRIVACY_RIGHTS_EMAIL = 'peter@orangejelly.co.uk';
export const PRIVACY_POLICY_URL = 'https://www.orangejelly.co.uk/privacy';

export interface PrivacyNoticeInput {
  /** polls.organiser_name — the person whose reply-to a reply would reach. */
  organiserName: string;
}

export const PRIVACY_NOTICE_HEADING = 'How we handle your details';

/**
 * The wording itself. Paragraph by paragraph, plain strings, no markup.
 *
 * Both renderers below build from this array and nothing else. That is the
 * mechanism that stops the two parts drifting — there is no second copy to
 * forget to update.
 */
function privacyNoticeParagraphs({ organiserName }: PrivacyNoticeInput): string[] {
  return [
    'Orange Jelly Limited runs this poll tool at www.orangejelly.co.uk and is the controller of your data. You gave us these details yourself when you responded to this poll.',

    `We hold your name, your answers and your email address, so the group can find a time that works and so we can tell you what was confirmed. We ask for the address because without it we cannot send you the time that was picked. Our lawful basis is legitimate interests: arranging a meeting people have chosen to take part in.`,

    `Your name and answers are visible to ${organiserName}, who set the poll up. We do not show your email address to anyone else. (If you reply to this email it goes to ${organiserName}, who will then see the address you reply from.)`,

    'We use Supabase to store the poll, Resend to send this email, and Vercel to run the site. Resend processes it in the United States under standard contractual protections. We do not sell your details or use them for marketing.',

    'We delete the whole poll 60 days after the last response or the last proposed date, whichever is later.',

    `To see, correct or delete your data, write to ${PRIVACY_RIGHTS_EMAIL}. Please don't reply to this email for that — replies go to ${organiserName}, not to us. You can also complain to the ICO at ico.org.uk.`,
  ];
}

/** The notice as plain text, for the text part of an email or a page. */
export function buildPrivacyNoticeText(input: PrivacyNoticeInput): string {
  const body = privacyNoticeParagraphs(input).join('\n\n');

  return `--\n${PRIVACY_NOTICE_HEADING}\n\n${body}\n\nFull privacy policy: ${PRIVACY_POLICY_URL}`;
}

/**
 * The notice as HTML.
 *
 * The last two paragraphs are merged and their addresses linked, so the reader
 * can act on them in one tap. The wording is byte-identical to the text part
 * either side of the anchors — the links add affordance, never meaning.
 */
export function buildPrivacyNoticeHtml(input: PrivacyNoticeInput): string {
  const paragraphs = privacyNoticeParagraphs(input);
  const escaped = paragraphs.map((paragraph) => escapeHtml(paragraph));

  // Turn the two addresses in the final paragraph into links. Done after
  // escaping so the anchor markup survives and the wording does not diverge.
  const rightsParagraph = escaped[escaped.length - 1]
    .replace(
      escapeHtml(PRIVACY_RIGHTS_EMAIL),
      `<a href="mailto:${PRIVACY_RIGHTS_EMAIL}" style="color:${BRAND_BLUE};">${PRIVACY_RIGHTS_EMAIL}</a>`
    )
    .replace(
      'ico.org.uk',
      `<a href="https://ico.org.uk" style="color:${BRAND_BLUE};">ico.org.uk</a>`
    );

  const body = [...escaped.slice(0, -1), rightsParagraph]
    .map(
      (paragraph) => `<p style="margin:0 0 8px;font-size:13px;color:${MUTED};">
  ${paragraph}
</p>`
    )
    .join('\n');

  return `<hr style="border:0;border-top:1px solid ${HAIRLINE};margin:0 0 16px;">
<p style="margin:0 0 8px;font-size:13px;font-weight:700;">${PRIVACY_NOTICE_HEADING}</p>
${body}
<p style="margin:0 0 8px;font-size:13px;color:${MUTED};">
  <a href="${PRIVACY_POLICY_URL}" style="color:${BRAND_BLUE};">Full privacy policy</a>
</p>`;
}
