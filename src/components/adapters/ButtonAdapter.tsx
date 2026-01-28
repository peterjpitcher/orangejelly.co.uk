import * as React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Map old props to new shadcn props
interface LegacyButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'custom' | 'outline-white';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
  external?: boolean;
  whatsapp?: boolean;
  onClick?: () => void | Promise<void>;
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
} as const;

// Map old sizes to shadcn sizes
const sizeMap = {
  small: 'sm',
  medium: 'default',
  large: 'lg',
} as const;

const legacyVariantClasses: Record<NonNullable<LegacyButtonProps['variant']>, string> = {
  primary: 'bg-orange text-white hover:bg-orange-dark',
  secondary: 'bg-teal text-white hover:bg-teal-dark',
  outline: 'border-2 border-orange text-orange hover:bg-orange hover:text-white',
  ghost: 'text-orange hover:bg-orange/10',
  custom: '',
  'outline-white': 'border-2 border-white text-white hover:bg-white hover:text-charcoal',
};

const legacySizeClasses: Record<NonNullable<LegacyButtonProps['size']>, string> = {
  small: 'px-4 py-2.5 text-sm',
  medium: 'px-6 py-3 text-base',
  large: 'px-8 py-4 text-lg',
};

export default function ButtonAdapter({
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
    fullWidth && 'w-full block',
    whatsapp && '!bg-[var(--color-whatsapp)] hover:!bg-[var(--color-whatsapp-hover)] text-white',
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
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
          {buttonContent}
        </a>
      </ShadcnButton>
    );
  }

  // Handle external links
  if (href && external) {
    return (
      <ShadcnButton {...sharedButtonProps} asChild>
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
          {buttonContent}
        </a>
      </ShadcnButton>
    );
  }

  // Handle internal links
  if (href) {
    return (
      <ShadcnButton {...sharedButtonProps} asChild>
        <Link href={href} aria-label={ariaLabel}>
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
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      {buttonContent}
    </ShadcnButton>
  );
}
