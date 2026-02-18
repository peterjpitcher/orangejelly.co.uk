import { cn } from '@/lib/utils';

interface BoxProps {
  children?: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  // Common styling props
  padding?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
  margin?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
  background?:
    | 'white'
    | 'cream'
    | 'orange'
    | 'teal'
    | 'orange-light'
    | 'teal-dark'
    | 'base'
    | 'blue-support'
    | 'surface'
    | 'highlight'
    | 'grounded'
    | 'transparent';
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  textAlign?: 'left' | 'center' | 'right';
  id?: string;
}

export default function Box({
  children,
  className,
  as: Component = 'div',
  padding = 'none',
  margin = 'none',
  background = 'transparent',
  rounded = false,
  position = 'static',
  textAlign,
  id,
}: BoxProps) {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
    xlarge: 'p-12',
  };

  const marginClasses = {
    none: '',
    small: 'm-4',
    medium: 'm-6',
    large: 'm-8',
    xlarge: 'm-12',
  };

  const backgroundClasses = {
    white: 'bg-white',
    cream: 'bg-cream',
    orange: 'bg-orange',
    teal: 'bg-teal',
    'orange-light': 'bg-orange-light',
    'teal-dark': 'bg-teal-dark',
    base: 'bg-charcoal',
    'blue-support': 'bg-teal',
    surface: 'bg-cream',
    highlight: 'bg-[var(--color-highlight)]',
    grounded: 'bg-[var(--color-grounded)]',
    transparent: 'bg-transparent',
  };

  const roundedClasses = {
    true: 'rounded',
    false: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <Component
      id={id}
      className={cn(
        paddingClasses[padding],
        marginClasses[margin],
        backgroundClasses[background],
        typeof rounded === 'string' ? roundedClasses[rounded] : rounded ? roundedClasses.true : '',
        position !== 'static' && position,
        textAlign && textAlignClasses[textAlign],
        className
      )}
    >
      {children}
    </Component>
  );
}
