import { describe, expect, it } from 'vitest';
import {
  formatOptionLabel,
  formatReplyCount,
  formatTallyLine,
  type DisplayOption,
} from './poll-display';

function dateOption(overrides: Partial<DisplayOption> = {}): DisplayOption {
  return {
    id: 'option-1',
    option_date: '2026-07-04',
    starts_at: null,
    ends_at: null,
    position: 1,
    ...overrides,
  };
}

function slotOption(overrides: Partial<DisplayOption> = {}): DisplayOption {
  return {
    id: 'option-2',
    option_date: null,
    // 19:30 London on 4 July 2026 is 18:30Z — BST is UTC+1.
    starts_at: '2026-07-04T18:30:00.000Z',
    ends_at: '2026-07-04T20:00:00.000Z',
    position: 1,
    ...overrides,
  };
}

describe('formatOptionLabel', () => {
  it('should render a dates option from option_date, with no time invented', () => {
    expect(formatOptionLabel(dateOption(), 'dates')).toBe('Saturday, 4 July 2026');
  });

  it('should render a slots option as a London range', () => {
    expect(formatOptionLabel(slotOption(), 'slots')).toBe('Saturday, 4 July 2026, 7:30pm – 9:00pm');
  });

  it('should not hand a date-only value to the slot formatter', () => {
    // The whole point of branching on option_kind. formatSlotRangeInLondon
    // throws on a date-only value by design, because a date carries no time and
    // rendering '2026-07-04' as a slot produces "1:00am" — a time nobody chose,
    // presented as fact. A 'dates' poll must never reach that path.
    expect(() => formatOptionLabel(dateOption(), 'dates')).not.toThrow();
  });

  it('should throw rather than guess when a slots option has no instants', () => {
    expect(() => formatOptionLabel(slotOption({ starts_at: null }), 'slots')).toThrow(
      /missing starts_at or ends_at/
    );
  });

  it('should throw rather than guess when a dates option has no date', () => {
    expect(() => formatOptionLabel(dateOption({ option_date: null }), 'dates')).toThrow(
      /missing option_date/
    );
  });

  it('should spell both dates out when a slot crosses midnight', () => {
    const overnight = slotOption({
      starts_at: '2026-07-04T22:00:00.000Z',
      ends_at: '2026-07-04T23:30:00.000Z',
    });
    // 23:00 – 00:30 London. Both dates appear, so the range cannot read backwards.
    expect(formatOptionLabel(overnight, 'slots')).toBe(
      'Saturday, 4 July 2026, 11:00pm – Sunday, 5 July 2026, 12:30am'
    );
  });
});

describe('formatTallyLine', () => {
  it('should render counts only, never a name', () => {
    expect(formatTallyLine({ yes: 4, if_need_be: 1, no: 2 })).toBe('4 yes · 1 if need be · 2 no');
  });

  it('should render zeroes when asked', () => {
    expect(formatTallyLine({ yes: 0, if_need_be: 0, no: 0 })).toBe('0 yes · 0 if need be · 0 no');
  });
});

describe('formatReplyCount', () => {
  it('should invite the first responder rather than show a row of zeroes', () => {
    expect(formatReplyCount(0)).toBe("Nobody's answered yet — you're first.");
  });

  it('should use the singular for one', () => {
    expect(formatReplyCount(1)).toBe('One person has replied so far.');
  });

  it('should use the plural beyond one', () => {
    expect(formatReplyCount(7)).toBe('7 people have replied so far.');
  });
});
