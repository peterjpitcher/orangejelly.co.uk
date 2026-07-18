import { formatInTimeZone, fromZonedTime, getTimezoneOffset } from 'date-fns-tz';

import { LONDON_TIME_ZONE, type IsoDate } from '@/lib/dateUtils';

/**
 * The week/slot maths behind the create-poll calendar grid.
 *
 * This module is deliberately pure and deliberately separate from the component.
 * The grid has to answer four questions that a component test cannot answer
 * honestly — what does this week span, where does this slot end, does this time
 * exist at all, and is it already gone — and every one of them has a DST edge
 * that only a direct unit test will ever exercise.
 *
 * It is client-safe: it reaches only date-fns-tz and the type/zone constants from
 * dateUtils, so nothing heavy follows it into the bundle.
 *
 * On the relationship with `londonWallClockToInstant`: that function is the
 * authority for turning a wall clock into a stored instant, and it THROWS on a
 * time inside the spring-forward gap. That is correct for a conversion and wrong
 * for a grid, which needs to ask "does 01:30 exist on this day?" about 700 cells
 * a render without a throw being the answer. So the round-trip check is
 * expressed here as a predicate rather than wrapped in a try/catch — swallowing
 * that throw is exactly how the gap stops being visible. The two are pinned
 * together by a test asserting they agree on the boundary.
 */

/** Monday. The UK working week starts on Monday, so the grid does too. */
const WEEK_STARTS_ON_MONDAY = 1;

const MINUTES_IN_DAY = 24 * 60;

const HOUR_IN_MS = 60 * 60 * 1000;

/**
 * The durations offered, in minutes.
 *
 * Minutes is the stored unit throughout; the row is *labelled* in hours once it
 * passes an hour (see `formatDurationLabel`). 3 and 4 hours are here because a
 * pub event runs long — Doodle stops at 2 hours, and that is a limitation rather
 * than a decision worth copying.
 */
export const DURATION_CHOICES = [15, 30, 60, 90, 120, 180, 240] as const;

/** An hour is the default: it is the length of most things being arranged. */
export const DEFAULT_DURATION_MINUTES = 60;

/** A custom duration shorter than this is a mis-tap, not a choice. */
export const MIN_CUSTOM_DURATION_MINUTES = 5;

/**
 * 12 hours. Past this it is an all-day event, and "All day" already says that
 * better than a 13-hour slot does.
 */
export const MAX_CUSTOM_DURATION_MINUTES = 12 * 60;

/** How a custom duration is being typed. A display unit only — never stored. */
export type DurationUnit = 'minutes' | 'hours';

/** All-day selection produces date-only options; every other choice is timed. */
export type DurationChoice = number | 'all-day';

/** The default visible window: 08:00 through 23:00. */
export const DEFAULT_FIRST_HOUR = 8;

/**
 * The last hour offered by default. 23:00, not 22:00, because an overnight slot
 * is a real thing to arrange in a pub and 23:00 + 120 min is the case that has
 * to work.
 */
export const DEFAULT_LAST_HOUR = 23;

/* -------------------------------------------------------------------------- */
/* Calendar arithmetic                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Adds (or subtracts) whole days to a calendar date.
 *
 * Pure string arithmetic through UTC, never through a local Date. The value is a
 * calendar date; running it through a timezone is the bug the whole date/slot
 * split exists to avoid.
 */
