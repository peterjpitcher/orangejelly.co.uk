import { type Metadata } from 'next';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';
import FeatureList from '@/components/FeatureList';
import FAQItem from '@/components/FAQItem';
import { generateMetadata as generateMeta } from '@/lib/metadata';
import { FAQSchema } from '@/components/StructuredData';
import { PackageCard, CaseStudyCard, ProofStrip, PackageCTA } from '@/components/packages';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Build Midweek Momentum - Proven Tuesday & Wednesday Solutions',
    description:
      'Turn quiet midweek nights into consistent bookings with practical systems proven at The Anchor. Tuesday and Wednesday solutions that actually work. From £375 + VAT.',
    path: '/quiet-midweek-solutions',
  });
}

const faqs = [
  {
    question: 'How quickly will I see midweek improvements?',
    answer:
      'Growth Fix clients typically see their first win within 2 weeks. We focus on one high-impact change first — a midweek event, a targeted offer, or a local visibility fix — then build from there.',
  },
  {
    question: 'What midweek events actually work?',
    answer:
      'Quiz nights, steak nights, tasting events, and themed food nights are proven midweek performers. The key is promotion rhythm and consistency, not the event itself. We grew table bookings by 403% at The Anchor using AI-planned events, WhatsApp groups, and weekly reminders.',
  },
  {
    question: 'Do I need a big budget to fix midweek trade?',
    answer:
      'No. A Growth Fix starts from just £375 + VAT — 5 focused hours on your biggest midweek bottleneck. Many of the best midweek strategies cost nothing to implement.',
  },
  {
    question: 'What if I have tried events before and they did not work?',
    answer:
      'The event format is rarely the problem. It is usually the promotion, timing, or consistency. We will diagnose what went wrong and build a repeatable system that sticks.',
  },
];

