import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  LONDON_TIME_ZONE,
  getTodayIsoDate,
  toLocalIsoDate,
  formatDateInLondon,
  formatSlotInLondon,
  formatSlotRangeInLondon,
  londonWallClockToInstant,
  isValidIsoDate,
  compareIsoDates,
} from './dateUtils';

/**
 * These tests exist because a one-hour offset error is the single fastest way to
 * lose a user's trust in a scheduling tool. Vercel lambdas run in UTC and every
 * user is in Europe/London, so the two only agree for part of the year. Both DST
 * boundaries are covered deliberately: in spring an hour does not exist, and in
 * autumn one happens twice.
 */

afterEach(() => {
  vi.useRealTimers();
});

describe('LONDON_TIME_ZONE', () => {
  it('is an IANA zone id, never a fixed offset', () => {
    // A fixed offset such as '+01:00' silently breaks twice a year.
    expect(LONDON_TIME_ZONE).toBe('Europe/London');
  });
});

describe('getTodayIsoDate', () => {
  it('returns the London date, not the UTC date, when the two disagree', () => {
    // 23:30 UTC on 30 June is already 00:30 on 1 July in London (BST, UTC+1).
    // A naive toISOString() would report 30 June and put the poll a day out.
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-30T23:30:00Z'));

    expect(getTodayIsoDate()).toBe('2026-07-01');
  });

  it('agrees with UTC in winter, when London is GMT', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T23:30:00Z'));

    expect(getTodayIsoDate()).toBe('2026-01-15');
  });
});

describe('toLocalIsoDate', () => {
  it('converts an instant to the London calendar date', () => {
    expect(toLocalIsoDate(new Date('2026-06-30T23:30:00Z'))).toBe('2026-07-01');
  });

  it('does not shift the date in winter', () => {
    expect(toLocalIsoDate(new Date('2026-01-15T23:30:00Z'))).toBe('2026-01-15');
  });

  it('accepts an ISO string as well as a Date', () => {
    expect(toLocalIsoDate('2026-06-30T23:30:00Z')).toBe('2026-07-01');
  });
});

describe('formatDateInLondon — date-only options', () => {
  it('formats a date-only string without any timezone conversion', () => {
    // The critical case. A date-only option is a calendar date, not an instant.
    // Parsing '2026-07-04' as UTC midnight and rendering it in London is fine,
    // but doing the reverse for a viewer west of London yields 3 July. A
    // date-only value must never be run through a zone conversion at all.
    expect(formatDateInLondon('2026-07-04')).toBe('Saturday, 4 July 2026');
  });

  it('holds the date on the spring DST boundary', () => {
    // 29 March 2026 is the spring-forward day: 01:00 GMT becomes 02:00 BST.
    expect(formatDateInLondon('2026-03-29')).toBe('Sunday, 29 March 2026');
  });

  it('holds the date on the autumn DST boundary', () => {
    // 25 October 2026 is the fall-back day: 02:00 BST becomes 01:00 GMT.
    expect(formatDateInLondon('2026-10-25')).toBe('Sunday, 25 October 2026');
  });

  it('holds the date on 1 January, where an off-by-one crosses a year', () => {
    expect(formatDateInLondon('2026-01-01')).toBe('Thursday, 1 January 2026');
  });

  it('supports a short format for compact UI', () => {
    expect(formatDateInLondon('2026-07-04', 'short')).toBe('Sat 4 Jul');
  });

  it('rejects an instant, which would mean a date-only value was mistyped', () => {
    expect(() => formatDateInLondon('2026-07-04T12:00:00Z')).toThrow(/date-only/i);
  });
});

