import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Text from '@/components/Text';

/**
 * Component harness. Development only.
 *
 * Storybook was the obvious alternative and was not chosen for two reasons. It renders
 * components outside the application's CSS context, which is exactly where the
 * token-scoping bugs D17 is worried about hide: a component can look right in
 * isolation and wrong inside the real cascade. And it is a large dependency, its own
 * build and its own config surface, for a marketing site with one developer.
 *
 * This renders the real components inside the real app, with the real tokens and the
 * real fonts, which is the context that matters.
 *
 * It 404s outside development. /test-shadcn was deleted on 27 August precisely because
 * it was a publicly routable development artefact, and reintroducing one would be
 * daft. The noindex metadata is belt and braces on top of the 404.
 *
 * Add a specimen when you port a component. A component that has no specimen here is
 * not finished, because nobody has looked at its states.
 */
export const metadata: Metadata = {
  title: 'Component harness',
  robots: { index: false, follow: false },
};

/**
 * Rendered per request rather than prerendered. Calling notFound() during static
 * generation bakes the 404 page into a statically served route, which answers 200 with
 * 404 content: a soft 404, and worse for search than a real one. Forcing dynamic makes
 * notFound() run at request time and return an actual 404 status.
 */
export const dynamic = 'force-dynamic';

const BUTTON_VARIANTS = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'base',
  'support',
  'accent',
] as const;

const BUTTON_SIZES = ['small', 'medium', 'large'] as const;

function Specimen({
  name,
  note,
  children,
}: {
  name: string;
  note?: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <section className="border-t border-gray-300 py-8">
      <h2 className="mb-1 font-mono text-sm uppercase tracking-widest text-gray-600">{name}</h2>
      {note ? <p className="mb-4 text-sm text-gray-500">{note}</p> : null}
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  );
}

/**
 * Every specimen renders twice: once on a light ground and once on a dark one. The
 * design system has a cream default and an ink inverse, and components that only get
 * checked on one of them ship broken on the other.
 */
function BothGrounds({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2">
      <div className="rounded border border-gray-200 bg-white p-6">
        <p className="mb-4 font-mono text-xs uppercase text-gray-400">light</p>
        <div className="flex flex-wrap items-start gap-3">{children}</div>
      </div>
      <div className="rounded border border-gray-700 bg-gray-900 p-6">
        <p className="mb-4 font-mono text-xs uppercase text-gray-500">dark</p>
        <div className="flex flex-wrap items-start gap-3">{children}</div>
      </div>
    </div>
  );
}

export default function ComponentHarness(): JSX.Element {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <main className="page-shell py-12">
      <h1 className="text-3xl font-bold">Component harness</h1>
      <p className="measure mt-2 text-gray-600">
        Development only. Renders the real components inside the real application, so the cascade
        and the tokens are the ones that ship. Add a specimen when you port a component.
      </p>

      <Specimen name="Button / variants" note="Every variant at the default size.">
        <BothGrounds>
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </BothGrounds>
      </Specimen>

      <Specimen name="Button / sizes">
        <BothGrounds>
          {BUTTON_SIZES.map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
        </BothGrounds>
      </Specimen>

      <Specimen name="Button / states" note="Loading and disabled are the two most often missed.">
        <BothGrounds>
          <Button>default</Button>
          <Button loading>loading</Button>
          <Button disabled>disabled</Button>
          <Button href="/dev/components">as a link</Button>
        </BothGrounds>
      </Specimen>

      <Specimen name="Heading / levels">
        <div className="w-full space-y-2">
          {([1, 2, 3, 4, 5, 6] as const).map((level) => (
            <Heading key={level} level={level}>
              Heading level {level}
            </Heading>
          ))}
        </div>
      </Specimen>

      <Specimen name="Text / sizes">
        <div className="w-full space-y-2">
          {(['xs', 'sm', 'base', 'lg', 'xl', '2xl'] as const).map((size) => (
            <Text key={size} size={size}>
              Text at {size}
            </Text>
          ))}
        </div>
      </Specimen>

      <Specimen
        name="Repositioning tokens"
        note="The new palette, pressure shadow, borders and highlight band. Hover the cards."
      >
        <div className="w-full space-y-6">
          <div className="flex flex-wrap gap-2">
            {[
              ['bg-oj-orange', 'oj-orange'],
              ['bg-oj-orange-deep', 'oj-orange-deep'],
              ['bg-oj-ember text-oj-cream', 'oj-ember'],
              ['bg-oj-ink text-oj-cream', 'oj-ink'],
              ['bg-oj-cream text-oj-ink', 'oj-cream'],
              ['bg-oj-paper text-oj-ink', 'oj-paper'],
              ['bg-oj-peach text-oj-ink', 'oj-peach'],
            ].map(([cls, label]) => (
              <span
                key={label}
                className={`${cls} border-1.5 border-oj-ink rounded-oj px-4 py-2 text-sm`}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              ['bg-cat-demand-soft text-cat-demand', 'demand'],
              ['bg-cat-convert-soft text-cat-convert', 'convert'],
              ['bg-cat-margin-soft text-cat-margin', 'margin'],
              ['bg-cat-ops-soft text-cat-ops', 'ops'],
              ['bg-cat-experience-soft text-cat-experience', 'experience'],
              ['bg-cat-scale-soft text-cat-scale', 'scale'],
              ['bg-cat-hospitality-soft text-cat-hospitality', 'hospitality'],
            ].map(([cls, label]) => (
              <span key={label} className={`${cls} rounded-full px-3 py-1 text-xs font-semibold`}>
                {label}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-6 bg-oj-cream p-8">
            <div className="oj-press border-1.5 border-oj-ink rounded-oj bg-oj-paper px-6 py-4 text-oj-ink">
              pressure shadow, hover me
            </div>
            <button
              type="button"
              className="oj-press oj-focus border-1.5 border-oj-ink rounded-oj bg-oj-orange px-6 py-4 font-bold text-oj-ink"
            >
              action
            </button>
          </div>

          <div className="bg-oj-cream p-8">
            <p className="oj-eyebrow mb-2">eyebrow label</p>
            <h3 className="oj-display text-4xl text-oj-ink">
              Growth stuck? <span className="oj-mark">Bring us the problem.</span>
            </h3>
            <p className="mt-3 text-oj-ink-2">
              Lowercase is a class, not an element rule, so{' '}
              <span className="oj-keep-case">The Anchor</span> and VAT survive in body copy.
            </p>
          </div>
        </div>
      </Specimen>

      <Specimen name="Card / variants">
        <div className="grid w-full gap-4 md:grid-cols-2">
          {(['default', 'bordered', 'shadowed'] as const).map((variant) => (
            <Card key={variant} variant={variant}>
              <Heading level={3}>{variant}</Heading>
              <Text>Body copy inside a {variant} card, to check contrast and padding.</Text>
            </Card>
          ))}
        </div>
      </Specimen>
    </main>
  );
}
