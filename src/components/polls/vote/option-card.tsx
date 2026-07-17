'use client';

import Text from '@/components/Text';
import { cn } from '@/lib/utils';
import type { AttendanceAnswer, AvailabilityAnswer } from '@/lib/validation/poll-responses';
import AnswerRadioGroup from './answer-radio-group';
import {
  formatOptionLabel,
  formatTallyLine,
  type DisplayOption,
  type OptionKind,
  type TallyCounts,
} from './poll-display';

/**
 * One option, one card. NEVER a matrix.
 *
 * This is the entire reason the tool exists. A drag-select grid — When2Meet's
 * design, and Doodle's on a narrow screen — registers a drag as a scroll on iOS
 * Safari and silently deselects answers already given. The person does not find
 * out. Vertical scroll is the only gesture a phone does reliably, so the list is
 * vertical and stays vertical: at desktop it stays a single column rather than
 * widening into a grid, which would reintroduce the matrix by the back door.
 *
 * The card IS the `<fieldset>` (§1 P1.3) — not a `<div>` wrapping one. The
 * `<legend>` is the option's full label, which gives the radio group its
 * accessible name natively, with no ARIA to hand-roll and get wrong.
 */

export interface OptionCardProps {
  option: DisplayOption;
  optionKind: OptionKind;
  tally: TallyCounts;
  /** At zero responses the tally line is replaced by the caller's reply line. */
  responderCount: number;
  value: AvailabilityAnswer | null;
  onChange: (value: AvailabilityAnswer) => void;
  /** How they would attend. Only rendered once the answer is yes or if-need-be. */
  attendance: AttendanceAnswer;
  onAttendanceChange: (value: AttendanceAnswer) => void;
  disabled?: boolean;
  /** Set after a submit that found this option unanswered. */
  invalid?: boolean;
}

export default function OptionCard({
  option,
  optionKind,
  tally,
  responderCount,
  value,
  onChange,
  attendance,
  onAttendanceChange,
  disabled = false,
  invalid = false,
}: OptionCardProps): JSX.Element {
  const label = formatOptionLabel(option, optionKind);
  const errorId = `option-error-${option.id}`;

  return (
    <fieldset
      className={cn(
        'rounded-lg border-2 bg-white p-4',
        invalid ? 'border-destructive' : 'border-charcoal/15'
      )}
      aria-describedby={invalid ? errorId : undefined}
    >
      <legend className="px-1 text-lg font-semibold text-charcoal">{label}</legend>

      <div className="mt-2">
        <AnswerRadioGroup
          optionId={option.id}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>

      {/*
        Only once they can make it. A "no" has no way of attending, and showing
        the question anyway would imply the answer still matters. In-person is
        the default: the pub is the usual venue, and the video link is the
        exception worth flagging to the organiser.
      */}
      {value !== null && value !== 'no' && (
        <div
          className="mt-3 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="How would you join?"
        >
          <span className="text-sm text-charcoal/70">Joining:</span>
          {(
            [
              { mode: 'in_person', label: 'In person' },
              { mode: 'virtual', label: 'Video or dial-in' },
            ] as const
          ).map(({ mode, label }) => {
            const selected = attendance === mode;
            return (
              <label
                key={mode}
                className={cn(
                  'flex min-h-[44px] cursor-pointer select-none items-center rounded-md border-2 px-3 text-sm font-medium transition-colors',
                  'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-charcoal',
                  selected
                    ? 'border-teal bg-teal text-white'
                    : 'border-charcoal/25 bg-white text-charcoal hover:border-charcoal/50',
                  disabled && 'cursor-default opacity-90'
                )}
              >
                <input
                  type="radio"
                  name={`attendance-${option.id}`}
                  value={mode}
                  checked={selected}
                  disabled={disabled}
                  onChange={() => onAttendanceChange(mode)}
                  className="absolute h-px w-px overflow-hidden opacity-0"
                />
                {selected && (
                  <span aria-hidden="true" className="mr-1.5">
                    ✓
                  </span>
                )}
                {label}
              </label>
            );
          })}
        </div>
      )}

      {invalid && (
        // Text plus the red border — colour is never the only signal.
        <p id={errorId} className="mt-2 text-sm font-medium text-destructive">
          Pick one of the three.
        </p>
      )}

      {responderCount > 0 && (
        <Text size="sm" color="muted" className="mt-3">
          {formatTallyLine(tally)}
        </Text>
      )}
    </fieldset>
  );
}
