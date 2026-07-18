import { describe, expect, it } from 'vitest';
import { generateToken } from '@/lib/poll-tokens';
import { buildConfirmEmail } from './confirm';
import { buildDigestEmail } from './digest';
import { buildNudgeEmail } from './nudge';
import { buildPrivacyNoticeHtml, buildPrivacyNoticeText } from './privacyNotice';
import { buildUnsubscribeHeaders } from './unsubscribe';
import { buildLinksEmail, buildVerifyEmail } from './verify';
import type { BuiltEmail } from './shell';

/**
 * The string every template is attacked with. If it survives unescaped anywhere,
 * a poll title can inject markup into someone's inbox.
 */
const XSS = '<script>alert("x")</script>';

const verifyInput = {
  organiserName: 'Peter Pitcher',
  pollTitle: 'July planning call',
  verifyUrl: 'https://www.orangejelly.co.uk/availability/verify/abc123',
};

const linksInput = {
  organiserName: 'Peter Pitcher',
  pollTitle: 'July planning call',
  participantUrl: 'https://www.orangejelly.co.uk/availability/p/ptok',
  organiserUrl: 'https://www.orangejelly.co.uk/availability/o/otok',
};

const digestInput = {
  organiserName: 'Peter Pitcher',
  pollTitle: 'July planning call',
  newNames: ['Billy Summers', 'Sam Reed'],
  tallies: [
    { label: 'Saturday, 4 July 2026, 7:30pm – 9:00pm (UK time)', yes: 4, ifNeedBe: 1, no: 0 },
    { label: 'Sunday, 5 July 2026, 2:00pm – 4:00pm (UK time)', yes: 2, ifNeedBe: 3, no: 0 },
  ],
  totalResponders: 5,
  organiserUrl: 'https://www.orangejelly.co.uk/availability/o/otok',
};

const confirmInput = {
  displayName: 'Billy Summers',
  pollTitle: 'July planning call',
  description: 'A quick catch-up on the summer plan.',
  location: 'The Anchor, Stanwell Moor',
  organiserName: 'Peter Pitcher',
  whenInWords: 'Saturday, 4 July 2026, 7:30pm – 9:00pm (UK time)',
  whenShort: 'Sat 4 Jul',
  participantUrl: 'https://www.orangejelly.co.uk/availability/p/ptok',
  googleUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=July',
  outlookUrl: 'https://outlook.live.com/calendar/0/deeplink/compose?rru=addevent&subject=July',
  icsAttached: true,
};

const nudgeInput = {
  organiserName: 'Peter Pitcher',
  pollTitle: 'July planning call',
  responderCount: 3,
  bestOption: { label: 'Saturday, 4 July 2026, 7:30pm – 9:00pm (UK time)', yesCount: 4 },
  participantUrl: 'https://www.orangejelly.co.uk/availability/p/ptok',
  organiserUrl: 'https://www.orangejelly.co.uk/availability/o/otok',
};

/** Every template, so the shared rules can be asserted once over all of them. */
const allTemplates: Array<{ name: string; build: () => BuiltEmail }> = [
  { name: 'verify', build: () => buildVerifyEmail(verifyInput) },
  { name: 'links', build: () => buildLinksEmail(linksInput) },
  { name: 'digest', build: () => buildDigestEmail(digestInput) },
  { name: 'confirm', build: () => buildConfirmEmail(confirmInput) },
  { name: 'nudge', build: () => buildNudgeEmail(nudgeInput) },
];

