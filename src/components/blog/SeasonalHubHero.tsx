import { type CSSProperties } from 'react';
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
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * Themed hero used ONLY for seasonal hub pages. Separate from BlogCategoryHero
 * (which other posts rely on) so the shared hero is never disturbed. The season
 * palette is applied via a static data-season attribute and the --season-hero
 * gradient token — no hardcoded hex and no dynamic Tailwind class construction.
 */
export default function SeasonalHubHero({
  title,
  excerpt,
  dateRangeLabel,
  label,
  season,
  breadcrumbs,
}: SeasonalHubHeroProps) {
  const heroStyle: CSSProperties = {
    background: 'var(--season-hero)',
    color: 'var(--season-hero-text)',
  };

  return (
    <section data-season={season} className="relative overflow-hidden" style={heroStyle}>
      {/* Subtle diagonal stripe pattern overlay — CSS only, no images */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,1) 10px, rgba(255,255,255,1) 11px)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-6">
            <Breadcrumb items={breadcrumbs} variant="light" />
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

        <Heading level={1} color="white" className="text-3xl md:text-5xl mb-4 max-w-4xl">
          {title}
        </Heading>

        {excerpt && (
          <Text size="lg" className="max-w-3xl text-white/80">
            {excerpt}
          </Text>
        )}
      </div>
    </section>
  );
}
