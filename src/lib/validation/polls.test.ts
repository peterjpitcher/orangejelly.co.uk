import { describe, expect, it } from 'vitest';

import {
  addOneDay,
  buildPollOptions,
  createPollSchema,
  isoDateSchema,
  type CreatePollFormValues,
} from './polls';
import { getTodayIsoDate } from '@/lib/dateUtils';

/**
 * Schema tests.
 *
 * No DST arithmetic is tested here — src/lib/dateUtils.test.ts already holds 47
 * passing tests covering both boundaries. These prove the poll code *calls*
 * dateUtils correctly and, above all, that a malformed value produces a
 * validation error rather than an exception.
 */

/** A date comfortably in the future, so "not in the past" never flakes. */
const FUTURE = '2099-07-04';

function validValues(overrides: Partial<CreatePollFormValues> = {}): CreatePollFormValues {
  return {
    title: 'Quiz night briefing',
    description: '',
    agenda: '',
    location: '',
    organiserName: 'Peter',
    organiserEmail: 'peter@orangejelly.co.uk',
    optionKind: 'dates',
    dates: [{ date: FUTURE }, { date: '2099-07-05' }],
    slots: undefined,
    turnstileToken: 'a-token',
    website: '',
    ...overrides,
  };
}

describe('isoDateSchema', () => {
  it('should return a validation error rather than throw when the date is malformed', () => {
    // The trap this schema exists to avoid: zod runs every refinement in a
    // chain even after one fails, and compareIsoDates() throws on malformed
    // input. Chained, this call would throw and 500 the action.
    expect(() => isoDateSchema.safeParse('rubbish')).not.toThrow();
    expect(isoDateSchema.safeParse('rubbish').success).toBe(false);
  });

  it('should return a validation error rather than throw when the date is nonsense but date-shaped', () => {
    expect(() => isoDateSchema.safeParse('2026-02-30')).not.toThrow();
    expect(isoDateSchema.safeParse('2026-02-30').success).toBe(false);
  });

  it('should reject a date in the past', () => {
    expect(isoDateSchema.safeParse('2020-01-01').success).toBe(false);
  });

  it('should accept today, measured in London rather than UTC', () => {
    expect(isoDateSchema.safeParse(getTodayIsoDate()).success).toBe(true);
  });
});

describe('createPollSchema', () => {
  it('should accept a valid dates poll', () => {
    expect(createPollSchema.safeParse(validValues()).success).toBe(true);
  });

  it('should accept a valid slots poll', () => {
    const result = createPollSchema.safeParse(
      validValues({
        optionKind: 'slots',
        dates: undefined,
        slots: [
          { date: FUTURE, startTime: '19:30', endTime: '21:00', endsNextDay: false },
          { date: FUTURE, startTime: '21:00', endTime: '22:30', endsNextDay: false },
        ],
      })
    );
    expect(result.success).toBe(true);
  });

  it('should not throw when an option date is malformed', () => {
    // The same chain trap, reached through the whole schema.
    const call = () =>
      createPollSchema.safeParse(validValues({ dates: [{ date: 'nope' }, { date: FUTURE }] }));
    expect(call).not.toThrow();
    expect(call().success).toBe(false);
  });

  it('should reject a poll with fewer than two options', () => {
    const result = createPollSchema.safeParse(validValues({ dates: [{ date: FUTURE }] }));
    expect(result.success).toBe(false);
  });

  it('should reject a poll with more than eight options', () => {
    const nine = Array.from({ length: 9 }, (_, i) => ({
      date: `2099-07-${String(i + 1).padStart(2, '0')}`,
    }));
    const result = createPollSchema.safeParse(validValues({ dates: nine }));
    expect(result.success).toBe(false);
  });

  it('should reject two options on the same date', () => {
    const result = createPollSchema.safeParse(
      validValues({ dates: [{ date: FUTURE }, { date: FUTURE }] })
    );
    expect(result.success).toBe(false);
  });

  it('should reject two slots that start at the same time', () => {
    const result = createPollSchema.safeParse(
      validValues({
        optionKind: 'slots',
        dates: undefined,
        slots: [
          { date: FUTURE, startTime: '19:30', endTime: '21:00', endsNextDay: false },
          { date: FUTURE, startTime: '19:30', endTime: '22:00', endsNextDay: false },
        ],
      })
    );
    expect(result.success).toBe(false);
  });

  it('should reject a poll carrying both dates and slots', () => {
    const result = createPollSchema.safeParse(
      validValues({
        optionKind: 'dates',
        slots: [{ date: FUTURE, startTime: '19:30', endTime: '21:00', endsNextDay: false }],
      })
    );
    expect(result.success).toBe(false);
  });

  it('should reject a missing turnstile token', () => {
    expect(createPollSchema.safeParse(validValues({ turnstileToken: '' })).success).toBe(false);
  });

  it('should reject an invalid email address', () => {
    expect(
      createPollSchema.safeParse(validValues({ organiserEmail: 'not-an-email' })).success
    ).toBe(false);
  });
});

