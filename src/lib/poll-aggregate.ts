import type { Availability, PollOptionRow } from './db/polls';

/**
 * Vote counting for the availability poll.
 *
 * Load-bearing rather than cosmetic: during voting, participants see only these
 * aggregates and never per-person answers. A bug here either leaks how an
 * individual voted or misreports the winner.
 *
 * Pure by design: no I/O, no framework.
 */

/** The shape of a stored answer this module needs. Narrower than the row on purpose. */
export interface PollResponseTally {
  option_id: string;
  participant_id: string;
  availability: Availability;
}

/**
 * Counts for one option. snake_case throughout, matching the repo's convention
 * of mapping by hand rather than through a `fromDb` helper.
 *
 * There is deliberately no participant identifier and no display name on this
 * object: it is handed to participants, and it must not be able to carry one.
 * There is also no weighted `score` — see `bestOption`.
 */
export interface OptionTally {
  option_id: string;
  yes: number;
  if_need_be: number;
  no: number;
  responded: number;
}

/** The option fields the tally needs. Accepts a full `PollOptionRow` unchanged. */
type TallyableOption = Pick<PollOptionRow, 'id' | 'position'>;

/**
 * Tallies every option, in `position` order.
 *
 * Ordering is applied here rather than trusted from the caller, because
 * `bestOption` breaks its ties on this order and a caller that passed rows in
 * arrival order would silently change which option wins.
 *
 * A participant is counted once per option: the last answer for a given
 * (participant, option) pair wins. The unique constraint on
 * `(participant_id, option_id)` should make duplicates impossible, but a
 * miscount here is invisible in a way a constraint violation is not.
 */
export function aggregateByOption(
  options: readonly TallyableOption[],
  responses: readonly PollResponseTally[]
): OptionTally[] {
  const ordered = [...options].sort((a, b) => a.position - b.position);

  // One answer per participant per option, keyed so a duplicate replaces rather than adds.
  const answers = new Map<string, Map<string, Availability>>();
  for (const option of ordered) {
    answers.set(option.id, new Map<string, Availability>());
  }

  for (const response of responses) {
    const perParticipant = answers.get(response.option_id);
    if (!perParticipant) {
      // An answer for an option that is not on this poll — a deleted option, or
      // a stale form post. It belongs to no tally, so it is dropped.
      continue;
    }
    perParticipant.set(response.participant_id, response.availability);
  }

  return ordered.map((option) => {
    const perParticipant = answers.get(option.id) ?? new Map<string, Availability>();
    const tally: OptionTally = {
      option_id: option.id,
      yes: 0,
      if_need_be: 0,
      no: 0,
      responded: perParticipant.size,
    };

    for (const availability of perParticipant.values()) {
      tally[availability] += 1;
    }

    return tally;
  });
}

/**
 * How many distinct people have replied to this poll at all.
 *
 * The denominator for any proportion shown to the organiser. It counts
 * participants, not `poll_responses` rows — somebody who answered eight options
 * is one person, not eight.
 */
export function countResponders(responses: readonly PollResponseTally[]): number {
  return new Set(responses.map((response) => response.participant_id)).size;
}

/**
 * The "Best so far" options, ordered by `position`.
 *
 * Ranked by yes descending, then if-need-be descending. There is no weighted
 * score: two yes beats one yes with five if-need-bes, because a maybe is not
 * half a yes.
 *
 * Returns an array because every option tied at the top is badged — picking one
 * of them by `position` would be arbitrary, and `position` is the order the
 * organiser happened to type the options in, not a preference. `position`
 * therefore orders the result; it never excludes an option from it.
 *
 * Returns `[]` when no option has any yes or any if-need-be. Without that, every
 * option ties on zero, every option is badged, and the organiser is shown eight
 * winners — worse than showing none. It is the only suppression condition:
 * an empty result means "no signal yet", not "no data".
 */
export function bestOption(tallies: readonly OptionTally[]): OptionTally[] {
  const withSignal = tallies.some((tally) => tally.yes + tally.if_need_be > 0);
  if (!withSignal) {
    return [];
  }

  const ranked = [...tallies].sort((a, b) => b.yes - a.yes || b.if_need_be - a.if_need_be);
  const top = ranked[0];

  // Ties are resolved by badging all of them, so the filter is on counts alone.
  return tallies.filter((tally) => tally.yes === top.yes && tally.if_need_be === top.if_need_be);
}
