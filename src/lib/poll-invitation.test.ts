import { describe, expect, it } from 'vitest';

import {
  buildInvitationText,
  formatInvitationOption,
  formatWallClockTime,
} from './poll-invitation';

const slotA = {
  date: '2026-08-04',
  startTime: '19:00',
  endTime: '21:00',
  endsNextDay: false,
} as const;
const slotB = {
  date: '2026-08-05',
  startTime: '23:00',
  endTime: '01:00',
  endsNextDay: true,
} as const;

const base = {
  title: 'Quiz night briefing',
  organiserName: 'Peter Pitcher',
  optionLabels: [formatInvitationOption(slotA), formatInvitationOption(slotB)],
  participantUrl: 'https://www.orangejelly.co.uk/availability/p/participant-token-here',
};

describe('formatWallClockTime', () => {
  it.each([
    ['00:30', '12:30am'],
    ['09:05', '9:05am'],
    ['12:00', '12:00pm'],
    ['19:00', '7:00pm'],
    ['23:45', '11:45pm'],
  ])('should render %s as %s', (input, expected) => {
    expect(formatWallClockTime(input)).toBe(expected);
  });
});

describe('formatInvitationOption', () => {
  it('should render a whole day without inventing times for it', () => {
    expect(formatInvitationOption({ date: '2026-08-04' })).toBe('Tuesday, 4 August 2026');
  });

  it('should render a slot as a readable range', () => {
    expect(formatInvitationOption(slotA)).toBe('Tuesday, 4 August 2026, 7:00pm to 9:00pm');
  });

  it('should say when a slot finishes the next day', () => {
    // A pub event crosses midnight. "11:00pm to 1:00am" with no marker reads as
    // a range running backwards.
    expect(formatInvitationOption(slotB)).toBe(
      'Wednesday, 5 August 2026, 11:00pm to 1:00am (finishes next day)'
    );
  });
});

describe('buildInvitationText', () => {
  it('should lead with who is asking and what for', () => {
    const text = buildInvitationText(base);
    expect(text.startsWith('Peter Pitcher is finding a time for: Quiz night briefing')).toBe(true);
  });

  it('should list every option and carry the link', () => {
    const text = buildInvitationText(base);
    expect(text).toContain('  - Tuesday, 4 August 2026, 7:00pm to 9:00pm');
    expect(text).toContain('(finishes next day)');
    expect(text).toContain(base.participantUrl);
  });

  it('should omit empty sections rather than printing headed blanks', () => {
    // "Agenda: (none)" reads like a form, and the block exists to not read like
    // a form.
    const text = buildInvitationText(base);
    expect(text).not.toContain("What we'll cover");
    expect(text).not.toContain('Where:');
    expect(text).not.toContain('Please answer by');
  });

  it('should include the agenda, location and deadline when they exist', () => {
    const text = buildInvitationText({
      ...base,
      agenda: '1. Last quarter\n2. Prize budget',
      location: 'The Anchor, Stanwell Moor',
      deadlineLabel: 'Tuesday, 22 July 2026 at 6:00pm',
    });
    expect(text).toContain("What we'll cover:\n1. Last quarter\n2. Prize budget");
    expect(text).toContain('Where: The Anchor, Stanwell Moor');
    expect(text).toContain('Please answer by Tuesday, 22 July 2026 at 6:00pm.');
  });

  it('should tell the recipient about the in-person or video choice', () => {
    // The attendance question is new; the invitation is where the recipient
    // learns it exists before they open the link.
    expect(buildInvitationText(base)).toContain('in person or need a video link');
  });

  it('should say no account is needed, which is the whole pitch', () => {
    expect(buildInvitationText(base)).toContain('you will not need an account');
  });
});
