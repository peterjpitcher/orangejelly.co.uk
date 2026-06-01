import { type Metadata } from 'next';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';
import FeatureList from '@/components/FeatureList';
import FAQItem from '@/components/FAQItem';
import Button from '@/components/Button';
import { FAQSchema } from '@/components/StructuredData';
import { generateMetadata as generateMeta } from '@/lib/metadata';
import { ProofStrip, PackageCard, PackageCTA, CaseStudyCard } from '@/components/packages';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Hospitality Marketing Agency — Why Choose Orange Jelly',
    description:
      'Hospitality marketing agency run by a licensee, not a desk. Clear packages from £375 + VAT. We grew Google Search visibility 828% and table bookings 403% at The Anchor.',
    path: '/pub-marketing-agency',
    ogType: 'website',
  });
}

const faqs = [
  {
    question: 'What makes you different from a normal hospitality marketing agency?',
    answer:
      'We run a pub. The Anchor in Stanwell Moor is where every tactic gets tested before we recommend it. Generic agencies sell templates. We sell systems that work behind a real bar, with real staff, on a real budget.',
  },
  {
    question: 'Do you work with pubs outside London and the South East?',
    answer:
      'Yes. Most of our work is remote — WhatsApp, video calls, and shared templates. We prioritise pubs across London, Surrey, Berkshire, and the wider South East for in-person visits, but the systems work anywhere in the UK.',
  },
  {
    question: 'How much does a hospitality marketing agency cost?',
    answer:
      'We offer four clear packages starting from £375 + VAT for a focused Growth Fix. Monthly support starts from £900 + VAT. No hidden fees, no lock-in contracts. Payment plans are available.',
  },
  {
    question: 'Can you help with social media, events, and menus — or just one thing?',
    answer:
      'All of it. Social media, event strategy, menu engineering, email marketing, Google Business Profile, and AI-powered automation. Our packages cover different combinations depending on your needs.',
  },
  {
    question: 'How quickly will I see results from pub marketing?',
    answer:
      'Growth Fix clients typically see their first win within 2 weeks. Momentum Month and Growth Partner clients build visible momentum within 30-60 days as systems bed in.',
  },
];

