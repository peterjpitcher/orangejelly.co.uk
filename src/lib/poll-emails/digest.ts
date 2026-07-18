import { escapeHtml } from '@/lib/email';
import {
  HAIRLINE,
  MUTED,
  fallbackLink,
  primaryButton,
  sanitiseSubjectValue,
  wrapHtml,
  wrapText,
  type BuiltEmail,
} from './shell';

/** One option's running totals. Integers from an aggregate, never user input. */
export interface DigestOptionTally {
  /** Already prose, from formatOptionForEmail(). */
  label: string;
  yes: number;
  ifNeedBe: number;
  no: number;
}

export interface DigestEmailInput {
  organiserName: string;
  pollTitle: string;
  /**
   * Display names of everyone whose response is new OR edited since the last
   * digest. Never their email addresses — the organiser sees names and answers,
   * and §4.3 promises addresses are shown to nobody.
   */
  newNames: string[];
  tallies: DigestOptionTally[];
  /** Everyone who has responded at all, not just since the last digest. */
  totalResponders: number;
  organiserUrl: string;
}

/**
 * "You have new responses" — the batched digest.
 *
 * ON THE WORDING "New or updated since we last wrote". The count comes from
 * poll_responses.updated_at, so an edit legitimately trips it. Copy claiming
 * these are all first-time responses would be a lie roughly as often as people
 * change their minds, which is often. The subject counts "responses", which
 * covers both honestly.
 *
 * No reply-to. Participant email addresses are optional and must never be
 * exposed in one.
 */
export function buildDigestEmail(input: DigestEmailInput): BuiltEmail {
  const { organiserName, pollTitle, newNames, tallies, totalResponders, organiserUrl } = input;

  const newCount = newNames.length;
  const countPhrase = newCount === 1 ? '1 new response' : `${newCount} new responses`;
  const respondedPhrase =
    totalResponders === 1 ? '1 person has responded' : `${totalResponders} people have responded`;

  const subject = `${countPhrase} to "${sanitiseSubjectValue(pollTitle)}"`;

  const textTallies = tallies
    .map(
      (tally) =>
        `  ${tally.label}\n      Yes ${tally.yes}  ·  If need be ${tally.ifNeedBe}  ·  No ${tally.no}`
    )
    .join('\n');

  const text = wrapText(`Hi ${organiserName},

${countPhrase} to your poll:

  ${pollTitle}

New or updated since we last wrote:
${newNames.map((name) => `  - ${name}`).join('\n')}

Where it stands (${respondedPhrase}):

${textTallies}

See the full picture and confirm a time:

  ${organiserUrl}

That link is private to you. Anyone who has it can confirm the time, close the
poll and delete responses.

We batch these — you'll get at most one an hour, however many people respond.`);

  // Every count carries a glyph AND a word ("✓ Yes 4"), never a colour swatch
  // alone. Email clients strip CSS unpredictably, so a count that only reads as
  // green fails for anyone whose client blocks styles — the same WCAG 1.4.1
  // reasoning that governs the poll page itself.
  const htmlTallies = tallies
    .map(
      (tally) => `  <tr>
    <td style="padding:10px 0;border-bottom:1px solid ${HAIRLINE};">
      <div style="font-weight:600;">${escapeHtml(tally.label)}</div>
      <div style="font-size:14px;color:${MUTED};">
        &#10003; Yes ${tally.yes} &nbsp;&middot;&nbsp; ~ If need be ${tally.ifNeedBe} &nbsp;&middot;&nbsp; &#10007; No ${tally.no}
      </div>
    </td>
  </tr>`
    )
    .join('\n');

  const html = wrapHtml(`  <p style="margin:0 0 16px;">Hi ${escapeHtml(organiserName)},</p>
  <p style="margin:0 0 8px;font-size:18px;font-weight:700;">${countPhrase}</p>
  <p style="margin:0 0 24px;">to your poll <strong>${escapeHtml(pollTitle)}</strong>.</p>

  <p style="margin:0 0 8px;font-weight:700;">New or updated since we last wrote</p>
  <ul style="margin:0 0 24px;padding-left:20px;">
${newNames.map((name) => `    <li style="margin:0 0 4px;">${escapeHtml(name)}</li>`).join('\n')}
  </ul>

  <p style="margin:0 0 8px;font-weight:700;">
    Where it stands (${respondedPhrase})
  </p>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"
         style="width:100%;margin:0 0 24px;border-collapse:collapse;">
${htmlTallies}
  </table>

  ${primaryButton(organiserUrl, 'See the results')}
  ${fallbackLink(organiserUrl, 'Or paste this into your browser:')}
  <p style="margin:0 0 16px;font-size:14px;">
    That link is private to you. Anyone who has it can confirm the time, close the
    poll and delete responses.
  </p>
  <p style="margin:0 0 16px;font-size:14px;color:${MUTED};">
    We batch these &mdash; you&rsquo;ll get at most one an hour, however many people respond.
  </p>`);

  return { subject, html, text };
}