export default function QuietMidweekSolutions() {
  return (
    <>
      <FAQSchema faqs={faqs} />

      <Hero
        title="Turn Quiet Midweek Nights Into Your Best Trade"
        subtitle="Proven systems to fill Tuesday and Wednesday nights with consistent bookings — tested at The Anchor, delivered for your venue"
        secondaryAction={{
          text: 'See Growth Fix Package',
          href: '/ways-to-work/growth-fix',
        }}
        bottomText="Packages from £375 + VAT • Proven at The Anchor • Payment plans available"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Quiet Midweek Solutions' }]}
        backgroundImage="/images/headers/quiet-midweek-solutions.png"
      />

      <ProofStrip claimIds={['search-visibility', 'table-bookings', 'food-revenue', 'no-shows']} />

      {/* The Problem */}
      <Section>
        <AnimatedItem animation="fade-in">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={2} align="center" className="mb-6">
              Every Quiet Tuesday and Wednesday Has a Cost
            </Heading>
            <Text size="lg" color="muted" align="center" className="mb-4">
              The longer midweek stays inconsistent, the harder it is to build repeat behaviour.
              Staff still cost, stock still expires, and rent does not care if Monday was dead.
            </Text>
            <Text size="lg" color="muted" align="center" className="mb-8">
              The good news? Midweek is often the fastest win. One strong event, one clear offer,
              and a consistent promotion rhythm can transform your quietest nights within weeks.
            </Text>
          </div>
        </AnimatedItem>
      </Section>

      {/* How We Did It */}
      <Section background="teal">
        <AnimatedItem animation="slide-up">
          <div className="max-w-4xl mx-auto text-center">
            <Heading level={2} color="white" className="mb-4">
              How We Built Midweek Momentum at The Anchor
            </Heading>
            <Text size="lg" color="white" className="opacity-90 mb-10">
              We went from losing money on quiet nights to making meaningful midweek profit.
            </Text>

            <Grid columns={{ default: 1, md: 2 }} gap="large" className="mb-8">
              <Card background="white" padding="large">
                <Heading level={3} className="mb-4 text-teal">
                  Tuesday Quiz Night
                </Heading>
                <div className="space-y-4">
                  <div>
                    <Text size="sm" className="text-charcoal/60">
                      Before:
                    </Text>
                    <Text weight="semibold">Sparse attendance, losing money</Text>
                  </div>
                  <div>
                    <Text size="sm" className="text-charcoal/60">
                      After:
                    </Text>
                    <Text weight="semibold" className="text-green-600">
                      Table bookings up 403%, stronger takings
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" className="text-charcoal/60">
                      How:
                    </Text>
                    <Text>WhatsApp quiz group + weekly reminders + consistent format</Text>
                  </div>
                </div>
              </Card>

              <Card background="white" padding="large">
                <Heading level={3} className="mb-4 text-teal">
                  Tasting Events
                </Heading>
                <div className="space-y-4">
                  <div>
                    <Text size="sm" className="text-charcoal/60">
                      Before:
                    </Text>
                    <Text weight="semibold">No midweek events beyond quiz</Text>
                  </div>
                  <div>
                    <Text size="sm" className="text-charcoal/60">
                      After:
                    </Text>
                    <Text weight="semibold" className="text-green-600">
                      Private hire bookings up 567%
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" className="text-charcoal/60">
                      How:
                    </Text>
                    <Text>Ticketed format + social proof + database marketing</Text>
                  </div>
                </div>
              </Card>
            </Grid>

            <CaseStudyCard id="anchor-midweek-turnaround" variant="full" />
          </div>
        </AnimatedItem>
      </Section>

      {/* Proven Event Formats */}
      <Section background="cream">
        <AnimatedItem animation="fade-in">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-4">
              Proven Midweek Event Formats
            </Heading>
            <Text size="lg" color="muted" align="center" className="mb-10">
              These formats work because they are easy to run, easy to promote, and easy to repeat.
            </Text>
            <Grid columns={{ default: 1, md: 3 }} gap="medium">
              <Card variant="bordered" padding="large">
                <Heading level={3} className="mb-4">
                  Tuesday Winners
                </Heading>
                <FeatureList
                  items={[
                    'Quiz Night 2.0 — fast-paced, phone-friendly',
                    'Taco Tuesday — simple menu, strong margins',
                    'Open Mic — performers bring their audience',
                  ]}
                  icon="check"
                  iconColor="green"
                  spacing="normal"
                />
              </Card>
              <Card variant="bordered" padding="large">
                <Heading level={3} className="mb-4">
                  Wednesday Winners
                </Heading>
                <FeatureList
                  items={[
                    'Steak Night — set-price deal, books out weekly',
                    'Wing Wednesday — lifts drinks spend and dwell time',
                    'Wine and Paint — ticketed, predictable attendance',
                  ]}
                  icon="check"
                  iconColor="green"
                  spacing="normal"
                />
              </Card>
              <Card variant="bordered" padding="large">
                <Heading level={3} className="mb-4">
                  Thursday Winners
                </Heading>
                <FeatureList
                  items={[
                    'Curry Club — set menu, efficient prep',
                    'Speed Dating — brings a new crowd',
                    'Cocktail Masterclass — premium upsell potential',
                  ]}
                  icon="check"
                  iconColor="green"
                  spacing="normal"
                />
              </Card>
            </Grid>
          </div>
        </AnimatedItem>
      </Section>

      {/* The Solution */}
      <Section>
        <AnimatedItem animation="slide-up">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-4">
              A Growth Fix for Your Midweek
            </Heading>
            <Text size="lg" color="muted" align="center" className="mb-10">
              Five focused hours on your biggest midweek bottleneck. Diagnosis, action plan, and one
              clear intervention — from just £375 + VAT.
            </Text>

            <div className="max-w-md mx-auto">
              <PackageCard packageId="growth-fix" highlighted />
            </div>

            <Card background="cream" padding="large" className="mt-8 text-center">
              <Text size="lg" className="mb-2">
                Need ongoing midweek support?
              </Text>
              <Text color="muted" className="mb-4">
                If you want weekly execution, event promotion, and social media support month after
                month, step up to Momentum Month or Growth Partner.
              </Text>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PackageCard packageId="momentum-month" />
                <PackageCard packageId="growth-partner" />
              </div>
            </Card>
          </div>
        </AnimatedItem>
      </Section>

      {/* FAQ */}
      <Section background="white">
        <Heading level={2} align="center" className="mb-8">
          Common Questions About Fixing Quiet Midweek Nights
        </Heading>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section background="orange-light" padding="small">
        <div className="max-w-3xl mx-auto text-center">
          <Heading level={2} align="center" className="mb-4">
            Your Midweek Momentum Starts Now
          </Heading>
          <Text size="lg" align="center" className="mb-6">
            Next Tuesday can look very different with the right offer and promotion rhythm. Tell
            Peter what is not working.
          </Text>
          <PackageCTA packageId="growth-fix" />
          <Text size="sm" color="muted" align="center" className="mt-4">
            From £375 + VAT. Payment plans available.
          </Text>
        </div>
      </Section>
    </>
  );
}
