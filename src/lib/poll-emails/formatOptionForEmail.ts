import {
  formatDateInLondon,
  formatSlotRangeInLondon,
  toLocalIsoDate,
  type IsoDate,
} from '@/lib/dateUtils';

/**
 * NOTE ON SHAPE: `option_kind` is a column on `polls`, NOT on `poll_options`.
 * A `select *` from `poll_options` will not contain it. The caller must read it
 * from the parent poll and pass it in explicitly — this type is a view over a
 * join, not a table row.
 */
export interface OptionForEmail {
  /** From polls.option_kind. */
  optionKind: 'dates' | 'slots';
  /** From poll_options.option_date. Non-null iff optionKind === 'dates'. */
  optionDate: IsoDate | null;
  /** From poll_options.starts_at. Non-null iff optionKind === 'slots'. */
  startsAt: string | null;
  /** From poll_options.ends_at. Non-null iff optionKind === 'slots'. */
  endsAt: string | null;
}

/**
 * The one place an option becomes human-readable prose.
 *
 * Date-only options never touch a zone conversion; slot options always do. That
 * split is dateUtils' central rule, and this function is the branch point for it.
 *
 * dateUtils throws on bad input, and callers must let it. A malformed option is
 * a data bug that belongs at build-payload time, before any send is attempted —
 * not something for a send's try/catch to swallow.
 */
export function formatOptionForEmail(option: OptionForEmail): string {
  if (option.optionKind === 'dates') {
    // The explicit guard beats a non-null assertion: the database constraint
    // holds this invariant, but the types coming back from a join do not, and
    // formatDateInLondon(null!) fails a long way from its cause.
    if (!option.optionDate) {
      throw new Error('A dates option must carry option_date.');
    }
    // 'Saturday, 4 July 2026' — no time, so no zone label. Adding one would be
    // a lie: a date-only option has no clock reading to sit in a zone.
    return formatDateInLondon(option.optionDate, 'long');
  }

  if (!option.startsAt || !option.endsAt) {
    throw new Error('A slots option must carry starts_at and ends_at.');
  }

  // 'Saturday, 4 July 2026, 7:30pm – 9:00pm (UK time)'
  return `${formatSlotRangeInLondon(option.startsAt, option.endsAt)} (UK time)`;
}

/**
 * Short form for a subject line: 'Sat 4 Jul'.
 *
 * A slot resolves to the London calendar date of its start, not the UTC one. A
 * 00:30 BST slot is stored as the previous day in UTC, and a subject saying so
 * would contradict the body two lines below it.
 */
export function formatOptionShortForSubject(option: OptionForEmail): string {
  if (option.optionKind === 'dates') {
    if (!option.optionDate) {
      throw new Error('A dates option must carry option_date.');
    }
    return formatDateInLondon(option.optionDate, 'short');
  }

  if (!option.startsAt) {
    throw new Error('A slots option must carry starts_at.');
  }

  return formatDateInLondon(toLocalIsoDate(option.startsAt), 'short');
}
