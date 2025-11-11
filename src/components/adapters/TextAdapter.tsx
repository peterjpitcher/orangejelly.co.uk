import * as React from 'react';
import { Text as ShadcnText } from '@/components/ui/typography';

// The existing Text component interface
interface LegacyTextProps {
  children: React.ReactNode;
  id?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  color?: 'charcoal' | 'muted' | 'white';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  className?: string;
  as?: 'p' | 'span' | 'div';
  itemProp?: string;
}

export default function TextAdapter({
  children,
  id,
  size = 'base',
  color = 'charcoal',
  weight = 'normal',
  align = 'left',
  className,
  as = 'p',
  itemProp,
  ...props
}: LegacyTextProps) {
  // Map color to shadcn color variant
  const colorMap = {
    charcoal: 'charcoal',
    muted: 'muted',
    white: 'white',
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
