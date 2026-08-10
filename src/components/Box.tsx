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
    | 'surface'
    | 'orange'
    | 'blue-support'
    | 'orange-light'
    | 'brand-base'
    | 'base'
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
    orange: 'bg-orange',
    'orange-light': 'bg-orange-light',
    'brand-base': 'bg-brand-base',
    base: 'bg-brand-base',
    'blue-support': 'bg-blue-support',
    surface: 'bg-surface',
    highlight: 'bg-brand-highlight',
    grounded: 'bg-brand-grounded',
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