export function addDaysIso(date: IsoDate, days: number): IsoDate {
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

/** The Monday of the week containing the given date. */
export function startOfWeekIso(date: IsoDate): IsoDate {
  const value = new Date(`${date}T00:00:00Z`);
  const day = value.getUTCDay(); // 0 = Sunday
  const backtrack = (day - WEEK_STARTS_ON_MONDAY + 7) % 7;
  return addDaysIso(date, -backtrack);
}

/** The seven dates of the week beginning at `weekStart`, Monday first. */
export function weekDaysIso(weekStart: IsoDate): IsoDate[] {
  return Array.from({ length: 7 }, (_, index) => addDaysIso(weekStart, index));
}

/** The first day of the month containing the given date. */
export function startOfMonthIso(date: IsoDate): IsoDate {
  return `${date.slice(0, 7)}-01`;
}

/** Adds (or subtracts) whole months, clamping to the last day where needed. */
export function addMonthsIso(date: IsoDate, months: number): IsoDate {
  const [year, month] = date.split('-').map(Number);
  const zeroBased = month - 1 + months;
  const targetYear = year + Math.floor(zeroBased / 12);
  const targetMonth = ((zeroBased % 12) + 12) % 12;
  return `${String(targetYear).padStart(4, '0')}-${String(targetMonth + 1).padStart(2, '0')}-01`;
}

/**
 * The month laid out as whole Monday-to-Sunday weeks.
 *
 * Leading and trailing days belong to the neighbouring months and are returned
 * as real dates rather than blanks, so the caller can grey them without having
 * to invent a placeholder.
 */
export function monthGridWeeks(monthAnchor: IsoDate): IsoDate[][] {
  const first = startOfMonthIso(monthAnchor);
  const gridStart = startOfWeekIso(first);
  const lastOfMonth = addDaysIso(addMonthsIso(first, 1), -1);
  const gridEnd = addDaysIso(startOfWeekIso(lastOfMonth), 6);

  const weeks: IsoDate[][] = [];
  let cursor = gridStart;
  while (cursor <= gridEnd) {
    weeks.push(weekDaysIso(cursor));
    cursor = addDaysIso(cursor, 7);
  }
  return weeks;
}

/** True when the date falls outside the month it is being displayed within. */
export function isOutsideMonth(date: IsoDate, monthAnchor: IsoDate): boolean {
  return date.slice(0, 7) !== monthAnchor.slice(0, 7);
}

/* -------------------------------------------------------------------------- */
/* Labels                                                                     */
/* -------------------------------------------------------------------------- */

/** A date-only value rendered with no zone conversion. Pinned to UTC both ways. */
function formatDateOnly(date: IsoDate, pattern: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const pinnedToUtc = new Date(Date.UTC(year, month - 1, day));
  return formatInTimeZone(pinnedToUtc, 'UTC', pattern);
}

/**
 * The week's range, as "13 – 19 July", widening only as far as it has to:
 * the month appears once when the week sits inside one, and the year appears
 * only when the week straddles two.
 */
export function formatWeekRangeLabel(weekStart: IsoDate): string {
  const weekEnd = addDaysIso(weekStart, 6);
  const sameMonth = weekStart.slice(0, 7) === weekEnd.slice(0, 7);
  const sameYear = weekStart.slice(0, 4) === weekEnd.slice(0, 4);

  if (sameMonth) {
    return `${formatDateOnly(weekStart, 'd')} – ${formatDateOnly(weekEnd, 'd MMMM')}`;
  }
  if (sameYear) {
    return `${formatDateOnly(weekStart, 'd MMMM')} – ${formatDateOnly(weekEnd, 'd MMMM')}`;
  }
  return `${formatDateOnly(weekStart, 'd MMM yyyy')} – ${formatDateOnly(weekEnd, 'd MMM yyyy')}`;
}

/** The month and year, as "July 2026". */
export function formatMonthLabel(monthAnchor: IsoDate): string {
  return formatDateOnly(startOfMonthIso(monthAnchor), 'MMMM yyyy');
}

/**
 * London's UTC offset on a given date, as "GMT+1" or "GMT".
 *
 * Computed, never hardcoded. "GMT+1" is wrong for roughly half the year, and a
 * scheduling tool that states the wrong offset as fact has told the user a lie
 * about the one thing it exists to get right.
 */
export function londonOffsetLabel(date: IsoDate): string {
  // Midday, so the answer is the day's settled offset rather than whatever holds
  // for the hour either side of a 01:00 transition.
  const middayUtc = new Date(`${date}T12:00:00Z`);
  const offsetHours = getTimezoneOffset(LONDON_TIME_ZONE, middayUtc) / (60 * 60 * 1000);

  if (offsetHours === 0) return 'GMT';
  return `GMT${offsetHours > 0 ? '+' : '−'}${Math.abs(offsetHours)}`;
}

/**
 * The full timezone statement shown beside the grid.
 *
 * A label, never a picker. Every user of this tool is in the UK; a dropdown here
 * would be an invitation to get it wrong.
 */
export function londonZoneLabel(date: IsoDate): string {
  return `United Kingdom, London (${londonOffsetLabel(date)})`;
}

/** "Tuesday 14 July" — the day column heading, spelled out in full. */
export function formatDayLabel(date: IsoDate): string {
  return formatDateOnly(date, 'EEEE d MMMM');
}

/**
 * A duration, in the unit a person would actually say it in.
 *
 * "2 hours", never "120 min". Making someone divide by 60 to find the option they
 * want is the tool doing its arithmetic in the user's head. Under an hour stays
 * in minutes, because "0.25 hours" is not how anyone says a quarter of an hour.
 */
export function formatDurationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;

  const hours = minutes / 60;
  if (Number.isInteger(hours)) {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }

  // 90 → "1.5 hours". Trailing zeroes stripped, so 150 is "2.5" and not "2.50".
  return `${Number(hours.toFixed(2))} hours`;
}

/** What `parseDurationInput` gives back: a length in minutes, or one message. */
export type ParsedDuration =
  | { minutes: number; error?: never }
  | { minutes?: never; error: string };