export default function PubMarketingAgencyPage() {
  return (
    <>
      <FAQSchema faqs={faqs} />

      {/* Hero — preserves "hospitality marketing agency" keyword */}
      <Hero
        title="A Hospitality Marketing Agency That Actually Runs a Pub"
        subtitle="We are not pitching from an office. We built these systems behind the bar at The Anchor — and they work. Clear packages, honest pricing, and a founder who understands your trading reality."
        secondaryAction={{
          text: 'See Our Packages',
          href: '/ways-to-work',
        }}
        bottomText="Packages from £375 + VAT • No lock-in • Payment plans available"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Pub Marketing Agency' }]}
        backgroundImage="/images/headers/pub-marketing-agency.png"
      />

      {/* Proof Strip */}
      <ProofStrip claimIds={['search-visibility', 'table-bookings', 'food-revenue', 'no-shows']} />

      {/* What Makes OJ Different */}
      <Section background="white" padding="large">
        <Container maxWidth="4xl">
          <Heading level={2} align="center" className="mb-6">
            Why Most Hospitality Marketing Agencies Miss the Mark
          </Heading>
          <div className="space-y-4 max-w-3xl mx-auto mb-12">
            <Text size="lg" className="text-charcoal/80">
              Most hospitality marketing agencies treat pubs like any other small business. They
              sell generic social media packages, monthly retainers, and reports full of impressions
              that never translate to bums on seats.
            </Text>
            <Text size="lg" className="text-charcoal/80">
              The problem? They have never pulled a pint, managed a kitchen GP, or tried to fill a
              Tuesday night in January. They do not understand that your budget is tight, your time
              is tighter, and you need results you can see on the till — not in a dashboard.
            </Text>
            <Text size="lg" className="text-charcoal/80">
              Orange Jelly is different. Peter Pitcher runs The Anchor in Stanwell Moor as a Greene
              King tenant. Every strategy we recommend has been tested in a real pub, with real
              staff, on a real budget. If it does not work behind the bar, it does not go on this
              website.
            </Text>
          </div>

          <Grid columns={{ default: 1, md: 3 }} gap="large">
            <Card variant="bordered" padding="large">
              <div className="text-3xl mb-4">🍺</div>
              <Heading level={3} className="mb-3">
                Run by a licensee
              </Heading>
              <Text color="muted">
                Not a marketing graduate. Peter is a Greene King tenant who built these systems to
                solve his own problems first.
              </Text>
            </Card>
            <Card variant="bordered" padding="large">
              <div className="text-3xl mb-4">🧪</div>
              <Heading level={3} className="mb-3">
                Tested at The Anchor
              </Heading>
              <Text color="muted">
                Every tactic runs in our pub before we recommend it. Real conditions, real staff,
                real results.
              </Text>
            </Card>
            <Card variant="bordered" padding="large">
              <div className="text-3xl mb-4">📦</div>
              <Heading level={3} className="mb-3">
                Clear packages
              </Heading>
              <Text color="muted">
                Four packages from £375 + VAT. No hidden fees, no surprise invoices, no six-month
                contracts.
              </Text>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Results */}
      <Section background="teal" padding="large">
        <Container maxWidth="4xl">
          <Heading level={2} color="white" align="center" className="mb-4">
            Real Numbers From a Real Pub
          </Heading>
          <Text
            size="lg"
            color="white"
            align="center"
            className="opacity-90 mb-10 max-w-3xl mx-auto"
          >
            These are results from The Anchor — not projections, not estimates. The same systems we
            deliver for clients.
          </Text>
          <Grid columns={{ default: 1, md: 3 }} gap="large">
            <CaseStudyCard id="anchor-midweek-turnaround" />
            <CaseStudyCard id="anchor-food-gp" />
            <CaseStudyCard id="anchor-social-growth" />
          </Grid>
        </Container>
      </Section>

      {/* Package Overview */}
      <Section background="cream" padding="large">
        <Container maxWidth="6xl">
          <Heading level={2} align="center" className="mb-4">
            Clear Packages. Honest Pricing.
          </Heading>
          <Text size="lg" color="muted" align="center" className="mb-10 max-w-2xl mx-auto">
            Not hourly invoices that surprise you. Four clear packages so you know exactly what you
            are getting.
          </Text>
          <Grid columns={{ default: 1, md: 2, lg: 4 }} gap="medium">
            <PackageCard packageId="growth-fix" />
            <PackageCard packageId="momentum-month" />
            <PackageCard packageId="growth-partner" highlighted />
            <PackageCard packageId="turnaround-intensive" />
          </Grid>
          <div className="text-center mt-8">
            <Button href="/ways-to-work" variant="primary" size="large">
              Compare All Packages
            </Button>
          </div>
        </Container>
      </Section>

      {/* Who This Is For */}
      <Section background="white" padding="large">
        <Container maxWidth="4xl">
          <Grid columns={{ default: 1, md: 2 }} gap="large">
            <Card background="white" padding="large" variant="bordered">
              <Heading level={3} className="mb-4 text-green-700">
                This is for you if...
              </Heading>
              <FeatureList
                items={[
                  'You run a pub and want more covers, not more reports',
                  'You have tried agencies before and got nothing useful',
                  'You need practical help, not a 40-page strategy deck',
                  'You want to talk to someone who understands the trade',
                  'You are a tenant, leaseholder, or free house operator',
                ]}
                icon="check"
                iconColor="green"
                spacing="normal"
              />
            </Card>
            <Card background="white" padding="large" variant="bordered">
              <Heading level={3} className="mb-4 text-red-600">
                This is not for you if...
              </Heading>
              <FeatureList
                items={[
                  'You want a big agency with a flashy office',
                  'You need someone to run your pub for you',
                  'You are looking for the cheapest option available',
                  'You are not willing to try new approaches',
                ]}
                icon="bullet"
                iconColor="red"
                spacing="normal"
              />
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* How It Works */}
      <Section background="white" padding="large">
        <Container maxWidth="5xl">
          <Heading level={2} align="center" className="mb-12">
            How Working With Us Works
          </Heading>
          <AnimatedItem animation="slide-up">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'WhatsApp chat',
                  desc: 'Tell me what is hurting most. Empty nights? Low margins? No time for marketing? We start there.',
                },
                {
                  step: '2',
                  title: 'Right package',
                  desc: 'We recommend the package that fits your situation — no upselling, just the right fit.',
                },
                {
                  step: '3',
                  title: 'Implement together',
                  desc: 'You get strategy, templates, and hands-on support. We work alongside you, not above you.',
                },
                {
                  step: '4',
                  title: 'Measure and build',
                  desc: 'We track what matters — covers, bookings, revenue — and adjust as your venue develops.',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-orange text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <Heading level={4} className="mb-3">
                    {item.title}
                  </Heading>
                  <Text size="sm" color="muted">
                    {item.desc}
                  </Text>
                </div>
              ))}
            </div>
          </AnimatedItem>
        </Container>
      </Section>

      {/* FAQ */}
      <Section background="cream" padding="large">
        <Container maxWidth="4xl">
          <Heading level={2} align="center" className="mb-12">
            Common Questions About Hospitality Marketing Agencies
          </Heading>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section background="orange-light" padding="large">
        <Container maxWidth="3xl">
          <div className="text-center">
            <Heading level={2} className="mb-4">
              Ready to Work With a Hospitality Marketing Agency That Gets It?
            </Heading>
            <Text size="lg" className="mb-8 max-w-2xl mx-auto">
              Message Peter on WhatsApp, tell him what is not working, and he will point you to the
              right package. No pitch decks, no sales calls.
            </Text>
            <PackageCTA />
            <Text size="sm" color="muted" className="mt-4">
              Packages from £375 + VAT. Payment plans available. 30-day guarantee.
            </Text>
          </div>
        </Container>
      </Section>
    </>
  );
}
