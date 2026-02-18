import { memo } from 'react';
import Grid from '@/components/Grid';

interface TrustItem {
  value: string;
  label: string;
  subtext?: string;
}

interface TrustBarProps {
  items?: TrustItem[];
}

function TrustBar({ items }: TrustBarProps) {
  // Don't render if no items provided
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <section className="bg-surface py-8 relative overflow-hidden">
      {/* Decorative brand shapes */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-support/20 to-transparent rounded-full -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-support/20 to-transparent rounded-full translate-x-20 translate-y-20"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <Grid columns={{ default: 1, md: 3 }} gap="medium" className="text-center">
          {items.map((item, index) => (
            <div key={index}>
              <p className="text-3xl font-bold text-blue-support mb-1">{item.value}</p>
              <p className="text-charcoal font-medium">{item.label}</p>
              {item.subtext && <p className="text-sm text-charcoal/70 mt-1">{item.subtext}</p>}
            </div>
          ))}
        </Grid>
      </div>
    </section>
  );
}

export default memo(TrustBar);
