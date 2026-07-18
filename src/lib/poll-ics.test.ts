import { describe, expect, it } from 'vitest';

import {
  buildCalendarLinks,
  buildPollIcs,
  ICS_PRODUCT_ID,
  nextCalendarDay,
  type PollIcsInput,
} from './poll-ics';

/**
 * The .ics is the part of this feature that goes wrong silently: a malformed
 * VCALENDAR does not error, it just fails to import, and nobody finds out until
 * the meeting is missed. So these tests parse the generated output rather than
 * trusting that the library was called correctly.
 *
 * `ics` is not mocked. It is a pure, offline formatter with no I/O — mocking it
 * would leave the one thing worth asserting (that the emitted text is a valid,
 * correctly-timed VCALENDAR) untested.
 */

const SLOT_INPUT: PollIcsInput = {
  pollId: '11111111-1111-4111-8111-111111111111',
  optionKind: 'slots',
  optionDate: null,
  // 19:30 BST on 4 July 2026 = 18:30Z. The offset is the whole point.
  startsAt: '2026-07-04T18:30:00.000Z',
  endsAt: '2026-07-04T20:00:00.000Z',
  title: 'July planning call',
  description: 'A quick catch-up.',
  agenda: null,
  location: null,
  organiserName: 'Peter Pitcher',
  organiserEmail: 'peter@orangejelly.co.uk',
  participantUrl: 'https://www.orangejelly.co.uk/availability/p/aaaaaaaaaaaaaaaaaaaaaa',
  confirmSequence: 0,
};

const DATE_INPUT: PollIcsInput = {
  ...SLOT_INPUT,
  optionKind: 'dates',
  optionDate: '2026-07-04',
  startsAt: null,
  endsAt: null,
};

/** Unfolds RFC 5545 continuation lines so a folded DESCRIPTION can be asserted on. */
function unfold(ics: string): string {
  return ics.replace(/\r\n[ \t]/g, '');
}

function lineFor(ics: string, field: string): string | undefined {
  return unfold(ics)
    .split('\r\n')
    .find((line) => line.startsWith(field));
}

