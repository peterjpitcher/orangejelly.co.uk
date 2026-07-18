import { cn } from '@/lib/utils';
import { answerGlyph, answerLabel, cellClass, type CellState } from './results-display';

/**
 * The glyph key.
 *
 * Rendered directly below the table, deliberately: a key that requires scrolling
 * back up to make sense of a cell is not a key. It restates the exact chip the
 * matrix uses — same glyph, same fill, same word — so the mapping is verifiable
 * by looking rather than by remembering.
 */

const STATES: CellState[] = ['yes', 'if_need_be', 'no', null];

export default function ResultsLegend(): JSX.Element {
  return (
    <ul className="mt-4 flex flex-wrap gap-4" aria-label="What each mark means">
      {STATES.map((state) => (
        <li key={state ?? 'not_answered'} className="flex items-center gap-2 text-sm text-charcoal">
          <span
            aria-hidden="true"
            className={cn(
              'inline-flex min-h-[32px] min-w-[32px] items-center justify-center rounded-md px-2 py-1',
              cellClass(state)
            )}
          >
            {answerGlyph(state)}
          </span>
          <span>{answerLabel(state)}</span>
        </li>
      ))}
    </ul>
  );
}
