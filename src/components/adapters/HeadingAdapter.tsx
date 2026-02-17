import * as React from 'react';
import { Heading as ShadcnHeading } from '@/components/ui/typography';

// The existing Heading component interface
interface LegacyHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  color?:
    | 'charcoal'
    | 'orange'
    | 'teal'
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
  align = 'left',
  color = 'charcoal',
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
    charcoal: 'charcoal',
    orange: 'orange',
    teal: 'teal',
    white: 'white',
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
