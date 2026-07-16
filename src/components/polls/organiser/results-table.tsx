import { cn } from '@/lib/utils';
import type { OptionKind } from '@/components/polls/vote/poll-display';
import type { PollOptionRow, Availability } from '@/lib/db/polls';
import type { OptionTally } from '@/lib/poll-aggregate';
import type { OrganiserParticipant } from '@/app/availability/o/organiser-data';
import { answerKey } from '@/app/availability/o/organiser-data';
import {
  answerGlyph,
  answerLabel,
  cellAccessibleName,
  cellClass,
  duplicateNames,
  optionFullLabel,
  optionHeaderLines,
  participantAccessibleName,
  totalsLine,
  type CellState,
} from './results-display';

/**
 * The results matrix: who said what, to every option.
 *
 * A SERVER COMPONENT WITH NO CLIENT JS. A table of at most 8 columns does not
 * need hydrating, and server-rendering it means the organiser sees results the
 * instant the page paints.
 *
 * A REAL SEMANTIC <table>, NOT role="grid". A grid is an interactive widget and
 * carries obligations — roving tabindex, arrow-key navigation, aria-colindex on
 * every cell. Half-implementing it makes the cells INVISIBLE to a screen reader
 * rather than merely awkward, which is strictly worse than the plain table this
 * read-only data actually wants. `<table>` with real headers is correct here.
 *
 * The markup is hand-rolled rather than built on `src/components/ui/table.tsx`:
 * that component hard-wraps the table in its own bare `overflow-auto` div and
 * routes `className` to the `<table>`, leaving the wrapper unreachable — so the
 * scroll region cannot be given `tabIndex`, `role` or an accessible name, and
 * the sticky offsets have nothing to attach to.
 */

export interface ResultsTableProps {
  optionKind: OptionKind;
  options: PollOptionRow[];
  participants: OrganiserParticipant[];
  /** `${participant_id}:${option_id}` -> availability. Absence means not answered. */
  responses: Record<string, Availability>;
  tallies: OptionTally[];
  /** Highlighted column. Never by colour alone — the header carries sr-only text. */
  confirmedOptionId: string | null;
}

/** The proportional bar. Decorative: the counts are already stated as text above it. */
function TotalsBar({ tally }: { tally: OptionTally }): JSX.Element | null {
  const total = tally.yes + tally.if_need_be + tally.no;
  if (total === 0) return null;

  // A plain three-div flex bar. `src/components/ui/progress.tsx` cannot do this:
  // it takes one value and hardcodes `bg-primary`, so it physically cannot show
  // three shares. `bg-chart-1` is also not an option — tailwind.config.js has no
  // `chart` colour key, so the class compiles to nothing at all. Inline
  // `hsl(var(--chart-N))` reads the tokens that do exist in globals.css.
  const shares: Array<{ count: number; colour: string }> = [
    { count: tally.yes, colour: 'hsl(var(--chart-2))' },
    { count: tally.if_need_be, colour: 'hsl(var(--chart-4))' },
    { count: tally.no, colour: 'hsl(var(--chart-1))' },
  ];

  return (
    // aria-hidden: it restates the line of text directly above it, and a screen
    // reader announcing the same counts twice is noise.
    <div
      aria-hidden="true"
      className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-surface"
    >
      {shares.map((share, index) =>
        share.count > 0 ? (
          <div
            key={index}
            style={{ backgroundColor: share.colour, width: `${(share.count / total) * 100}%` }}
          />
        ) : null
      )}
    </div>
  );
}

