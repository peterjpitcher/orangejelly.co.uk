import Link from 'next/link';
import Text from '@/components/Text';
import { getAllCategoryConfigs } from '@/lib/category-colours';

interface CategoryLegendProps {
  className?: string;
}

/**
 * Compact legend showing all 8 categories with colour dots.
 * Each item links to the category listing page.
 */
export default function CategoryLegend({ className = '' }: CategoryLegendProps) {
  const categories = getAllCategoryConfigs();

  if (categories.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-x-5 gap-y-2 justify-center ${className}`}>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/licensees-guide/category/${cat.slug}`}
          className="flex items-center gap-2 group"
        >
          <span
            className="inline-block w-3 h-3 rounded-full shrink-0 transition-transform group-hover:scale-125"
            style={{ backgroundColor: cat.primary }}
            aria-hidden="true"
          />
          <Text
            size="xs"
            color="muted"
            className="whitespace-nowrap group-hover:text-charcoal transition-colors"
          >
            {cat.label}
          </Text>
        </Link>
      ))}
    </div>
  );
}
