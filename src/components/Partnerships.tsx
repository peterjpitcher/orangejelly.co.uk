import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Link from '@/components/Link';
import AnimatedItem from '@/components/AnimatedItem';
import OptimizedImage from '@/components/OptimizedImage';

// Import partnerships data
import partnersData from '../../content/data/partnerships.json';

interface Partner {
  name: string;
  description?: string;
  logoUrl: string;
  url?: string;
}

interface PartnershipsProps {
  variant?: 'full' | 'compact' | 'minimal';
  background?: 'white' | 'cream' | 'orange-light' | 'teal-dark';
  showDescription?: boolean;
  className?: string;
  partners?: Partner[];
}

export default function Partnerships({
  variant = 'full',
  background = 'white',
  showDescription = true,
  className = '',
  partners: partnersProp,
}: PartnershipsProps) {
  // Use local data if no partners provided
  const partners = partnersProp || (partnersData as Partner[]);

  // Don't render if no partners available
  if (!partners || partners.length === 0) {
    return null;
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-6 ${className}`}>
        <Text size="sm" color="muted" className="font-semibold w-full text-center mb-2">
          Working with:
        </Text>
        {partners.map((partner) => (
          <div key={partner.name} className="text-center">
            <Link
              href={partner.url || '#'}
              external
              className="block opacity-70 hover:opacity-100 transition-opacity"
            >
              <div className="w-16 h-16 mx-auto mb-2 bg-white rounded-lg p-2 border border-gray-200">
                {partner.logoUrl ? (
                  <OptimizedImage
                    src={partner.logoUrl}
                    alt={partner.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded text-xs font-medium">
                    {partner.name
                      .split(' ')
                      .map((word) => word[0])
                      .join('')}
                  </div>
                )}
              </div>
              <Text size="sm" align="center" className="font-semibold">
                {partner.name}
              </Text>
            </Link>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card background={background} padding="medium" className={className}>
        <Heading level={3} align="center" className="mb-8">
          Working with Industry Leaders
        </Heading>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${partners.length >= 3 ? 'md:grid-cols-3' : partners.length === 2 ? 'md:grid-cols-2 max-w-lg' : 'md:grid-cols-1 max-w-sm'} gap-6 mx-auto`}
        >
          {partners.map((partner) => (
            <div key={partner.name} className="text-center">
              <Link
                href={partner.url || '#'}
                external
                className="block opacity-90 hover:opacity-100 transition-opacity group"
              >
                <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-xl p-4 border-2 border-gray-200 group-hover:border-orange group-hover:shadow-md transition-all">
                  {partner.logoUrl ? (
                    <OptimizedImage
                      src={partner.logoUrl}
                      alt={partner.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                      <Text className="font-bold text-gray-600">
                        {partner.name
                          .split(' ')
                          .map((word) => word[0])
                          .join('')}
                      </Text>
                    </div>
                  )}
                </div>
                <Text
                  size="base"
                  align="center"
                  className="font-bold mb-2 group-hover:text-orange transition-colors"
                >
                  {partner.name}
                </Text>
                {showDescription && partner.description && (
                  <Text size="sm" align="center" color="muted" className="line-clamp-3">
                    {partner.description}
                  </Text>
                )}
              </Link>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <AnimatedItem animation="fade-in" className={className}>
      <Card background={background} padding="large">
        <Heading level={3} align="center" className="mb-8">
          Working With Industry Leaders
        </Heading>

        <div
          className={`grid grid-cols-1 ${partners.length === 1 ? 'md:grid-cols-1 max-w-sm' : partners.length === 2 ? 'md:grid-cols-2 max-w-2xl' : partners.length === 3 ? 'md:grid-cols-3 max-w-4xl' : 'md:grid-cols-4'} gap-8 mx-auto`}
        >
          {partners.map((partner) => (
            <div key={partner.name} className="text-center">
              <Link href={partner.url || '#'} external className="block group">
                <div className="w-40 h-40 mx-auto mb-5 bg-white rounded-xl p-5 border-2 border-gray-200 group-hover:border-orange group-hover:shadow-lg transition-all">
                  {partner.logoUrl ? (
                    <OptimizedImage
                      src={partner.logoUrl}
                      alt={partner.name}
                      width={160}
                      height={160}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                      <Text className="text-xl font-bold text-gray-600">
                        {partner.name
                          .split(' ')
                          .map((word) => word[0])
                          .join('')}
                      </Text>
                    </div>
                  )}
                </div>
                <Heading
                  level={3}
                  align="center"
                  className="mb-3 text-xl md:text-2xl group-hover:text-orange transition-colors"
                >
                  {partner.name}
                </Heading>
                {showDescription && partner.description && (
                  <Text size="base" color="muted" align="center">
                    {partner.description}
                  </Text>
                )}
              </Link>
            </div>
          ))}
        </div>

        <Text size="sm" color="muted" align="center" className="mt-8 pt-6 border-t border-gray-200">
          We're proud to work with these industry leaders, sharing our AI innovations to help
          transform the wider pub industry.
        </Text>
      </Card>
    </AnimatedItem>
  );
}
