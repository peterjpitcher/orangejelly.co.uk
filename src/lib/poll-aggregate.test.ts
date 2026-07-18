import { describe, expect, it } from 'vitest';

import {
  aggregateByOption,
  bestOption,
  countResponders,
  type OptionTally,
  type PollResponseTally,
} from './poll-aggregate';

/** Options carry a display name nowhere near the tally, which is the point of the privacy test. */
function option(id: string, position: number): { id: string; position: number } {
  return { id, position };
}

function response(
  participant_id: string,
  option_id: string,
  availability: PollResponseTally['availability']
): PollResponseTally {
  return { participant_id, option_id, availability };
}

/** Builds a tally directly, so the ranking tests do not depend on the counting code. */
function tally(option_id: string, yes: number, if_need_be: number, no = 0): OptionTally {
  return { option_id, yes, if_need_be, no, responded: yes + if_need_be + no };
}

describe('aggregateByOption', () => {
  it('should return a tally for every option when no responses exist', () => {
    const result = aggregateByOption([option('a', 0), option('b', 1)], []);

    expect(result).toHaveLength(2);
    expect(result.map((t) => t.option_id)).toEqual(['a', 'b']);
  });

  it('should report zero across every state when an option has no responses', () => {
    const result = aggregateByOption([option('a', 0)], []);

    expect(result[0]).toEqual({ option_id: 'a', yes: 0, if_need_be: 0, no: 0, responded: 0 });
  });

  it('should count one yes when a single participant votes yes', () => {
    const result = aggregateByOption([option('a', 0)], [response('p1', 'a', 'yes')]);

    expect(result[0]).toEqual({ option_id: 'a', yes: 1, if_need_be: 0, no: 0, responded: 1 });
  });

  it('should count each state separately when three participants vote yes, if need be and no', () => {
    const result = aggregateByOption(
      [option('a', 0)],
      [response('p1', 'a', 'yes'), response('p2', 'a', 'if_need_be'), response('p3', 'a', 'no')]
    );

    expect(result[0]).toEqual({ option_id: 'a', yes: 1, if_need_be: 1, no: 1, responded: 3 });
  });

  it('should count a participant once per option when they vote on every option', () => {
    const result = aggregateByOption(
      [option('a', 0), option('b', 1)],
      [response('p1', 'a', 'yes'), response('p1', 'b', 'no')]
    );

    expect(result[0]).toMatchObject({ option_id: 'a', yes: 1, responded: 1 });
    expect(result[1]).toMatchObject({ option_id: 'b', no: 1, responded: 1 });
  });

  it('should count a participant once when a duplicate answer exists for the same option', () => {
    const result = aggregateByOption(
      [option('a', 0)],
      [response('p1', 'a', 'no'), response('p1', 'a', 'yes')]
    );

    expect(result[0]).toEqual({ option_id: 'a', yes: 1, if_need_be: 0, no: 0, responded: 1 });
  });

  it('should preserve option order by position when tallies are returned', () => {
    // Passed out of order: the tally must not inherit the caller's ordering.
    const result = aggregateByOption([option('c', 2), option('a', 0), option('b', 1)], []);

    expect(result.map((t) => t.option_id)).toEqual(['a', 'b', 'c']);
  });

  it('should ignore responses whose option id is not in the option list', () => {
    const result = aggregateByOption(
      [option('a', 0)],
      [response('p1', 'a', 'yes'), response('p2', 'ghost', 'yes')]
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ option_id: 'a', yes: 1, if_need_be: 0, no: 0, responded: 1 });
  });

  it('should not include any participant identifier in the returned tally', () => {
    const result = aggregateByOption(
      [option('a', 0)],
      [response('billy-summers-id', 'a', 'yes'), response('peter-pitcher-id', 'a', 'no')]
    );

    expect(Object.keys(result[0]).sort()).toEqual(
      ['if_need_be', 'no', 'option_id', 'responded', 'yes'].sort()
    );
    expect(JSON.stringify(result)).not.toContain('billy-summers-id');
    expect(JSON.stringify(result)).not.toContain('peter-pitcher-id');
  });

  it('should count responded as the number of participants who voted on that option', () => {
    const result = aggregateByOption(
      [option('a', 0)],
      [response('p1', 'a', 'yes'), response('p2', 'a', 'no')]
    );

    expect(result[0].responded).toBe(2);
  });

  it('should count responded excluding participants who skipped that option', () => {
    const result = aggregateByOption(
      [option('a', 0), option('b', 1)],
      [response('p1', 'a', 'yes'), response('p2', 'a', 'yes'), response('p1', 'b', 'yes')]
    );

    expect(result[0].responded).toBe(2);
    expect(result[1].responded).toBe(1);
  });
});

