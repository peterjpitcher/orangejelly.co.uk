import React, { memo } from 'react';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Grid from '@/components/Grid';

interface QuickStat {
  label: string;
  value: string;
  highlight?: boolean;
}

interface QuickStatsProps {
  stats: QuickStat[];
  className?: string;
}

function QuickStats({ stats, className = '' }: QuickStatsProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <Card variant="bordered" className={`bg-blue-support-light ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 text-2xl">📊</div>
        <Heading level={4} className="text-brand-base">
          Key Metrics
        </Heading>
      </div>

      <Grid columns={{ default: 1, sm: 2, md: stats.length > 2 ? 3 : 2 }} gap="small">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`text-center p-3 rounded-lg ${
              stat.highlight ? 'bg-white border-2 border-blue-support shadow-sm' : 'bg-white/50'
            }`}
          >
            <Text
              size="2xl"
              weight="bold"
              className={stat.highlight ? 'text-blue-support' : 'text-brand-base'}
            >
              {stat.value}
            </Text>
            <Text size="sm" color="muted" className="mt-1">
              {stat.label}
            </Text>
          </div>
        ))}
      </Grid>
    </Card>
  );
}

export default memo(QuickStats);
