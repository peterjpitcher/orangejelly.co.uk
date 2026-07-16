import { describe, expect, it } from 'vitest';
import {
  formatOptionForEmail,
  formatOptionShortForSubject,
  type OptionForEmail,
} from './formatOptionForEmail';

const dateOption: OptionForEmail = {
  optionKind: 'dates',
  optionDate: '2026-07-04',
  startsAt: null,
  endsAt: null,
};

const slotOption: OptionForEmail = {
  optionKind: 'slots',
  optionDate: null,
  startsAt: '2026-08-04T18:00:00.000Z', // 7pm BST
  endsAt: '2026-08-04T20:00:00.000Z', // 9pm BST
};

describe('formatOptionForEmail', () => {
  it('should render a date-only option with no time and no zone label when the kind is dates', () => {
    expect(formatOptionForEmail(dateOption)).toBe('Saturday, 4 July 2026');
  });

  it('should never append a zone label to a date-only option', () => {
    // A date has no clock reading, so a zone label on it is meaningless. This is
    // deliberate and must not be "fixed" later.
    expect(formatOptionForEmail(dateOption)).not.toContain('UK time');
  });

  it('should render a slot as a London range with the zone named when the kind is slots', () => {
    expect(formatOptionForEmail(slotOption)).toBe(
      'Tuesday, 4 August 2026, 7:00pm – 9:00pm (UK time)'
    );
  });

  it('should convert a GMT slot to London time when the date falls outside BST', () => {
    expect(
      formatOptionForEmail({
        optionKind: 'slots',
        optionDate: null,
        startsAt: '2026-01-14T19:00:00.000Z',
        endsAt: '2026-01-14T21:00:00.000Z',
      })
    ).toBe('Wednesday, 14 January 2026, 7:00pm – 9:00pm (UK time)');
  });

  it('should spell both dates out when a slot crosses midnight', () => {
    // Overnight slots ship at launch. ends_at > starts_at is the only constraint.
    expect(
      formatOptionForEmail({
        optionKind: 'slots',
        optionDate: null,
        startsAt: '2026-08-04T22:00:00.000Z', // 11pm BST
        endsAt: '2026-08-04T23:30:00.000Z', // 12:30am BST, next day
      })
    ).toBe('Tuesday, 4 August 2026, 11:00pm – Wednesday, 5 August 2026, 12:30am (UK time)');
  });

  it('should throw when a dates option carries no option_date', () => {
    expect(() => formatOptionForEmail({ ...dateOption, optionDate: null })).toThrow(
      'A dates option must carry option_date.'
    );
  });

  it('should throw when a slots option is missing either end', () => {
    expect(() => formatOptionForEmail({ ...slotOption, endsAt: null })).toThrow(
      'A slots option must carry starts_at and ends_at.'
    );
  });

  it('should throw rather than invent a time when a date-only value reaches the slot arm', () => {
    // The guard in dateUtils exists because '2026-07-04' rendered as a slot
    // produced "4 July 2026 at 1:00am" — a time nobody chose. Prove it holds.
    expect(() =>
      formatOptionForEmail({
        optionKind: 'slots',
        optionDate: null,
        startsAt: '2026-07-04',
        endsAt: '2026-07-05',
      })
    ).toThrow(/date-only value/);
  });

  it('should throw when a slot timestamp carries no zone', () => {
    expect(() =>
      formatOptionForEmail({
        optionKind: 'slots',
        optionDate: null,
        startsAt: '2026-08-04T19:00:00',
        endsAt: '2026-08-04T21:00:00',
      })
    ).toThrow(/no timezone or offset/);
  });
});

describe('formatOptionShortForSubject', () => {
  it('should render a short date for a dates option', () => {
    expect(formatOptionShortForSubject(dateOption)).toBe('Sat 4 Jul');
  });

  it('should render the short date of a slot start', () => {
    expect(formatOptionShortForSubject(slotOption)).toBe('Tue 4 Aug');
  });

  it("should use the slot's London calendar date, not its UTC one", () => {
    // 00:30 BST on 5 August is 23:30 UTC on 4 August. The subject must agree
    // with the body, which says the 5th.
    expect(
      formatOptionShortForSubject({
        optionKind: 'slots',
        optionDate: null,
        startsAt: '2026-08-04T23:30:00.000Z',
        endsAt: '2026-08-05T01:00:00.000Z',
      })
    ).toBe('Wed 5 Aug');
  });
});
