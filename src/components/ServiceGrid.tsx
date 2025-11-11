import { memo } from 'react';
import ServiceCard from './ServiceCard';

interface Service {
  id: string;
  emoji?: string;
  title: string;
  problem: string;
  deliverable?: string;
  description: string;
  features?: string[];
  example?: {
    before?: string;
    after?: string;
    result?: string;
  };
  ctaText?: string;
  highlight?: boolean;
}

interface ServiceGridProps {
  services: Service[];
  className?: string;
}

function ServiceGrid({ services, className = '' }: ServiceGridProps) {
  if (!services || services.length === 0) {
    return null;
  }

  // Find highlighted service
  const highlightedService = services.find((s) => s.highlight);
  const otherServices = services.filter((s) => !s.highlight);

  return (
    <div className={`${className}`}>
      {/* Featured Service - Full Width */}
      {highlightedService && (
        <div className="mb-12">
          <ServiceCard {...highlightedService} />
        </div>
      )}

      {/* Other Services - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {otherServices.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </div>
  );
}

export default memo(ServiceGrid);
