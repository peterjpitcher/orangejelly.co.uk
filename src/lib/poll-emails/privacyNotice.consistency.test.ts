import { readFileSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

import { buildPrivacyNoticeText, PRIVACY_RIGHTS_EMAIL } from './privacyNotice';

/**
 * The Article 13 notice exists in two places, and it has to.
 *
 * The email version says things a page cannot ("if you reply to this email it
 * goes to the organiser"); the page version carries a link to /privacy that an
 * email body renders differently. They are the same FACTS in two media, not one
 * string used twice, so collapsing them into a single renderer would make both
 * worse.
 *
 * What must never diverge is the facts themselves. A privacy notice that tells a
 * participant 60 days on the page and something else in the email is worse than a
 * terse one: it is a promise the business is visibly failing to keep, and it is
 * the kind of drift nobody notices until someone asks.
 *
 * These tests read the page component as TEXT rather than rendering it. That is
 * deliberate — the point is to fail when someone edits one file and not the
 * other, which is a source-level question, not a rendering one.
 */

const VOTE_NOTICE = readFileSync(
  path.join(process.cwd(), 'src/components/polls/vote/privacy-notice.tsx'),
  'utf8'
);

const emailNotice = buildPrivacyNoticeText({ organiserName: 'Peter' });

describe('the privacy notice says the same thing on the page and in the email', () => {
  it('should quote the same retention window in both', () => {
    // Peter's decision, 16 July 2026. It is also what polls.expires_at enforces
    // and what the cron actually deletes on, so all three must agree.
    expect(emailNotice).toContain('60 days');
    expect(VOTE_NOTICE).toContain('60 days');
  });

  it('should name the same controller in both', () => {
    expect(emailNotice).toContain('Orange Jelly Limited');
    expect(VOTE_NOTICE).toContain('Orange Jelly Limited');
  });

  it('should name no vendor in either short notice, and defer both to /privacy', () => {
    // Peter's decision, 17 July 2026: the short notices stop reading like a
    // compliance form. The vendor list and the ICO complaint right move to the
    // one durable document, /privacy, which both notices link to. That keeps the
    // required disclosures made somewhere the reader is pointed at, while the
    // poll page talks like a person.
    for (const vendor of ['Supabase', 'Resend', 'Vercel']) {
      expect(emailNotice).not.toContain(vendor);
      expect(VOTE_NOTICE).not.toContain(vendor);
    }
    expect(emailNotice).toContain('orangejelly.co.uk/privacy');
    expect(VOTE_NOTICE).toContain('/privacy');
  });

  it('should keep the ICO line OUT of the short notices but IN the full policy', () => {
    // The right to complain to the regulator is a disclosure UK GDPR requires.
    // Removing it from the short notices is fine only for as long as the full
    // policy still carries it, so this test reads the policy page and fails the
    // moment someone tidies the ICO out of there too.
    expect(emailNotice).not.toMatch(/ico\.org\.uk/i);
    expect(VOTE_NOTICE).not.toMatch(/ico\.org\.uk/i);

    const policyPage = readFileSync(path.join(process.cwd(), 'src/app/privacy/page.tsx'), 'utf8');
    expect(policyPage).toMatch(/ico\.org\.uk/i);
    for (const vendor of ['Supabase', 'Resend', 'Vercel']) {
      expect(policyPage).toContain(vendor);
    }
  });

  it('should give the same rights address in both, and never a privacy@ mailbox', () => {
    // Orange Jelly runs one mailbox. An earlier draft of the spec named
    // privacy@orangejelly.co.uk, which does not exist and never will — a rights
    // address that bounces is worse than naming none at all.
    expect(PRIVACY_RIGHTS_EMAIL).toBe('peter@orangejelly.co.uk');
    expect(emailNotice).toContain(PRIVACY_RIGHTS_EMAIL);
    expect(VOTE_NOTICE.includes(PRIVACY_RIGHTS_EMAIL) || VOTE_NOTICE.includes('CONTACT')).toBe(
      true
    );
    expect(emailNotice).not.toContain('privacy@');
    expect(VOTE_NOTICE).not.toContain('privacy@');
  });

  it('should describe collection as direct, never as supplied by the organiser', () => {
    // Article 13, not 14. The participant types their own name and answers into
    // our form. An earlier draft said "the organiser gave us your details",
    // which is simply false and would have made the notice a misstatement of the
    // collection route.
    expect(emailNotice).toContain('You gave us these details yourself');
    expect(emailNotice).not.toMatch(/organiser (gave|supplied|provided) us your/i);
    expect(VOTE_NOTICE).not.toMatch(/organiser (gave|supplied|provided) us your/i);
  });
});
