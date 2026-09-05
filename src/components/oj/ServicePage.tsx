import {
  Anchor,
  Band,
  Breadcrumb,
  Button,
  FAQ,
  GroundProvider,
  OjFooter,
  OjHeader,
} from '@/components/oj';

export interface ServicePageContent {
  label: string;
  heading: string;
  intro: string;
  audience: string;
  deliverables: readonly { title: string; body: string }[];
  evidence: { heading: string; body: string; href: string; label: string; boundary: string };
  fit: { heading: string; body: string };
  process: readonly { title: string; body: string }[];
  faqs: readonly { q: string; a: string }[];
  related: readonly { href: string; label: string }[];
  invitation: string;
}

export function ServicePage({ content }: { content: ServicePageContent }): JSX.Element {
  return (
    <>
      <OjHeader current="solutions" />
      <main id="main-content">
        <GroundProvider value="ink">
          <section className="bg-oj-ink py-12 text-oj-cream sm:py-16">
            <div className="page-shell">
              <Breadcrumb
                tone="ink"
                className="mb-7"
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'What we build', href: '/solutions' },
                  { label: content.label },
                ]}
              />
              <p className="font-oj text-sm font-bold uppercase tracking-[0.14em] text-oj-peach">
                {content.label}
              </p>
              <h1 className="oj-display mt-3 max-w-[19ch] text-[clamp(38px,7vw,72px)] leading-[0.98]">
                {content.heading}
              </h1>
              <p className="measure mt-5 text-[19px] leading-relaxed text-oj-cream/85">
                {content.intro}
              </p>
              <p className="measure mt-4 text-[17px] leading-relaxed text-oj-cream/85">
                {content.audience}
              </p>
              <div className="mt-7">
                <Button arrow href="/start-here#enquiry">
                  Discuss your project
                </Button>
              </div>
            </div>
          </section>
        </GroundProvider>
        <Band heading={content.evidence.heading} tone="paper">
          <div className="measure space-y-4 text-[17px] leading-relaxed text-oj-ink-2">
            <p>{content.evidence.body}</p>
            <p>{content.evidence.boundary}</p>
            <Anchor
              className="inline-block font-bold text-oj-orange-deep underline underline-offset-4"
              href={content.evidence.href}
            >
              {content.evidence.label}
            </Anchor>
          </div>
        </Band>
        <Band
          heading="What we can build for you"
          intro="We agree the scope around your customers, your team and the systems you already use."
        >
          <div className="grid gap-8 md:grid-cols-3">
            {content.deliverables.map((item) => (
              <div key={item.title} className="border-t-1.5 border-oj-ink pt-4">
                <h3 className="font-oj text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-[17px] leading-relaxed text-oj-ink-2">{item.body}</p>
              </div>
            ))}
          </div>
        </Band>
        <Band heading={content.fit.heading} intro={content.fit.body} tone="paper" />
        <Band heading="From the first conversation to a working build">
          <ol className="grid list-none gap-8 p-0 md:grid-cols-3">
            {content.process.map((step) => (
              <li key={step.title}>
                <h3 className="font-oj text-xl font-black">{step.title}</h3>
                <p className="mt-3 text-[17px] leading-relaxed text-oj-ink-2">{step.body}</p>
              </li>
            ))}
          </ol>
        </Band>
        <Band heading="Questions before you start" tone="paper">
          <FAQ items={content.faqs} />
        </Band>
        <Band heading="Related work">
          <ul className="flex list-none flex-col gap-4 p-0">
            {content.related.map((link) => (
              <li key={link.href}>
                <Anchor
                  className="font-bold text-oj-orange-deep underline underline-offset-4"
                  href={link.href}
                >
                  {link.label}
                </Anchor>
              </li>
            ))}
          </ul>
        </Band>
        <Band tone="ink" heading={content.invitation} size="lg" divider={false}>
          <p className="measure text-[17px] leading-relaxed text-oj-cream/85">
            Tell us what you want to build or improve. Bring an idea, an existing system or a
            problem you want to solve.
          </p>
          <div className="mt-7">
            <Button arrow href="/start-here#enquiry">
              Discuss your project
            </Button>
          </div>
        </Band>
      </main>
      <OjFooter />
    </>
  );
}
