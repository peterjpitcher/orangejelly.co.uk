import { memo } from 'react';

import NextLink from 'next/link';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
  variant?: 'default' | 'button' | 'underline' | 'nav';
  size?: 'sm' | 'md' | 'lg';
  color?:
    | 'orange'
    | 'teal'
    | 'charcoal'
    | 'white'
    | 'inherit'
    | 'base'
    | 'support'
    | 'accent'
    | 'highlight'
    | 'grounded';
  target?: string;
  rel?: string;
  onClick?: () => void;
  'aria-label'?: string;
}

function Link({
  href,
  children,
  external = false,
  className = '',
  variant = 'default',
  size = 'md',
  color = 'orange',
  target,
  rel,
  onClick,
  'aria-label': ariaLabel,
}: LinkProps) {
  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Color classes
  const colorClasses = {
    orange: 'text-orange hover:text-orange-dark',
    teal: 'text-teal hover:text-teal-dark',
    charcoal: 'text-charcoal hover:text-charcoal/80',
    white: 'text-white hover:text-cream',
    base: 'text-charcoal hover:text-teal',
    support: 'text-teal hover:text-teal-light',
    accent: 'text-orange hover:text-orange-dark',
    highlight: 'text-[var(--color-grounded)] hover:text-charcoal',
    grounded: 'text-[var(--color-grounded)] hover:text-charcoal',
    inherit: '',
  };

  // Variant classes
  const variantClasses = {
    default: `${colorClasses[color]} transition-colors`,
    button: `inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold transition-all ${
      ['orange', 'accent'].includes(color)
        ? 'bg-orange text-white hover:bg-orange-dark'
        : ['teal', 'support'].includes(color)
          ? 'bg-teal text-white hover:bg-teal-dark'
          : ['base', 'charcoal'].includes(color)
            ? 'bg-charcoal text-white hover:bg-charcoal-light'
            : ['highlight', 'grounded'].includes(color)
              ? 'bg-[var(--color-grounded)] text-white hover:bg-[var(--color-base)]'
              : 'bg-teal text-white hover:bg-teal-dark'
    }`,
    underline: `${colorClasses[color]} underline hover:no-underline transition`,
    nav: `text-charcoal hover:text-orange transition-colors font-medium`,
  };

  const baseClasses = `${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  // Handle external links
  if (
    external ||
    href.startsWith('http') ||
    href.startsWith('tel:') ||
    href.startsWith('mailto:')
  ) {
    return (
      <a
        href={href}
        className={baseClasses}
        target={target || (external ? '_blank' : undefined)}
        rel={rel || (external ? 'noopener noreferrer' : undefined)}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  // Internal links use Next.js Link
  return (
    <NextLink href={href} className={baseClasses} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </NextLink>
  );
}

export default memo(Link);
