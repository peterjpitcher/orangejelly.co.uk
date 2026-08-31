'use client';

import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/oj';
import { cn } from '@/lib/utils';
import { getTodayIsoDate, type IsoDate } from '@/lib/dateUtils';
import {
  addDaysIso,
  addMonthsIso,
  buildTimeRows,
  computeSlotEnd,
  describeDateCell,
  describeSlotCell,
  formatDayOfMonth,
  formatMonthLabel,
  formatWallClockLabel,
  formatWeekRangeLabel,
  formatWeekdayShort,
  isOutsideMonth,
  isPastDate,
  isPastSlot,
  londonWallClockExists,
  londonZoneLabel,
  monthGridWeeks,
  slotKey,
  startOfMonthIso,
  startOfWeekIso,
  weekDaysIso,
  type CalendarSlot,
  type DurationChoice,
} from '@/lib/poll-calendar';
import { MAX_POLL_OPTIONS } from '@/lib/validation/polls';

/**
 * The calendar grid. Click a cell to offer that time; click it again to take it
 * back.
 *
 * Why a grid and not a list of rows: a repeater asks the organiser to hold the
 * week in their head and type it back one field at a time. Laying the week out
 * and letting them point at it is the whole difference between the two.
 *
 * Three decisions worth knowing before changing anything here:
 *
 *   - **Click, never drag.** Drag-select is what breaks When2Meet on a phone: a
 *     quick drag on iOS Safari is a scroll, and the scroll silently unpicks what
 *     was already chosen. One tap is one toggle, and that is not a simplification
 *     to be optimised away later.
 *   - **Month is offered only for whole days.** A month cell has no room for
 *     times and cannot express them, so the tabs appear only when the poll is
 *     about whole days, where a month is the right tool. This is a real view in
 *     the mode it suits rather than a tab that half works in both.
 *   - **`now` starts null on purpose.** Past cells cannot be disabled during the
 *     server render without the server's clock and the browser's disagreeing at a
 *     minute boundary and tearing hydration. Nothing is past until mounted, and
 *     the disabling appears a frame later.
 */

/** Sized so a full week clears the 44px tap target and still scrolls at 375px. */
const GRID_TEMPLATE = '4.5rem repeat(7, minmax(5.5rem, 1fr))';
const GRID_MIN_WIDTH = '43rem';

export type ViewMode = 'week' | 'month';

interface AvailabilityGridProps {
  duration: DurationChoice;
  /** Selected whole-day options, when the poll is about whole days. */
  dates: Array<{ date: string }>;
  /** Selected timed options, when the poll is about times. */
  slots: CalendarSlot[];
  onToggleDate: (date: IsoDate) => void;
  onToggleSlot: (slot: CalendarSlot) => void;
  disabled: boolean;
}

/** Why a cell cannot be picked. Null when it can. */
type CellBlock = 'past' | 'missing' | 'cap' | null;

const BLOCK_REASON: Record<Exclude<CellBlock, null>, string> = {
  past: 'already gone',
  // The spring-forward gap. The clocks go forward and the hour is skipped, so
  // there is no such time to offer. See londonWallClockToInstant.
  missing: 'the clocks go forward, so this hour does not exist',
  cap: `you have already picked ${MAX_POLL_OPTIONS}`,
};

