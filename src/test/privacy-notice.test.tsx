import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PrivacyPage from '@/app/privacy/page';

/**
 * The privacy notice against what the code actually does.
 *
 * It described a pub contact form until the enquiry work landed. A notice that
 * describes a form that no longer exists is not a small inaccuracy: it is the one
 * document a person is entitled to rely on when deciding whether to type any of
 * this in.
 *
 * @see tasks/repositioning/SUB-SPECS.md part 1.7
 */
describe('the privacy notice', () => {
  function text(): string {
    render(<PrivacyPage />);
    return document.body.textContent ?? '';
  }

  it('describes the four things step one asks for', () => {
    const body = text();
    expect(body).toMatch(/your name, your email address, your company/i);
    expect(body).toMatch(/what is happening in the business/i);
  });

  /*
   * REWRITTEN 31 August 2026, when the second step of the enquiry form was removed.
   * The notice used to say the six later questions were optional; it now has to say
   * they are no longer asked and what happened to the answers already given, because
   * a privacy notice describing a form that does not exist is the wrong kind of
   * wrong.
   */
  it('says the six later questions are no longer asked, and what became of the answers', () => {
    const body = text();
    expect(body).toMatch(/no longer does/i);
    expect(body).toMatch(/Answers given before that date are still held/i);
    expect(body).toMatch(/ask us to delete them/i);
    // The claim it replaced must not survive anywhere.
    expect(body).not.toMatch(/Every one of these is optional/);
  });

  it('no longer describes a pub contact form', () => {
    const body = text();
    expect(body).not.toMatch(/venue name/i);
    // Phone was on the old form and is not asked for anywhere in the new journey.
    expect(body).not.toMatch(/optionally your phone number/i);
  });

  it('states the 24-month retention rather than "as long as is useful"', () => {
    const body = text();
    expect(body).toMatch(/24 months from the last time we were in contact/);
    expect(body).not.toMatch(/no longer than is useful/);
  });

  it('draws the analytics line at device storage, and names both sides', () => {
    const body = text();
    expect(body).toMatch(/Without asking you/);
    expect(body).toMatch(/Vercel Analytics and Speed Insights/);
    expect(body).toMatch(/set no cookie and store nothing on your device/i);
    expect(body).toMatch(/Only if you agree/);
    expect(body).toMatch(/Google Tag Manager and Google Analytics/);
  });

  it('promises that enquiry answers never reach analytics', () => {
    expect(text()).toMatch(/enquiry answers do not go into analytics/i);
  });

  it('says where the sensitive answers live, and where they do not', () => {
    // The notification email carries step one only. This is the user-facing half of
    // that decision, and it is a promise the code has to keep.
    const body = text();
    expect(body).toMatch(/readable only from our password-protected admin area/i);
  });

  it('names only the one mailbox Orange Jelly has', () => {
    const body = text();
    expect(body).toMatch(/peter@orangejelly\.co\.uk/);
    expect(body).not.toMatch(/privacy@|dpo@|hello@|support@/);
  });

  it('is dated the day it was rewritten', () => {
    expect(text()).toMatch(/Last updated: 28 August 2026/);
  });
});