describe('buildPollIcs', () => {
  describe('the generated calendar parses', () => {
    it('should emit a well-formed VCALENDAR wrapper when given a slot option', () => {
      const { value, error } = buildPollIcs(SLOT_INPUT);

      expect(error).toBeUndefined();
      expect(value).toBeDefined();

      const ics = value as string;
      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('VERSION:2.0');
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain('END:VEVENT');
      expect(ics).toContain('END:VCALENDAR');
    });

    it('should use CRLF line endings as RFC 5545 requires', () => {
      const ics = buildPollIcs(SLOT_INPUT).value as string;

      expect(ics).toContain('\r\n');
      // No bare LF: every LF must be preceded by a CR.
      expect(/[^\r]\n/.test(ics)).toBe(false);
    });

    it('should keep every content line within the 75-octet fold limit', () => {
      const ics = buildPollIcs({
        ...SLOT_INPUT,
        agenda: 'A'.repeat(400),
      }).value as string;

      for (const line of ics.split('\r\n')) {
        expect(Buffer.byteLength(line, 'utf8')).toBeLessThanOrEqual(75);
      }
    });
  });

  describe('DTSTART is a UTC instant', () => {
    it('should emit DTSTART as a UTC instant with a trailing Z, never a floating local time', () => {
      const ics = buildPollIcs(SLOT_INPUT).value as string;

      // 18:30Z — the stored instant, not the 19:30 London wall clock.
      expect(lineFor(ics, 'DTSTART')).toBe('DTSTART:20260704T183000Z');
    });

    it('should emit DTEND as a UTC instant with a trailing Z', () => {
      const ics = buildPollIcs(SLOT_INPUT).value as string;

      expect(lineFor(ics, 'DTEND')).toBe('DTEND:20260704T200000Z');
    });

    it('should not emit a TZID parameter on a slot option', () => {
      const ics = buildPollIcs(SLOT_INPUT).value as string;

      expect(ics).not.toContain('TZID');
    });

    it('should hold the instant across the BST boundary rather than re-reading the wall clock', () => {
      // 00:30 BST on 5 July is 23:30Z on the 4th. The .ics must carry the
      // instant, so the date in UTC is legitimately the previous day.
      const ics = buildPollIcs({
        ...SLOT_INPUT,
        startsAt: '2026-07-04T23:30:00.000Z',
        endsAt: '2026-07-05T00:30:00.000Z',
      }).value as string;

      expect(lineFor(ics, 'DTSTART')).toBe('DTSTART:20260704T233000Z');
      expect(lineFor(ics, 'DTEND')).toBe('DTEND:20260705T003000Z');
    });
  });

  describe('all-day events', () => {
    it('should emit DTSTART as a VALUE=DATE with no zone conversion when the option is date-only', () => {
      const ics = buildPollIcs(DATE_INPUT).value as string;

      expect(lineFor(ics, 'DTSTART')).toBe('DTSTART;VALUE=DATE:20260704');
      expect(ics).not.toContain('T000000Z');
    });

    it('should emit an exclusive DTEND of the next day', () => {
      const ics = buildPollIcs(DATE_INPUT).value as string;

      expect(lineFor(ics, 'DTEND')).toBe('DTEND;VALUE=DATE:20260705');
    });
  });

  describe('nextCalendarDay', () => {
    it('should roll over the month end', () => {
      expect(nextCalendarDay('2026-07-31')).toEqual([2026, 8, 1]);
    });

    it('should roll over the year end', () => {
      expect(nextCalendarDay('2026-12-31')).toEqual([2027, 1, 1]);
    });

    it('should roll over a leap day', () => {
      expect(nextCalendarDay('2028-02-28')).toEqual([2028, 2, 29]);
    });

    it('should cross the spring-forward boundary without dropping a day', () => {
      // 29 March 2026 is when the UK clocks go forward. A 24-hour arithmetic
      // step in a local zone lands back on the 29th; this must not.
      expect(nextCalendarDay('2026-03-29')).toEqual([2026, 3, 30]);
    });
  });

  describe('the VEVENT fields', () => {
    it('should key the UID on the poll, not the option, so a re-confirm supersedes', () => {
      const ics = buildPollIcs(SLOT_INPUT).value as string;

      expect(lineFor(ics, 'UID')).toBe(`UID:${SLOT_INPUT.pollId}@orangejelly.co.uk`);
    });

    it('should keep the UID stable across a re-confirm while the sequence rises', () => {
      const first = buildPollIcs(SLOT_INPUT).value as string;
      const second = buildPollIcs({ ...SLOT_INPUT, confirmSequence: 1 }).value as string;

      expect(lineFor(first, 'UID')).toBe(lineFor(second, 'UID'));
      expect(lineFor(first, 'SEQUENCE')).toBe('SEQUENCE:0');
      expect(lineFor(second, 'SEQUENCE')).toBe('SEQUENCE:1');
    });

    it('should use METHOD:PUBLISH, never REQUEST, since the VEVENT carries no ATTENDEE', () => {
      const ics = buildPollIcs(SLOT_INPUT).value as string;

      expect(ics).toContain('METHOD:PUBLISH');
      expect(ics).not.toContain('METHOD:REQUEST');
      expect(ics).not.toContain('ATTENDEE');
    });

    it('should mark the event CONFIRMED and carry the Orange Jelly product id', () => {
      const ics = buildPollIcs(SLOT_INPUT).value as string;

      expect(ics).toContain('STATUS:CONFIRMED');
      expect(ics).toContain(ICS_PRODUCT_ID);
    });

    it('should emit DTSTAMP as a UTC instant', () => {
      const ics = buildPollIcs(SLOT_INPUT).value as string;

      expect(lineFor(ics, 'DTSTAMP')).toMatch(/^DTSTAMP:\d{8}T\d{6}Z$/);
    });

    it('should put the agenda in DESCRIPTION, which is why the field exists', () => {
      const ics = buildPollIcs({
        ...SLOT_INPUT,
        agenda: 'Budget review\nStaffing',
      }).value as string;

      const description = lineFor(ics, 'DESCRIPTION') as string;
      expect(description).toContain('Agenda:');
      expect(description).toContain('Budget review');
      expect(description).toContain('Staffing');
    });

    it('should include the poll link in DESCRIPTION', () => {
      const ics = buildPollIcs(SLOT_INPUT).value as string;

      expect(lineFor(ics, 'DESCRIPTION')).toContain(SLOT_INPUT.participantUrl);
    });

    it('should omit LOCATION when the poll has none', () => {
      const ics = buildPollIcs(SLOT_INPUT).value as string;

      expect(ics).not.toContain('LOCATION');
    });

    it('should emit LOCATION when the poll has one', () => {
      const ics = buildPollIcs({ ...SLOT_INPUT, location: 'The Anchor, Stanwell Moor' })
        .value as string;

      expect(lineFor(ics, 'LOCATION')).toContain('The Anchor');
    });

    it('should escape a comma in the title rather than splitting the property', () => {
      const ics = buildPollIcs({ ...SLOT_INPUT, title: 'Planning, budget and staffing' })
        .value as string;

      // RFC 5545 escapes a comma in a TEXT value. An unescaped one would be
      // read as a value separator and silently truncate the summary.
      expect(lineFor(ics, 'SUMMARY')).toBe('SUMMARY:Planning\\, budget and staffing');
    });

    it('should not HTML-escape the title — entities in a calendar entry are a bug', () => {
      const ics = buildPollIcs({ ...SLOT_INPUT, title: 'Pete & Billy catch-up' }).value as string;

      expect(lineFor(ics, 'SUMMARY')).toContain('Pete & Billy');
      expect(ics).not.toContain('&amp;');
    });
  });

  describe('failure', () => {
    it('should return an error rather than throwing when a slot option is missing its times', () => {
      const result = buildPollIcs({ ...SLOT_INPUT, startsAt: null });

      expect(result.value).toBeUndefined();
      expect(result.error).toContain('missing starts_at');
    });

    it('should return an error rather than throwing when a date option is missing its date', () => {
      const result = buildPollIcs({ ...DATE_INPUT, optionDate: null });

      expect(result.value).toBeUndefined();
      expect(result.error).toContain('missing option_date');
    });

    it('should return an error rather than throwing on an unparseable instant', () => {
      const result = buildPollIcs({ ...SLOT_INPUT, startsAt: 'not-a-date' });

      expect(result.value).toBeUndefined();
      expect(result.error).toContain('Invalid instant');
    });
  });
});

