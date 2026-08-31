import * as React from 'react';

import { cn } from '@/lib/utils';

import { GroundProvider, type Ground } from './Ground';

/**
 * A full-width page section: surface, gutter, display heading, optional intro.
 *
 * Every repositioned page is a stack of these, so it exists to stop each page
 * re-deciding the vertical rhythm and the heading size. Three pages with three
 * slightly different section paddings is the sort of thing nobody can point at and
 * everybody can feel.
 *
 * `tone` names the role rather than the colour. Naming a variant after its colour
 * is how a palette change turns into a rename across every page.
 */
export interface BandProps {
  id?: string;
  heading?: React.ReactNode;
  intro?: React.ReactNode;
  tone?: 'page' | 'paper' | 'ink' | 'orange';
  /** Constrains the heading so a long display line does not run the full width. */
  headingWidth?: string;
  /** The last band before the footer has nothing to divide it from. */
  divider?: boolean;
  size?: 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}

const SURFACES: Record<NonNullable<BandProps['tone']>, string> = {
  page: 'bg-oj-cream',
  paper: 'bg-oj-paper',
  ink: 'bg-oj-ink text-oj-cream',
  orange: 'bg-oj-band text-oj-on-band',
};

/*
 * A Band paints the background, so a Band declares the ground. Every button inside
 * one then picks its own border, label and shadow without the call site being asked
 * to remember which way round they go. This covers about twenty call sites on its
 * own, which is most of them.
 */
const GROUNDS: Record<NonNullable<BandProps['tone']>, Ground> = {
  page: 'light',
  paper: 'light',
  ink: 'ink',
  orange: 'band',
};

export function Band({
  id,
  heading,
  intro,
  tone = 'page',
  headingWidth,
  divider = true,
  size = 'md',
  children,
  className,
}: BandProps): JSX.Element {
  return (
    <GroundProvider value={GROUNDS[tone]}>
      <section
        id={id}
        className={cn(
          SURFACES[tone],
          divider && 'border-b-1.5 border-oj-ink',
          /*
           * `lg` is the closing-band size, and its padding is deliberately
           * asymmetric.
           *
           * All nineteen uses are the last Band on their page with
           * `divider={false}`, and sixteen of them are `tone="ink"`, sitting
           * directly on top of an ink footer. Symmetric 96px there meant 96px of
           * empty dark below the call to action and another 64px of footer padding
           * under it: 160px of nothing between the button somebody is meant to
           * press and the first thing below it, in one unbroken slab that reads as
           * a single enormous footer.
           *
           * So the air moves above the heading, where it separates the band from
           * the page, instead of below the button, where it only separates dark
           * from more dark. 120px total against the design system's own ink CTA
           * sections, which run 64px on five templates and 80px on two, and never 96.
           */
          size === 'lg' ? 'pb-10 pt-14 sm:pb-10 sm:pt-20' : 'py-14 sm:py-20',
          className
        )}
      >
        <div className="page-shell">
          {heading ? (
            <h2
              className={cn(
                'oj-display text-[clamp(30px,5.5vw,52px)] leading-[0.98]',
                headingWidth
              )}
            >
              {heading}
            </h2>
          ) : null}
          {intro ? (
            <p
              className={cn(
                'measure mt-5 text-[17px] leading-relaxed',
                tone === 'ink' ? 'text-oj-cream/80' : 'text-oj-ink-2'
              )}
            >
              {intro}
            </p>
          ) : null}
          {children ? (
            <div className={heading || intro ? 'mt-8' : undefined}>{children}</div>
          ) : null}
        </div>
      </section>
    </GroundProvider>
  );
}

export default Band;
