import { memo } from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?:
    | 'surface'
    | 'white'
    | 'orange-light'
    | 'blue-support'
    | 'brand-base'
    | 'base'
    | 'highlight'
    | 'grounded';
  padding?: 'small' | 'medium' | 'large';
}

function Section({
  children,
  className = '',
  background = 'surface',
  padding = 'medium',
}: SectionProps) {
  // This map used to carry both vocabularies at once: cream/teal/charcoal beside
  // surface/blue-support/base. The alias entries have gone now the names they
  // aliased have. The one place the two disagreed was the blue background, where
  // `teal` set text-surface (#F2F8FC) and `blue-support` set text-white; both are
  // unified on white, which is the marginally higher contrast of the two at 6.55:1.
  const bgClasses = {
    surface: 'bg-surface',
    white: 'bg-white',
    'orange-light': 'bg-orange/10',
    'blue-support': 'bg-blue-support text-white',
    'brand-base': 'bg-brand-base text-surface',
    base: 'bg-brand-base text-surface',
    highlight: 'bg-brand-highlight text-brand-base',
    grounded: 'bg-brand-grounded text-white',
  };

  const paddingClasses = {
    small: 'py-6 md:py-8',
    medium: 'py-10 md:py-14',
    large: 'py-14 md:py-20',
  };

  return (
    <section
      className={`${bgClasses[background]} ${paddingClasses[padding]} overflow-hidden ${className}`}
    >
      <div className="page-shell">{children}</div>
    </section>
  );
}

export default memo(Section);
