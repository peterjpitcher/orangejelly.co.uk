// ARIA Landmark wrapper components for accessibility

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  role?: 'region' | 'search' | 'form' | 'complementary';
  as?: 'section' | 'div' | 'article' | 'aside';
}

export function LandmarkSection({
  children,
  className = '',
  ariaLabel,
  ariaLabelledBy,
  role,
  as: Component = 'section',
}: SectionProps) {
  return (
    <Component
      className={className}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </Component>
  );
}

interface NavigationProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
}

export function LandmarkNav({ children, className = '', ariaLabel }: NavigationProps) {
  return (
    <nav className={className} aria-label={ariaLabel}>
      {children}
    </nav>
  );
}

interface MainProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function LandmarkMain({ children, className = '', id = 'main-content' }: MainProps) {
  return (
    <main id={id} className={className}>
      {children}
    </main>
  );
}

interface AsideProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

export function LandmarkAside({ children, className = '', ariaLabel, ariaLabelledBy }: AsideProps) {
  return (
    <aside className={className} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
      {children}
    </aside>
  );
}

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function LandmarkHeader({ children, className = '' }: HeaderProps) {
  return <header className={className}>{children}</header>;
}

interface FooterProps {
  children: React.ReactNode;
  className?: string;
}

export function LandmarkFooter({ children, className = '' }: FooterProps) {
  return <footer className={className}>{children}</footer>;
}

// Helper component for search regions
interface SearchRegionProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function SearchRegion({
  children,
  className = '',
  ariaLabel = 'Search',
}: SearchRegionProps) {
  return (
    <LandmarkSection role="search" className={className} ariaLabel={ariaLabel} as="div">
      {children}
    </LandmarkSection>
  );
}

// Helper component for forms with proper labeling
interface FormRegionProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export function FormRegion({
  children,
  className = '',
  ariaLabel,
  ariaLabelledBy,
  onSubmit,
}: FormRegionProps) {
  return (
    <form
      className={className}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}
