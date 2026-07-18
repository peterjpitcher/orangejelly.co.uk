import { describe, expect, it } from 'vitest';

import { buildDeadlineReminderEmail } from './deadlineReminder';

/**
 * The deadline reminder is the human step in the deadline flow, and everything
 * about it exists to keep a human in the loop: it goes to the organiser, it
 * carries their private link, and it must never read as though the invite has
 * already gone out.
 */

const base = {
  organiserName: 'Peter',
  pollTitle: 'Quiz night briefing',
  totalResponders: 4,
  organiserUrl: 'https://www.orangejelly.co.uk/availability/o/organiser-token-here',
};

describe('buildDeadlineReminderEmail', () => {
  it('should build both an HTML and a plain-text part from one call', () => {
    const email = buildDeadlineReminderEmail(base);
    expect(email.html.length).toBeGreaterThan(0);
    expect(email.text.length).toBeGreaterThan(0);
    expect(email.subject).toContain('Quiz night briefing');
  });

  it('should say nothing has been sent yet, so the organiser knows it is their call', () => {
    // The whole design rests on this. If the reminder implied the invite was out,
    // the organiser would think the job was done and never confirm.
    const email = buildDeadlineReminderEmail(base);
    expect(email.text).toMatch(/nothing has been sent/i);
    expect(email.html).toMatch(/nothing has gone out/i);
  });

  it('should carry the organiser link so there is one tap to the results', () => {
    const email = buildDeadlineReminderEmail(base);
    expect(email.html).toContain(base.organiserUrl);
    expect(email.text).toContain(base.organiserUrl);
  });

  it('should state the turnout plainly rather than push a confirmation', () => {
    const email = buildDeadlineReminderEmail({ ...base, totalResponders: 2 });
    expect(email.text).toContain('2 people have answered');
  });

  it('should handle a poll nobody answered without reading as an error', () => {
    const email = buildDeadlineReminderEmail({ ...base, totalResponders: 0 });
    expect(email.text).toMatch(/no one has answered/i);
    expect(email.text).not.toContain('0 people');
  });

  it('should say the reminder will not repeat, so the organiser is not chased', () => {
    const email = buildDeadlineReminderEmail(base);
    expect(email.text).toMatch(/won.t send this reminder again/i);
  });

  it('should escape a poll title that contains HTML', () => {
    // Poll titles are attacker-controlled. A title is not markup.
    const email = buildDeadlineReminderEmail({
      ...base,
      pollTitle: '<script>alert(1)</script>',
    });
    expect(email.html).not.toContain('<script>alert(1)</script>');
    expect(email.html).toContain('&lt;script&gt;');
  });
});
