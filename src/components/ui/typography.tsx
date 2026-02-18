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
      base: 'text-charcoal',
      support: 'text-teal',
      accent: 'text-orange',
      highlight: 'text-[var(--color-highlight)]',
      grounded: 'text-[var(--color-grounded)]',
      charcoal: 'text-charcoal',
      orange: 'text-orange',
      teal: 'text-secondary',
      white: 'text-white',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    level: 2,
    color: 'default',
    align: 'left',
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
      base: 'text-charcoal',
      support: 'text-teal',
      accent: 'text-orange',
      highlight: 'text-[var(--color-highlight)]',
      grounded: 'text-[var(--color-grounded)]',
      charcoal: 'text-charcoal',
      muted: 'text-muted-foreground',
      white: 'text-white',
      orange: 'text-orange',
      error: 'text-destructive',
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
    },
  },
  defaultVariants: {
    size: 'base',
    color: 'default',
    weight: 'normal',
    align: 'left',
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
