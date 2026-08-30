'use client';

/*
 * A client component, because it reads its ground from context.
 *
 * It was a server component until the ground resolver landed, and making it call a
 * hook without this line fails at prerender rather than at type-check: every page in
 * the build errors with "u is not a function" from inside React's serializer, which
 * names neither the hook nor the component. The unit tests do not catch it either,
 * because jsdom renders everything as a client.
 *
 * The cost is a hydration boundary around each button. It is small, and most buttons
 * already sat inside a client component: the header, the enquiry form, the sticky
 * bar and the consent notice are all 'use client' already.
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { Anchor } from './Anchor';
import { useGround, type Ground } from './Ground';

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
 * One primary per view. Orange is the single dominant call to action, solid is
 * secondary emphasis, ghost is tertiary. Sentence case labels only.
 *
 * WHAT THE VARIANTS NAME. A role, never a colour. The colours come from the ground
 * the button is sitting on, read from context, because the correct border and label
 * invert between a light section and a dark one and asking each call site to
 * remember that did not work: two buttons ended up ink-on-ink at 1.00:1 and
 * invisible, five more sat on orange bands at 2.92:1, and one had been hand-patched
 * with a className override. See Ground.tsx.
 *
 * Every label is bold and under 18.66px, so each one needs 4.5:1, never the 3:1 that
 * large text is allowed. That is why white cannot sit on the brand orange, where it
 * is 2.97:1, and why an orange button is the deep orange at 5.24:1 or, on the band
 * itself, ember at 8.83:1.
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2.5 whitespace-nowrap',
    'font-oj font-bold',
    'border-1.5 rounded-oj',
    'min-h-tap',
    'cursor-pointer no-underline',
    'transition-[transform,box-shadow] duration-oj-hover ease-oj',
    // Hover lifts the block up-left onto its shadow. Active returns it flat rather
    // than pushing further in: the reference is explicit that press collapses the
    // shadow entirely, which reads as the block being pushed back into the page.
    'hover:-translate-x-0.5 hover:-translate-y-0.5',
    'active:translate-x-0 active:translate-y-0 active:shadow-none',
    'focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-40',
    // Respect reduced motion: the shadow still communicates state, the movement goes.
    'motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0',
  ],
  {
    variants: {
      /** The role the button plays. Never a colour. */
      variant: {
        primary: '',
        solid: '',
        ghost: '',
      },
      /**
       * The surface underneath. Set from context, not by hand.
       *
       * It only carries the focus ring here; the fill, label and border come from
       * the compound variants below, which need to see both axes at once.
       */
      ground: {
        light: 'focus-visible:shadow-[shadow:var(--oj-ring)]',
        ink: 'focus-visible:shadow-[shadow:var(--oj-ring-inverse)]',
        band: 'focus-visible:shadow-[shadow:var(--oj-ring-inverse)]',
      },
      size: {
        sm: 'text-[13.5px] px-3.5 py-[7px]',
        md: 'text-[15px] px-5 py-[11px]',
        lg: 'text-[17px] px-7 py-[15px]',
      },
    },

    /*
     * Every role against every ground. Nine cells, and the rule behind them is one
     * sentence: the outline is always the strongest neutral against its ground, so
     * it inverts rather than disappearing.
     *
     *   fill    deep orange for primary, one step down to ember on the band so it
     *           does not vanish into a ground of its own colour
     *   label   white on any orange fill, ink on any light fill, cream on ink
     *   border  ink on a light ground, white on a dark one
     *   shadow  measured against the GROUND, never against the fill, or the block
     *           just looks like it grew
     */
    compoundVariants: [
      {
        variant: 'primary',
        ground: 'light',
        // White on #b34e08 is 5.24:1; the fill is 4.81:1 against cream, so the
        // button is legible with the border and still visible without it.
        class: 'bg-oj-orange-deep text-oj-on-band border-oj-ink hover:shadow-press',
      },
      {
        variant: 'primary',
        ground: 'ink',
        // The fill alone is 2.92:1 against ink, so the white border does the
        // boundary work at 15.27:1 rather than being decoration.
        class: 'bg-oj-orange-deep text-oj-on-band border-oj-on-band hover:shadow-press-inverse',
      },
      {
        variant: 'primary',
        ground: 'band',
        // Deep orange on the band is the same colour, so the fill steps down to
        // ember. White on ember is 8.83:1 and the white border is 5.24:1.
        class: 'bg-oj-ember text-oj-on-band border-oj-on-band hover:shadow-press-inverse',
      },
      {
        variant: 'solid',
        ground: 'light',
        // An ink block casting an orange shadow. Ink on ink would be invisible,
        // which is exactly what the old `ink` variant did on a dark section.
        class: 'bg-oj-ink text-oj-cream border-oj-ink hover:shadow-press-orange',
      },
      {
        variant: 'solid',
        ground: 'ink',
        // Inverted: a cream block on the dark ground, 14.02:1 either way round.
        class: 'bg-oj-cream text-oj-ink border-oj-on-band hover:shadow-press-orange',
      },
      {
        variant: 'solid',
        ground: 'band',
        class: 'bg-oj-cream text-oj-ink border-oj-on-band hover:shadow-press',
      },
      {
        variant: 'ghost',
        ground: 'light',
        class: 'bg-transparent text-oj-ink border-oj-ink hover:shadow-press',
      },
      {
        variant: 'ghost',
        ground: 'ink',
        class: 'bg-transparent text-oj-on-band border-oj-on-band hover:shadow-press-inverse',
      },
      {
        variant: 'ghost',
        ground: 'band',
        class: 'bg-transparent text-oj-on-band border-oj-on-band hover:shadow-press-inverse',
      },
    ],

    defaultVariants: { variant: 'primary', ground: 'light', size: 'md' },
  }
);

type ButtonBaseProps = Omit<VariantProps<typeof buttonVariants>, 'ground'> & {
  /**
   * The surface this button sits on.
   *
   * Almost never passed. It comes from the nearest GroundProvider, which is set by
   * whatever painted the background. This is the escape hatch for a button rendered
   * outside any provider, or one in a component that paints its own background and
   * has no reason to provide a ground for anything else.
   */
  ground?: Ground;
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
  ground,
  size,
  arrow = false,
  href,
  children,
  className,
  ...rest
}: ButtonProps): JSX.Element {
  const inherited = useGround();
  const classes = cn(
    'group/btn',
    buttonVariants({ variant, ground: ground ?? inherited, size }),
    className
  );
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
