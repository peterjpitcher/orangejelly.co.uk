import { BLOCK_HEADING, CARD_ON_PAPER } from '@/components/admin/BackOfficeBand';
import { cn } from '@/lib/utils';
import {
  formatOptionLabel,
  formatReplyCount,
  formatTallyLine,
  type DisplayOption,
  type OptionKind,
  type TallyCounts,
} from './poll-display';

/**
 * The read-only list, for a poll that is closed or confirmed.
 *
 * NO RADIOS HERE, not even disabled ones. A disabled radio group with no value
 * selected says "you answered nothing", but the shared participant link does
 * not identify anybody, so the visitor has no answers for it to show. It would
 * be telling every reader they abstained. Totals only.
 *
 * (The EDIT screen is the opposite case and does render disabled radios: an edit
 * token identifies exactly one person, so their own answers are a real value to
 * show. Same data, different link, different truth.)
 *
 * Still no "best option" badge, and still no names. Confirmation does not turn a
 * participant into an organiser (§1 P3.5).
 */

export interface OptionResultsProps {
  optionKind: OptionKind;
  options: DisplayOption[];
  tallies: Record<string, TallyCounts>;
  responderCount: number;
  /** Marked out from the rest when the organiser has picked a time. */
  confirmedOptionId?: string | null;
}

export default function OptionResults({
  optionKind,
  options,
  tallies,
  responderCount,
  confirmedOptionId = null,
}: OptionResultsProps): JSX.Element {
  return (
    <div className="space-y-4">
      <p className="text-sm text-oj-ink-2">{formatReplyCount(responderCount)}</p>

      <ul className="space-y-3">
        {options.map((option) => {
          const tally = tallies[option.id] ?? { yes: 0, if_need_be: 0, no: 0 };
          const isConfirmed = confirmedOptionId === option.id;

          return (
            <li
              key={option.id}
              // The chosen time takes the peach fill, which carries ink at full
              // contrast, and the words below say so: never colour alone.
              className={cn(CARD_ON_PAPER, isConfirmed && 'bg-oj-peach')}
            >
              <p className={`text-lg ${BLOCK_HEADING}`}>{formatOptionLabel(option, optionKind)}</p>

              {isConfirmed && (
                // Word plus colour, never colour alone.
                <p className="mt-1 text-sm font-bold text-oj-ink">✓ This is the time</p>
              )}

              {responderCount > 0 && (
                <p className="mt-2 text-sm text-oj-ink-2">{formatTallyLine(tally)}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
