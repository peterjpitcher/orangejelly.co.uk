import { memo } from 'react';
import Heading from './Heading';
import Text from './Text';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesGridProps {
  features: Feature[];
  className?: string;
}

function FeaturesGrid({ features, className = '' }: FeaturesGridProps) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <section className={`bg-white py-12 ${className}`}>
      <div className="page-shell">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="text-5xl mb-2 transform transition-transform group-hover:scale-110">
                {feature.icon}
              </div>
              <Heading level={3} color="brand-base" className="text-sm mb-1">
                {feature.title}
              </Heading>
              <Text size="xs" color="muted">
                {feature.description}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(FeaturesGrid);
