import { type CSSProperties } from 'react';
import Image from 'next/image';
import Breadcrumb, { type BreadcrumbItem } from '@/components/Breadcrumb';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import { type SeasonTheme } from '@/lib/seasonal-hubs';

interface SeasonalHubHeroProps {
  title: string;
  excerpt?: string;
  /** Strapline shown above the title, e.g. "September–November". */
  dateRangeLabel: string;
  /** Pill label, e.g. "Autumn Pub Playbook". */
  label: string;
  season: SeasonTheme;
  imageSrc?: string;
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * Themed hero used ONLY for seasonal hub pages. Separate from BlogCategoryHero
 * (which other posts rely on) so the shared hero is never disturbed. The season
 * palette is applied via a static data-season attribute and the --season-hero
 * gradient token: no hardcoded hex and no dynamic Tailwind class construction.
 */
export default function SeasonalHubHero({
  title,
  excerpt,
  dateRangeLabel,
  label,
  season,
  imageSrc,
  breadcrumbs,
}: SeasonalHubHeroProps) {
  const heroStyle: CSSProperties = {
    background: 'var(--season-hero)',
    color: 'var(--season-hero-text)',
  };

  return (
    <section data-season={season} className="relative overflow-hidden" style={heroStyle}>
      {imageSrc && (
        <Image src={imageSrc} alt="" fill priority sizes="100vw" className="object-cover" />
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(18,33,51,0.97) 0%, rgba(18,33,51,0.9) 52%, rgba(18,33,51,0.62) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 page-shell py-12 md:py-20">
        {/* One measure for the whole hero, matching the content beneath it.
            See the note in BlogCategoryHero: hero copy is article content and sits
            on the same spine as the body, not flush to the shell. */}
        <div className="measure">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-6">
              {/* Guide routes emit the canonical trail via <BreadcrumbJsonLd />. */}
              <Breadcrumb items={breadcrumbs} variant="light" emitJsonLd={false} />
            </div>
          )}

          {/* Series pill */}
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 border border-white/20 bg-white/15 text-white">
            {label}
          </span>

          {/* Date-range strapline */}
          <Text size="lg" weight="semibold" className="mb-3 text-white/80 uppercase tracking-wide">
            {dateRangeLabel}
          </Text>

          {/* No max-w: the measure above already sets the column. */}
          <Heading level={1} color="white" className="text-3xl md:text-5xl mb-4">
            {title}
          </Heading>

          {excerpt && (
            <Text size="lg" className="text-white/80">
              {excerpt}
            </Text>
          )}
        </div>
      </div>
    </section>
  );
}
