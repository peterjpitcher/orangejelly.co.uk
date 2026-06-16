// src/components/packages/PackageCard.tsx

import { getPackageById } from '@/lib/packages';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import TrackedButton from '@/components/TrackedButton';
import { cn } from '@/lib/utils';

interface PackageCardProps {
  packageId: string;
  highlighted?: boolean;
  className?: string;
}

export function PackageCard({
  packageId,
  highlighted = false,
  className,
}: PackageCardProps): React.ReactElement | null {
  const pkg = getPackageById(packageId);

  if (!pkg) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[PackageCard] No package found for id: "${packageId}"`);
    }
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border p-6 h-full',
        highlighted
          ? 'border-orange bg-orange/5 ring-2 ring-orange shadow-lg relative'
          : 'border-gray-200 bg-white',
        className
      )}
    >
      {pkg.badge && (
        <span className="inline-block self-start rounded-full bg-orange px-3 py-1 text-xs font-semibold text-white mb-4">
          {pkg.badge}
        </span>
      )}

      <Heading level={3} className="mb-1">
        {pkg.name}
      </Heading>

      <Text color="muted" size="sm" className="mb-4">
        {pkg.shortDescription}
      </Text>

      <div className="mb-4">
        <Text size="2xl" weight="bold" className="block">
          {pkg.price.display}
        </Text>
        <Text size="sm" color="muted">
          {pkg.hours}
        </Text>
      </div>

      <div className="mb-6">
        <Text weight="semibold" size="sm" className="mb-2 block">
          Best for:
        </Text>
        <ul className="space-y-1">
          {pkg.bestFor.slice(0, 4).map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-charcoal/80">
              <span className="text-orange mt-0.5 shrink-0">&#10003;</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto">
        {pkg.paymentPlan.available && (
          <Text size="xs" color="muted" className="mb-4 text-center">
            {pkg.paymentPlan.cardCopy}
          </Text>
        )}

        <TrackedButton
          eventName="package_cta_click"
          eventProperties={{
            package_id: pkg.id,
            package_slug: pkg.slug,
            package_name: pkg.name,
            cta: 'package_card_learn_more',
          }}
          href={`/ways-to-work/${pkg.slug}`}
          variant={highlighted ? 'primary' : 'outline'}
          size="medium"
          className="w-full"
        >
          Learn more
        </TrackedButton>
      </div>
    </div>
  );
}
