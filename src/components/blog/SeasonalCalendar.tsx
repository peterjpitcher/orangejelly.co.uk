import { type CSSProperties } from 'react';
import Grid from '@/components/Grid';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import { type SeasonalCalendarEntry, type SeasonTheme } from '@/lib/seasonal-hubs';

interface SeasonalCalendarProps {
  entries: SeasonalCalendarEntry[];
  season: SeasonTheme;
  heading?: string;
  subtitle?: string;
}

/**
 * Themed "at a glance" calendar for a seasonal hub. Replaces the plain markdown
 * table with a scannable, accessible grid of dated moments. Colour comes from the
 * season token set (var(--season-*)) selected by the static data-season attribute
 * on the wrapper — no hardcoded hex and no dynamically constructed Tailwind classes.
 */
export default function SeasonalCalendar({
  entries,
  season,
  heading = 'At a glance',
  subtitle = 'The dates worth blocking now — pick the two or three that fit your pub.',
}: SeasonalCalendarProps) {
  if (!entries || entries.length === 0) return null;

  // Season tokens read via inline style. data-season swaps the whole palette.
  const tintStyle: CSSProperties = { backgroundColor: 'var(--season-tint)' };
  const cardStyle: CSSProperties = {
    borderColor: 'var(--season-border)',
    backgroundColor: 'var(--color-white)',
  };
  const dateChipStyle: CSSProperties = {
    // accent-strong (not accent) keeps the small chip text ≥4.5:1 on white (WCAG AA).
    backgroundColor: 'var(--season-accent-strong)',
    color: 'var(--season-accent-contrast)',
  };
  const spineStyle: CSSProperties = { backgroundColor: 'var(--season-accent)' };

  return (
    <section data-season={season} aria-label={heading} className="py-12 md:py-16" style={tintStyle}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8 max-w-3xl">
          <Heading level={2} className="mb-2">
            {heading}
          </Heading>
          <Text color="muted" size="lg">
            {subtitle}
          </Text>
        </div>

        <Grid columns={{ default: 1, sm: 2, lg: 3 }} gap="medium">
          {entries.map((entry) => (
            <div
              key={`${entry.date}-${entry.moment}`}
              className="relative h-full rounded-xl border bg-white p-5 pl-6 shadow-sm"
              style={cardStyle}
            >
              {/* Accent spine — colour-independent of the text content */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
                style={spineStyle}
              />
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                style={dateChipStyle}
              >
                {entry.date}
              </span>
              <Heading level={3} className="mt-3 mb-1 text-lg">
                {entry.moment}
              </Heading>
              <Text color="charcoal" size="sm">
                {entry.opportunity}
              </Text>
            </div>
          ))}
        </Grid>

        {season === 'autumn' && (
          <Text color="muted" size="sm" className="mt-6 max-w-3xl italic">
            International Champagne Day falls on the fourth Friday of October — Friday 23 October in
            2026 — so we&rsquo;ve made it a weekend to keep the Saturday trade too.
          </Text>
        )}
      </div>
    </section>
  );
}
