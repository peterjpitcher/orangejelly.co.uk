import { cn } from '@/lib/utils';
import type { OptionKind } from '@/components/polls/vote/poll-display';
import type { AttendanceMode, Availability, PollOptionRow } from '@/lib/db/polls';
import type { OptionTally } from '@/lib/poll-aggregate';
import type { OrganiserParticipant } from '@/app/availability/o/organiser-data';
import { answerKey } from '@/app/availability/o/organiser-data';
import {
  answerGlyph,
  answerLabel,
  cellAccessibleName,
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
 * carries obligations: roving tabindex, arrow-key navigation, aria-colindex on
 * every cell. Half-implementing it makes the cells INVISIBLE to a screen reader
 * rather than merely awkward, which is strictly worse than the plain table this
 * read-only data actually wants. `<table>` with real headers is correct here.
 *
 * The markup is hand-rolled rather than built on `src/components/ui/table.tsx`:
 * that component hard-wraps the table in its own bare `overflow-auto` div and
 * routes `className` to the `<table>`, leaving the wrapper unreachable, so the
 * scroll region cannot be given `tabIndex`, `role` or an accessible name, and
 * the sticky offsets have nothing to attach to.
 */

export interface ResultsTableProps {
  optionKind: OptionKind;
  options: PollOptionRow[];
  participants: OrganiserParticipant[];
  /** `${participant_id}:${option_id}` -> availability. Absence means not answered. */
  responses: Record<string, Availability>;
  /**
   * `${participant_id}:${option_id}` -> attendance, sparse. Only a yes or an
   * if-need-be carries one, and only for answers given since the question
   * existed. The organiser needs the exceptions: a cell is marked only when
   * someone needs a video link, because "in person at the pub" is the assumed
   * case and marking it would bury the signal in the noise.
   */
  attendance: Record<string, AttendanceMode>;
  tallies: OptionTally[];
  /** Highlighted column. Never by colour alone: the header carries sr-only text. */
  confirmedOptionId: string | null;
}

/**
 * The shape every answer chip shares. State-specific fill, border and weight come
 * from `cellChipClass`.
 */
export const CELL_CHIP_BASE =
  'inline-flex min-h-[32px] min-w-[32px] items-center justify-center gap-1 rounded-oj border-1.5 px-2 py-1';

/**
 * The chip treatment for one answer.
 *
 * FOUR TREATMENTS THAT DIFFER BY MORE THAN HUE. This is the densest screen in the
 * app, and hue alone at this size is guesswork even for someone who can see it:
 * at a glance a reader is scanning shape and weight, not sampling colour. So each
 * state changes fill, border style and text weight together.
 *
 *   yes           filled deep orange, white label, solid ink border, bold
 *   if need be    filled sunken cream, ink label, solid ink border
 *   no            no fill, dashed border, recessed label
 *   not answered  nothing at all
 *
 * WHITE ON THE ORANGE FILL, NEVER INK. `--oj-orange-deep` with white is 5.24:1;
 * the brand orange with white is 2.97:1 and is not a fill text ever sits on.
 *
 * The glyph and the word beside it still carry the state on their own, which is
 * what keeps this out of WCAG 1.4.1 territory. The fill is reinforcement.
 */
export function cellChipClass(state: CellState): string {
  switch (state) {
    case 'yes':
      return 'border-oj-ink bg-oj-orange-deep font-bold text-oj-on-band';
    case 'if_need_be':
      return 'border-oj-ink bg-oj-cream-2 font-semibold text-oj-ink';
    case 'no':
      return 'border-dashed border-oj-ink/40 text-oj-ink-2';
    default:
      // `text-oj-ink-2` rather than the muted `text-oj-ink-3`, which drops to
      // 4.4:1 on the chosen column's tint.
      return 'border-transparent text-oj-ink-2';
  }
}

/** The proportional bar. Decorative: the counts are already stated as text above it. */
function TotalsBar({ tally }: { tally: OptionTally }): JSX.Element | null {
  const total = tally.yes + tally.if_need_be + tally.no;
  if (total === 0) return null;

  // A plain three-div flex bar. `src/components/ui/progress.tsx` cannot do this:
  // it takes one value and hardcodes `bg-primary`, so it physically cannot show
  // three shares. The fills echo the chips above them, so the bar reads as a
  // summary of the column rather than as a second, unrelated colour scheme.
  const shares: Array<{ count: number; fill: string }> = [
    { count: tally.yes, fill: 'bg-oj-orange-deep' },
    { count: tally.if_need_be, fill: 'bg-oj-peach' },
    { count: tally.no, fill: 'bg-oj-ink/25' },
  ];

  return (
    // aria-hidden: it restates the line of text directly above it, and a screen
    // reader announcing the same counts twice is noise.
    <div
      aria-hidden="true"
      className="mt-2 flex h-1.5 w-full overflow-hidden rounded-oj bg-oj-cream-2"
    >
      {shares.map((share, index) =>
        share.count > 0 ? (
          <div
            key={index}
            className={share.fill}
            style={{ width: `${(share.count / total) * 100}%` }}
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
  attendance,
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
      // The full-bleed negative margin went when the border arrived: a card that
      // runs its own edges off the side of a phone reads as a rendering fault.
      className="oj-focus relative overflow-x-auto overflow-y-visible rounded-oj border-1.5 border-oj-ink bg-oj-paper"
    >
      <table className="w-full min-w-[640px] border-collapse text-sm">
        {/* Supplies both the region's accessible name and an explanation of the
            axes: a matrix whose rows and columns are unnamed is a puzzle. */}
        <caption id="results-table-caption" className="sr-only">
          Who can make each option. Rows are people, columns are the options you put up.
        </caption>

        <thead>
          <tr>
            {/* z-20: the corner cell sits above both sticky edges. */}
            <th
              scope="col"
              className="sticky left-0 top-0 z-20 border-b-1.5 border-oj-ink bg-oj-cream p-3 text-left font-bold text-oj-ink"
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
                    'sticky top-0 z-10 min-w-[8rem] border-b-1.5 border-oj-ink p-3 text-left font-bold text-oj-ink',
                    // Sticky needs a non-transparent background or the rows
                    // scroll visibly underneath it.
                    isConfirmed ? 'bg-oj-orange-soft' : 'bg-oj-cream'
                  )}
                >
                  {/* The chosen column is marked by words, not only by fill. */}
                  {isConfirmed && <span className="sr-only">Chosen option. </span>}
                  <span className="block">{dateLine}</span>
                  {timeLine && <span className="block font-normal text-oj-ink-2">{timeLine}</span>}
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
              // A soft rule, not the full ink 1.5px: thirty hard lines down a
              // dense grid is a fence, and the rows stop being readable.
              <tr key={participant.id} className="border-t-1.5 border-oj-ink/10">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-oj-paper p-3 text-left font-semibold text-oj-ink"
                >
                  {/* The visible name stays short; the accessible name carries
                      the disambiguator when two people share it. */}
                  <span aria-hidden="true">{participant.display_name}</span>
                  <span className="sr-only">{accessibleName}</span>
                </th>

                {options.map((option) => {
                  const state: CellState = responses[answerKey(participant.id, option.id)] ?? null;
                  const needsLink = attendance[answerKey(participant.id, option.id)] === 'virtual';
                  const isConfirmed = option.id === confirmedOptionId;

                  return (
                    <td key={option.id} className={cn('p-3', isConfirmed && 'bg-oj-orange-soft')}>
                      <span className={cn(CELL_CHIP_BASE, cellChipClass(state))}>
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
                      {/* EMBER, NOT DEEP ORANGE. This marker is 12px bold, so it
                          needs 4.5:1 and never gets the 3:1 large text is allowed.
                          Deep orange manages 5.06:1 on paper but only 4.25:1 once
                          the cell is the chosen column's orange tint, and the
                          chosen column is exactly where a video marker is most
                          likely to matter. Ember holds 8.54:1 and 7.17:1. */}
                      {needsLink && (
                        <span className="mt-1 block text-xs font-bold text-oj-ember">
                          <span aria-hidden="true">▶ </span>video
                          <span className="sr-only">: would join by video or dial-in</span>
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr className="border-t-1.5 border-oj-ink">
            <th
              scope="row"
              className="sticky left-0 z-10 bg-oj-cream p-3 text-left font-bold text-oj-ink"
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
                    option.id === confirmedOptionId ? 'bg-oj-orange-soft' : 'bg-oj-cream'
                  )}
                >
                  {/* COUNTS AS TEXT FIRST, then the bar. The summary card above
                      uses percentages; the foot uses counts, because a per-cell
                      percentage next to a per-cell count is noise. */}
                  <span className="block text-oj-ink">{totalsLine(counts)}</span>
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
