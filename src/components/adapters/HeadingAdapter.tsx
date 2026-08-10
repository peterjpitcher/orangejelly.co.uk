import * as React from 'react';
import { Heading as ShadcnHeading } from '@/components/ui/typography';

// The existing Heading component interface
interface LegacyHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  align?: 'inherit' | 'left' | 'center' | 'right';
  color?:
    | 'inherit'
    | 'brand-base'
    | 'orange'
    | 'orange-on-dark'
    | 'blue-support'
    | 'white'
    | 'base'
    | 'support'
    | 'accent'
    | 'highlight'
    | 'grounded';
  className?: string;
  itemProp?: string;
}

export default function HeadingAdapter({
  level,
  children,
  align = 'inherit',
  // Inherit by default: see the note in TextAdapter.
  color = 'inherit',
  className,
  itemProp,
  ...props
}: LegacyHeadingProps) {
  // Map color to shadcn color variant
  const colorMap = {
    base: 'base',
    support: 'support',
    accent: 'accent',
    highlight: 'highlight',
    grounded: 'grounded',
    // The legacy `charcoal` and `teal` prop names now spell their real colours and
    // resolve onto the existing `base` and `support` variants, which already
    // rendered exactly these two colours.
    'brand-base': 'base',
    'blue-support': 'support',
    orange: 'orange',
    'orange-on-dark': 'orange-on-dark',
    white: 'white',
    inherit: 'inherit',
  } as const;

  return (
    <ShadcnHeading
      level={level}
      align={align}
      color={colorMap[color] || 'default'}
      className={className}
      itemProp={itemProp}
      {...props}
    >
      {children}
    </ShadcnHeading>
  );
}
