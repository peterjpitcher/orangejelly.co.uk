'use client';

import { cn } from '@/lib/utils';
import type { AvailabilityAnswer } from '@/lib/validation/poll-responses';

/**
 * The three-state answer control: Yes / If need be / No.
 *
 * NATIVE RADIOS, NO DEPENDENCY. Neither `src/components/ui/radio-group.tsx` nor
 * `@radix-ui/react-radio-group` exists in this repo, and neither is needed.
 * Native radios give roving focus, arrow-key navigation, single-choice semantics
 * and form-reset behaviour for free, and they are the one control iOS Safari has
 * never broken. A checkbox would be wrong: the answer is single-choice, and a
 * checkbox group announces as multi-select.
 *
 * NO ARIA GROUPING HERE. The caller wraps this in a `<fieldset>` with a
 * `<legend>` naming the option in full (§1 P1.3), which is native grouping and
 * needs no `role="radiogroup"`. §1 is authoritative over the §2.3 draft that
 * called for hand-rolled ARIA — and hand-rolled ARIA grouping is the version
 * that breaks.
 *
 * EVERY STATE CARRIES A GLYPH AND A WORD. Colour is never the sole indicator
 * (WCAG 1.4.1), because the most common failure of every tool of this kind is a
 * green/amber/red grid that is unreadable to eight percent of men.
 */

interface AnswerOption {
  value: AvailabilityAnswer;
  label: string;
  glyph: string;
  /** Only applied when this answer is the chosen one. */
  selected: string;
}

/**
 * Wire values are fixed by `poll_responses.availability`'s CHECK constraint.
 * 'if_need_be' — never 'if_needed'. The database rejects anything else.
 */
const ANSWERS: readonly AnswerOption[] = [
  { value: 'yes', label: 'Yes', glyph: '✓', selected: 'border-orange bg-orange text-white' },
  {
    value: 'if_need_be',
    label: 'If need be',
    glyph: '~',
    selected: 'border-brand-highlight bg-brand-highlight text-charcoal',
  },
  {
    value: 'no',
    label: 'No',
    glyph: '✗',
    selected: 'border-charcoal bg-surface-alt text-charcoal',
  },
];

export interface AnswerRadioGroupProps {
  /** `poll_options.id` — becomes the radio `name`, so the group is unique per card. */
  optionId: string;
  /** No answer is preselected. `null` means genuinely unanswered, and stays that way. */
  value: AvailabilityAnswer | null;
  onChange: (value: AvailabilityAnswer) => void;
  disabled?: boolean;
}

export default function AnswerRadioGroup({
  optionId,
  value,
  onChange,
  disabled = false,
}: AnswerRadioGroupProps): JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-2">
      {ANSWERS.map((answer) => {
        const isSelected = value === answer.value;

        return (
          <label
            key={answer.value}
            className={cn(
              // 56px, comfortably over the 44px floor. These are the only
              // controls on the screen, so thumb accuracy beats density.
              'relative flex min-h-[56px] select-none flex-col items-center justify-center gap-1',
              'rounded-md border-2 px-2 py-3 text-sm font-semibold transition-colors',
              'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2',
              'focus-within:outline-charcoal',
              disabled ? 'cursor-default opacity-90' : 'cursor-pointer',
              isSelected ? answer.selected : 'border-charcoal/25 bg-white text-charcoal',
              !isSelected && !disabled && 'hover:border-charcoal/50'
            )}
          >
            <input
              type="radio"
              name={`answer-${optionId}`}
              value={answer.value}
              checked={isSelected}
              disabled={disabled}
              onChange={() => onChange(answer.value)}
              // Visually hidden but present, focusable and announced. Not
              // `hidden` and not `display:none`, either of which would take it
              // out of the tab order and off the accessibility tree.
              className="absolute h-px w-px overflow-hidden opacity-0"
            />
            <span aria-hidden="true" className="text-base leading-none">
              {answer.glyph}
            </span>
            <span className="text-center leading-tight">{answer.label}</span>
          </label>
        );
      })}
    </div>
  );
}
