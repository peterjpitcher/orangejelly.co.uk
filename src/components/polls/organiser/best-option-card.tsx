import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import type { OptionTally } from '@/lib/poll-aggregate';
import type { PollOptionRow } from '@/lib/db/polls';
import type { OptionKind } from '@/components/polls/vote/poll-display';
import ConfirmControl from './confirm-control';
import { optionFullLabel, percentOf } from './results-display';

/**
 * "Best so far": the single most useful thing on this page, and the reason it
 * sits ABOVE the matrix rather than below it: the matrix needs horizontal
 * scrolling on a phone and this does not.
 *
 * COUNTS BELOW FIVE REPLIES, PERCENTAGES FROM FIVE. "100% said yes" computed
 * from a single voter is true and absurd; "1 of 1 said yes" is the honest
 * sentence. Once the denominator is big enough to mean something the display
 * switches to percentages, per the house style for proportions. Either way the
 * denominator is people who replied: never `poll_responses` rows, which count
 * one person once per option.
 *
 * THE CARD IS SUPPRESSED ENTIRELY when nothing has any yes or if-need-be:
 * `bestOption` returns `[]` for that case, and rendering it anyway would badge
 * all eight options as joint winners, which is worse than showing none. The page
 * decides that by checking the array is non-empty: see `page.tsx`.
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

  // "100% said yes" computed from one voter is technically true and reads like
  // a joke. Below five replies the counts are the honest sentence ("1 of 1 said
  // yes"); from five the percentage starts meaning something and stays per the
  // house style for proportions.
  const statLine =
    responderCount < 5
      ? `${leader.yes} of ${responderCount} said yes` +
        (leader.if_need_be > 0 ? `, ${leader.if_need_be} if need be` : '')
      : `${percentOf(leader.yes, responderCount)}% said yes, ${percentOf(
          leader.if_need_be,
          responderCount
        )}% said if need be`;

  return (
    <Card variant="bordered" padding="medium" className="mt-6">
      <Heading level={2} className="text-xl">
        Best so far
      </Heading>
      <Text className="mt-2 font-semibold">
        {optionKind === 'slots' ? `${label} UK time` : label}
      </Text>
      <Text size="sm" color="muted" className="mt-1">
        {statLine}.
      </Text>

      <ConfirmControl
        organiserToken={organiserToken}
        optionId={leader.option_id}
        // Formatted on the server: no date formatter crosses the boundary.
        optionLabel={optionKind === 'slots' ? `${label} UK time` : label}
        hasResponses={responderCount > 0}
      />

      {/* Every tied option is offered. Picking one by `position` would be
          arbitrary: that is the order the organiser typed them in, not a
          preference: so the tie is stated WITH the alternatives it refers to,
          and those render as outline buttons: subordinate to the leader's, not
          three identical slabs of orange competing for the same click. */}
      {best.length > 1 && (
        <div className="mt-5 border-t border-charcoal/15 pt-4">
          <Text size="sm" color="muted">
            {best.length === 2
              ? 'One more is level with it. Pick whichever suits you:'
              : `${best.length - 1} more are level with it. Pick whichever suits you:`}
          </Text>
          <ul className="mt-3 space-y-4">
            {best.slice(1).map((tally) => {
              const option = optionById.get(tally.option_id);
              if (!option) return null;
              const tiedLabel = optionFullLabel(option, optionKind);
              const display = optionKind === 'slots' ? `${tiedLabel} UK time` : tiedLabel;

              return (
                <li key={tally.option_id}>
                  <Text size="sm" className="font-medium">
                    {display}
                  </Text>
                  <ConfirmControl
                    organiserToken={organiserToken}
                    optionId={tally.option_id}
                    optionLabel={display}
                    hasResponses={responderCount > 0}
                    buttonLabel="Confirm this one instead"
                    buttonVariant="outline"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Card>
  );
}