describe('formatSlotInLondon — timed options', () => {
  it('renders a UTC instant in BST during summer', () => {
    // 18:00 UTC in July is 19:00 in London.
    expect(formatSlotInLondon('2026-07-04T18:00:00Z')).toBe('Saturday, 4 July 2026 at 7:00pm');
  });

  it('renders a UTC instant in GMT during winter', () => {
    // 18:00 UTC in January is 18:00 in London.
    expect(formatSlotInLondon('2026-01-15T18:00:00Z')).toBe('Thursday, 15 January 2026 at 6:00pm');
  });

  it('renders half-hours correctly', () => {
    expect(formatSlotInLondon('2026-07-04T18:30:00Z')).toBe('Saturday, 4 July 2026 at 7:30pm');
  });

  it('renders midday as noon, not 12:00am', () => {
    expect(formatSlotInLondon('2026-01-15T12:00:00Z')).toBe('Thursday, 15 January 2026 at 12:00pm');
  });

  it('renders midnight as 12:00am', () => {
    expect(formatSlotInLondon('2026-01-15T00:00:00Z')).toBe('Thursday, 15 January 2026 at 12:00am');
  });

  it('crosses the date boundary when London is ahead of UTC', () => {
    // 23:30 UTC on 4 July is 00:30 on 5 July in London.
    expect(formatSlotInLondon('2026-07-04T23:30:00Z')).toBe('Sunday, 5 July 2026 at 12:30am');
  });

  it('rejects a date-only value rather than inventing a time for it', () => {
    // The guard must run BOTH ways. formatDateInLondon already refuses an
    // instant, but without this the reverse slipped through: '2026-07-04' parsed
    // as UTC midnight and rendered in London as "4 July 2026 at 1:00am" — a time
    // nobody chose, presented as fact. A date-only option carries no time, so
    // asking for its time is a caller bug, not a formatting question.
    expect(() => formatSlotInLondon('2026-07-04')).toThrow(/date-only/i);
  });

  it('rejects a timestamp with no zone, which would silently mean two things', () => {
    // '2026-07-04T19:00:00' is parsed as LOCAL time. On a Vercel lambda that is
    // UTC; on a developer's laptop in London it is BST. Same string, two
    // instants an hour apart, and the bug only shows in production.
    expect(() => formatSlotInLondon('2026-07-04T19:00:00')).toThrow(/timezone|offset/i);
  });

  it('accepts an explicit positive offset, not only Z', () => {
    // 19:00+01:00 is 18:00 UTC, which is 19:00 in London in July.
    expect(formatSlotInLondon('2026-07-04T19:00:00+01:00')).toBe('Saturday, 4 July 2026 at 7:00pm');
  });

  it('still accepts a Date object, which is always unambiguous', () => {
    expect(formatSlotInLondon(new Date('2026-07-04T18:00:00Z'))).toBe(
      'Saturday, 4 July 2026 at 7:00pm'
    );
  });
});

describe('formatSlotRangeInLondon', () => {
  it('collapses a same-day range to one date with both times', () => {
    expect(formatSlotRangeInLondon('2026-07-04T18:00:00Z', '2026-07-04T19:30:00Z')).toBe(
      'Saturday, 4 July 2026, 7:00pm – 8:30pm'
    );
  });

  it('spells both dates out when a range crosses midnight', () => {
    expect(formatSlotRangeInLondon('2026-07-04T22:00:00Z', '2026-07-04T23:30:00Z')).toBe(
      'Saturday, 4 July 2026, 11:00pm – Sunday, 5 July 2026, 12:30am'
    );
  });

  it('rejects an end at or before the start', () => {
    expect(() => formatSlotRangeInLondon('2026-07-04T19:00:00Z', '2026-07-04T18:00:00Z')).toThrow(
      /after/i
    );
  });
});