describe('addOneDay', () => {
  it('should roll over a month boundary', () => {
    expect(addOneDay('2026-07-31')).toBe('2026-08-01');
  });

  it('should roll over a leap day', () => {
    expect(addOneDay('2028-02-28')).toBe('2028-02-29');
  });
});

describe('buildPollOptions', () => {
  it('should map dates straight through without touching a time zone', () => {
    const result = buildPollOptions(validValues());
    expect(result.options).toEqual([{ optionDate: FUTURE }, { optionDate: '2099-07-05' }]);
  });

  it('should convert slot wall-clock times into instants', () => {
    const result = buildPollOptions(
      validValues({
        optionKind: 'slots',
        dates: undefined,
        slots: [{ date: '2026-07-04', startTime: '19:30', endTime: '21:00', endsNextDay: false }],
      })
    );

    // July is BST (UTC+1), so 19:30 London is 18:30Z. If this ever reads 19:30Z
    // the wall clock is being treated as UTC — the exact bug the instant
    // conversion exists to prevent.
    expect(result.options?.[0].startsAt?.toISOString()).toBe('2026-07-04T18:30:00.000Z');
    expect(result.options?.[0].endsAt?.toISOString()).toBe('2026-07-04T20:00:00.000Z');
  });

  it('should carry an overnight slot into the next day when the flag is set', () => {
    const result = buildPollOptions(
      validValues({
        optionKind: 'slots',
        dates: undefined,
        slots: [{ date: '2026-07-04', startTime: '22:00', endTime: '01:00', endsNextDay: true }],
      })
    );

    expect(result.error).toBeUndefined();
    // 22:00 on the 4th BST is 21:00Z; 01:00 on the 5th BST is 00:00Z on the 5th.
    // The end lands on the following calendar day in both zones, which is the
    // whole point of the flag.
    expect(result.options?.[0].startsAt?.toISOString()).toBe('2026-07-04T21:00:00.000Z');
    expect(result.options?.[0].endsAt?.toISOString()).toBe('2026-07-05T00:00:00.000Z');
  });

  it('should reject an overnight slot when the flag is not set', () => {
    // 22:00 -> 01:00 with the box unticked is an end before its start. It must
    // NOT be silently inferred into an all-night event.
    const result = buildPollOptions(
      validValues({
        optionKind: 'slots',
        dates: undefined,
        slots: [{ date: '2026-07-04', startTime: '22:00', endTime: '01:00', endsNextDay: false }],
      })
    );

    expect(result.options).toBeUndefined();
    expect(result.error).toBe('The end time must be after the start time');
  });

  it('should reject a slot longer than 24 hours', () => {
    const result = buildPollOptions(
      validValues({
        optionKind: 'slots',
        dates: undefined,
        slots: [{ date: '2026-07-04', startTime: '10:00', endTime: '11:00', endsNextDay: true }],
      })
    );

    expect(result.error).toBe('A slot cannot be longer than 24 hours.');
  });

  it('should return the error message rather than throw when a time falls in the spring-forward gap', () => {
    // 28 March 2027, 01:30 London: the clocks go forward at 01:00 and that half
    // hour never happens. londonWallClockToInstant throws; the action must show
    // the message, not 500.
    const call = () =>
      buildPollOptions(
        validValues({
          optionKind: 'slots',
          dates: undefined,
          slots: [{ date: '2027-03-28', startTime: '01:30', endTime: '03:00', endsNextDay: false }],
        })
      );

    expect(call).not.toThrow();
    expect(call().error).toContain('does not exist');
  });
});