export default function AvailabilityGrid({
  duration,
  dates,
  slots,
  onToggleDate,
  onToggleSlot,
  disabled,
}: AvailabilityGridProps): JSX.Element {
  const allDay = duration === 'all-day';

  const [view, setView] = useState<ViewMode>('week');
  const [anchor, setAnchor] = useState<IsoDate>(() => getTodayIsoDate());
  const [expanded, setExpanded] = useState(false);

  // See the header: null until mounted, so the server render and the first
  // client render agree about what is past.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  const today = getTodayIsoDate();
  const weekStart = startOfWeekIso(anchor);
  const weekDays = useMemo(() => weekDaysIso(weekStart), [weekStart]);

  const selectedCount = allDay ? dates.length : slots.length;
  const atCap = selectedCount >= MAX_POLL_OPTIONS;

  const selectedDates = useMemo(() => new Set(dates.map((entry) => entry.date)), [dates]);
  const selectedSlots = useMemo(() => new Set(slots.map((slot) => slotKey(slot))), [slots]);

  const durationMinutes = allDay ? 0 : duration;
  const timeRows = useMemo(
    () => (allDay ? [] : buildTimeRows(durationMinutes, expanded)),
    [allDay, durationMinutes, expanded]
  );

  // Month only ever shows whole days, so the tabs only make sense there.
  const effectiveView: ViewMode = allDay ? view : 'week';

  function blockForDate(date: IsoDate): CellBlock {
    if (now !== null && isPastDate(date, today)) return 'past';
    if (!selectedDates.has(date) && atCap) return 'cap';
    return null;
  }

  function blockForSlot(date: IsoDate, time: string, key: string): CellBlock {
    if (!londonWallClockExists(date, time)) return 'missing';
    if (now !== null && isPastSlot(date, time, now)) return 'past';
    if (!selectedSlots.has(key) && atCap) return 'cap';
    return null;
  }

  function shift(days: number): void {
    setAnchor((current) => addDaysIso(current, days));
  }

  const rangeLabel =
    effectiveView === 'month' ? formatMonthLabel(anchor) : formatWeekRangeLabel(weekStart);

  return (
    // min-w-0 all the way down: any ancestor that refuses to shrink hands its
    // width to the scroll container, and a scroll container as wide as its
    // content does not scroll. See the fieldset note in create-poll-form.tsx.
    <div className="min-w-0 space-y-4">
      {/* Tabs, then navigation, then the zone. The zone is a statement of fact and
          sits apart from the controls so it does not read as one. */}
      {allDay && (
        <div
          className="inline-flex rounded-oj border-1.5 border-oj-ink bg-oj-paper p-1"
          role="tablist"
          aria-label="Calendar view"
        >
          {(['week', 'month'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={view === mode}
              onClick={() => setView(mode)}
              disabled={disabled}
              className={cn(
                'oj-focus min-h-tap rounded-oj px-4 text-sm font-bold capitalize transition-colors',
                // Deep orange, never brand orange: the label is bold and small, so
                // white on it has to clear 4.5:1, and only the deep tone does.
                view === mode
                  ? 'bg-oj-orange-deep text-oj-on-band'
                  : 'text-oj-ink hover:bg-oj-cream-2'
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <NavButton
            label={effectiveView === 'month' ? 'Previous month' : 'Previous week'}
            glyph="←"
            disabled={disabled}
            onClick={() =>
              effectiveView === 'month' ? setAnchor(addMonthsIso(anchor, -1)) : shift(-7)
            }
          />
          <NavButton
            label={effectiveView === 'month' ? 'Next month' : 'Next week'}
            glyph="→"
            disabled={disabled}
            onClick={() =>
              effectiveView === 'month' ? setAnchor(addMonthsIso(anchor, 1)) : shift(7)
            }
          />
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => setAnchor(today)}
            disabled={disabled}
          >
            Today
          </Button>
          {/* Announced, because moving the week changes everything below it. */}
          <p className="text-base font-bold text-oj-ink" aria-live="polite">
            {rangeLabel}
          </p>
        </div>

        <p className="text-[14.5px] text-oj-ink-3">{londonZoneLabel(weekStart)}</p>
      </div>

      {/* The scroll container. tabIndex and a name because a keyboard user must be
          able to reach and scroll it; without both, the far end of the week is
          unreachable on a narrow screen. */}
      <div
        className="oj-focus overflow-x-auto rounded-oj-lg border-1.5 border-oj-ink bg-oj-paper"
        tabIndex={0}
        role="group"
        aria-label={
          effectiveView === 'month'
            ? `Days in ${formatMonthLabel(anchor)}. Scroll to see the whole month.`
            : `Times from ${formatWeekRangeLabel(weekStart)}. Scroll sideways to see the whole week.`
        }
      >
        {effectiveView === 'month' ? (
          <MonthGrid
            anchor={anchor}
            selectedDates={selectedDates}
            blockFor={blockForDate}
            onToggleDate={onToggleDate}
            disabled={disabled}
          />
        ) : (
          <div
            className="grid"
            style={{ gridTemplateColumns: GRID_TEMPLATE, minWidth: GRID_MIN_WIDTH }}
          >
            {/* Header row. The gutter corner is sticky too, or it slides out from
                under the day names as the week scrolls. */}
            {/* The rules inside the grid are the hairline ink the design system
                uses inside a table, not the 1.5px card border: at 1.5px every
                one of the fifty-odd lines here reads as an edge and the grid
                stops being one object. */}
            <div className="sticky left-0 z-20 border-b border-r border-oj-ink/15 bg-oj-paper" />
            {weekDays.map((date) => (
              <div
                key={date}
                className={cn(
                  'border-b border-oj-ink/15 px-1 py-2 text-center',
                  date === today && 'bg-oj-orange-soft'
                )}
              >
                <div className="text-xs uppercase tracking-[0.08em] text-oj-ink-3">
                  {formatWeekdayShort(date)}
                </div>
                <div className="text-base font-bold text-oj-ink">{formatDayOfMonth(date)}</div>
              </div>
            ))}

            {allDay ? (
              // One row: the whole day, per day.
              <>
                <div className="sticky left-0 z-10 flex items-center justify-end border-r border-oj-ink/15 bg-oj-paper px-2 py-1 text-right text-xs text-oj-ink-3">
                  All day
                </div>
                {weekDays.map((date) => {
                  const selected = selectedDates.has(date);
                  const block = blockForDate(date);
                  return (
                    <GridCell
                      key={date}
                      selected={selected}
                      block={block}
                      disabled={disabled}
                      label={describeDateCell(date, selected)}
                      onClick={() => onToggleDate(date)}
                    />
                  );
                })}
              </>
            ) : (
              timeRows.map((time) => (
                <TimeRow
                  key={time}
                  time={time}
                  weekDays={weekDays}
                  durationMinutes={durationMinutes}
                  selectedSlots={selectedSlots}
                  blockForSlot={blockForSlot}
                  onToggleSlot={onToggleSlot}
                  disabled={disabled}
                />
              ))
            )}
          </div>
        )}
      </div>

      {!allDay && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          disabled={disabled}
          className="oj-focus min-h-tap text-sm font-bold text-oj-orange-deep underline underline-offset-4 hover:text-oj-ink"
        >
          {expanded ? 'Show 8am to 11pm only' : 'Show every hour of the day'}
        </button>
      )}

      {/* The counter. Live, because the cap is only fair if you can see it coming. */}
      <div aria-live="polite" className="space-y-1">
        <p className="text-[14.5px] text-oj-ink-3">
          {selectedCount} of {MAX_POLL_OPTIONS} times selected
        </p>
        {atCap && (
          <p className="text-[14.5px] leading-normal text-oj-ink-3">
            That&apos;s the maximum. Unpick one to pick another. A long list makes people skim and
            leave out times they could actually do.
          </p>
        )}
      </div>
    </div>
  );
}

/** One hour (or part-hour) across all seven days. */
function TimeRow({
  time,
  weekDays,
  durationMinutes,
  selectedSlots,
  blockForSlot,
  onToggleSlot,
  disabled,
}: {
  time: string;
  weekDays: IsoDate[];
  durationMinutes: number;
  selectedSlots: Set<string>;
  blockForSlot: (date: IsoDate, time: string, key: string) => CellBlock;
  onToggleSlot: (slot: CalendarSlot) => void;
  disabled: boolean;
}): JSX.Element {
  return (
    <>
      <div className="sticky left-0 z-10 flex items-start justify-end border-r border-oj-ink/15 bg-oj-paper px-2 py-1 text-right text-xs text-oj-ink-3">
        {formatWallClockLabel(time)}
      </div>
      {weekDays.map((date) => {
        const slot = computeSlotEnd(date, time, durationMinutes);
        const key = slotKey(slot);
        const selected = selectedSlots.has(key);
        const block = blockForSlot(date, time, key);

        return (
          <GridCell
            key={date}
            selected={selected}
            block={block}
            disabled={disabled}
            label={describeSlotCell(slot, selected)}
            onClick={() => onToggleSlot(slot)}
          />
        );
      })}
    </>
  );
}

/**
 * One cell.
 *
 * A real button with aria-pressed, and selection shown by a tick and a border as
 * well as the fill: colour alone fails WCAG 1.4.1 and fails the person the
 * grid is hardest for.
 */
function GridCell({
  selected,
  block,
  disabled,
  label,
  onClick,
}: {
  selected: boolean;
  block: CellBlock;
  disabled: boolean;
  label: string;
  onClick: () => void;
}): JSX.Element {
  const blocked = block !== null;
  const accessibleName = blocked ? `${label}, unavailable: ${BLOCK_REASON[block]}` : label;

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={accessibleName}
      title={blocked ? `Unavailable: ${BLOCK_REASON[block]}` : undefined}
      disabled={disabled || blocked}
      onClick={onClick}
      className={cn(
        'oj-focus relative m-0.5 flex min-h-tap items-center justify-center rounded-oj border-1.5 text-sm transition-colors',
        /*
         * Three states that have to be told apart at a glance, and each one is
         * carried by more than colour:
         *
         *   picked      filled deep orange, white label, solid ink edge, tick
         *   free        cream tile inside the paper grid, solid faint edge
         *   unpickable  no tile at all and a dashed edge, so the cell reads as
         *               absent rather than merely quiet
         *
         * The fill is the DEEP orange. Brand orange with white is 2.97:1, and
         * the tick sits at 14px bold, so it needs 4.5:1; deep orange gives 5.24.
         */
        selected
          ? 'border-oj-ink bg-oj-orange-deep font-bold text-oj-on-band'
          : 'border-oj-ink/20 bg-oj-cream hover:border-oj-ink hover:bg-oj-orange-soft',
        blocked &&
          !selected &&
          'cursor-not-allowed border-dashed border-oj-ink/20 bg-transparent hover:border-oj-ink/20 hover:bg-transparent',
        block === 'past' && 'opacity-40'
      )}
    >
      {/* The tick is the non-colour signal. Hidden from the name, which already
          says "selected". */}
      {selected && <span aria-hidden="true">✓</span>}
    </button>
  );
}

/** The month, for whole-day polls. */
function MonthGrid({
  anchor,
  selectedDates,
  blockFor,
  onToggleDate,
  disabled,
}: {
  anchor: IsoDate;
  selectedDates: Set<string>;
  blockFor: (date: IsoDate) => CellBlock;
  onToggleDate: (date: IsoDate) => void;
  disabled: boolean;
}): JSX.Element {
  const month = startOfMonthIso(anchor);
  const weeks = useMemo(() => monthGridWeeks(month), [month]);
  const today = getTodayIsoDate();

  return (
    <div className="grid grid-cols-7 gap-0.5 p-1" style={{ minWidth: '20rem' }}>
      {weeks[0].map((date) => (
        <div
          key={`head-${date}`}
          className="py-2 text-center text-xs uppercase tracking-[0.08em] text-oj-ink-3"
        >
          {formatWeekdayShort(date)}
        </div>
      ))}

      {weeks.flat().map((date) => {
        const selected = selectedDates.has(date);
        const block = blockFor(date);
        const outside = isOutsideMonth(date, month);
        const blocked = block !== null;

        return (
          <button
            key={date}
            type="button"
            aria-pressed={selected}
            aria-label={
              blocked
                ? `${describeDateCell(date, selected)}, unavailable: ${BLOCK_REASON[block]}`
                : describeDateCell(date, selected)
            }
            disabled={disabled || blocked}
            onClick={() => onToggleDate(date)}
            className={cn(
              'oj-focus flex min-h-tap items-center justify-center gap-1 rounded-oj border-1.5 text-sm transition-colors',
              // Same three states, same reasoning, as GridCell above.
              selected
                ? 'border-oj-ink bg-oj-orange-deep font-bold text-oj-on-band'
                : 'border-oj-ink/20 bg-oj-cream hover:border-oj-ink hover:bg-oj-orange-soft',
              blocked &&
                !selected &&
                'cursor-not-allowed border-dashed border-oj-ink/20 bg-transparent',
              // Matches the week grid: a day that has been and gone reads as spent.
              block === 'past' && 'opacity-40',
              outside && !selected && 'text-oj-ink-3 opacity-60',
              date === today && !selected && 'border-oj-orange-deep'
            )}
          >
            <span aria-hidden="true">{formatDayOfMonth(date)}</span>
            {selected && <span aria-hidden="true">✓</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Icon-only navigation. Always named: an arrow is not a label. */
function NavButton({
  label,
  glyph,
  onClick,
  disabled,
}: {
  label: string;
  glyph: string;
  onClick: () => void;
  disabled: boolean;
}): JSX.Element {
  return (
    // The design system's ghost button, squared off. It already carries the
    // border, the focus ring, the disabled state and the tap floor; the only
    // thing it does not know is that this one holds a glyph rather than a word,
    // so the width and the side padding are the whole override.
    <Button
      variant="ghost"
      size="sm"
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="w-tap px-0"
    >
      <span aria-hidden="true">{glyph}</span>
    </Button>
  );
}
