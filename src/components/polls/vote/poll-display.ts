import { formatDateInLondon, formatSlotRangeInLondon } from '@/lib/dateUtils';

/**
 * Display helpers shared by the vote screen, the edit screen and their
 * read-only states.
 *
 * The option shape is declared locally rather than imported from
 * `src/lib/db/polls.ts` on purpose: these run in Client Components, and that
 * module pulls in `crypto` and the service-role client. A structural type keeps
 * the boundary honest instead of relying on `import type` erasure holding.
 */

export type OptionKind = 'dates' | 'slots';

/** The option fields a label needs. Accepts a full `PollOptionRow` unchanged. */
export interface DisplayOption {
  id: string;
  option_date: string | null;
  starts_at: string | null;
  ends_at: string | null;
  position: number;
}

/**
 * Renders one option as a full, unambiguous label.
 *
 * BRANCH ON `option_kind` — THIS IS THE BIT THAT THROWS IF YOU GET IT WRONG.
 * `poll_options_shape_chk` guarantees the two shapes are mutually exclusive:
 *   - 'slots' rows have `starts_at`/`ends_at` and a NULL `option_date`
 *   - 'dates' rows have `option_date` and NULL `starts_at`/`ends_at`
 *
 * `formatSlotInLondon` and `formatSlotRangeInLondon` deliberately THROW on a
 * date-only value, because a date carries no time and rendering one as "1:00am"
 * presents a time nobody chose as fact. That guard is correct. Never weaken it
 * to make a call site compile — branch here instead.
 *
 * The label is the option's accessible name (it goes in the `<legend>`), so it
 * spells the date out in full rather than relying on nearby context.
 */
export function formatOptionLabel(option: DisplayOption, kind: OptionKind): string {
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

export interface TallyCounts {
  yes: number;
  if_need_be: number;
  no: number;
}

/**
 * "4 yes · 1 if need be · 2 no".
 *
 * Counts only. Never a name against an answer — who voted what is the
 * organiser's view alone (§1 P1.6, binding per R11).
 */
export function formatTallyLine(tally: TallyCounts): string {
  return `${tally.yes} yes · ${tally.if_need_be} if need be · ${tally.no} no`;
}

/**
 * The reply count, in words.
 *
 * There is no invitee or headcount column in the schema, so "{n} of {m}" is not
 * computable and must not be invented. At zero this replaces the tally line
 * entirely — "0 yes · 0 if need be · 0 no" reads as a dead poll rather than a
 * new one (§1 P3.3).
 */
export function formatReplyCount(responderCount: number): string {
  if (responderCount === 0) return "Nobody's answered yet — you're first.";
  if (responderCount === 1) return 'One person has replied so far.';
  return `${responderCount} people have replied so far.`;
}
