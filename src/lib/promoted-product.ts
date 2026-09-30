/**
 * The product the whole site is promoting, in one place.
 *
 * Peter asked for Cheers to be promoted on the site (30 September 2026): a band on the
 * homepage and the Pubs page and a footer link. All of them read this constant, so one
 * edit changes every promotion, and setting it to `null` takes them all down at once.
 * When Cheers opens to everyone, change `eyebrow`, `footerLabel` and `cta` here.
 *
 * What Cheers does comes from its own live homepage (`src/content/homepage.ts` in the
 * cheersai2.0 repo), the source of truth for its features. The Anchor being its first
 * venue comes from that repo's CLAUDE.md. Cheers' own site names no venues, but The
 * Anchor is ours, so saying so here is ours to say. Two things must
 * never appear here, and both are checked: a price (Cheers' plans are priced on its own
 * site; the only price on this site is the hourly rate) and "for pubs" or "for
 * hospitality", because the homepage describes the company by market, not by sector.
 * "Venues" is the word that works on both the homepage and the Pubs page.
 *
 * The launch month is Peter's expectation (30 September 2026). Cheers can only open to
 * everyone once Meta approves its App Review, so if that slips, change the eyebrow.
 */
export interface PromotedProduct {
  name: string;
  /** Another origin, so every link to it opens in a new tab. */
  href: string;
  /** The footer label. Short: it sits in a column of one-to-three-word links. */
  footerLabel: string;
  eyebrow: string;
  title: string;
  /** The line under the title on a band. */
  blurb: string;
  cta: string;
}

export const PROMOTED_PRODUCT: PromotedProduct | null = {
  name: 'Cheers',
  href: 'https://cheers.orangejelly.co.uk/',
  footerLabel: 'Cheers (coming soon)',
  eyebrow: 'Coming soon · expected November 2026',
  title: 'Meet Cheers, the social media tool we built for venues.',
  blurb:
    "Cheers turns one idea into posts for Facebook and Instagram, written in your venue's voice and published on time. You approve every post before it goes out. It already runs at The Anchor, our own venue.",
  cta: 'See Cheers',
};
