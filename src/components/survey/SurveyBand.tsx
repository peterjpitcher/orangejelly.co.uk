import { Button, GroundProvider } from '@/components/oj';
import { PROMOTED_SURVEY } from '@/lib/promoted-survey';
import { cn } from '@/lib/utils';

/**
 * A full-width band inviting the visitor to take the promoted survey.
 *
 * It sits directly under the hero on the homepage, the Pubs page and the guides
 * library, which is where Peter asked for the survey to be championed (22 September
 * 2026). Compact on purpose: it is an invitation between the hero and the page's own
 * content, not a section of the page, so it takes less height than a Band.
 *
 * `tone` is chosen against the hero above it so the edge between them lands. The
 * homepage opens on the orange band, so its survey band is ink; the Pubs page and the
 * guides library open on ink, so theirs is orange, the site's colour for "act".
 *
 * Renders nothing when there is no promoted survey, so closing it takes every band
 * down with the nav item. See `src/lib/promoted-survey.ts`.
 */
export interface SurveyBandProps {
  tone: 'ink' | 'orange';
}

export default function SurveyBand({ tone }: SurveyBandProps): JSX.Element | null {
  if (!PROMOTED_SURVEY) return null;
  const survey = PROMOTED_SURVEY;
  const ink = tone === 'ink';

  return (
    // The band declares its ground, so the button picks its own treatment: white on
    // deep orange on ink, the white outline on the orange band.
    <GroundProvider value={ink ? 'ink' : 'band'}>
      <section
        aria-labelledby="survey-band-heading"
        className={cn(
          'border-b-1.5 border-oj-ink py-10 sm:py-12',
          ink ? 'bg-oj-ink text-oj-cream' : 'bg-oj-band text-oj-on-band'
        )}
      >
        <div className="page-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            {/* Peach on ink is 11.03:1. On the orange band everything is the on-band
                colour at full strength: a tint there is the 1.63:1 standfirst the
                ink heroes were introduced to escape. */}
            <p
              className={cn(
                'font-oj text-[14px] font-bold uppercase tracking-[0.14em]',
                ink ? 'text-oj-peach' : 'text-oj-on-band'
              )}
            >
              {survey.eyebrow}
            </p>
            <h2
              id="survey-band-heading"
              className="oj-display mt-2 text-[clamp(28px,4.5vw,44px)] leading-[0.98]"
            >
              {survey.title}
            </h2>
            <p
              className={cn(
                'mt-3 max-w-[62ch] text-[17px] leading-relaxed',
                ink ? 'text-oj-cream/85' : 'text-oj-on-band'
              )}
            >
              {survey.blurb}
            </p>
          </div>
          <div className="flex-none">
            <Button href={survey.href} size="lg" arrow>
              {survey.cta}
            </Button>
          </div>
        </div>
      </section>
    </GroundProvider>
  );
}