describe('every poll email template', () => {
  it.each(allTemplates)('should emit a non-empty plain-text part ($name)', ({ build }) => {
    // HTML-only mail is the strongest spam signal this feature could send, and
    // poll mail shares a sending domain with Peter's other mail.
    const email = build();
    expect(email.text.trim().length).toBeGreaterThan(100);
  });

  it.each(allTemplates)('should emit a non-empty HTML part ($name)', ({ build }) => {
    expect(build().html).toContain('<div style=');
  });

  it.each(allTemplates)('should emit a non-empty subject ($name)', ({ build }) => {
    expect(build().subject.trim().length).toBeGreaterThan(0);
  });

  it.each(allTemplates)('should sign off in both parts ($name)', ({ build }) => {
    const email = build();
    expect(email.text).toContain('Orange Jelly');
    expect(email.html).toContain('Orange Jelly');
  });

  it.each(allTemplates)('should not shout in the subject ($name)', ({ build }) => {
    // No all-caps and no exclamation stacking — §4.6 hygiene, mandatory because
    // the sending domain is shared.
    const { subject } = build();
    expect(subject).not.toMatch(/\b[A-Z]{4,}\b/);
    expect(subject).not.toContain('!');
  });

  it.each(allTemplates)('should carry no URL shortener ($name)', ({ build }) => {
    const email = build();
    const shorteners = /\b(bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly)\b/;
    expect(email.html).not.toMatch(shorteners);
    expect(email.text).not.toMatch(shorteners);
  });

  it.each(allTemplates)(
    'should carry no image, so a blocked-images client loses nothing ($name)',
    ({ build }) => {
      expect(build().html).not.toContain('<img');
    }
  );
});

