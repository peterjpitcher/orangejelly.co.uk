import { cn } from '@/lib/utils';
import { answerGlyph, answerLabel, type CellState } from './results-display';
import { CELL_CHIP_BASE, cellChipClass } from './results-table';

/**
 * The glyph key.
 *
 * Rendered directly below the table, deliberately: a key that requires scrolling
 * back up to make sense of a cell is not a key. It restates the exact chip the
 * matrix uses, same glyph, same fill, same word, so the mapping is verifiable
 * by looking rather than by remembering.
 *
 * The chip classes come from `results-table` rather than being written out again
 * here. Two copies of the same fill is how a key ends up describing a colour the
 * matrix stopped using.
 */

const STATES: CellState[] = ['yes', 'if_need_be', 'no', null];

export default function ResultsLegend(): JSX.Element {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3" aria-label="What each mark means">
      {STATES.map((state) => (
        <li key={state ?? 'not_answered'} className="flex items-center gap-2 text-sm text-oj-ink">
          <span aria-hidden="true" className={cn(CELL_CHIP_BASE, cellChipClass(state))}>
            {answerGlyph(state)}
          </span>
          <span>{answerLabel(state)}</span>
        </li>
      ))}
    </ul>
  );
}
