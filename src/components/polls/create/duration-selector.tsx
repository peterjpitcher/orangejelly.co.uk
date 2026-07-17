'use client';

import { useState } from 'react';

import Text from '@/components/Text';
import { cn } from '@/lib/utils';
import {
  DURATION_CHOICES,
  formatDurationLabel,
  parseDurationInput,
  type DurationChoice,
  type DurationUnit,
} from '@/lib/poll-calendar';

/**
 * How long each option runs — and, as a consequence, what kind of poll this is.
 *
 * The duration is the only control that decides between the two option kinds the
 * form emits: "All day" produces date-only options, everything else produces
 * timed slots. That is why it sits above the grid rather than beside it, and why
 * moving between "All day" and a timed length is the one change that discards
 * what has been picked.
 *
 * The row is labelled in the unit a person would say — "2 hours", not "120 min"
 * — while minutes stay the stored unit throughout. Same for the custom field:
 * type 5, pick hours, and the form still emits 300. One canonical unit in the
 * data, two ways to type it.
 *
 * Native radios rather than buttons with aria-pressed: this is one choice from
 * several, which is what a radio group is, and it brings arrow-key navigation
 * and the correct announcement with it instead of us rebuilding both.
 */

/** The length the custom field opens on. Deliberately not one of the presets. */
const CUSTOM_SEED_MINUTES = 45;

interface DurationSelectorProps {
  value: DurationChoice;
  onChange: (value: DurationChoice) => void;
  disabled: boolean;
}

const CHOICE_CLASSES =
  'flex min-h-[44px] cursor-pointer items-center justify-center rounded-md border border-border bg-white px-3 py-2 text-center text-sm font-medium text-charcoal transition-colors hover:border-orange peer-checked:border-orange peer-checked:bg-orange peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-orange peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50';

/** Renders a length in the given unit, for seeding the field when the unit flips. */
function toUnit(minutes: number, unit: DurationUnit): string {
  if (unit === 'minutes') return String(minutes);
  // Trailing zeroes stripped: 45 minutes is "0.75 hours", not "0.7500".
  return String(Number((minutes / 60).toFixed(4)));
}

export default function DurationSelector({
  value,
  onChange,
  disabled,
}: DurationSelectorProps): JSX.Element {
  /**
   * Whether the custom field is open is explicit state, not derived from the
   * value. Derived, typing "6" then "0" into the field would hit 60, match the
   * "1 hour" preset, and the field would vanish mid-keystroke.
   */
  const [customOpen, setCustomOpen] = useState(false);
  const [unit, setUnit] = useState<DurationUnit>('minutes');
  const [draft, setDraft] = useState(String(CUSTOM_SEED_MINUTES));
  const [error, setError] = useState<string | null>(null);

  function choosePreset(next: DurationChoice): void {
    setCustomOpen(false);
    setError(null);
    onChange(next);
  }

  function openCustom(): void {
    setCustomOpen(true);
    setError(null);
    setUnit('minutes');
    setDraft(String(CUSTOM_SEED_MINUTES));
    onChange(CUSTOM_SEED_MINUTES);
  }

  function commit(raw: string, nextUnit: DurationUnit): void {
    setDraft(raw);
    const result = parseDurationInput(raw, nextUnit);
    // Narrowed on the value rather than on `error`: the success branch types
    // `error` as an optional `never`, which TypeScript will not use to discriminate.
    if (typeof result.minutes !== 'number') {
      // The last good length stays committed. A half-typed value must not be
      // allowed to recompute every slot the organiser has already picked.
      setError(result.error ?? 'Enter a number.');
      return;
    }
    setError(null);
    onChange(result.minutes);
  }

  function changeUnit(nextUnit: DurationUnit): void {
    setUnit(nextUnit);
    setError(null);
    // Re-express the committed length rather than reinterpreting the digits:
    // flipping 45 minutes to hours means 0.75, not 45 hours.
    const committed = typeof value === 'number' ? value : CUSTOM_SEED_MINUTES;
    setDraft(toUnit(committed, nextUnit));
  }

  return (
    <fieldset className="min-w-0 space-y-3">
      <legend className="text-base font-medium text-charcoal">How long is each option?</legend>
      <Text size="sm" color="muted">
        Pick &lsquo;All day&rsquo; to ask about whole days instead of times. You can&apos;t change
        that once the poll is out.
      </Text>

      {/* Nine choices. They wrap rather than shrink — a tap target under 44px is
          not a smaller button, it is a button you miss. */}
      <div className="flex flex-wrap gap-2">
        {/* aria-label on every input, not left to the wrapping label. The visible
            text is inside a span next to an sr-only input, and that association
            is exactly the kind a screen reader is entitled to resolve differently
            from how it looks. Stating the name outright costs nothing. */}
        {DURATION_CHOICES.map((minutes) => (
          <label key={minutes} className="relative">
            <input
              type="radio"
              name="pollDuration"
              aria-label={formatDurationLabel(minutes)}
              className="peer sr-only"
              checked={!customOpen && value === minutes}
              onChange={() => choosePreset(minutes)}
              disabled={disabled}
            />
            <span className={cn(CHOICE_CLASSES, 'min-w-[72px]')}>
              {formatDurationLabel(minutes)}
            </span>
          </label>
        ))}

        <label className="relative">
          <input
            type="radio"
            name="pollDuration"
            aria-label="All day"
            className="peer sr-only"
            checked={!customOpen && value === 'all-day'}
            onChange={() => choosePreset('all-day')}
            disabled={disabled}
          />
          <span className={cn(CHOICE_CLASSES, 'min-w-[72px]')}>All day</span>
        </label>

        <label className="relative">
          <input
            type="radio"
            name="pollDuration"
            aria-label="Custom length"
            className="peer sr-only"
            checked={customOpen}
            onChange={openCustom}
            disabled={disabled}
          />
          <span className={cn(CHOICE_CLASSES, 'min-w-[72px]')}>Custom</span>
        </label>
      </div>

      {customOpen && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="customDuration" className="text-sm font-medium text-charcoal">
              Each option runs
            </label>
            <input
              id="customDuration"
              type="text"
              inputMode="decimal"
              value={draft}
              disabled={disabled}
              aria-invalid={error !== null}
              aria-describedby={error ? 'customDurationError' : undefined}
              onChange={(event) => commit(event.target.value, unit)}
              className="h-11 w-24 rounded-md border border-border bg-white px-3 text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            />
            <label htmlFor="customDurationUnit" className="sr-only">
              Unit
            </label>
            <select
              id="customDurationUnit"
              value={unit}
              disabled={disabled}
              onChange={(event) => changeUnit(event.target.value as DurationUnit)}
              className="h-11 rounded-md border border-border bg-white px-3 text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            >
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
            </select>
          </div>

          {error ? (
            <p
              id="customDurationError"
              role="alert"
              className="text-[0.8rem] font-medium text-destructive"
            >
              {error}
            </p>
          ) : (
            <Text size="sm" color="muted">
              Anything from 5 minutes to 12 hours. Type 1.5 in hours for an hour and a half.
            </Text>
          )}
        </div>
      )}
    </fieldset>
  );
}