/**
 * Reads a custom duration typed in either unit and returns minutes.
 *
 * Minutes is the canonical unit; hours are a way of typing, not a way of
 * storing. Someone wanting five hours types 5 and picks hours — they are never
 * made to work out 300.
 *
 * Fractional hours are accepted (1.5 → 90) but only when they land on a whole
 * minute. 0.51 hours is 30.6 minutes, and that is REFUSED rather than rounded:
 * a slot that quietly becomes 30.6 minutes long is worse than one the user was
 * told to re-type, because nothing downstream will ever mention it again.
 */
export function parseDurationInput(raw: string, unit: DurationUnit): ParsedDuration {
  const trimmed = raw.trim();
  if (trimmed === '') return { error: 'Enter how long each option runs.' };

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return { error: 'Enter a number.' };
  if (value <= 0) return { error: 'Enter a length greater than zero.' };

  const minutes = unit === 'hours' ? value * 60 : value;

  // Guarded against floating point: 1.5 * 60 is exactly 90, but 0.1 * 60 is
  // 6.000000000000001, and a bare Number.isInteger would refuse a legitimate
  // six-minute slot.
  const rounded = Math.round(minutes);
  if (Math.abs(minutes - rounded) > 1e-6) {
    return {
      error:
        unit === 'hours'
          ? 'That does not come to a whole number of minutes. Try 1.5 for an hour and a half.'
          : 'Enter a whole number of minutes.',
    };
  }

  if (rounded < MIN_CUSTOM_DURATION_MINUTES) {
    return { error: `The shortest option is ${MIN_CUSTOM_DURATION_MINUTES} minutes.` };
  }
  if (rounded > MAX_CUSTOM_DURATION_MINUTES) {
    return { error: 'The longest option is 12 hours. Use ‘All day’ for anything longer.' };
  }

  return { minutes: rounded };
}

/** "Tue" / "14" — the two halves of the compact column heading. */
export function formatWeekdayShort(date: IsoDate): string {
  return formatDateOnly(date, 'EEE');
}

export function formatDayOfMonth(date: IsoDate): string {
  return formatDateOnly(date, 'd');
}

/**
 * A wall-clock time as "2:00pm".
 *
 * Built from the string alone. The time is not an instant and must not be routed
 * through one to be displayed.
 */
