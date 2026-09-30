import { Button, GroundProvider } from '@/components/oj';
import { PROMOTED_PRODUCT } from '@/lib/promoted-product';
import { cn } from '@/lib/utils';

/**
 * A full-width band introducing the promoted product, Cheers.
 *
 * It sits after "what we build" on the homepage, where a product we built is the proof
 * of that section, and after the websites band on the Pubs page, where venues are the
 * audience (Peter, 30 September 2026). Compact like the survey band it is modelled on:
 * an introduction between sections, not a section of its own.
 *
 * `tone` is chosen against the sections either side so its edges land. Both current
 * placements sit between light sections, so both are ink.
 *
 * Cheers lives on its own origin, so the button opens it in a new tab and says so to
 * screen readers, as every other external link on the site does.
 *
 * Renders nothing when there is no promoted product, so one line in
 * `src/lib/promoted-product.ts` takes every band down with the footer link.
 */
export interface ProductBandProps {
  tone: 'ink' | 'orange';
}

export default function ProductBand({ tone }: ProductBandProps): JSX.Element | null {
  if (!PROMOTED_PRODUCT) return null;
  const product = PROMOTED_PRODUCT;
  const ink = tone === 'ink';

  return (
    <GroundProvider value={ink ? 'ink' : 'band'}>
      <section
        aria-labelledby="product-band-heading"
        className={cn(
          'border-b-1.5 border-oj-ink py-10 sm:py-12',
          ink ? 'bg-oj-ink text-oj-cream' : 'bg-oj-band text-oj-on-band'
        )}
      >
        <div className="page-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            {/* The same contrast choices as the survey band: peach on ink, and the
                on-band colour at full strength on orange. */}
            <p
              className={cn(
                'font-oj text-[14px] font-bold uppercase tracking-[0.14em]',
                ink ? 'text-oj-peach' : 'text-oj-on-band'
              )}
            >
              {product.eyebrow}
            </p>
            <h2
              id="product-band-heading"
              className="oj-display mt-2 text-[clamp(28px,4.5vw,44px)] leading-[0.98]"
            >
              {product.title}
            </h2>
            <p
              className={cn(
                'mt-3 max-w-[62ch] text-[17px] leading-relaxed',
                ink ? 'text-oj-cream/85' : 'text-oj-on-band'
              )}
            >
              {product.blurb}
            </p>
          </div>
          <div className="flex-none">
            <Button href={product.href} size="lg" arrow target="_blank" rel="noopener noreferrer">
              {product.cta}
              <span className="sr-only"> (opens in a new tab)</span>
            </Button>
          </div>
        </div>
      </section>
    </GroundProvider>
  );
}
