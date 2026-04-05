import Breadcrumb, { type BreadcrumbItem } from '@/components/Breadcrumb';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import { getCategoryGradient, getCategoryLabel } from '@/lib/category-colours';

interface BlogCategoryHeroProps {
  title: string;
  excerpt?: string;
  category: string; // slug
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * Full-width category-coloured hero block for blog posts.
 * Replaces the previous image-based Hero with a category-specific gradient header.
 * CSS-only pattern overlay keeps it lightweight with no image dependencies.
 */
export default function BlogCategoryHero({
  title,
  excerpt,
  category,
  breadcrumbs,
}: BlogCategoryHeroProps) {
  const gradient = getCategoryGradient(category);
  const categoryLabel = getCategoryLabel(category);

  return (
    <section className="relative overflow-hidden" style={{ background: gradient }}>
      {/* Subtle diagonal stripe pattern overlay — CSS only, no images */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,1) 10px, rgba(255,255,255,1) 11px)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Breadcrumbs — light variant for dark backgrounds */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-6">
            <Breadcrumb items={breadcrumbs} variant="light" />
          </div>
        )}

        {/* Category pill */}
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 border border-white/20"
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#fff',
          }}
        >
          {categoryLabel}
        </span>

        {/* Title */}
        <Heading level={1} color="white" className="text-3xl md:text-5xl mb-4 max-w-4xl">
          {title}
        </Heading>

        {/* Excerpt */}
        {excerpt && (
          <Text size="lg" className="max-w-3xl text-white/70">
            {excerpt}
          </Text>
        )}
      </div>
    </section>
  );
}