export function formatWallClockLabel(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours < 12 ? 'am' : 'pm';
  const twelveHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${twelveHour}:${String(minutes).padStart(2, '0')}${period}`;
}

/* -------------------------------------------------------------------------- */
/* Time rows                                                                  */
/* -------------------------------------------------------------------------- */

/** Minutes since midnight for a HH:mm wall clock. */
export function minutesFromWallClock(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/** A HH:mm wall clock from minutes since midnight, wrapping past midnight. */
export function wallClockFromMinutes(minutes: number): string {
  const wrapped = ((minutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const hours = Math.floor(wrapped / 60);
  return `${String(hours).padStart(2, '0')}:${String(wrapped % 60).padStart(2, '0')}`;
}

/**
 * The row step for a given duration.
 *
 * A 15-minute duration wants quarter-hour rows — otherwise the choice is
 * pointless. Anything an hour or longer sits on the hour, which is where people
 * actually start things.
 */
export function rowStepMinutes(durationMinutes: number): number {
  return Math.min(Math.max(durationMinutes, MIN_CUSTOM_DURATION_MINUTES), 60);
}

/**
 * Every start time offered down the side of the grid.
 *
 * The window is 08:00–23:00 by default and the full day when expanded. 23:00 is
 * included on purpose: it is the start of the overnight case.
 */
export function buildTimeRows(durationMinutes: number, expanded = false): string[] {
  const step = rowStepMinutes(durationMinutes);
  const firstMinute = expanded ? 0 : DEFAULT_FIRST_HOUR * 60;
  const lastMinute = expanded ? MINUTES_IN_DAY - step : DEFAULT_LAST_HOUR * 60;

  const rows: string[] = [];
  for (let minute = firstMinute; minute <= lastMinute; minute += step) {
    rows.push(wallClockFromMinutes(minute));
  }
  return rows;
}

/* -------------------------------------------------------------------------- */
/* Slots                                                                      */
/* -------------------------------------------------------------------------- */

/** The shape the create form emits for a timed option. Unchanged, and pinned. */
export interface CalendarSlot {
  date: IsoDate;
  startTime: string;
  endTime: string;
  endsNextDay: boolean;
}

/**
 * Where a slot of the given length ends.
 *
 * `endsNextDay` is COMPUTED, never asked for. 23:00 + 120 min ends at 01:00 the
 * following day, and expecting the organiser to work that out and tick a box is
 * how a pub event silently becomes a one-hour meeting.
 *
 * A duration of exactly 24 hours lands back on the same wall clock a day later,
 * which is a next-day end, so the comparison is on total minutes rather than on
 * the formatted string.
 */
export function computeSlotEnd(
  date: IsoDate,
  startTime: string,
  durationMinutes: number
): CalendarSlot {
  const endMinutes = minutesFromWallClock(startTime) + durationMinutes;
  return {
    date,
    startTime,
    endTime: wallClockFromMinutes(endMinutes),
    endsNextDay: endMinutes >= MINUTES_IN_DAY,
  };
}

/**
 * The instant a London wall clock names, or null when it names nothing.
 *
 * Null is returned only for the spring-forward gap: on 29 March 2026 the clock
 * jumps 01:00 → 02:00, so 01:30 does not happen and there is no instant to
 * return. The round-trip below is what proves it — a wall clock that comes back
 * different from the one asked for did not exist.
 *
 * The autumn overlap is the opposite case and is resolved the same way
 * `londonWallClockToInstant` resolves it: on 25 October 2026 01:30 happens
 * twice, and the earlier (BST) occurrence is the one taken. That is a decision
 * this codebase already made, and the grid must not quietly make the other one —
 * a cell that disagrees with the value it goes on to submit is worse than either
 * choice on its own.
 *
 * This mirrors `londonWallClockToInstant`, which throws instead. See the module
 * header: a grid cannot use a throw as an answer, and catching it is how the gap
 * becomes invisible. `agrees with londonWallClockToInstant` in the test file
 * holds the two together — it is what caught this function returning the later
 * of the two ambiguous instants when dateUtils returns the earlier.
 */
export function londonWallClockInstantOrNull(date: IsoDate, time: string): Date | null {
  const wallClock = `${date}T${time}:00`;
  const candidate = fromZonedTime(wallClock, LONDON_TIME_ZONE);

  if (Number.isNaN(candidate.getTime())) return null;

  const roundTripped = formatInTimeZone(candidate, LONDON_TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ss");
  if (roundTripped !== wallClock) return null;

  // If the hour before also lands on this wall clock, the time is ambiguous and
  // we are holding the later (GMT) of the two. Take the earlier, as dateUtils does.
  const anHourEarlier = new Date(candidate.getTime() - HOUR_IN_MS);
  const earlierWallClock = formatInTimeZone(
    anHourEarlier,
    LONDON_TIME_ZONE,
    "yyyy-MM-dd'T'HH:mm:ss"
  );

  return earlierWallClock === wallClock ? anHourEarlier : candidate;
}

/**
 * True when the wall clock is a real time on that London day.
 *
 * False only inside the spring-forward gap. The grid must not offer a cell that
 * would later throw on conversion, so this is what disables it.
 */
export function londonWallClockExists(date: IsoDate, time: string): boolean {
  return londonWallClockInstantOrNull(date, time) !== null;
}

/** True when the whole day is behind us. `today` must be London's today. */
export function isPastDate(date: IsoDate, today: IsoDate): boolean {
  return date < today;
}

/**
 * True when the slot has already started.
 *
 * A time that does not exist is not in the past — it is nowhere — so it reports
 * false here and is disabled by `londonWallClockExists` instead. Two reasons for
 * one cell being unavailable stay two reasons.
 */
export function isPastSlot(date: IsoDate, time: string, now: Date): boolean {
  const instant = londonWallClockInstantOrNull(date, time);
  if (instant === null) return false;
  return instant.getTime() < now.getTime();
}

/* -------------------------------------------------------------------------- */
/* Selection                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The identity of an option, for toggling and duplicate checks.
 *
 * Keyed on the START, matching the duplicate rule in validation/polls.ts. Two
 * slots that begin together and differ only in length are not two choices a
 * human can vote between.
 */
export function slotKey(slot: Pick<CalendarSlot, 'date' | 'startTime'>): string {
  return `${slot.date}T${slot.startTime}`;
}

/**
 * The accessible name for one grid cell.
 *
 * Self-contained and position-independent on purpose. "Tuesday 14 July, 2:00pm
 * to 3:00pm, not selected" makes sense read on its own; a name that leans on the
 * cell's row and column makes sense only to someone who can see the grid.
 */
export function describeSlotCell(slot: CalendarSlot, selected: boolean): string {
  const day = formatDayLabel(slot.date);
  const start = formatWallClockLabel(slot.startTime);
  const end = formatWallClockLabel(slot.endTime);
  const endDay = slot.endsNextDay ? ` on ${formatDayLabel(addDaysIso(slot.date, 1))}` : '';
  return `${day}, ${start} to ${end}${endDay}, ${selected ? 'selected' : 'not selected'}`;
}

/** The accessible name for one whole-day cell. */
export function describeDateCell(date: IsoDate, selected: boolean): string {
  return `${formatDayLabel(date)}, all day, ${selected ? 'selected' : 'not selected'}`;
}
