import Section from '@/components/Section';
import Partnerships from '@/components/Partnerships';
import RelatedLinks from '@/components/RelatedLinks';
import CTASection from '@/components/CTASection';
import TrustBadges from '@/components/TrustBadges';
import type { RelatedLink } from '@/components/RelatedLinks';

// Import related links data
import relatedLinksData from '../../../content/data/related-links.json';

type RelatedLinkCluster = Record<string, { links: RelatedLink[] }>;

interface SectionWrapperProps {
  background?:
    | 'white'
    | 'surface'
    | 'blue-support'
    | 'orange-light'
    | 'brand-base'
    | 'base'
    | 'highlight'
    | 'grounded';
  padding?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

// Wrapper to ensure consistent section styling
function SectionWrapper({
  background = 'white',
  padding = 'medium',
  children,
}: SectionWrapperProps) {
  return (
    <Section background={background} padding={padding}>
      {children}
    </Section>
  );
}

// Working With Industry Leaders Section
interface IndustryLeadersSectionProps {
  variant?: 'full' | 'compact' | 'minimal';
  background?: 'white' | 'surface';
}

export function IndustryLeadersSection({
  variant = 'compact',
  background = 'white',
}: IndustryLeadersSectionProps) {
  return (
    <SectionWrapper background={background} padding="medium">
      <div className="text-center mb-8">
        <p className="text-sm text-brand-base/75 font-medium uppercase tracking-wider">
          Working with Industry Leaders
        </p>
      </div>
      <Partnerships variant={variant} />
    </SectionWrapper>
  );
}

// See How We Can Help Section
interface HelpSectionProps {
  title?: string;
  subtitle?: string;
  links?: RelatedLink[];
  linkCluster?: string; // Cluster ID for related links
  background?: 'white' | 'surface';
  columns?: {
    default?: 1 | 2 | 3 | 4;
    sm?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4;
    lg?: 1 | 2 | 3 | 4;
  };
}

export function HelpSection({
  title = 'See How We Can Help',
  subtitle = 'Choose where to start based on your biggest challenge',
  links,
  linkCluster,
  background = 'surface',
  columns = { default: 1, md: 2, lg: 3 },
}: HelpSectionProps) {
  // If links are provided directly, use them
  if (links && links.length > 0) {
    return (
      <SectionWrapper background={background}>
        <RelatedLinks
          title={title}
          subtitle={subtitle}
          links={links}
          variant="card"
          columns={columns}
        />
      </SectionWrapper>
    );
  }

  // Otherwise, use local data by cluster ID
  const clusterId = linkCluster || 'quickStart';
  const clusterMap = relatedLinksData as RelatedLinkCluster;
  const clusterData = clusterMap[clusterId];

  if (!clusterData) {
    return null; // Don't render anything if cluster not found
  }

  return (
    <SectionWrapper background={background}>
      <RelatedLinks
        title={title}
        subtitle={subtitle}
        links={clusterData.links}
        variant="card"
        columns={columns}
      />
    </SectionWrapper>
  );
}

// Standard CTA Section with common defaults
interface StandardCTASectionProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  whatsappMessage?: string;
  bottomText?: string;
  variant?:
    | 'orange'
    | 'blue-support'
    | 'brand-base'
    | 'base'
    | 'support'
    | 'accent'
    | 'highlight'
    | 'grounded';
}

export function StandardCTASection({
  title,
  subtitle,
  buttonText = 'WhatsApp me now',
  whatsappMessage,
  bottomText,
  variant,
}: StandardCTASectionProps) {
  return (
    <CTASection
      title={title}
      subtitle={subtitle}
      buttonText={buttonText}
      whatsappMessage={whatsappMessage}
      bottomText={bottomText}
      variant={variant}
    />
  );
}

// Trust & Credibility Section combining multiple trust elements
interface TrustCredibilitySectionProps {
  showBadges?: boolean;
  showPartnerships?: boolean;
  partnershipsVariant?: 'full' | 'compact' | 'minimal';
  background?: 'white' | 'surface';
}

export function TrustCredibilitySection({
  showBadges = true,
  showPartnerships = true,
  partnershipsVariant = 'compact',
  background = 'surface',
}: TrustCredibilitySectionProps) {
  return (
    <SectionWrapper background={background} padding="large">
      {showBadges && (
        <div className="mb-12">
          <TrustBadges />
        </div>
      )}

      {showPartnerships && (
        <div>
          <div className="text-center mb-8">
            <p className="text-sm text-brand-base/75 font-medium uppercase tracking-wider">
              Proud to Work With
            </p>
          </div>
          <Partnerships variant={partnershipsVariant} />
        </div>
      )}
    </SectionWrapper>
  );
}

// Success Metrics Bar
interface MetricsBarProps {
  metrics?: Array<{
    value: string;
    label: string;
    highlight?: boolean;
  }>;
  background?: 'orange' | 'blue-support' | 'brand-base' | 'base' | 'highlight' | 'grounded';
  textColor?: 'white' | 'brand-base';
}

export function MetricsBar({
  metrics = [
    { value: '-89%', label: 'Booking No-Shows', highlight: true },
    { value: '+403%', label: 'Table Bookings' },
    { value: '30 Days', label: 'To lock in progress' },
  ],
  background = 'orange',
  textColor,
}: MetricsBarProps) {
  /*
   * Fill and label together, because which one is legible depends on the other.
   * The orange and highlight fills are light and need navy; the navy and blue
   * fills need white. `textColor` still overrides, but it no longer has to be
   * remembered for the common case.
   */
  const bar = {
    orange: { bg: 'bg-orange', text: 'text-brand-base', accent: 'text-brand-base-dark' },
    highlight: {
      bg: 'bg-brand-highlight',
      text: 'text-brand-base',
      accent: 'text-brand-base-dark',
    },
    'brand-base': { bg: 'bg-brand-base', text: 'text-white', accent: 'text-brand-highlight' },
    base: { bg: 'bg-brand-base', text: 'text-white', accent: 'text-brand-highlight' },
    'blue-support': { bg: 'bg-blue-support', text: 'text-white', accent: 'text-brand-highlight' },
    grounded: { bg: 'bg-brand-grounded', text: 'text-white', accent: 'text-brand-highlight' },
  }[background];

  const textClass = textColor
    ? textColor === 'white'
      ? 'text-white'
      : 'text-brand-base'
    : bar.text;

  return (
    <div className={`${bar.bg} ${textClass} py-4`}>
      <div className="page-shell">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              {/* The highlighted figure used a fixed yellow, which is unreadable on
                  the light fills. It now takes an accent chosen for the surface. */}
              <div
                className={`text-2xl md:text-3xl font-bold ${metric.highlight ? bar.accent : ''}`}
              >
                {metric.value}
              </div>
              <div className="text-sm md:text-base opacity-90">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
