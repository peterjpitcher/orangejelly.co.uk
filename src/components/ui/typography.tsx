import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Heading component with SEO optimization
const headingVariants = cva('font-display font-bold tracking-tight scroll-m-20', {
  variants: {
    level: {
      1: 'text-4xl lg:text-5xl',
      2: 'text-3xl',
      3: 'text-2xl',
      4: 'text-xl',
      5: 'text-lg',
      6: 'text-base',
    },
    color: {
      default: 'text-foreground',
      base: 'text-brand-base',
      support: 'text-blue-support',
      accent: 'text-orange-dark',
      highlight: 'text-brand-highlight',
      grounded: 'text-brand-grounded',
      orange: 'text-orange-dark',
      /*
       * The accent orange for navy surfaces.
       *
       * `orange` above resolves to orange-dark because the brand orange is only
       * 2.79:1 on the cream page, which fails even the 3:1 large-text bar. On navy
       * the ramp runs the other way: orange-dark is 2.80:1 there, the brand orange
       * is 4.55:1. One name per surface, because one value cannot serve both.
       */
      'orange-on-dark': 'text-orange',
      white: 'text-white',
      /*
       * `inherit` emits no colour at all, so the heading takes its container's.
       *
       * On the page background that resolves to the same navy `base` would have
       * set, because body carries text-foreground. The difference shows inside a
       * container that sets its own light text: a navy fill, a blue panel, an
       * orange CTA band. Forcing a colour there fought the container and produced
       * navy-on-blue at 1.65:1.
       */
      inherit: '',
      // `charcoal` and `teal` used to sit here as extra variants resolving to
      // text-brand-base and text-secondary, which is to say they duplicated `base`
      // and `support` under names that described neither colour accurately.
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      // Emits nothing, so a parent's text-center reaches this element.
      inherit: '',
    },
  },
  defaultVariants: {
    level: 2,
    color: 'default',
    align: 'inherit',
  },
});

export interface HeadingProps
  extends
    Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof headingVariants> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  itemProp?: string; // For schema markup
  children: React.ReactNode;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level, color, align, className, itemProp, children, ...props }, ref) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    return React.createElement(
      Tag,
      {
        ref,
        className: cn(headingVariants({ level, color, align }), className),
        itemProp,
        ...props,
      },
      children
    );
  }
);
Heading.displayName = 'Heading';

// Text component with variants
const textVariants = cva('leading-7', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    },
    color: {
      default: 'text-foreground',
      base: 'text-brand-base',
      support: 'text-blue-support',
      accent: 'text-orange-dark',
      highlight: 'text-brand-highlight',
      grounded: 'text-brand-grounded',
      muted: 'text-muted-foreground',
      white: 'text-white',
      orange: 'text-orange-dark',
      // See the Heading variant: one accent name per surface.
      'orange-on-dark': 'text-orange',
      error: 'text-destructive',
      // See the Heading variant above: no colour, so the container's wins.
      inherit: '',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
      // Emits nothing, so a parent's text-center reaches this element.
      inherit: '',
    },
  },
  defaultVariants: {
    size: 'base',
    color: 'default',
    weight: 'normal',
    align: 'inherit',
  },
});

export interface TextProps
  extends
    Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
  itemProp?: string; // For schema markup
  children: React.ReactNode;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ as = 'p', size, color, weight, align, className, itemProp, children, ...props }, ref) => {
    const Component = as;

    return (
      <Component
        ref={ref}
        className={cn(textVariants({ size, color, weight, align }), className)}
        itemProp={itemProp}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Text.displayName = 'Text';

// List components for semantic HTML
export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  ordered?: boolean;
  itemProp?: string;
  children: React.ReactNode;
}

export const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  ({ ordered = false, className, itemProp, children, ...props }, ref) => {
    const listClasses = ordered ? 'ml-6 list-decimal [&>li]:mt-2' : 'ml-6 list-disc [&>li]:mt-2';

    if (ordered) {
      return (
        <ol
          ref={ref as React.Ref<HTMLOListElement>}
          className={cn(listClasses, className)}
          itemProp={itemProp}
          {...props}
        >
          {children}
        </ol>
      );
    }

    return (
      <ul
        ref={ref as React.Ref<HTMLUListElement>}
        className={cn(listClasses, className)}
        itemProp={itemProp}
        {...props}
      >
        {children}
      </ul>
    );
  }
);
List.displayName = 'List';

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  itemProp?: string;
  children: React.ReactNode;
}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, itemProp, children, ...props }, ref) => {
    return (
      <li ref={ref} className={cn('', className)} itemProp={itemProp} {...props}>
        {children}
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
