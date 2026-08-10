import Link from 'next/link';
import { getBaseUrl } from '@/lib/site-config';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: 'light' | 'dark';
  /**
   * Set false on pages that already render <BreadcrumbJsonLd />. Those pages know
   * their full hierarchy (including seasonal hub levels) and emit a richer trail,
   * so letting this component emit a second BreadcrumbList just gives Google two
   * competing answers for the same page.
   */
  emitJsonLd?: boolean;
}

export default function Breadcrumb({
  items,
  className = '',
  variant = 'dark',
  emitJsonLd = true,
}: BreadcrumbProps) {
  // Generate breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `${getBaseUrl()}${item.href}` }),
    })),
  };

  const textColor = variant === 'light' ? 'text-white/70' : 'text-brand-base/70';
  const activeColor =
    variant === 'light' ? 'text-white font-medium' : 'text-brand-base font-medium';
  // /60, not /40. These separators are text, so they need 4.5:1: white/40 on the
  // navy hero measured 3.48:1 and brand-base/40 on cream only 2.26:1.
  const separatorColor = variant === 'light' ? 'text-white/60' : 'text-brand-base/70';
  const hoverColor = variant === 'light' ? 'hover:text-white' : 'hover:text-orange-dark';

  return (
    <>
      {emitJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
        <ol className="flex items-baseline flex-wrap">
          {items.map((item, index) => (
            <li key={index} className="inline-flex items-baseline">
              {index > 0 && (
                <span className={`mx-2 ${separatorColor}`} aria-hidden="true">
                  /
                </span>
              )}
              {item.href && index < items.length - 1 ? (
                <Link
                  href={item.href}
                  className={`${textColor} ${hoverColor} transition-colors inline-block`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={index === items.length - 1 ? activeColor : textColor}
                  aria-current={index === items.length - 1 ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

// Pre-defined breadcrumb paths for common pages
export const breadcrumbPaths = {
  services: [{ label: 'Home', href: '/' }, { label: 'Services' }],
  waysToWork: [{ label: 'Home', href: '/' }, { label: 'Ways to Work' }],
  capabilities: [{ label: 'Home', href: '/' }, { label: 'Capabilities' }],
  about: [{ label: 'Home', href: '/' }, { label: 'About' }],
  results: [{ label: 'Home', href: '/' }, { label: 'Success Stories' }],
  contact: [{ label: 'Home', href: '/' }, { label: 'Contact' }],
  licenseesGuide: [
    { label: 'Home', href: '/' },
    { label: "The Licensee's Guide", href: '/licensees-guide' },
  ],
  // Package-specific breadcrumbs
  growthFix: [
    { label: 'Home', href: '/' },
    { label: 'Ways to Work', href: '/ways-to-work' },
    { label: 'Growth Fix' },
  ],
  momentumMonth: [
    { label: 'Home', href: '/' },
    { label: 'Ways to Work', href: '/ways-to-work' },
    { label: 'Momentum Month' },
  ],
  growthPartner: [
    { label: 'Home', href: '/' },
    { label: 'Ways to Work', href: '/ways-to-work' },
    { label: 'Growth Partner' },
  ],
  turnaroundIntensive: [
    { label: 'Home', href: '/' },
    { label: 'Ways to Work', href: '/ways-to-work' },
    { label: 'Turnaround Intensive' },
  ],
};
