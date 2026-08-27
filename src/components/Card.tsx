import * as React from 'react';
import {
  Card as ShadcnCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

interface LegacyCardProps {
  variant?: 'default' | 'bordered' | 'shadowed' | 'colored';
  background?:
    | 'white'
    | 'surface'
    | 'orange-light'
    | 'brand-base'
    | 'orange'
    | 'blue-support'
    | 'base'
    | 'highlight'
    | 'grounded';
  padding?: 'small' | 'medium' | 'large';
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

// `brand-base` now renders the navy it names. It arrived here as the old
// `teal-dark` key, which this component rendered as bg-secondary (blue #01619E)
// even though teal-dark resolved to navy #1A2F49 in the palette: the component and
// the token disagreed. Navy is what both the old token and the new name mean, so
// the two call sites that passed teal-dark render navy rather than blue now.
const backgroundMap = {
  white: 'bg-white',
  'orange-light': 'bg-orange/10',
  'brand-base': 'bg-brand-base text-white',
  orange: 'bg-primary text-primary-foreground',
  base: 'bg-brand-base text-white',
  'blue-support': 'bg-blue-support text-white',
  surface: 'bg-surface',
  highlight: 'bg-brand-highlight text-brand-base',
  grounded: 'bg-brand-grounded text-white',
};

const paddingMap = {
  small: 'p-4',
  medium: 'p-6',
  large: 'p-8',
};

export default function Card({
  variant = 'default',
  background = 'white',
  padding = 'medium',
  className,
  children,
  asChild = false,
  ...props
}: LegacyCardProps) {
  const Comp = asChild ? Slot : 'div';

  const cardClasses = cn(
    // Base styles handled by shadcn Card
    variant === 'bordered' && 'border-2',
    variant === 'shadowed' && 'shadow-lg',
    /*
     * `background` applies whatever the variant is.
     *
     * It used to be gated on variant === 'colored' while the text-white rule below
     * was gated on `background` alone, so the two could disagree. A card asking for
     * a dark background without also saying variant="colored" got the white text
     * and no background: white on white, 1:1. pub-rescue's "30-Day Momentum Sprint"
     * card was rendering completely invisible text that way.
     *
     * `variant` describes the border and shadow treatment; it was never meant to be
     * the switch that decides whether `background` is honoured at all. Cards that
     * asked for surface or orange-light without variant="colored" now get the tint
     * they asked for too.
     */
    backgroundMap[background],
    // Remove default padding since we'll apply it to the content
    'p-0',
    className
  );

  const contentClasses = cn(
    paddingMap[padding],
    // Ensure proper text color for dark backgrounds
    (background === 'brand-base' ||
      background === 'orange' ||
      background === 'blue-support' ||
      background === 'base' ||
      background === 'grounded') &&
      'text-white'
  );

  if (asChild) {
    return (
      <Comp className={cn(cardClasses, contentClasses)} {...props}>
        {children}
      </Comp>
    );
  }

  return (
    <ShadcnCard className={cardClasses} {...props}>
      <div className={contentClasses}>{children}</div>
    </ShadcnCard>
  );
}

// Export compound components for compatibility
export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
