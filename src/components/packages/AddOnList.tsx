// src/components/packages/AddOnList.tsx

import { getAddOns } from '@/lib/packages';
import Text from '@/components/Text';
import Card from '@/components/Card';

interface AddOnListProps {
  packageId?: string;
  className?: string;
}

export function AddOnList({ packageId, className }: AddOnListProps): React.ReactElement {
  const addOns = getAddOns();
  const filtered = packageId ? addOns.filter((a) => a.relatedPackages.includes(packageId)) : addOns;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className || ''}`}>
      {filtered.map((addOn) => (
        <Card key={addOn.id} className="p-5">
          <Text weight="semibold" className="mb-1 block">
            {addOn.name}
          </Text>
          <Text size="sm" color="muted" className="mb-2">
            {addOn.description}
          </Text>
          <Text size="xs" color="muted">
            {addOn.priceNote}
          </Text>
        </Card>
      ))}
    </div>
  );
}
