// src/components/packages/CapabilityGrid.tsx

import { getCapabilities } from '@/lib/packages';
import Text from '@/components/Text';
import {
  Target,
  Calendar,
  Share2,
  TrendingUp,
  PenTool,
  Camera,
  MapPin,
  Monitor,
  Layout,
  BarChart2,
  BookOpen,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  target: Target,
  calendar: Calendar,
  'share-2': Share2,
  'trending-up': TrendingUp,
  'pen-tool': PenTool,
  camera: Camera,
  'map-pin': MapPin,
  monitor: Monitor,
  layout: Layout,
  'bar-chart-2': BarChart2,
  'book-open': BookOpen,
};

interface CapabilityGridProps {
  className?: string;
  compact?: boolean;
}

export function CapabilityGrid({
  className,
  compact = false,
}: CapabilityGridProps): React.ReactElement {
  const capabilities = getCapabilities();

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${compact ? 'lg:grid-cols-5 gap-4' : 'lg:grid-cols-3 gap-6'} ${className || ''}`}
    >
      {capabilities.map((cap) => {
        const IconComponent = iconMap[cap.icon] || Target;
        return (
          <div key={cap.id} className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-orange" />
            </div>
            <div>
              <Text weight="semibold" size="sm" className="block">
                {cap.name}
              </Text>
              {!compact && (
                <Text size="xs" color="muted">
                  {cap.shortDescription}
                </Text>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
