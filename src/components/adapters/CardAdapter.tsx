import * as React from "react";
import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface LegacyCardProps {
  variant?: 'default' | 'bordered' | 'shadowed' | 'colored';
  background?:
    | 'white'
    | 'cream'
    | 'orange-light'
    | 'teal-dark'
    | 'orange'
    | 'teal'
    | 'base'
    | 'blue-support'
    | 'surface'
    | 'highlight'
    | 'grounded';
  padding?: 'small' | 'medium' | 'large';
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

const backgroundMap = {
  white: 'bg-white',
  cream: 'bg-muted',
  'orange-light': 'bg-orange/10',
  'teal-dark': 'bg-secondary text-secondary-foreground',
  orange: 'bg-primary text-primary-foreground',
  teal: 'bg-secondary text-secondary-foreground',
  base: 'bg-charcoal text-white',
  'blue-support': 'bg-teal text-white',
  surface: 'bg-cream',
  highlight: 'bg-[var(--color-highlight)] text-charcoal',
  grounded: 'bg-[var(--color-grounded)] text-white',
};

const paddingMap = {
  small: 'p-4',
  medium: 'p-6',
  large: 'p-8'
};

export default function CardAdapter({
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
    variant === 'colored' && backgroundMap[background],
    // Remove default padding since we'll apply it to the content
    "p-0",
    className
  );

  const contentClasses = cn(
    paddingMap[padding],
    // Ensure proper text color for dark backgrounds
    (background === 'teal-dark' ||
      background === 'orange' ||
      background === 'teal' ||
      background === 'base' ||
      background === 'blue-support' ||
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
      <div className={contentClasses}>
        {children}
      </div>
    </ShadcnCard>
  );
}

// Export compound components for compatibility
export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
