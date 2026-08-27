import Image from 'next/image';
import Breadcrumb, { type BreadcrumbItem } from '@/components/Breadcrumb';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import { getCategoryGradient, getCategoryLabel } from '@/lib/category-colours';

interface BlogCategoryHeroProps {
  title: string;
  excerpt?: string;
  category: string; // slug
  imageSrc?: string;
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * Full-width image hero for blog posts, with the category gradient kept as a
 * strong readability layer and as the fallback when a post has no image.
 */
export default function BlogCategoryHero({
  title,
  excerpt,
  category,
  imageSrc,
  breadcrumbs,
}: BlogCategoryHeroProps) {
  const gradient = getCategoryGradient(category);
  const categoryLabel = getCategoryLabel(category);

  return (
    <section className="relative overflow-hidden" style={{ background: gradient }}>
      {imageSrc && (
        <Image src={imageSrc} alt="" fill priority sizes="100vw" className="object-cover" />
      )}

      {/* Keep white article copy readable over every photograph. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(18,33,51,0.97) 0%, rgba(18,33,51,0.9) 52%, rgba(18,33,51,0.64) 100%)',
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
