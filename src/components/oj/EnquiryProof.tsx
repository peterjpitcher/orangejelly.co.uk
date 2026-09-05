import { SUCCESS_METRICS } from '@/lib/constants';
import { type GuideProof } from '@/lib/guide-conversion';
import { Anchor } from './Anchor';

const proofDetails = {
  bookings: {
    value: SUCCESS_METRICS.tableBookings.value,
    label: 'table bookings',
    href: '/results/interest-that-did-not-turn-up',
  },
  'food-revenue': {
    value: SUCCESS_METRICS.foodRevenue.value,
    label: 'food revenue in three months',
    href: '/results/busy-and-not-much-better-off',
  },
  'search-visibility': {
    value: SUCCESS_METRICS.searchVisibility.value,
    label: 'Google Search visibility',
    href: '/results/nobody-could-find-us',
  },
};
export function EnquiryProof({ proof }: { proof: GuideProof }): JSX.Element {
  if (proof === 'none')
    return (
      <Anchor
        href="/results"
        className="oj-focus inline-flex min-h-tap items-center font-bold underline"
      >
        See what changed at The Anchor
      </Anchor>
    );
  const detail = proofDetails[proof];
  return (
    <div className="mt-5 border-t-1.5 border-oj-ink/20 pt-4 text-oj-ink">
      <p className="font-bold">
        {detail.value} {detail.label} at The Anchor, our own venue.
      </p>
      <p className="mt-2 text-sm text-oj-ink-2">
        Results from our own venue, not a forecast for your business.
      </p>
      <Anchor
        href={detail.href}
        className="oj-focus mt-2 inline-flex min-h-tap items-center font-bold underline"
      >
        See what changed at The Anchor
      </Anchor>
    </div>
  );
}
