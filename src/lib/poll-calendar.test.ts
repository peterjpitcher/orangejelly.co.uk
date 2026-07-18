import { describe, it, expect } from 'vitest';

import { londonWallClockToInstant } from './dateUtils';
import {
  addDaysIso,
  addMonthsIso,
  buildTimeRows,
  computeSlotEnd,
  describeDateCell,
  describeSlotCell,
  formatDayLabel,
  formatDurationLabel,
  formatMonthLabel,
  formatWallClockLabel,
  formatWeekRangeLabel,
  parseDurationInput,
  DURATION_CHOICES,
  MAX_CUSTOM_DURATION_MINUTES,
  MIN_CUSTOM_DURATION_MINUTES,
  isOutsideMonth,
  isPastDate,
  isPastSlot,
  londonOffsetLabel,
  londonWallClockExists,
  londonWallClockInstantOrNull,
  londonZoneLabel,
  minutesFromWallClock,
  monthGridWeeks,
  rowStepMinutes,
  slotKey,
  startOfMonthIso,
  startOfWeekIso,
  wallClockFromMinutes,
  weekDaysIso,
  DEFAULT_LAST_HOUR,
} from './poll-calendar';

/**
 * The grid's maths, tested where it can actually be tested.
 *
 * A component test renders a grid and asserts a cell is disabled; it cannot tell
 * you *why*, and it will happily pass against a grid that disables the right
 * cell on the wrong day for the wrong reason. Every DST case below is here
 * rather than in the component test for that reason.
 *
 * The two dates that matter in 2026:
 *   - 29 March, when 01:00 → 02:00 and the 01:00 hour does not exist.
 *   - 25 October, when 01:00 → 01:00 and the 01:00 hour happens twice.
 */

const SPRING_FORWARD = '2026-03-29';
const AUTUMN_BACK = '2026-10-25';

