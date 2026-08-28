import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { Anchor } from './Anchor';

/**
 * The repositioning Button.
 *
 * Lives in components/oj/ alongside the existing Button rather than replacing it.
 * The old one has around 200 call sites across pages that have not been rebuilt yet;
 * swapping it now would restyle the live site months before the launch release. The
 * old one comes out when nothing imports it.
 *
 * Ported from docs/brand/design-system/components/core/Button. The reference is
 * plain React with an injected stylesheet, so this is a port rather than a copy:
 * same contract, same behaviour, expressed in the repo's CVA and Tailwind idiom.
 *
 * One primary per view. Orange is the single dominant call to action, ink is
 * secondary emphasis, ghost is tertiary. Sentence case labels only.
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2.5 whitespace-nowrap',
    'font-oj font-bold',
    'border-1.5 border-oj-ink rounded-oj',
    'min-h-tap',
    'cursor-pointer no-underline',
    'transition-[transform,box-shadow] duration-oj-hover ease-oj',
    // Hover lifts the block up-left onto its shadow. Active returns it flat rather
    // than pushing further in: the reference is explicit that press collapses the
    // shadow entirely, which reads as the block being pushed back into the page.
    'hover:-translate-x-0.5 hover:-translate-y-0.5',
    'active:translate-x-0 active:translate-y-0 active:shadow-none',
    'focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--oj-surface-page),0_0_0_4.5px_var(--oj-orange)]',
    'disabled:pointer-events-none disabled:opacity-40',
    // Respect reduced motion: the shadow still communicates state, the movement goes.
    'motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-oj-orange text-oj-ink hover:shadow-press',
        // An ink block casts an orange shadow. Ink on ink would be invisible.
        ink: 'bg-oj-ink text-oj-cream hover:shadow-press-orange',
        ghost: 'bg-transparent text-oj-ink hover:shadow-press',
      },
      size: {
        sm: 'text-[13.5px] px-3.5 py-[7px]',
        md: 'text-[15px] px-5 py-[11px]',
        lg: 'text-[17px] px-7 py-[15px]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  /** Append a → that nudges on hover. */
  arrow?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export type ButtonProps = ButtonBaseProps &
  (
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>)
    | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  );

/**
 * The arrow is decorative and hidden from assistive technology: "Book a growth
 * diagnostic →" and "Book a growth diagnostic" are the same instruction, and a
 * screen reader announcing "right arrow" adds nothing.
 */
function Arrow(): JSX.Element {
  return (
    <span
      aria-hidden="true"
      className="font-normal transition-transform duration-oj-hover ease-oj group-hover/btn:translate-x-[3px] motion-reduce:transition-none"
    >
      →
    </span>
  );
}

export function Button({
  variant,
  size,
  arrow = false,
  href,
  children,
  className,
  ...rest
}: ButtonProps): JSX.Element {
  const classes = cn('group/btn', buttonVariants({ variant, size }), className);
  const content = (
    <>
      {children}
      {arrow ? <Arrow /> : null}
    </>
  );

  if (href !== undefined) {
    return (
      <Anchor
        href={href}
        className={classes}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Anchor>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}

export default Button;