describe('countResponders', () => {
  it('should return zero when nobody has replied', () => {
    expect(countResponders([])).toBe(0);
  });

  it('should count a participant once when they answered several options', () => {
    expect(
      countResponders([
        response('p1', 'a', 'yes'),
        response('p1', 'b', 'no'),
        response('p2', 'a', 'no'),
      ])
    ).toBe(2);
  });
});

describe('bestOption', () => {
  it('should return nothing when no options exist', () => {
    expect(bestOption([])).toEqual([]);
  });

  it('should return nothing when no responses exist', () => {
    expect(bestOption([tally('a', 0, 0), tally('b', 0, 0)])).toEqual([]);
  });

  it('should return nothing when every participant voted no on every option', () => {
    // The badge's only suppression condition. Without it every option ties on
    // zero, every option is badged, and the organiser is shown eight winners.
    const result = bestOption([tally('a', 0, 0, 5), tally('b', 0, 0, 5), tally('c', 0, 0, 5)]);

    expect(result).toEqual([]);
  });

  it('should return the option with the most yes votes when yes counts differ', () => {
    const result = bestOption([tally('a', 1, 0), tally('b', 3, 0), tally('c', 2, 0)]);

    expect(result.map((t) => t.option_id)).toEqual(['b']);
  });

  it('should rank on yes count alone when one option has more yes and fewer if need be', () => {
    // Pins the rule against a weighted score: under yes*2 + if_need_be, 'a'
    // would lose 4-7. A maybe is not half a yes.
    const result = bestOption([tally('a', 2, 0), tally('b', 1, 5)]);

    expect(result.map((t) => t.option_id)).toEqual(['a']);
  });

  it('should return the option with more if need be votes when two options tie on yes', () => {
    const result = bestOption([tally('a', 2, 1), tally('b', 2, 4)]);

    expect(result.map((t) => t.option_id)).toEqual(['b']);
  });

  it('should return the earlier option by position when two options tie on yes and on if need be', () => {
    // Both are badged — position orders the result, it does not exclude.
    // Tallies arrive in position order from aggregateByOption.
    const result = bestOption([tally('a', 2, 1), tally('b', 2, 1)]);

    expect(result[0].option_id).toBe('a');
  });

  it('should return every tied option when two options tie completely', () => {
    const result = bestOption([tally('a', 2, 1), tally('b', 2, 1), tally('c', 1, 0)]);

    expect(result.map((t) => t.option_id)).toEqual(['a', 'b']);
  });

  it('should return the option with any signal when the others have none', () => {
    const result = bestOption([tally('a', 0, 0, 3), tally('b', 0, 1, 2)]);

    expect(result.map((t) => t.option_id)).toEqual(['b']);
  });

  it('should rank on the tallies produced by aggregateByOption when counting end to end', () => {
    const tallies = aggregateByOption(
      [option('a', 0), option('b', 1)],
      [
        response('p1', 'a', 'yes'),
        response('p2', 'a', 'yes'),
        response('p1', 'b', 'no'),
        response('p2', 'b', 'if_need_be'),
      ]
    );

    expect(bestOption(tallies).map((t) => t.option_id)).toEqual(['a']);
  });
});
