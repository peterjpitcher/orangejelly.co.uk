import { memo } from 'react';
import Heading from './Heading';
import Text from './Text';
import OptimizedImage from './OptimizedImage';
import Link from './Link';

interface Partner {
  name: string;
  description: string;
  logoUrl: string;
  url: string;
}

interface PartnershipsSectionProps {
  partners: Partner[];
  title?: string;
  className?: string;
}

function PartnershipsSection({
  partners,
  title = 'Working with Industry Leaders',
  className = '',
}: PartnershipsSectionProps) {
  if (!partners || partners.length === 0) {
    return null;
  }

  return (
    <section className={`bg-gray-50 py-16 ${className}`}>
      <div className="max-w-5xl mx-auto px-4">
        <Heading level={2} align="center" color="charcoal" className="mb-12">
          {title}
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {partners.map((partner, index) => (
            <div key={index} className="text-center">
              <Link href={partner.url} external className="block group">
                <div className="bg-white rounded-xl p-8 h-48 flex items-center justify-center mb-6 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                  <OptimizedImage
                    src={partner.logoUrl}
                    alt={partner.name}
                    width={280}
                    height={140}
                    className="max-h-32 max-w-full object-contain"
                  />
                </div>
                <Heading
                  level={4}
                  color="charcoal"
                  className="mb-3 text-lg font-bold group-hover:text-orange transition-colors"
                >
                  {partner.name}
                </Heading>
                <Text size="base" color="muted" className="max-w-sm mx-auto">
                  {partner.description}
                </Text>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(PartnershipsSection);
