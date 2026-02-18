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
    | 'cream'
    | 'teal'
    | 'orange-light'
    | 'charcoal'
    | 'base'
    | 'blue-support'
    | 'surface'
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
  background?: 'white' | 'cream' | 'surface';
}

export function IndustryLeadersSection({
  variant = 'compact',
  background = 'white',
}: IndustryLeadersSectionProps) {
  return (
    <SectionWrapper background={background} padding="medium">
      <div className="text-center mb-8">
        <p className="text-sm text-charcoal/60 font-medium uppercase tracking-wider">
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
  background?: 'white' | 'cream' | 'surface';
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
  background = 'cream',
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
    | 'teal'
    | 'charcoal'
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
  background?: 'white' | 'cream' | 'surface';
}

export function TrustCredibilitySection({
  showBadges = true,
  showPartnerships = true,
  partnershipsVariant = 'compact',
  background = 'cream',
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
            <p className="text-sm text-charcoal/60 font-medium uppercase tracking-wider">
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
  background?: 'orange' | 'teal' | 'charcoal' | 'base' | 'blue-support' | 'highlight' | 'grounded';
  textColor?: 'white' | 'charcoal';
}

export function MetricsBar({
  metrics = [
    { value: '£250/week', label: 'Sunday Waste Cut', highlight: true },
    { value: '25-30', label: 'Quiz Teams Each Month' },
    { value: '30 Days', label: 'To lock in progress' },
  ],
  background = 'orange',
  textColor = 'white',
}: MetricsBarProps) {
  const bgClass = {
    orange: 'bg-orange',
    teal: 'bg-teal',
    charcoal: 'bg-charcoal',
    base: 'bg-charcoal',
    'blue-support': 'bg-teal',
    highlight: 'bg-[var(--color-highlight)]',
    grounded: 'bg-[var(--color-grounded)]',
  }[background];

  const textClass = textColor === 'white' ? 'text-white' : 'text-charcoal';

  return (
    <div className={`${bgClass} ${textClass} py-4`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div
                className={`text-2xl md:text-3xl font-bold ${metric.highlight ? 'text-yellow-300' : ''}`}
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
