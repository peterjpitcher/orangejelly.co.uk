import { formatDateInLondon, formatSlotRangeInLondon, toLocalIsoDate } from '@/lib/dateUtils';
import type { DisplayOption, OptionKind } from '@/components/polls/vote/poll-display';

/**
 * Display helpers for the organiser results matrix.
 *
 * Pure. No I/O, no framework — every one of these is a string function, so the
 * page can render the whole matrix on the server and ship no JavaScript for it.
 *
 * The option shape is reused from the vote screen's `poll-display`, which
 * declares it structurally rather than importing `PollOptionRow`: that module
 * pulls in `crypto` and the service-role client, and these helpers are shared
 * with the client-side confirm dialogue.
 */

/**
 * A cell's state. `null` IS a state — "not answered".
 *
 * There is no 'not_answered' value in the `availability` enum, and there must
 * not be one: a participant who never answered an option has no `poll_responses`
 * row at all. Absence is the state, and the matrix renders it as one.
 */
export type CellState = 'yes' | 'if_need_be' | 'no' | null;

/**
 * The glyph for each state.
 *
 * A GLYPH, NOT A COLOUR. WCAG 1.4.1: colour must never be the only indicator of
 * state. The fill behind these is decorative reinforcement — this is the signal.
 * At 375px the visible word is hidden to keep the columns narrow, and the glyph
 * is what survives.
 */
export function answerGlyph(state: CellState): string {
  switch (state) {
    case 'yes':
      return '✓';
    case 'if_need_be':
      return '~';
    case 'no':
      return '✕';
    default:
      return '–';
  }
}

/** The word for each state. Read out by a screen reader at every width. */
export function answerLabel(state: CellState): string {
  switch (state) {
    case 'yes':
      return 'Yes';
    case 'if_need_be':
      return 'If need be';
    case 'no':
      return 'No';
    default:
      return 'Not answered';
  }
}

/** The cell fill. Reinforces the glyph; never carries meaning on its own. */
export function cellClass(state: CellState): string {
  switch (state) {
    case 'yes':
      return 'bg-orange-light text-charcoal';
    case 'if_need_be':
      return 'bg-surface-alt text-charcoal';
    case 'no':
      return 'bg-surface text-charcoal-light';
    default:
      return 'text-charcoal-light';
  }
}

/**
 * The column header's two lines.
 *
 * BRANCHES ON option_kind, AND THIS IS THE BIT THAT THROWS IF YOU GET IT WRONG.
 * On a 'dates' poll `starts_at` is NULL, and `formatSlotRangeInLondon` throws on
 * a date-only value by design — it will not render a date nobody gave a time to
 * as "1:00am". Never weaken that guard to make a call site compile; branch here.
 *
 * There is no `option.date` field on either shape. The columns are
 * `option_date`, `starts_at` and `ends_at`.
 */
export function optionHeaderLines(
  option: DisplayOption,
  kind: OptionKind
): [string, string | null] {
  if (kind === 'slots') {
    if (!option.starts_at || !option.ends_at) {
      throw new Error(`Slot option ${option.id} is missing starts_at or ends_at.`);
    }
    // The London calendar date of the start, not the UTC one: a 00:30 BST slot
    // is stored on the previous UTC day, and a header saying so would contradict
    // the time printed directly beneath it.
    return [
      formatDateInLondon(toLocalIsoDate(option.starts_at), 'short'),
      formatSlotRangeInLondon(option.starts_at, option.ends_at),
    ];
  }

  if (!option.option_date) {
    throw new Error(`Date option ${option.id} is missing option_date.`);
  }

  // No second line. A date-only option has no clock reading to print.
  return [formatDateInLondon(option.option_date, 'short'), null];
}

/**
 * The full, unambiguous option label, for a cell's accessible name and the
 * confirm dialogue.
 */
export function optionFullLabel(option: DisplayOption, kind: OptionKind): string {
  if (kind === 'slots') {
    if (!option.starts_at || !option.ends_at) {
      throw new Error(`Slot option ${option.id} is missing starts_at or ends_at.`);
    }
    return formatSlotRangeInLondon(option.starts_at, option.ends_at);
  }

  if (!option.option_date) {
    throw new Error(`Date option ${option.id} is missing option_date.`);
  }
  return formatDateInLondon(option.option_date, 'long');
}

/**
 * A row header's accessible name, disambiguated when names collide.
 *
 * Two people called Sarah is the expected case, not the edge case: there are no
 * accounts, so nothing stops it, and the same person voting twice produces it
 * too. A screen-reader user hearing "Sarah" twice cannot tell the rows apart, so
 * the duplicate carries the date it was answered.
 */
export function participantAccessibleName(
  displayName: string,
  createdAt: string,
  isDuplicate: boolean
): string {
  if (!isDuplicate) return displayName;
  return `${displayName}, answered ${formatDateInLondon(toLocalIsoDate(createdAt), 'short')}`;
}

/** Which display names appear more than once, lowercased for the comparison. */
export function duplicateNames(participants: ReadonlyArray<{ display_name: string }>): Set<string> {
  const seen = new Map<string, number>();
  for (const participant of participants) {
    const key = participant.display_name.trim().toLowerCase();
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }

  const duplicates = new Set<string>();
  for (const [name, count] of seen) {
    if (count > 1) duplicates.add(name);
  }
  return duplicates;
}

/**
 * A cell's self-contained accessible name: "Peter, Tuesday 14 July 2pm, if need be".
 *
 * SELF-CONTAINED IS THE REQUIREMENT. A screen reader user navigating the matrix
 * lands on a cell with no reliable sense of which row and column they are in, so
 * "if need be" alone is useless. Never rely on visual position.
 */
export function cellAccessibleName(
  participantName: string,
  optionLabel: string,
  state: CellState
): string {
  return `${participantName}, ${optionLabel}, ${answerLabel(state).toLowerCase()}`;
}

/** "4 yes · 1 if need be · 2 no" — the totals row, as text, before any bar. */
export function totalsLine(tally: { yes: number; if_need_be: number; no: number }): string {
  return `${tally.yes} yes · ${tally.if_need_be} if need be · ${tally.no} no`;
}

/**
 * The reply count for the sub-line.
 *
 * Never "{n} of {m}". The schema has no headcount column to divide by, and
 * inventing a denominator would be a number Peter cannot stand behind.
 */
export function replyCountLine(responderCount: number): string {
  if (responderCount === 0) return "Nobody's replied yet.";
  if (responderCount === 1) return 'One person has replied.';
  return `${responderCount} people have replied.`;
}

/**
 * A percentage of those who replied.
 *
 * Proportions are presented as percentages, per the standing rule. The
 * denominator is the number of people who replied to this poll — not the number
 * of `poll_responses` rows, which would count one person eight times.
 */
export function percentOf(count: number, responderCount: number): number {
  if (responderCount <= 0) return 0;
  return Math.round((count / responderCount) * 100);
}
