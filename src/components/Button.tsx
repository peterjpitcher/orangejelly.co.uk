import * as React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Map old props to new shadcn props
interface LegacyButtonProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'custom'
    | 'outline-white'
    | 'base'
    | 'support'
    | 'accent';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
  external?: boolean;
  whatsapp?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

// Map old variants to shadcn variants
const variantMap = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
  custom: 'default',
  'outline-white': 'outline',
  base: 'default',
  support: 'secondary',
  accent: 'default',
} as const;

// Map old sizes to shadcn sizes
const sizeMap = {
  small: 'sm',
  medium: 'default',
  large: 'lg',
} as const;

const legacyVariantClasses: Record<NonNullable<LegacyButtonProps['variant']>, string> = {
  primary: 'bg-orange text-brand-base hover:text-brand-base-dark',
  secondary: 'bg-blue-support text-white hover:bg-brand-base',
  outline: 'border-2 border-orange-dark text-orange-dark hover:bg-orange hover:text-brand-base',
  ghost: 'text-orange-dark hover:bg-orange/10',
  custom: '',
  'outline-white':
    'border-2 border-white bg-transparent text-white hover:bg-white hover:text-brand-base',
  base: 'bg-brand-base text-white hover:bg-brand-base-light',
  support: 'bg-blue-support text-white hover:bg-brand-base',
  accent: 'bg-orange text-brand-base hover:text-brand-base-dark',
};

const legacySizeClasses: Record<NonNullable<LegacyButtonProps['size']>, string> = {
  small: 'px-4 py-2.5 text-sm min-h-tap',
  medium: 'px-6 py-3 text-base min-h-tap',
  large: 'px-8 py-4 text-lg min-h-control',
};

export default function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  href,
  external = false,
  whatsapp = false,
  onClick,
  children,
  className,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}: LegacyButtonProps) {
  const shadcnVariant = loading ? 'loading' : variantMap[variant] || 'default';
  const shadcnSize = sizeMap[size] || 'default';

  const buttonClasses = cn(
    // `flex`, never `block`.
    //
    // The base is `inline-flex items-center justify-center`, and that
    // items-center is the only thing vertically centring the label. Adding
    // `block` here silently switched display away from flex, at which point
    // align-items does nothing at all: it is not a flex container any more.
    // The label then landed wherever line-height put it inside a box padded to
    // min-h-tap, which is why full-width buttons sat a few pixels off centre
    // while inline ones looked fine. `flex` is block-level like `block` was, so
    // w-full still behaves, and the centring survives.
    fullWidth && 'w-full flex',
    whatsapp && '!bg-whatsapp hover:!bg-whatsapp-dark text-white',
    legacyVariantClasses[variant],
    legacySizeClasses[size],
    className
  );

  const buttonContent = (
    <>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </>
  );

  const sharedButtonProps = {
    variant: shadcnVariant,
    size: shadcnSize,
    className: buttonClasses,
    disabled: disabled || loading,
    'aria-busy': loading || undefined,
  } as const;

  // Handle WhatsApp button
  if (whatsapp && href) {
    return (
      <ShadcnButton {...sharedButtonProps} asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        >
          {buttonContent}
        </a>
      </ShadcnButton>
    );
  }

  // Handle external links
  if (href && external) {
    return (
      <ShadcnButton {...sharedButtonProps} asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        >
          {buttonContent}
        </a>
      </ShadcnButton>
    );
  }

  // Handle internal links
  if (href) {
    return (
      <ShadcnButton {...sharedButtonProps} asChild>
        <Link
          href={href}
          aria-label={ariaLabel}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        >
          {buttonContent}
        </Link>
      </ShadcnButton>
    );
  }

  // Handle regular buttons
  return (
    <ShadcnButton
      {...sharedButtonProps}
      type={type}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      aria-label={ariaLabel}
      {...props}
    >
      {buttonContent}
    </ShadcnButton>
  );
}
