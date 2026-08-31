import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import {
  Button as OjButton,
  Stat,
  Tag,
  Mark,
  Header as OjHeader,
  Footer as OjFooter,
  Breadcrumb as OjBreadcrumb,
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
} from '@/components/oj';

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
 * Add a specimen when you build a component. The legacy Button, Heading, Text and Card specimens came out on 31 August 2026 with the components themselves. A component that has no specimen here is
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
    <section className="border-t-1.5 border-oj-ink py-8">
      <h2 className="oj-eyebrow mb-1">{name}</h2>
      {note ? <p className="mb-4 text-sm text-oj-ink-2">{note}</p> : null}
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
      <div className="rounded-oj border-1.5 border-oj-ink bg-oj-cream p-6">
        <p className="oj-eyebrow mb-4">light</p>
        <div className="flex flex-wrap items-start gap-3">{children}</div>
      </div>
      <div className="rounded-oj border-1.5 border-oj-cream bg-oj-ink p-6">
        <p className="oj-eyebrow mb-4 text-oj-peach">dark</p>
        <div className="flex flex-wrap items-start gap-3">{children}</div>
      </div>
    </div>
  );
}

export default function ComponentHarness(): JSX.Element {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <main id="main-content" className="page-shell bg-oj-paper py-12">
      <h1 className="oj-display text-[34px] leading-none text-oj-ink">component harness.</h1>
      <p className="measure mt-2 text-oj-ink-2">
        Development only. Renders the real components inside the real application, so the cascade
        and the tokens are the ones that ship. Add a specimen when you build a component. The legacy
        Button, Heading, Text and Card specimens came out on 31 August 2026 with the components
        themselves.
      </p>

      {/*
        The Button, on both grounds, first.

        Its colour table is the most argued-over thing in the system and the one
        place a mistake is expensive: the rule is that white always sits on an orange
        fill, and that on a dark ground the border is white so the boundary survives.
        Both are only checkable side by side, which is what BothGrounds is for.
      */}
      <Specimen
        name="oj / Button"
        note="Every variant on both grounds. Ground normally comes from context; it is set by hand here so the pairs sit together."
      >
        <BothGrounds>
          {(['primary', 'solid', 'ghost'] as const).map((variant) => (
            <OjButton key={variant} variant={variant}>
              {variant}
            </OjButton>
          ))}
        </BothGrounds>
      </Specimen>

      <Specimen name="oj / Button sizes and states">
        <div className="flex w-full flex-wrap items-center gap-3">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <OjButton key={size} size={size}>
              {size}
            </OjButton>
          ))}
          <OjButton arrow>with arrow</OjButton>
          <OjButton href="/dev/components">as a link</OjButton>
          <OjButton disabled>disabled</OjButton>
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
              Growth stuck? <span className="oj-mark">Let's talk.</span>
            </h3>
            <p className="mt-3 text-oj-ink-2">
              Lowercase is a class, not an element rule, so{' '}
              <span className="oj-keep-case">The Anchor</span> and VAT survive in body copy.
            </p>
          </div>
        </div>
      </Specimen>

      <Specimen
        name="oj / Button"
        note="The repositioning button. One primary per view. Hover to see the pressure shadow."
      >
        <div className="w-full space-y-4 bg-oj-cream p-8">
          <div className="flex flex-wrap items-center gap-4">
            <OjButton size="lg" arrow>
              Book a growth diagnostic
            </OjButton>
            <OjButton variant="solid">Let's talk</OjButton>
            <OjButton variant="ghost" size="sm" href="#method">
              See how we work
            </OjButton>
            <OjButton disabled>Disabled</OjButton>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <OjButton key={size} size={size}>
                {size}
              </OjButton>
            ))}
          </div>
        </div>
      </Specimen>

      <Specimen name="oj / Stat" note="Evidence as a design asset. Always give the provenance.">
        <div className="grid w-full gap-8 md:grid-cols-2">
          <div className="flex flex-wrap gap-10 bg-oj-cream p-8">
            <Stat value="403%" label="Table bookings" sub="At The Anchor, our own venue" />
            <Stat
              value="41.7%"
              label="Of search clicks"
              sub="From aviation content, not pub content"
              accent={false}
            />
          </div>
          <div className="flex flex-wrap gap-10 bg-oj-ink p-8">
            <Stat
              tone="dark"
              value="828%"
              label="Search visibility"
              sub="At The Anchor, our own venue"
            />
            <Stat tone="dark" size="sm" value="89%" label="Fewer no-shows" accent={false} />
          </div>
        </div>
      </Specimen>

      <Specimen name="oj / Tag and Mark">
        <div className="w-full space-y-6">
          <div className="flex flex-wrap gap-3 bg-oj-cream p-8">
            <Tag>Create demand</Tag>
            <Tag variant="ink">Protect margin</Tag>
            <Tag variant="orange">Build for scale</Tag>
            <Tag size="sm" dot={false}>
              No dot
            </Tag>
            <Tag dot="ok" variant="ink">
              Taking work
            </Tag>
          </div>
          <div className="bg-oj-cream p-8">
            <h3 className="oj-display text-4xl text-oj-ink">
              Growth stuck? <Mark>Let's talk.</Mark>
            </h3>
            <h3 className="oj-display mt-4 text-4xl text-oj-ink">
              A content calendar will not fix a <Mark tone="orange">broken growth system.</Mark>
            </h3>
          </div>
        </div>
      </Specimen>

      <Specimen
        name="oj / Header"
        note="Cream is the default. Orange is conversion pages only. Narrow the window below 880px for the drawer."
      >
        <div className="w-full space-y-8">
          <div className="border-1.5 border-oj-ink">
            <OjHeader
              sticky={false}
              items={[
                { label: 'How we work', href: '#' },
                {
                  label: 'Growth problems',
                  current: true,
                  sub: [
                    { label: 'Growth has stalled', href: '#' },
                    { label: 'Leads are not converting', href: '#' },
                    { label: 'See all eight', href: '#', more: true },
                  ],
                },
                { label: 'Results', href: '#' },
                { label: 'About', href: '#' },
              ]}
              cta={{ label: "Let's talk", href: '#' }}
            />
          </div>
          <div className="border-1.5 border-oj-ink">
            <OjHeader
              sticky={false}
              tone="orange"
              items={[
                { label: 'How we work', href: '#' },
                { label: 'Growth problems', current: true, href: '#' },
                { label: 'About', href: '#' },
              ]}
              cta={{ label: "Let's talk", href: '#' }}
            />
          </div>
        </div>
      </Specimen>

      <Specimen name="oj / Breadcrumb">
        <div className="w-full bg-oj-cream p-8">
          <OjBreadcrumb
            items={[
              { label: 'Home', href: '#' },
              { label: 'Insights', href: '#' },
              { label: 'Where AI actually helps an accountancy practice' },
            ]}
          />
        </div>
      </Specimen>

      <Specimen name="oj / Footer">
        <div className="w-full">
          <OjFooter
            columns={[
              {
                title: 'Growth problems',
                links: [
                  { label: 'Growth has stalled', href: '#' },
                  { label: 'Leads are not converting', href: '#' },
                  { label: 'Margin is disappearing', href: '#' },
                ],
              },
              {
                title: 'Company',
                links: [
                  { label: 'How we work', href: '#' },
                  { label: 'Results', href: '#' },
                  { label: 'About', href: '#' },
                ],
              },
            ]}
          >
            <Tag dot="ok" variant="ink">
              Taking work for October
            </Tag>
          </OjFooter>
        </div>
      </Specimen>

      <Specimen
        name="oj / Form controls"
        note="Label, hint and error are wired to the control automatically. Tab through to see the focus ring."
      >
        <div className="grid w-full gap-6 bg-oj-cream p-8 md:grid-cols-2">
          <Field label="Your name" required>
            <Input placeholder="Sam Whitfield" autoComplete="name" />
          </Field>
          <Field label="Work email" required hint="No newsletters. One reply.">
            <Input type="email" placeholder="you@company.co.uk" autoComplete="email" />
          </Field>
          <Field label="Work email" error="Enter a work email address">
            <Input type="email" defaultValue="sam@" />
          </Field>
          <Field label="Your role">
            <Select defaultValue="">
              <option value="">Choose one</option>
              <option value="owner">Owner or founder</option>
              <option value="md">Managing director</option>
              <option value="ops">Operations director</option>
            </Select>
          </Field>
          <div className="md:col-span-2">
            <Field
              label="What is happening in the business?"
              required
              hint="A sentence or two is plenty. We will ask the rest."
            >
              <Textarea placeholder="Enquiries have halved since the spring and nobody can agree why." />
            </Field>
          </div>
          <Field label="Disabled">
            <Input disabled defaultValue="Not editable" />
          </Field>
          <div className="flex flex-col gap-3">
            <Checkbox label="Send me the write-up afterwards" defaultChecked />
            <Radio name="demo-size" value="a" label="1 to 9 people" defaultChecked />
            <Radio name="demo-size" value="b" label="10 to 49 people" />
          </div>
        </div>
      </Specimen>
    </main>
  );
}
