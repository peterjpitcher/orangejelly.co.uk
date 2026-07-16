import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

/**
 * Date and time handling for Europe/London.
 *
 * Vercel lambdas run in UTC; every user of this site is in the UK. The two agree
 * for roughly five months of the year and disagree for the other seven, which is
 * why every conversion here is explicit and none of it relies on the host's local
 * timezone.
 *
 * The central rule is the split between the two kinds of value, which look alike
 * and behave completely differently:
 *
 *   - A **date-only** value ('2026-07-04') is a calendar date. "Saturday the 4th"
 *     is Saturday the 4th everywhere. It must NEVER be converted between zones —
 *     doing so is what turns it into Friday the 3rd at 23:00.
 *   - A **slot** value is an instant in time, stored as a UTC `timestamptz`.
 *     It must ALWAYS be rendered through a zone to be meaningful.
 *
 * The two are kept apart at the type level below, and mixing them throws.
 */

/** IANA zone id. Never a fixed offset such as '+01:00', which breaks twice a year. */
export const LONDON_TIME_ZONE = 'Europe/London';

/** A calendar date with no time and no zone, as 'YYYY-MM-DD'. */
export type IsoDate = string;

/** An instant in time. Accepted as a Date or an ISO 8601 string with a zone. */
export type Instant = Date | string;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const WALL_CLOCK_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const HOUR_IN_MS = 60 * 60 * 1000;

const LONG_DATE = 'EEEE, d MMMM yyyy';
const SHORT_DATE = 'EEE d MMM';
const TIME_OF_DAY = 'h:mmaaa';

/**
 * True if the value is a well-formed, real calendar date.
 *
 * Deliberately strict: the pattern check rejects unpadded parts and two-digit
 * years, and the round-trip catches dates that parse but do not exist, such as
 * 30 February or a leap day in a non-leap year.
 */