describe('addDaysIso', () => {
  it('adds a day', () => {
    expect(addDaysIso('2026-07-14', 1)).toBe('2026-07-15');
  });

  it('subtracts a day', () => {
    expect(addDaysIso('2026-07-14', -1)).toBe('2026-07-13');
  });

  it('rolls over a month boundary', () => {
    expect(addDaysIso('2026-07-31', 1)).toBe('2026-08-01');
  });

  it('rolls over a year boundary', () => {
    expect(addDaysIso('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('handles a leap day', () => {
    expect(addDaysIso('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDaysIso('2028-02-29', 1)).toBe('2028-03-01');
  });

  it('does not shift the date across the spring-forward day', () => {
    // The classic failure: a local Date built at midnight on a DST day lands an
    // hour out and the date arithmetic silently loses or repeats a day.
    expect(addDaysIso('2026-03-28', 1)).toBe(SPRING_FORWARD);
    expect(addDaysIso(SPRING_FORWARD, 1)).toBe('2026-03-30');
  });

  it('does not shift the date across the autumn fall-back day', () => {
    expect(addDaysIso('2026-10-24', 1)).toBe(AUTUMN_BACK);
    expect(addDaysIso(AUTUMN_BACK, 1)).toBe('2026-10-26');
  });
});

describe('startOfWeekIso', () => {
  it('returns the Monday of a midweek date', () => {
    // 14 July 2026 is a Tuesday.
    expect(startOfWeekIso('2026-07-14')).toBe('2026-07-13');
  });

  it('returns the date itself when it is already a Monday', () => {
    expect(startOfWeekIso('2026-07-13')).toBe('2026-07-13');
  });

  it('treats Sunday as the end of the week, not the start', () => {
    // 19 July 2026 is a Sunday; its week began on the 13th.
    expect(startOfWeekIso('2026-07-19')).toBe('2026-07-13');
  });

  it('reaches back across a month boundary', () => {
    // 1 July 2026 is a Wednesday.
    expect(startOfWeekIso('2026-07-01')).toBe('2026-06-29');
  });
});

describe('weekDaysIso', () => {
  it('returns seven consecutive days, Monday first', () => {
    expect(weekDaysIso('2026-07-13')).toEqual([
      '2026-07-13',
      '2026-07-14',
      '2026-07-15',
      '2026-07-16',
      '2026-07-17',
      '2026-07-18',
      '2026-07-19',
    ]);
  });

  it('returns seven days across the spring-forward week', () => {
    const days = weekDaysIso('2026-03-23');
    expect(days).toHaveLength(7);
    expect(days).toContain(SPRING_FORWARD);
    expect(new Set(days).size).toBe(7);
  });
});

describe('formatWeekRangeLabel', () => {
  it('names the month once when the week sits inside one', () => {
    expect(formatWeekRangeLabel('2026-07-13')).toBe('13 – 19 July');
  });

  it('names both months when the week straddles two', () => {
    expect(formatWeekRangeLabel('2026-06-29')).toBe('29 June – 5 July');
  });

  it('names the year when the week straddles two', () => {
    expect(formatWeekRangeLabel('2026-12-28')).toBe('28 Dec 2026 – 3 Jan 2027');
  });
});

describe('startOfMonthIso / addMonthsIso / formatMonthLabel', () => {
  it('finds the first of the month', () => {
    expect(startOfMonthIso('2026-07-14')).toBe('2026-07-01');
  });

  it('steps forward a month', () => {
    expect(addMonthsIso('2026-07-01', 1)).toBe('2026-08-01');
  });

  it('steps back across a year boundary', () => {
    expect(addMonthsIso('2026-01-01', -1)).toBe('2025-12-01');
  });

  it('steps forward across a year boundary', () => {
    expect(addMonthsIso('2026-12-01', 1)).toBe('2027-01-01');
  });

  it('steps from a long month to a short one without overflowing', () => {
    // 31 January + 1 month must not become 3 March.
    expect(addMonthsIso('2026-01-31', 1)).toBe('2026-02-01');
  });

  it('labels the month', () => {
    expect(formatMonthLabel('2026-07-14')).toBe('July 2026');
  });
});

describe('monthGridWeeks', () => {
  it('returns whole Monday-to-Sunday weeks', () => {
    const weeks = monthGridWeeks('2026-07-01');
    for (const week of weeks) {
      expect(week).toHaveLength(7);
    }
    expect(weeks[0][0]).toBe('2026-06-29'); // The Monday before 1 July.
    expect(weeks[weeks.length - 1][6]).toBe('2026-08-02'); // The Sunday after 31 July.
  });

  it('contains every day of the month exactly once', () => {
    const days = monthGridWeeks('2026-07-01').flat();
    const julyDays = days.filter((day) => day.startsWith('2026-07'));
    expect(julyDays).toHaveLength(31);
    expect(new Set(julyDays).size).toBe(31);
  });

  it('handles a February that starts on a Sunday', () => {
    // 1 February 2026 is a Sunday — the worst case for a leading row.
    const weeks = monthGridWeeks('2026-02-01');
    expect(weeks[0]).toContain('2026-02-01');
    expect(weeks.flat().filter((day) => day.startsWith('2026-02'))).toHaveLength(28);
  });

  it('handles a leap February', () => {
    expect(
      monthGridWeeks('2028-02-01')
        .flat()
        .filter((d) => d.startsWith('2028-02'))
    ).toHaveLength(29);
  });

  it('flags days outside the month being displayed', () => {
    expect(isOutsideMonth('2026-06-29', '2026-07-01')).toBe(true);
    expect(isOutsideMonth('2026-07-14', '2026-07-01')).toBe(false);
  });
});

describe('londonOffsetLabel', () => {
  it('reports GMT in winter', () => {
    expect(londonOffsetLabel('2026-01-15')).toBe('GMT');
  });

  it('reports GMT+1 in summer', () => {
    expect(londonOffsetLabel('2026-07-14')).toBe('GMT+1');
  });

  it('reports GMT+1 on the spring-forward day itself', () => {
    // The clocks go forward at 01:00, so the day as a whole is BST.
    expect(londonOffsetLabel(SPRING_FORWARD)).toBe('GMT+1');
  });

  it('reports GMT on the autumn fall-back day itself', () => {
    // The clocks go back at 02:00, so the day as a whole is GMT.
    expect(londonOffsetLabel(AUTUMN_BACK)).toBe('GMT');
  });

  it('reports GMT the day before the clocks go forward', () => {
    expect(londonOffsetLabel('2026-03-28')).toBe('GMT');
  });

  it('reports GMT+1 the day before the clocks go back', () => {
    expect(londonOffsetLabel('2026-10-24')).toBe('GMT+1');
  });
});

describe('londonZoneLabel', () => {
  it('states the zone and the computed offset', () => {
    expect(londonZoneLabel('2026-07-14')).toBe('United Kingdom, London (GMT+1)');
  });

  it('states the winter offset without a sign', () => {
    expect(londonZoneLabel('2026-01-15')).toBe('United Kingdom, London (GMT)');
  });

  it('never hardcodes an offset — the same label differs across the year', () => {
    // The bug this guards: shipping "(GMT+1)" as a constant, which is wrong for
    // roughly half the year in a tool whose only job is being right about time.
    expect(londonZoneLabel('2026-01-15')).not.toBe(londonZoneLabel('2026-07-14'));
  });
});

describe('formatWallClockLabel', () => {
  it('renders an afternoon time', () => {
    expect(formatWallClockLabel('14:00')).toBe('2:00pm');
  });

  it('renders a morning time', () => {
    expect(formatWallClockLabel('09:30')).toBe('9:30am');
  });

  it('renders midnight as 12am, not 0am', () => {
    expect(formatWallClockLabel('00:00')).toBe('12:00am');
  });

  it('renders noon as 12pm, not 0pm', () => {
    expect(formatWallClockLabel('12:00')).toBe('12:00pm');
  });

  it('renders a quarter past eleven at night', () => {
    expect(formatWallClockLabel('23:15')).toBe('11:15pm');
  });
});

describe('minutesFromWallClock / wallClockFromMinutes', () => {
  it('converts to minutes', () => {
    expect(minutesFromWallClock('14:30')).toBe(870);
    expect(minutesFromWallClock('00:00')).toBe(0);
  });

  it('converts back', () => {
    expect(wallClockFromMinutes(870)).toBe('14:30');
    expect(wallClockFromMinutes(0)).toBe('00:00');
  });

  it('wraps past midnight', () => {
    expect(wallClockFromMinutes(24 * 60)).toBe('00:00');
    expect(wallClockFromMinutes(25 * 60)).toBe('01:00');
  });

  it('pads to two digits both sides', () => {
    expect(wallClockFromMinutes(9 * 60 + 5)).toBe('09:05');
  });
});

describe('rowStepMinutes', () => {
  it('gives quarter-hour rows for a quarter-hour duration', () => {
    expect(rowStepMinutes(15)).toBe(15);
  });

  it('gives half-hour rows for a half-hour duration', () => {
    expect(rowStepMinutes(30)).toBe(30);
  });

  it('caps at the hour for long durations, so starts land on the hour', () => {
    expect(rowStepMinutes(90)).toBe(60);
    expect(rowStepMinutes(120)).toBe(60);
    expect(rowStepMinutes(600)).toBe(60);
  });
});

describe('buildTimeRows', () => {
  it('runs 08:00 to 23:00 by default', () => {
    const rows = buildTimeRows(60);
    expect(rows[0]).toBe('08:00');
    expect(rows[rows.length - 1]).toBe(`${DEFAULT_LAST_HOUR}:00`);
  });

  it('offers 23:00 — the start of the overnight case Peter asked for', () => {
    expect(buildTimeRows(120)).toContain('23:00');
  });

  it('steps by the duration for sub-hour durations', () => {
    const rows = buildTimeRows(15);
    expect(rows.slice(0, 4)).toEqual(['08:00', '08:15', '08:30', '08:45']);
  });

  it('covers the whole day when expanded', () => {
    const rows = buildTimeRows(60, true);
    expect(rows[0]).toBe('00:00');
    expect(rows[rows.length - 1]).toBe('23:00');
    expect(rows).toHaveLength(24);
  });

  it('never emits a duplicate or an out-of-order row', () => {
    const rows = buildTimeRows(15, true);
    expect(new Set(rows).size).toBe(rows.length);
    expect([...rows].sort()).toEqual(rows);
  });
});

describe('computeSlotEnd', () => {
  it('adds an hour', () => {
    expect(computeSlotEnd('2026-07-14', '14:00', 60)).toEqual({
      date: '2026-07-14',
      startTime: '14:00',
      endTime: '15:00',
      endsNextDay: false,
    });
  });

  it('adds fifteen minutes', () => {
    expect(computeSlotEnd('2026-07-14', '14:00', 15)).toMatchObject({
      endTime: '14:15',
      endsNextDay: false,
    });
  });

  it('adds ninety minutes across an hour boundary', () => {
    expect(computeSlotEnd('2026-07-14', '14:30', 90)).toMatchObject({
      endTime: '16:00',
      endsNextDay: false,
    });
  });

  it('rolls over midnight and flags the next day', () => {
    // Peter's case, verbatim: 23:00 + 120 min.
    expect(computeSlotEnd('2026-07-14', '23:00', 120)).toEqual({
      date: '2026-07-14',
      startTime: '23:00',
      endTime: '01:00',
      endsNextDay: true,
    });
  });

  it('treats an end of exactly midnight as the next day', () => {
    // 23:00 + 60 min ends at 00:00 — which is tomorrow's midnight, not today's.
    // Getting this wrong makes the slot run backwards by 23 hours.
    expect(computeSlotEnd('2026-07-14', '23:00', 60)).toEqual({
      date: '2026-07-14',
      startTime: '23:00',
      endTime: '00:00',
      endsNextDay: true,
    });
  });

  it('rolls a four-hour slot over midnight', () => {
    // The amendment's case, verbatim: 22:00 + 4 hours.
    expect(computeSlotEnd('2026-07-14', '22:00', 240)).toEqual({
      date: '2026-07-14',
      startTime: '22:00',
      endTime: '02:00',
      endsNextDay: true,
    });
  });

  it('rolls a four-hour slot starting at 21:00 over midnight', () => {
    // The longer durations make the overnight case MORE likely, not less: a
    // 4-hour slot crosses midnight from 21:00 onwards, which on the old 2-hour
    // ceiling it never did.
    expect(computeSlotEnd('2026-07-14', '21:00', 240)).toMatchObject({
      endTime: '01:00',
      endsNextDay: true,
    });
  });

  it('does not roll a three-hour slot that finishes at midnight exactly', () => {
    expect(computeSlotEnd('2026-07-14', '20:00', 180)).toMatchObject({
      endTime: '23:00',
      endsNextDay: false,
    });
  });

  it('rolls every long duration that crosses midnight, and no others', () => {
    for (const minutes of [180, 240]) {
      for (const start of ['18:00', '20:00', '21:00', '22:00', '23:00']) {
        const slot = computeSlotEnd('2026-07-14', start, minutes);
        const crossed = minutesFromWallClock(start) + minutes >= 24 * 60;
        expect(slot.endsNextDay).toBe(crossed);
      }
    }
  });

  it('treats a full 24 hours as the next day', () => {
    expect(computeSlotEnd('2026-07-14', '10:00', 24 * 60)).toEqual({
      date: '2026-07-14',
      startTime: '10:00',
      endTime: '10:00',
      endsNextDay: true,
    });
  });

  it('does not flag the next day for a slot ending at 23:59', () => {
    expect(computeSlotEnd('2026-07-14', '23:00', 59)).toMatchObject({
      endTime: '23:59',
      endsNextDay: false,
    });
  });

  it('never asks the organiser to work out the rollover', () => {
    // endsNextDay is derived from the arithmetic on every path. There is no
    // input to computeSlotEnd that could carry a hand-ticked flag.
    for (const start of ['22:00', '23:00', '23:45']) {
      const slot = computeSlotEnd('2026-07-14', start, 120);
      const crossed = minutesFromWallClock(start) + 120 >= 24 * 60;
      expect(slot.endsNextDay).toBe(crossed);
    }
  });
});

describe('DURATION_CHOICES', () => {
  it('offers the lengths a pub event actually runs, up to four hours', () => {
    expect([...DURATION_CHOICES]).toEqual([15, 30, 60, 90, 120, 180, 240]);
  });

  it('holds minutes, not hours — minutes is the stored unit throughout', () => {
    for (const choice of DURATION_CHOICES) {
      expect(Number.isInteger(choice)).toBe(true);
    }
  });
});

describe('formatDurationLabel', () => {
  it('keeps sub-hour lengths in minutes', () => {
    expect(formatDurationLabel(15)).toBe('15 min');
    expect(formatDurationLabel(30)).toBe('30 min');
    expect(formatDurationLabel(45)).toBe('45 min');
  });

  it('says "1 hour", not "60 min"', () => {
    expect(formatDurationLabel(60)).toBe('1 hour');
  });

  it('says "2 hours", not "120 min"', () => {
    expect(formatDurationLabel(120)).toBe('2 hours');
  });

  it('says "1.5 hours" for ninety minutes', () => {
    expect(formatDurationLabel(90)).toBe('1.5 hours');
  });

  it('labels the long options in hours', () => {
    expect(formatDurationLabel(180)).toBe('3 hours');
    expect(formatDurationLabel(240)).toBe('4 hours');
  });

  it('does not leave a trailing zero on a fractional label', () => {
    expect(formatDurationLabel(150)).toBe('2.5 hours');
  });

  it('labels every offered choice without saying "min" past an hour', () => {
    // The point of the change: one unit across the row once it passes an hour.
    const labels = DURATION_CHOICES.map(formatDurationLabel);
    expect(labels).toEqual([
      '15 min',
      '30 min',
      '1 hour',
      '1.5 hours',
      '2 hours',
      '3 hours',
      '4 hours',
    ]);
  });
});

describe('parseDurationInput', () => {
  it('reads minutes', () => {
    expect(parseDurationInput('45', 'minutes')).toEqual({ minutes: 45 });
  });

  it('reads whole hours', () => {
    // Peter's case: five hours is typed as 5, never as 300.
    expect(parseDurationInput('5', 'hours')).toEqual({ minutes: 300 });
  });

  it('reads fractional hours', () => {
    expect(parseDurationInput('1.5', 'hours')).toEqual({ minutes: 90 });
    expect(parseDurationInput('2.25', 'hours')).toEqual({ minutes: 135 });
  });

  it('tolerates surrounding whitespace', () => {
    expect(parseDurationInput('  2  ', 'hours')).toEqual({ minutes: 120 });
  });

  it('refuses an hours value that does not land on a whole minute', () => {
    // 0.51 hours is 30.6 minutes. Rounding it silently is how a slot becomes a
    // length nobody chose and nothing downstream ever mentions again.
    const result = parseDurationInput('0.51', 'hours');
    expect(result.minutes).toBeUndefined();
    expect(result.error).toContain('whole number of minutes');
  });

  it('refuses a fractional minutes value', () => {
    expect(parseDurationInput('10.5', 'minutes').error).toBeDefined();
  });

  it('does not trip over floating point on a legitimate value', () => {
    // 0.1 * 60 is 6.000000000000001 in IEEE 754. A bare Number.isInteger check
    // would refuse a perfectly good six-minute slot.
    expect(parseDurationInput('0.1', 'hours')).toEqual({ minutes: 6 });
    expect(parseDurationInput('0.7', 'hours')).toEqual({ minutes: 42 });
  });

  it('refuses empty input', () => {
    expect(parseDurationInput('', 'minutes').error).toBeDefined();
    expect(parseDurationInput('   ', 'hours').error).toBeDefined();
  });

  it('refuses text', () => {
    expect(parseDurationInput('soon', 'minutes').error).toBe('Enter a number.');
  });

  it('refuses zero and negatives', () => {
    expect(parseDurationInput('0', 'minutes').error).toBeDefined();
    expect(parseDurationInput('-2', 'hours').error).toBeDefined();
  });

  it('refuses anything under the floor', () => {
    expect(parseDurationInput('4', 'minutes').error).toContain('5 minutes');
  });

  it('accepts exactly the floor', () => {
    expect(parseDurationInput(String(MIN_CUSTOM_DURATION_MINUTES), 'minutes')).toEqual({
      minutes: MIN_CUSTOM_DURATION_MINUTES,
    });
  });

  it('accepts exactly the ceiling, in either unit', () => {
    expect(parseDurationInput('12', 'hours')).toEqual({ minutes: MAX_CUSTOM_DURATION_MINUTES });
    expect(parseDurationInput('720', 'minutes')).toEqual({ minutes: MAX_CUSTOM_DURATION_MINUTES });
  });

  it('refuses anything over the ceiling and points at All day', () => {
    expect(parseDurationInput('13', 'hours').error).toContain('All day');
    expect(parseDurationInput('721', 'minutes').error).toContain('12 hours');
  });
});

describe('londonWallClockInstantOrNull', () => {
  it('resolves a summer wall clock as BST', () => {
    // 14:00 BST is 13:00 UTC.
    expect(londonWallClockInstantOrNull('2026-07-14', '14:00')?.toISOString()).toBe(
      '2026-07-14T13:00:00.000Z'
    );
  });

  it('resolves a winter wall clock as GMT', () => {
    expect(londonWallClockInstantOrNull('2026-01-15', '14:00')?.toISOString()).toBe(
      '2026-01-15T14:00:00.000Z'
    );
  });

  it('returns null inside the spring-forward gap', () => {
    // 01:30 does not happen on 29 March 2026. There is no instant to return.
    expect(londonWallClockInstantOrNull(SPRING_FORWARD, '01:30')).toBeNull();
    expect(londonWallClockInstantOrNull(SPRING_FORWARD, '01:00')).toBeNull();
  });

  it('resolves the hours either side of the gap', () => {
    expect(londonWallClockInstantOrNull(SPRING_FORWARD, '00:30')).not.toBeNull();
    expect(londonWallClockInstantOrNull(SPRING_FORWARD, '02:00')).not.toBeNull();
  });

  it('resolves an ambiguous autumn wall clock rather than refusing it', () => {
    // 01:30 happens twice on 25 October. Both are real; the cell stays offerable.
    expect(londonWallClockInstantOrNull(AUTUMN_BACK, '01:30')).not.toBeNull();
  });

  it('picks the earlier of two ambiguous autumn instants, as dateUtils does', () => {
    // 01:30 on 25 October is 00:30 UTC (BST) and again 01:30 UTC (GMT). dateUtils
    // takes the earlier and so must this — a grid that offers one instant and
    // submits the other is an hour wrong with no way for the user to tell.
    expect(londonWallClockInstantOrNull(AUTUMN_BACK, '01:30')?.toISOString()).toBe(
      '2026-10-25T00:30:00.000Z'
    );
  });

  it('agrees with londonWallClockToInstant on the boundary', () => {
    // This test is the pin between the two implementations. dateUtils throws
    // where this returns null, and the whole DST guarantee rests on them
    // disagreeing about nothing except the shape of the answer.
    const cases: Array<[string, string]> = [
      [SPRING_FORWARD, '00:30'],
      [SPRING_FORWARD, '01:00'],
      [SPRING_FORWARD, '01:30'],
      [SPRING_FORWARD, '02:00'],
      [AUTUMN_BACK, '01:30'],
      ['2026-07-14', '14:00'],
      ['2026-01-15', '09:00'],
    ];

    for (const [date, time] of cases) {
      const ours = londonWallClockInstantOrNull(date, time);
      let theirs: Date | null = null;
      try {
        theirs = londonWallClockToInstant(date, time);
      } catch {
        theirs = null;
      }

      expect(ours === null).toBe(theirs === null);
      if (ours !== null && theirs !== null) {
        expect(ours.toISOString()).toBe(theirs.toISOString());
      }
    }
  });
});

describe('londonWallClockExists', () => {
  it('is false only inside the spring-forward gap', () => {
    expect(londonWallClockExists(SPRING_FORWARD, '01:30')).toBe(false);
    expect(londonWallClockExists(SPRING_FORWARD, '03:00')).toBe(true);
    expect(londonWallClockExists('2026-07-14', '01:30')).toBe(true);
  });

  it('is true for every hour the grid offers by default, on a normal day', () => {
    for (const time of buildTimeRows(60)) {
      expect(londonWallClockExists('2026-07-14', time)).toBe(true);
    }
  });

  it('is true for the whole default window even on the spring-forward day', () => {
    // The gap is at 01:00, which the default 08:00–23:00 window never reaches.
    // If this ever fails, the default window has moved and the grid needs to
    // start disabling cells in it.
    for (const time of buildTimeRows(60)) {
      expect(londonWallClockExists(SPRING_FORWARD, time)).toBe(true);
    }
  });

  it('finds the gap when the grid is expanded to the whole day', () => {
    const missing = buildTimeRows(30, true).filter(
      (time) => !londonWallClockExists(SPRING_FORWARD, time)
    );
    expect(missing).toEqual(['01:00', '01:30']);
  });
});

describe('isPastDate', () => {
  it('is true for yesterday', () => {
    expect(isPastDate('2026-07-13', '2026-07-14')).toBe(true);
  });

  it('is false for today', () => {
    expect(isPastDate('2026-07-14', '2026-07-14')).toBe(false);
  });

  it('is false for tomorrow', () => {
    expect(isPastDate('2026-07-15', '2026-07-14')).toBe(false);
  });
});

describe('isPastSlot', () => {
  it('is true for a slot earlier today', () => {
    // 13:00 UTC is 14:00 London in July.
    const now = new Date('2026-07-14T13:00:00Z');
    expect(isPastSlot('2026-07-14', '09:00', now)).toBe(true);
  });

  it('is false for a slot later today', () => {
    const now = new Date('2026-07-14T13:00:00Z');
    expect(isPastSlot('2026-07-14', '18:00', now)).toBe(false);
  });

  it('compares against London time, not UTC', () => {
    // 23:30 UTC on 13 July is already 00:30 on the 14th in London. A 00:15 slot
    // on the 14th is therefore in the past, and a UTC-based check would say the
    // opposite.
    const now = new Date('2026-07-13T23:30:00Z');
    expect(isPastSlot('2026-07-14', '00:15', now)).toBe(true);
    expect(isPastSlot('2026-07-14', '01:00', now)).toBe(false);
  });

  it('is false for a time that does not exist, which is disabled for another reason', () => {
    const now = new Date('2026-03-29T00:00:00Z');
    expect(isPastSlot(SPRING_FORWARD, '01:30', now)).toBe(false);
  });
});

describe('slotKey', () => {
  it('keys on the start, matching the duplicate rule in the schema', () => {
    expect(slotKey({ date: '2026-07-14', startTime: '14:00' })).toBe('2026-07-14T14:00');
  });

  it('gives two slots that start together the same key regardless of length', () => {
    const sixty = computeSlotEnd('2026-07-14', '14:00', 60);
    const ninety = computeSlotEnd('2026-07-14', '14:00', 90);
    expect(slotKey(sixty)).toBe(slotKey(ninety));
  });
});

describe('describeSlotCell', () => {
  it('names the day, the range and the state, without leaning on position', () => {
    const slot = computeSlotEnd('2026-07-14', '14:00', 60);
    expect(describeSlotCell(slot, false)).toBe('Tuesday 14 July, 2:00pm to 3:00pm, not selected');
  });

  it('reports the selected state', () => {
    const slot = computeSlotEnd('2026-07-14', '14:00', 60);
    expect(describeSlotCell(slot, true)).toBe('Tuesday 14 July, 2:00pm to 3:00pm, selected');
  });

  it('names the following day when the slot runs past midnight', () => {
    // Otherwise "11:00pm to 1:00am" reads as a range running backwards.
    const slot = computeSlotEnd('2026-07-14', '23:00', 120);
    expect(describeSlotCell(slot, false)).toBe(
      'Tuesday 14 July, 11:00pm to 1:00am on Wednesday 15 July, not selected'
    );
  });
});

describe('describeDateCell', () => {
  it('names the day and the state', () => {
    expect(describeDateCell('2026-07-14', false)).toBe('Tuesday 14 July, all day, not selected');
    expect(describeDateCell('2026-07-14', true)).toBe('Tuesday 14 July, all day, selected');
  });
});

describe('formatDayLabel', () => {
  it('spells the day out in full', () => {
    expect(formatDayLabel('2026-07-14')).toBe('Tuesday 14 July');
  });

  it('does not shift the day across a DST boundary', () => {
    expect(formatDayLabel(SPRING_FORWARD)).toBe('Sunday 29 March');
    expect(formatDayLabel(AUTUMN_BACK)).toBe('Sunday 25 October');
  });
});
