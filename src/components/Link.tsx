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
    | 'orange-on-dark'
    | 'blue-support'
    | 'brand-base'
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
  /*
   * Two orange link colours, because contrast runs in opposite directions on the
   * two surfaces this site uses.
   *
   * `orange` is for light surfaces. The brand orange is 3.17:1 as body text on
   * cream, so link text uses orange-dark at 4.84:1 and darkens further on hover.
   *
   * `orange-on-dark` is for the navy footer and navy bands, where going darker
   * makes things worse: orange-dark on navy is 2.80:1. The brand orange itself is
   * 4.55:1 there, so dark surfaces get the actual brand colour and lighten further
   * to brand.highlight on hover (8.12:1).
   */
  const colorClasses = {
    orange: 'text-orange-dark hover:text-orange-darker',
    'orange-on-dark': 'text-orange hover:text-brand-highlight',
    'blue-support': 'text-blue-support hover:text-brand-base',
    'brand-base': 'text-brand-base hover:text-brand-base/80',
    white: 'text-white hover:text-surface',
    base: 'text-brand-base hover:text-blue-support',
    support: 'text-blue-support hover:text-blue-support-light',
    accent: 'text-orange-dark hover:text-orange-darker',
    highlight: 'text-brand-grounded hover:text-brand-base',
    grounded: 'text-brand-grounded hover:text-brand-base',
    inherit: '',
  };

  // Variant classes
  const variantClasses = {
    default: `${colorClasses[color]} transition-colors`,
    button: `inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold transition-all ${
      ['orange', 'accent'].includes(color)
        ? 'bg-orange text-brand-base hover:text-brand-base-dark'
        : ['blue-support', 'support'].includes(color)
          ? 'bg-blue-support text-white hover:bg-brand-base'
          : ['base', 'brand-base'].includes(color)
            ? 'bg-brand-base text-white hover:bg-brand-base-light'
            : ['highlight', 'grounded'].includes(color)
              ? 'bg-brand-grounded text-white hover:bg-brand-base'
              : 'bg-blue-support text-white hover:bg-brand-base'
    }`,
    underline: `${colorClasses[color]} underline hover:no-underline transition`,
    nav: `text-brand-base hover:text-orange-dark transition-colors font-medium`,
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