export function isValidIsoDate(value: unknown): value is IsoDate {
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function assertIsoDate(value: unknown, label = 'date'): asserts value is IsoDate {
  if (!isValidIsoDate(value)) {
    if (typeof value === 'string' && value.includes('T')) {
      throw new Error(
        `Expected a date-only value as YYYY-MM-DD but received an instant: "${value}". ` +
          'Date-only options must not carry a time — use formatSlotInLondon for instants.'
      );
    }
    throw new Error(`Invalid ${label}: "${value}". Expected YYYY-MM-DD.`);
  }
}

/**
 * Renders a date-only value with no timezone conversion whatsoever.
 *
 * The date is pinned to UTC purely so the formatter has an instant to work with;
 * because it is both built and rendered in UTC, the calendar date is returned
 * exactly as given. This is the property the whole function exists to guarantee.
 */
export function formatDateInLondon(date: IsoDate, style: 'long' | 'short' = 'long'): string {
  assertIsoDate(date);

  const [year, month, day] = date.split('-').map(Number);
  const pinnedToUtc = new Date(Date.UTC(year, month - 1, day));

  return formatInTimeZone(pinnedToUtc, 'UTC', style === 'short' ? SHORT_DATE : LONG_DATE);
}

/** The calendar date in London for a given instant, as 'YYYY-MM-DD'. */
export function toLocalIsoDate(instant: Instant): IsoDate {
  const value = typeof instant === 'string' ? new Date(instant) : instant;

  if (Number.isNaN(value.getTime())) {
    throw new Error(`Invalid instant: "${String(instant)}".`);
  }

  return formatInTimeZone(value, LONDON_TIME_ZONE, 'yyyy-MM-dd');
}

/**
 * Today's date in London.
 *
 * Not the same as the UTC date. Between midnight and 01:00 London time in summer
 * these differ, and a naive toISOString() would put a poll a day out.
 */
export function getTodayIsoDate(): IsoDate {
  return toLocalIsoDate(new Date());
}

/** Renders an instant as a London wall-clock date and time. */
export function formatSlotInLondon(instant: Instant): string {
  const value = typeof instant === 'string' ? new Date(instant) : instant;

  if (Number.isNaN(value.getTime())) {
    throw new Error(`Invalid instant: "${String(instant)}".`);
  }

  return formatInTimeZone(value, LONDON_TIME_ZONE, `${LONG_DATE} 'at' ${TIME_OF_DAY}`);
}

/**
 * Renders a start and end instant as a single London range.
 *
 * Collapses to one date when both ends fall on the same London day, and spells
 * both dates out when the range crosses midnight — otherwise "11:00pm – 12:30am"
 * reads as a range running backwards.
 */
export function formatSlotRangeInLondon(start: Instant, end: Instant): string {
  const startValue = typeof start === 'string' ? new Date(start) : start;
  const endValue = typeof end === 'string' ? new Date(end) : end;

  if (Number.isNaN(startValue.getTime())) {
    throw new Error(`Invalid start instant: "${String(start)}".`);
  }
  if (Number.isNaN(endValue.getTime())) {
    throw new Error(`Invalid end instant: "${String(end)}".`);
  }
  if (endValue.getTime() <= startValue.getTime()) {
    throw new Error('Slot end must be after slot start.');
  }

  const startTime = formatInTimeZone(startValue, LONDON_TIME_ZONE, TIME_OF_DAY);
  const endTime = formatInTimeZone(endValue, LONDON_TIME_ZONE, TIME_OF_DAY);
  const startDate = formatInTimeZone(startValue, LONDON_TIME_ZONE, LONG_DATE);
  const endDate = formatInTimeZone(endValue, LONDON_TIME_ZONE, LONG_DATE);

  if (startDate === endDate) {
    return `${startDate}, ${startTime} – ${endTime}`;
  }

  return `${startDate}, ${startTime} – ${endDate}, ${endTime}`;
}

/**
 * Converts a London wall-clock date and time into a UTC instant for storage.
 *
 * This is where the DST bugs live, so both boundary cases are handled explicitly
 * rather than left to the library's default:
 *
 *   - **Spring gap.** On the spring-forward day the clock jumps from 01:00 to
 *     02:00, so 01:30 never happens. Coercing it to a neighbouring hour is how a
 *     poll silently ends up an hour out, so this throws instead.
 *   - **Autumn overlap.** On the fall-back day 01:30 happens twice, an hour apart.
 *     The earlier (BST) occurrence is chosen. That is a decision, not an accident.
 */
export function londonWallClockToInstant(date: IsoDate, time: string): Date {
  assertIsoDate(date);

  if (typeof time !== 'string' || !WALL_CLOCK_TIME_PATTERN.test(time)) {
    throw new Error(`Invalid time: "${time}". Expected a 24-hour HH:mm value.`);
  }

  const wallClock = `${date}T${time}:00`;
  const candidate = fromZonedTime(wallClock, LONDON_TIME_ZONE);

  // Round-trip to prove the wall clock we asked for is the one we actually got.
  // A mismatch means the time does not exist on this date.
  const roundTripped = formatInTimeZone(candidate, LONDON_TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ss");
  if (roundTripped !== wallClock) {
    throw new Error(
      `${time} does not exist on ${date} in ${LONDON_TIME_ZONE} — the clocks go forward ` +
        'and that hour is skipped. Choose a different time.'
    );
  }

  // If the hour before also lands on the same wall clock, the time is ambiguous
  // and we are currently holding the later (GMT) of the two. Take the earlier.
  const anHourEarlier = new Date(candidate.getTime() - HOUR_IN_MS);
  const earlierWallClock = formatInTimeZone(
    anHourEarlier,
    LONDON_TIME_ZONE,
    "yyyy-MM-dd'T'HH:mm:ss"
  );
  if (earlierWallClock === wallClock) {
    return anHourEarlier;
  }

  return candidate;
}

/**
 * Compares two date-only values chronologically. Suitable as a sort comparator.
 *
 * ISO dates happen to sort correctly as strings, but relying on that quietly
 * couples the ordering to the format. This states the intent instead.
 */
export function compareIsoDates(a: IsoDate, b: IsoDate): number {
  assertIsoDate(a, 'first date');
  assertIsoDate(b, 'second date');

  if (a === b) return 0;
  return a < b ? -1 : 1;
}
