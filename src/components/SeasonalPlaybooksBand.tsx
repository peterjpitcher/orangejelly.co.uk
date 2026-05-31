import Section from '@/components/Section';
import Grid from '@/components/Grid';
import Card from '@/components/Card';
import Link from '@/components/Link';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import { SEASON_HUBS, isHubInSeason } from '@/lib/seasonal-hubs';

interface SeasonalPlaybooksBandProps {
  /** When true, the hub that is currently in season gets a "This season" pill. */
  highlightInSeason?: boolean;
  /** Section background token. Defaults to the cream band used on the guides index. */
  background?: 'white' | 'cream';
  /** Optional heading override. */
  heading?: string;
  /** Optional subtitle override. */
  subtitle?: string;
}

const DEFAULT_SUBTITLE =
  'Curated, ready-to-run guides for the moments that matter each season — pick the playbook that fits the calendar ahead.';

/**
 * Renders a card per seasonal hub from SEASON_HUBS, linking to each hub page.
 * Always shows every hub; with `highlightInSeason`, badges the in-season one.
 * Shared between the homepage and the licensee's guide index.
 */
export default function SeasonalPlaybooksBand({
  highlightInSeason = false,
  background = 'cream',
  heading = 'Seasonal Playbooks',
  subtitle = DEFAULT_SUBTITLE,
}: SeasonalPlaybooksBandProps) {
  if (SEASON_HUBS.length === 0) {
    return null;
  }

  return (
    <Section background={background}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Heading level={2} align="center" className="mb-3">
            {heading}
          </Heading>
          <Text size="lg" align="center" className="max-w-2xl mx-auto text-charcoal/70">
            {subtitle}
          </Text>
        </div>
        <Grid columns={{ default: 1, sm: 2, lg: 3 }} gap="medium">
          {SEASON_HUBS.map((hub) => {
            const inSeason = highlightInSeason && isHubInSeason(hub);
            return (
              <Card key={hub.hubSlug} variant="bordered" asChild>
                <Link
                  href={`/licensees-guide/${hub.hubSlug}`}
                  color="inherit"
                  className="group block h-full"
                >
                  <span className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-orange/10 text-orange">
                      {hub.dateRangeLabel}
                    </span>
                    {inSeason && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-teal text-white">
                        This season
                      </span>
                    )}
                  </span>
                  <Heading level={3} className="mb-2 group-hover:text-orange transition-colors">
                    {hub.label}
                  </Heading>
                  <Text color="muted">
                    {hub.featuredGuides.length} practical guides for the {hub.season} season.
                  </Text>
                </Link>
              </Card>
            );
          })}
        </Grid>
      </div>
    </Section>
  );
}