describe('buildVerifyEmail', () => {
  it('should name the poll in the subject', () => {
    expect(buildVerifyEmail(verifyInput).subject).toBe(
      'Confirm your email to publish "July planning call"'
    );
  });

  it('should strip newlines from a title bound for the subject', () => {
    // Header injection: a CR or LF in a title would let an attacker append
    // their own headers.
    const { subject } = buildVerifyEmail({
      ...verifyInput,
      pollTitle: 'July call\r\nBcc: victim@example.com',
    });
    expect(subject).not.toMatch(/[\r\n]/);
    expect(subject).toBe('Confirm your email to publish "July call Bcc: victim@example.com"');
  });

  it('should escape an injected poll title in the HTML', () => {
    const { html } = buildVerifyEmail({ ...verifyInput, pollTitle: XSS });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('should escape an injected organiser name in the HTML', () => {
    const { html } = buildVerifyEmail({ ...verifyInput, organiserName: XSS });
    expect(html).not.toContain('<script>');
  });

  it('should carry the verify link in both parts', () => {
    const email = buildVerifyEmail(verifyInput);
    expect(email.text).toContain(verifyInput.verifyUrl);
    expect(email.html).toContain(verifyInput.verifyUrl);
  });

  it('should state the 24-hour single-use expiry in both parts', () => {
    const email = buildVerifyEmail(verifyInput);
    expect(email.text).toContain('24 hours and once only');
    expect(email.html).toContain('24 hours and once only');
  });

  it('should carry no participant or organiser link — neither exists yet', () => {
    const email = buildVerifyEmail(verifyInput);
    expect(email.html).not.toContain('/availability/p/');
    expect(email.html).not.toContain('/availability/o/');
    expect(email.text).not.toContain('/availability/p/');
    expect(email.text).not.toContain('/availability/o/');
  });
});

describe('buildLinksEmail', () => {
  it('should carry both links in both parts', () => {
    const email = buildLinksEmail(linksInput);
    for (const part of [email.text, email.html]) {
      expect(part).toContain(linksInput.participantUrl);
      expect(part).toContain(linksInput.organiserUrl);
    }
  });

  it('should warn that the private link confers full control', () => {
    const email = buildLinksEmail(linksInput);
    expect(email.text).toContain('Keep it to yourself.');
    expect(email.html).toContain('Keep it to yourself.');
  });

  it('should separate the two links under their own headings', () => {
    // The visual separation is the control that stops an organiser forwarding
    // the wrong link.
    const { html } = buildLinksEmail(linksInput);
    expect(html).toContain('Send this to the people you&rsquo;re inviting');
    expect(html).toContain('Private &mdash; just for you');
  });
});

describe('buildDigestEmail', () => {
  it('should use the singular subject when one response is new', () => {
    expect(buildDigestEmail({ ...digestInput, newNames: ['Billy Summers'] }).subject).toBe(
      '1 new response to "July planning call"'
    );
  });

  it('should use the plural subject when several responses are new', () => {
    expect(buildDigestEmail(digestInput).subject).toBe('2 new responses to "July planning call"');
  });

  it('should say "New or updated" rather than claim all are first-time responses', () => {
    // The count comes from poll_responses.updated_at, so an edit legitimately
    // trips it. Claiming otherwise would be a lie as often as people change
    // their minds.
    const email = buildDigestEmail(digestInput);
    expect(email.text).toContain('New or updated since we last wrote');
    expect(email.html).toContain('New or updated since we last wrote');
  });

  it('should list every new name in both parts', () => {
    const email = buildDigestEmail(digestInput);
    for (const name of digestInput.newNames) {
      expect(email.text).toContain(name);
      expect(email.html).toContain(name);
    }
  });

  it('should escape an injected participant display name', () => {
    const { html } = buildDigestEmail({ ...digestInput, newNames: [XSS] });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('should render every tally with a word beside the glyph, not colour alone', () => {
    // Email clients strip CSS unpredictably. A count that only reads as green
    // fails for anyone whose client blocks styles — WCAG 1.4.1.
    const { html } = buildDigestEmail(digestInput);
    expect(html).toContain('Yes 4');
    expect(html).toContain('If need be 1');
    expect(html).toContain('No 0');
  });

  it('should render every tally in the plain-text part too', () => {
    const { text } = buildDigestEmail(digestInput);
    expect(text).toContain('Yes 4  ·  If need be 1  ·  No 0');
    expect(text).toContain('Yes 2  ·  If need be 3  ·  No 0');
  });

  it('should use the singular verb when one person has responded', () => {
    const email = buildDigestEmail({ ...digestInput, totalResponders: 1 });
    expect(email.html).toContain('1 person has responded');
    expect(email.text).toContain('1 person has responded');
  });
});

describe('buildConfirmEmail', () => {
  it('should put the title and short date in the subject', () => {
    expect(buildConfirmEmail(confirmInput).subject).toBe(
      'Confirmed: "July planning call" — Sat 4 Jul'
    );
  });

  it('should never carry an organiser token, whatever the caller passes', () => {
    // ConfirmEmailInput has no organiserToken field — the type makes the mistake
    // unrepresentable. This proves it with a real token, and fails loudly if
    // someone widens the input type later.
    const organiserToken = generateToken();
    const email = buildConfirmEmail(confirmInput);
    expect(email.html).not.toContain(organiserToken);
    expect(email.text).not.toContain(organiserToken);
    expect(email.html).not.toContain('/availability/o/');
    expect(email.text).not.toContain('/availability/o/');
  });

  it('should render the time in words with the zone named, in both parts', () => {
    const email = buildConfirmEmail(confirmInput);
    expect(email.text).toContain('Saturday, 4 July 2026, 7:30pm – 9:00pm (UK time)');
    expect(email.html).toContain('Saturday, 4 July 2026, 7:30pm – 9:00pm (UK time)');
  });

  it('should promise the attachment when the .ics built', () => {
    const email = buildConfirmEmail(confirmInput);
    expect(email.text).toContain("There's a calendar file attached");
    expect(email.html).toContain('calendar file attached');
  });

  it('should not promise an attachment that is not there when the .ics failed', () => {
    // A calendar file that will not build must never suppress the notification
    // that the meeting is happening — but the copy must not lie about it either.
    const email = buildConfirmEmail({ ...confirmInput, icsAttached: false });
    expect(email.text).not.toContain('attached');
    expect(email.html).not.toContain('attached');
    expect(email.text).toContain('Add it to your calendar:');
    expect(email.html).toContain('Add it to your calendar:');
  });

  it('should still carry both add-to-calendar links when the .ics failed', () => {
    const email = buildConfirmEmail({ ...confirmInput, icsAttached: false });
    expect(email.text).toContain(confirmInput.googleUrl);
    expect(email.text).toContain(confirmInput.outlookUrl);
  });

  it('should escape the ampersands in a calendar URL bound for an href', () => {
    // A bare & in an attribute must be &amp; for the URL to survive a strict
    // parser. Not belt-and-braces — required.
    const { html } = buildConfirmEmail(confirmInput);
    expect(html).toContain('action=TEMPLATE&amp;text=July');
  });

  it('should omit the location line when the poll has none', () => {
    const email = buildConfirmEmail({ ...confirmInput, location: null });
    expect(email.text).not.toContain('The Anchor');
    expect(email.html).not.toContain('The Anchor');
  });

  it('should omit the description block when the poll has none', () => {
    const email = buildConfirmEmail({ ...confirmInput, description: null });
    expect(email.text).not.toContain('summer plan');
    expect(email.html).not.toContain('summer plan');
  });

  it('should escape an injected location and description', () => {
    const { html } = buildConfirmEmail({ ...confirmInput, location: XSS, description: XSS });
    expect(html).not.toContain('<script>');
  });

  it('should carry the Article 13 notice in both parts of a participant copy', () => {
    const email = buildConfirmEmail(confirmInput);
    expect(email.text).toContain('How we handle your details');
    expect(email.html).toContain('How we handle your details');
  });

  it('should tell a participant that a reply reaches the organiser', () => {
    const email = buildConfirmEmail(confirmInput);
    expect(email.text).toContain('Reply to this email and it goes straight to');
    expect(email.html).toContain('goes straight to');
  });

  it('should change the opening line and drop the notice on the organiser copy', () => {
    // They typed their own details into the create form and were told what we do
    // with them at verification.
    const email = buildConfirmEmail({ ...confirmInput, isOrganiserCopy: true });
    expect(email.text).toContain("You've confirmed the time.");
    expect(email.text).not.toContain('How we handle your details');
    expect(email.html).not.toContain('How we handle your details');
  });

  it('should keep the participant URL on the organiser copy', () => {
    const email = buildConfirmEmail({ ...confirmInput, isOrganiserCopy: true });
    expect(email.text).toContain(confirmInput.participantUrl);
  });
});

describe('buildNudgeEmail', () => {
  it('should name the poll in the subject without shouting', () => {
    expect(buildNudgeEmail(nudgeInput).subject).toBe(
      'A quick nudge — "July planning call" is still open'
    );
  });

  it('should name the best option and its yes count when there are responses', () => {
    const email = buildNudgeEmail(nudgeInput);
    expect(email.text).toContain('3 people have responded so far');
    expect(email.text).toContain('with 4 yeses');
    expect(email.html).toContain('4 yeses');
  });

  it('should say nobody has responded rather than crash when the count is zero', () => {
    // A poll nobody has answered is the commonest case for this email.
    // "0 people have responded. The best option right now is <undefined>" is the
    // obvious crash.
    const email = buildNudgeEmail({ ...nudgeInput, responderCount: 0, bestOption: null });
    expect(email.text).toContain('Nobody has responded yet.');
    expect(email.html).toContain('Nobody has responded yet.');
    expect(email.text).not.toContain('best option');
    expect(email.html).not.toContain('best option');
  });

  it('should drop the best-option sentence when no option has any support', () => {
    const email = buildNudgeEmail({ ...nudgeInput, responderCount: 3, bestOption: null });
    expect(email.text).toContain('Nobody has responded yet.');
    expect(email.text).not.toContain('undefined');
  });

  it('should use the singular when one person has responded', () => {
    const email = buildNudgeEmail({ ...nudgeInput, responderCount: 1 });
    expect(email.text).toContain('1 person has responded');
  });

  it('should use the singular yes when the best option has one', () => {
    const email = buildNudgeEmail({
      ...nudgeInput,
      bestOption: { label: 'Saturday, 4 July 2026', yesCount: 1 },
    });
    expect(email.text).toContain('with 1 yes.');
  });

  it('should carry both links under separate headings', () => {
    const email = buildNudgeEmail(nudgeInput);
    expect(email.html).toContain('Send this to the people you&rsquo;re inviting');
    expect(email.html).toContain('Private &mdash; just for you');
    expect(email.text).toContain(nudgeInput.participantUrl);
    expect(email.text).toContain(nudgeInput.organiserUrl);
  });

  it('should promise only one nudge', () => {
    const email = buildNudgeEmail(nudgeInput);
    expect(email.text).toContain("This is the only nudge we'll send about this poll.");
    expect(email.html).toContain('the only nudge we&rsquo;ll send about this poll');
  });
});

describe('buildPrivacyNotice', () => {
  const input = { organiserName: 'Peter Pitcher' };

  it('should name Orange Jelly Limited as the controller in both parts', () => {
    expect(buildPrivacyNoticeText(input)).toContain('Orange Jelly Limited');
    expect(buildPrivacyNoticeHtml(input)).toContain('Orange Jelly Limited');
  });

  it('should say the data came from the reader — Article 13, not Article 14', () => {
    // We have no invitee list. A participant types their own details into our
    // form. Any wording claiming the organiser supplied them is a false
    // statement about our own processing.
    const text = buildPrivacyNoticeText(input);
    expect(text).toContain('You gave us these details yourself');
    expect(text).not.toMatch(/organiser (gave|supplied|provided) (us )?your/i);
  });

  it('should route rights requests to the one mailbox Orange Jelly runs', () => {
    const text = buildPrivacyNoticeText(input);
    expect(text).toContain('peter@orangejelly.co.uk');
    expect(text).not.toContain('privacy@');
    expect(text).not.toContain('hello@');
    expect(text).not.toContain('support@');
  });

  it('should warn that a reply reaches the organiser, not the controller', () => {
    // The reply-to makes the natural assumption the wrong one. Instructing a
    // reader to exercise Article 15-17 rights by replying would route them to a
    // third party with no obligation to action it.
    const text = buildPrivacyNoticeText(input);
    expect(text).toContain("Please don't reply to this email for that");
    expect(buildPrivacyNoticeHtml(input)).toContain('reply to this email for that');
  });

  it('should defer the vendor list to the privacy policy rather than reciting it', () => {
    // Peter's decision, 17 July 2026: the short notice talks like a person and
    // points at /privacy, which is where the vendor names and the transfer
    // detail now live. The consistency test guards the other half: it fails if
    // /privacy stops carrying them.
    const text = buildPrivacyNoticeText(input);
    expect(text).not.toContain('Supabase');
    expect(text).not.toContain('Resend');
    expect(text).not.toContain('Vercel');
    expect(text).toContain('orangejelly.co.uk/privacy');
  });

  it('should state the 60-day retention rule', () => {
    expect(buildPrivacyNoticeText(input)).toContain('60 days after the last response');
  });

  it('should link the privacy policy and leave the ICO to it', () => {
    const html = buildPrivacyNoticeHtml(input);
    expect(html).not.toContain('ico.org.uk');
    expect(html).toContain('https://www.orangejelly.co.uk/privacy');
  });

  it('should escape an injected organiser name', () => {
    const html = buildPrivacyNoticeHtml({ organiserName: XSS });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('should build both parts from the same wording, so they cannot drift', () => {
    const text = buildPrivacyNoticeText(input);
    const html = buildPrivacyNoticeHtml(input);
    // Every sentence in the text part must appear in the HTML part.
    expect(html).toContain('is the controller of your data');
    expect(text).toContain('is the controller of your data');
    expect(html).toContain('legitimate interests');
    expect(text).toContain('legitimate interests');
  });
});

describe('buildUnsubscribeHeaders', () => {
  it('should send both headers, because the URL form alone is not compliant', () => {
    // Gmail's bulk-sender rules require the one-click POST form.
    const headers = buildUnsubscribeHeaders('otok');
    expect(headers['List-Unsubscribe']).toContain(
      '<https://www.orangejelly.co.uk/availability/o/otok/unsubscribe>'
    );
    expect(headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');
  });

  it('should offer a mailto fallback to the one live mailbox', () => {
    expect(buildUnsubscribeHeaders('otok')['List-Unsubscribe']).toContain(
      '<mailto:peter@orangejelly.co.uk?subject=unsubscribe>'
    );
  });
});