describe('londonWallClockToInstant — the DST trap', () => {
  it('converts a summer wall-clock time to the correct UTC instant', () => {
    // An organiser typing "7pm on 4 July" means 19:00 BST, which is 18:00 UTC.
    expect(londonWallClockToInstant('2026-07-04', '19:00').toISOString()).toBe(
      '2026-07-04T18:00:00.000Z'
    );
  });

  it('converts a winter wall-clock time to the correct UTC instant', () => {
    // "6pm on 15 January" means 18:00 GMT, which is 18:00 UTC.
    expect(londonWallClockToInstant('2026-01-15', '18:00').toISOString()).toBe(
      '2026-01-15T18:00:00.000Z'
    );
  });

  it('handles the hour before the spring-forward gap', () => {
    // 00:30 on 29 March 2026 is still GMT.
    expect(londonWallClockToInstant('2026-03-29', '00:30').toISOString()).toBe(
      '2026-03-29T00:30:00.000Z'
    );
  });

  it('handles the hour after the spring-forward gap', () => {
    // 03:00 BST on 29 March 2026 is 02:00 UTC.
    expect(londonWallClockToInstant('2026-03-29', '03:00').toISOString()).toBe(
      '2026-03-29T02:00:00.000Z'
    );
  });

  it('rejects a wall-clock time that does not exist, rather than inventing one', () => {
    // 01:30 on 29 March 2026 never happens — the clock jumps 01:00 to 02:00.
    // Silently coercing this is how a poll ends up an hour out.
    expect(() => londonWallClockToInstant('2026-03-29', '01:30')).toThrow(/does not exist/i);
  });

  it('resolves an ambiguous autumn time to the first (BST) occurrence, explicitly', () => {
    // 01:30 on 25 October 2026 happens twice: once at 00:30 UTC (BST) and again
    // at 01:30 UTC (GMT). Picking the earlier is a decision, not an accident.
    expect(londonWallClockToInstant('2026-10-25', '01:30').toISOString()).toBe(
      '2026-10-25T00:30:00.000Z'
    );
  });

  it('round-trips a summer slot back to the same wall-clock time', () => {
    const instant = londonWallClockToInstant('2026-07-04', '19:00');
    expect(formatSlotInLondon(instant)).toBe('Saturday, 4 July 2026 at 7:00pm');
  });

  it('round-trips a winter slot back to the same wall-clock time', () => {
    const instant = londonWallClockToInstant('2026-01-15', '18:00');
    expect(formatSlotInLondon(instant)).toBe('Thursday, 15 January 2026 at 6:00pm');
  });

  it('rejects a malformed time', () => {
    expect(() => londonWallClockToInstant('2026-07-04', '25:00')).toThrow(/time/i);
  });

  it('rejects a malformed date', () => {
    expect(() => londonWallClockToInstant('4 July 2026', '19:00')).toThrow(/date/i);
  });
});

describe('isValidIsoDate', () => {
  it('accepts a well-formed date', () => {
    expect(isValidIsoDate('2026-07-04')).toBe(true);
  });

  it.each([
    ['2026-02-30', 'a day that does not exist'],
    ['2026-13-01', 'a month that does not exist'],
    ['26-07-04', 'a two-digit year'],
    ['2026-7-4', 'unpadded parts'],
    ['2026-07-04T12:00:00Z', 'an instant'],
    ['', 'an empty string'],
    ['not a date', 'prose'],
  ])('rejects %s (%s)', (input) => {
    expect(isValidIsoDate(input)).toBe(false);
  });

  it('accepts a leap day in a leap year', () => {
    expect(isValidIsoDate('2028-02-29')).toBe(true);
  });

  it('rejects a leap day in a non-leap year', () => {
    expect(isValidIsoDate('2026-02-29')).toBe(false);
  });
});

describe('compareIsoDates', () => {
  it('orders dates chronologically', () => {
    expect(compareIsoDates('2026-07-04', '2026-07-05')).toBeLessThan(0);
    expect(compareIsoDates('2026-07-05', '2026-07-04')).toBeGreaterThan(0);
    expect(compareIsoDates('2026-07-04', '2026-07-04')).toBe(0);
  });

  it('sorts a list without lexical surprises across year and month ends', () => {
    const sorted = ['2026-12-31', '2026-01-01', '2026-07-04'].sort(compareIsoDates);
    expect(sorted).toEqual(['2026-01-01', '2026-07-04', '2026-12-31']);
  });
});