export default function ResultsTable({
  optionKind,
  options,
  participants,
  responses,
  tallies,
  confirmedOptionId,
}: ResultsTableProps): JSX.Element {
  const duplicates = duplicateNames(participants);
  const tallyById = new Map(tallies.map((tally) => [tally.option_id, tally]));

  // Computed once per option rather than once per cell: an 8-column, 30-row
  // matrix would otherwise format the same label 240 times.
  const optionLabels = new Map(
    options.map((option) => [option.id, optionFullLabel(option, optionKind)])
  );

  return (
    <div
      tabIndex={0}
      role="region"
      aria-labelledby="results-table-caption"
      className="relative -mx-4 overflow-x-auto overflow-y-visible px-4 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-focus-ring)] sm:mx-0 sm:px-0"
    >
      <table className="w-full min-w-[640px] border-collapse text-sm">
        {/* Supplies both the region's accessible name and an explanation of the
            axes — a matrix whose rows and columns are unnamed is a puzzle. */}
        <caption id="results-table-caption" className="sr-only">
          Who can make each option. Rows are people, columns are the options you put up.
        </caption>

        <thead>
          <tr>
            {/* z-20: the corner cell sits above both sticky edges. */}
            <th
              scope="col"
              className="sticky left-0 top-0 z-20 bg-white p-3 text-left font-semibold text-charcoal"
            >
              Name
            </th>
            {options.map((option) => {
              const [dateLine, timeLine] = optionHeaderLines(option, optionKind);
              const isConfirmed = option.id === confirmedOptionId;

              return (
                <th
                  key={option.id}
                  scope="col"
                  className={cn(
                    'sticky top-0 z-10 min-w-[8rem] p-3 text-left font-semibold text-charcoal',
                    // Sticky needs a non-transparent background or the rows
                    // scroll visibly underneath it.
                    isConfirmed ? 'bg-orange-light' : 'bg-white'
                  )}
                >
                  {/* The chosen column is marked by words, not only by fill. */}
                  {isConfirmed && <span className="sr-only">Chosen option. </span>}
                  <span className="block">{dateLine}</span>
                  {timeLine && (
                    <span className="block font-normal text-charcoal-light">{timeLine}</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {participants.map((participant) => {
            const accessibleName = participantAccessibleName(
              participant.display_name,
              participant.created_at,
              duplicates.has(participant.display_name.trim().toLowerCase())
            );

            return (
              <tr key={participant.id} className="border-t border-border">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-white p-3 text-left font-medium text-charcoal"
                >
                  {/* The visible name stays short; the accessible name carries
                      the disambiguator when two people share it. */}
                  <span aria-hidden="true">{participant.display_name}</span>
                  <span className="sr-only">{accessibleName}</span>
                </th>

                {options.map((option) => {
                  const state: CellState = responses[answerKey(participant.id, option.id)] ?? null;
                  const isConfirmed = option.id === confirmedOptionId;

                  return (
                    <td key={option.id} className={cn('p-3', isConfirmed && 'bg-orange-light')}>
                      <span
                        className={cn(
                          'inline-flex min-h-[32px] min-w-[32px] items-center justify-center gap-1 rounded-md px-2 py-1',
                          cellClass(state)
                        )}
                      >
                        <span aria-hidden="true">{answerGlyph(state)}</span>
                        {/* Self-contained: name, option and state together. */}
                        <span className="sr-only">
                          {cellAccessibleName(
                            accessibleName,
                            optionLabels.get(option.id) ?? '',
                            state
                          )}
                        </span>
                        {/* Hidden at 375px to keep the columns narrow. The glyph
                            and the sr-only text both survive, so 1.4.1 holds. */}
                        <span aria-hidden="true" className="hidden sm:inline">
                          {answerLabel(state)}
                        </span>
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr className="border-t-2 border-charcoal/20">
            <th
              scope="row"
              className="sticky left-0 z-10 bg-white p-3 text-left font-semibold text-charcoal"
            >
              Totals
            </th>
            {options.map((option) => {
              const tally = tallyById.get(option.id);
              const counts = tally ?? { yes: 0, if_need_be: 0, no: 0 };

              return (
                <td
                  key={option.id}
                  className={cn(
                    'p-3 align-top',
                    option.id === confirmedOptionId && 'bg-orange-light'
                  )}
                >
                  {/* COUNTS AS TEXT FIRST, then the bar. The summary card above
                      uses percentages; the foot uses counts, because a per-cell
                      percentage next to a per-cell count is noise. */}
                  <span className="block text-charcoal">{totalsLine(counts)}</span>
                  {tally && <TotalsBar tally={tally} />}
                </td>
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
