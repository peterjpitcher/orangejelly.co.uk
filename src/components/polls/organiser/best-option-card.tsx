import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import type { OptionTally } from '@/lib/poll-aggregate';
import type { PollOptionRow } from '@/lib/db/polls';
import type { OptionKind } from '@/components/polls/vote/poll-display';
import ConfirmControl from './confirm-control';
import { optionFullLabel, percentOf } from './results-display';

/**
 * "Best so far" — the single most useful thing on this page, and the reason it
 * sits ABOVE the matrix rather than below it: the matrix needs horizontal
 * scrolling on a phone and this does not.
 *
 * PERCENTAGES HERE, COUNTS IN THE TABLE FOOT. Proportions are presented as
 * percentages per the standing rule, and the denominator is the number of people
 * who replied — never the number of `poll_responses` rows, which counts one
 * person once per option.
 *
 * THE CARD IS SUPPRESSED ENTIRELY when nothing has any yes or if-need-be:
 * `bestOption` returns `[]` for that case, and rendering it anyway would badge
 * all eight options as joint winners, which is worse than showing none. The page
 * decides that by checking the array is non-empty — see `page.tsx`.
 */

export interface BestOptionCardProps {
  organiserToken: string;
  optionKind: OptionKind;
  /** Every option tied at the top. More than one is a real tie, not a bug. */
  best: OptionTally[];
  options: PollOptionRow[];
  responderCount: number;
}

export default function BestOptionCard({
  organiserToken,
  optionKind,
  best,
  options,
  responderCount,
}: BestOptionCardProps): JSX.Element | null {
  const optionById = new Map(options.map((option) => [option.id, option]));

  const leader = best[0];
  const leaderOption = leader ? optionById.get(leader.option_id) : undefined;
  if (!leader || !leaderOption) return null;

  const label = optionFullLabel(leaderOption, optionKind);
  const yesPct = percentOf(leader.yes, responderCount);
  const ifNeedBePct = percentOf(leader.if_need_be, responderCount);

  return (
    <Card variant="bordered" padding="medium" className="mt-6">
      <Heading level={2} className="text-xl">
        Best so far
      </Heading>
      <Text className="mt-2">{optionKind === 'slots' ? `${label} UK time` : label}</Text>
      <Text size="sm" color="muted" className="mt-1">
        {yesPct}% said yes, {ifNeedBePct}% said if need be.
      </Text>

      {/* Every tied option is badged. Picking one by `position` would be
          arbitrary — that is the order the organiser typed them in, not a
          preference — so the tie is stated and the choice handed back. */}
      {best.length > 1 && (
        <Text size="sm" color="muted" className="mt-2">
          {best.length === 2
            ? 'Two options are level. Pick whichever suits you.'
            : `${best.length} options are level. Pick whichever suits you.`}
        </Text>
      )}

      <ConfirmControl
        organiserToken={organiserToken}
        optionId={leader.option_id}
        // Formatted on the server: no date formatter crosses the boundary.
        optionLabel={optionKind === 'slots' ? `${label} UK time` : label}
        hasResponses={responderCount > 0}
      />

      {best.length > 1 && (
        <ul className="mt-4 space-y-3 border-t border-charcoal/15 pt-4">
          {best.slice(1).map((tally) => {
            const option = optionById.get(tally.option_id);
            if (!option) return null;
            const tiedLabel = optionFullLabel(option, optionKind);
            const display = optionKind === 'slots' ? `${tiedLabel} UK time` : tiedLabel;

            return (
              <li key={tally.option_id}>
                <Text size="sm">{display}</Text>
                <ConfirmControl
                  organiserToken={organiserToken}
                  optionId={tally.option_id}
                  optionLabel={display}
                  hasResponses={responderCount > 0}
                  buttonLabel="Confirm this one instead"
                />
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
