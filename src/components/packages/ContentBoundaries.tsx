// src/components/packages/ContentBoundaries.tsx

import Heading from '@/components/Heading';
import Text from '@/components/Text';

interface ContentBoundariesProps {
  className?: string;
}

export function ContentBoundaries({ className }: ContentBoundariesProps): React.ReactElement {
  const layers = [
    {
      title: 'Strategy',
      color: 'bg-green-50 border-green-200',
      badge: 'Included in packages',
      badgeColor: 'bg-green-100 text-green-700',
      items: [
        'Campaign direction',
        'Content themes and shot lists',
        'Creative prompts and caption guidance',
        'Review of client-shot content',
        'Content priorities tied to commercial outcomes',
      ],
    },
    {
      title: 'Light Production',
      color: 'bg-amber-50 border-amber-200',
      badge: 'Limited inclusion where listed',
      badgeColor: 'bg-amber-100 text-amber-700',
      items: [
        'Small amounts of editing',
        'Repurposing client-shot assets',
        'Limited content shaping within package hours',
      ],
    },
    {
      title: 'Production',
      color: 'bg-red-50 border-red-200',
      badge: 'Always separately scoped',
      badgeColor: 'bg-red-100 text-red-700',
      items: [
        'Filming and photography',
        'Heavy editing and post-production',
        'Large asset batches',
        'Daily posting and scheduling',
        'Community management',
      ],
    },
  ];

  return (
    <div className={className}>
      <Heading level={3} className="mb-6">
        How content creation works
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {layers.map((layer) => (
          <div key={layer.title} className={`rounded-xl border p-5 ${layer.color}`}>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium mb-3 ${layer.badgeColor}`}
            >
              {layer.badge}
            </span>
            <Text weight="semibold" className="mb-3 block">
              {layer.title}
            </Text>
            <ul className="space-y-1">
              {layer.items.map((item) => (
                <li key={item} className="text-sm text-charcoal/70">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
