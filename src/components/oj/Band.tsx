import * as React from 'react';

import { cn } from '@/lib/utils';

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
    <section
      id={id}
      className={cn(
        SURFACES[tone],
        divider && 'border-b-1.5 border-oj-ink',
        size === 'lg' ? 'py-16 sm:py-24' : 'py-14 sm:py-20',
        className
      )}
    >
      <div className="page-shell">
        {heading ? (
          <h2
            className={cn('oj-display text-[clamp(30px,5.5vw,52px)] leading-[0.98]', headingWidth)}
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
        {children ? <div className={heading || intro ? 'mt-8' : undefined}>{children}</div> : null}
      </div>
    </section>
  );
}

export default Band;
