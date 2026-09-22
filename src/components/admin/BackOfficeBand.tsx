import { Band, type BandProps } from '@/components/oj';
import { cn } from '@/lib/utils';

/**
 * A section of a back-office screen: the public `Band`, so the paper and cream
 * surfaces, the ink rule between them and the lowercase display heading are the
 * same ones the public pages use.
 *
 * The one difference is the padding. A public band is one idea with room around
 * it; a tool screen stacks several panels of data, and the public 80px above and
 * below each one turned the dashboard into a long scroll of air. 56px keeps the
 * rhythm and the rule while leaving the numbers on screen.
 */
export default function BackOfficeBand({ className, ...rest }: BandProps): JSX.Element {
  return <Band {...rest} className={cn('py-10 sm:py-14', className)} />;
}

/*
 * The raised block, for each of the two surfaces a band can be.
 *
 * Cream on paper is 1.05:1, so a block keeps the ink border and the small hard
 * shadow to exist at all, and it flips to the other surface on a cream band. The
 * public pages do the same: a card is always the surface its band is not. One
 * definition here, so the dashboard, the polls list and the panels cannot drift.
 */
export const CARD_ON_PAPER = 'rounded-oj border-1.5 border-oj-ink bg-oj-cream p-5 shadow-press-sm';
export const CARD_ON_CREAM = 'rounded-oj border-1.5 border-oj-ink bg-oj-paper p-5 shadow-press-sm';

/*
 * A heading inside a block. Sentence case at the heavy weight, as the public cards
 * title themselves ("Sell you activity because it is easy to sell."). The lowercase
 * display face is for the band headings above them.
 */
export const BLOCK_HEADING = 'font-oj font-black tracking-[-0.02em] text-oj-ink';
