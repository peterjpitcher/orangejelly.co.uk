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
      {/* Subtle diagonal stripe pattern overlay: CSS only, no images */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,1) 10px, rgba(255,255,255,1) 11px)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 page-shell py-12 md:py-20">
        {/*
          One measure for the whole hero, matching the article beneath it.
          The breadcrumb, pill, title and standfirst are article content, not site
          chrome, so they belong on the same spine as the body copy. Before this
          they sat flush to the shell at 416 while the article sat in a centred
          measure at 576, a visible 160px step on all 104 guide pages.
          The text stays left-aligned; it is the COLUMN that is centred.
        */}
        <div className="measure">
          {/* Breadcrumbs: light variant for dark backgrounds */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-6">
              {/* Guide routes emit the canonical trail via <BreadcrumbJsonLd />. */}
              <Breadcrumb items={breadcrumbs} variant="light" emitJsonLd={false} />
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

          {/* Title. No max-w: the measure above already sets the column. */}
          <Heading level={1} color="white" className="text-3xl md:text-5xl mb-4">
            {title}
          </Heading>

          {/* Excerpt */}
          {excerpt && (
            <Text size="lg" className="text-white/70">
              {excerpt}
            </Text>
          )}
        </div>
      </div>
    </section>
  );
}