describe('buildCalendarLinks', () => {
  describe('Google', () => {
    it('should render a slot as a UTC instant range', () => {
      const { googleUrl } = buildCalendarLinks(SLOT_INPUT);

      expect(googleUrl).toContain('dates=20260704T183000Z/20260704T200000Z');
      expect(googleUrl).toContain('action=TEMPLATE');
    });

    it('should render a date-only option as an exclusive all-day range', () => {
      const { googleUrl } = buildCalendarLinks(DATE_INPUT);

      expect(googleUrl).toContain('dates=20260704/20260705');
    });

    it('should encode the title', () => {
      const { googleUrl } = buildCalendarLinks({ ...SLOT_INPUT, title: 'Pete & Billy' });

      expect(googleUrl).toContain('text=Pete%20%26%20Billy');
    });

    it('should omit the location parameter entirely when the poll has none', () => {
      const { googleUrl } = buildCalendarLinks(SLOT_INPUT);

      expect(googleUrl).not.toContain('location=');
    });

    it('should include an encoded location when the poll has one', () => {
      const { googleUrl } = buildCalendarLinks({
        ...SLOT_INPUT,
        location: 'The Anchor, Stanwell Moor',
      });

      expect(googleUrl).toContain('location=The%20Anchor%2C%20Stanwell%20Moor');
    });
  });

  describe('Outlook', () => {
    it('should render a slot with ISO 8601 instants carrying the Z', () => {
      const { outlookUrl } = buildCalendarLinks(SLOT_INPUT);

      expect(outlookUrl).toContain(`startdt=${encodeURIComponent('2026-07-04T18:30:00.000Z')}`);
      expect(outlookUrl).toContain(`enddt=${encodeURIComponent('2026-07-04T20:00:00.000Z')}`);
      expect(outlookUrl).not.toContain('allday=true');
    });

    it('should mark a date-only option all-day with an exclusive end and no clock reading', () => {
      const { outlookUrl } = buildCalendarLinks(DATE_INPUT);

      expect(outlookUrl).toContain('allday=true');
      expect(outlookUrl).toContain('startdt=2026-07-04');
      expect(outlookUrl).toContain('enddt=2026-07-05');
    });
  });

  it('should throw on a malformed option, so the caller catches it before any send', () => {
    expect(() => buildCalendarLinks({ ...SLOT_INPUT, endsAt: null })).toThrow(/missing/);
  });
});
