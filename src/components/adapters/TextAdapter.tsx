import * as React from 'react';
import { Text as ShadcnText } from '@/components/ui/typography';

// The existing Text component interface
interface LegacyTextProps {
  children: React.ReactNode;
  id?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  color?:
    | 'inherit'
    | 'brand-base'
    | 'muted'
    | 'white'
    | 'base'
    | 'support'
    | 'accent'
    | 'highlight'
    | 'grounded';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'inherit' | 'left' | 'center' | 'right';
  className?: string;
  as?: 'p' | 'span' | 'div';
  itemProp?: string;
}

export default function TextAdapter({
  children,
  id,
  size = 'base',
  // Inherit by default. On the page background this resolves to the same navy the
  // old 'brand-base' default emitted, since body sets text-foreground; the change is
  // that Text no longer overrides a container that has set its own light colour.
  color = 'inherit',
  weight = 'normal',
  align = 'inherit',
  className,
  as = 'p',
  itemProp,
  ...props
}: LegacyTextProps) {
  // Map color to shadcn color variant
  const colorMap = {
    base: 'base',
    support: 'support',
    accent: 'accent',
    highlight: 'highlight',
    grounded: 'grounded',
    // See HeadingAdapter: `charcoal` was never charcoal, and `base` already
    // rendered this exact colour.
    'brand-base': 'base',
    muted: 'muted',
    white: 'white',
    inherit: 'inherit',
  } as const;

  return (
    <ShadcnText
      id={id}
      as={as}
      size={size}
      color={colorMap[color] || 'default'}
      weight={weight}
      align={align}
      className={className}
      itemProp={itemProp}
      {...props}
    >
      {children}
    </ShadcnText>
  );
}
