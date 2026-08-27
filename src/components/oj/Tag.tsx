import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Labelled chip for pressure points, topics and metadata.
 *
 * Near-square corners, not pills. The design system reserves the pill shape for
 * taxonomy tags specifically, so a chip that rounds fully reads as a category when
 * it is not one.
 */
const tagVariants = cva(
  'inline-flex items-center gap-2 border-1.5 border-oj-ink rounded-oj font-bold font-oj',
  {
    variants: {
      variant: {
        outline: 'bg-oj-paper text-oj-ink',
        ink: 'bg-oj-ink text-oj-cream',
        orange: 'bg-oj-orange text-oj-ink',
      },
      size: {
        sm: 'text-[12.5px] px-[9px] py-1',
        md: 'text-sm px-[13px] py-[7px]',
      },
    },
    defaultVariants: { variant: 'outline', size: 'md' },
  }
);

export interface TagProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>, VariantProps<typeof tagVariants> {
  /** Signal dot. `true` is the orange pressure dot, `'ok'` the green availability dot. */
  dot?: boolean | 'ok';
  children?: React.ReactNode;
}

export function Tag({
  variant = 'outline',
  size,
  dot = true,
  children,
  className,
  ...rest
}: TagProps): JSX.Element {
  return (
    <span className={cn(tagVariants({ variant, size }), className)} {...rest}>
      {dot ? (
        <span
          // Decorative. The dot repeats what the label already says, and the 'ok'
          // state is carried by the text beside it rather than by colour alone,
          // which is what keeps this out of WCAG 1.4.1 territory.
          aria-hidden="true"
          className={cn(
            'h-2 w-2 flex-none rounded-full border',
            dot === 'ok' ? 'bg-oj-ok' : variant === 'orange' ? 'bg-oj-cream' : 'bg-oj-orange',
            variant === 'ink' ? 'border-oj-cream' : 'border-oj-ink'
          )}
        />
      ) : null}
      {children}
    </span>
  );
}

export default Tag;
