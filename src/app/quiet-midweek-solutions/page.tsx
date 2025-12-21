import { type Metadata } from 'next';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Card from '@/components/Card';
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';
import CTASection from '@/components/CTASection';
import FAQItem from '@/components/FAQItem';
import ProblemCard from '@/components/ProblemCard';
import Text from '@/components/Text';
import FeatureList from '@/components/FeatureList';
import { generateMetadata as generateMeta } from '@/lib/metadata';
import { FAQSchema } from '@/components/StructuredData';
// Import local data
import midweekData from '../../../content/data/quiet-midweek.json';
import WhatsAppButton from '@/components/WhatsAppButton';

type MidweekStrategy = {
  _key: string;
  title: string;
  description?: string;
  points?: string[];
};

type MidweekMetric = {
  _key: string;
  value: string;
  label: string;
  description?: string;
};

const extendedMidweekData = midweekData as typeof midweekData & {
  midweekStrategies?: MidweekStrategy[];
  successMetrics?: { title?: string; metrics?: MidweekMetric[] };
};

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Fix Dead Tuesday & Wednesday Nights - Proven Midweek Solutions',
    description:
      'Transform your dead midweek nights into profit. From empty tables to fully booked - proven strategies that work for UK pubs. Get the exact system we use at The Anchor.',
    path: '/quiet-midweek-solutions',
  });
}

export default function QuietMidweekSolutions() {
  // Use local data
  const heroSection = extendedMidweekData.heroSection;
  const problemSection = extendedMidweekData.problemSection;
  const timeline = extendedMidweekData.transformationTimeline;
  const faqs = extendedMidweekData.faqs;
  const midweekStrategies: MidweekStrategy[] = extendedMidweekData.midweekStrategies || [];
  const successMetrics = extendedMidweekData.successMetrics;

  return (
    <>
      {heroSection && (
        <Hero
          title={heroSection.title}
          subtitle={heroSection.subtitle}
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Quiet Midweek Solutions' }]}
        />
      )}

      {/* Problem Agitation */}
      <Section background="cream" padding="small">
        <AnimatedItem animation="fade-in">
          <div className="max-w-4xl mx-auto text-center">
            <Heading level={2} className="mb-8">
              {problemSection.heading}
            </Heading>

            <Grid columns={{ default: 1, md: 3 }} gap="medium" className="mb-8">
              {problemSection.problems.map((problem, index) => (
                <ProblemCard
                  key={index}
                  emoji={problem.emoji}
                  problem={problem.title}
                  solution={problem.description}
                  linkText={problem.linkText}
                  linkHref={problem.linkHref}
                />
              ))}
            </Grid>

            <Card background="white" padding="large" variant="bordered" className="border-red-200">
              <Text size="lg" weight="semibold" className="text-red-600 mb-4">
                {problemSection.brutalMath.heading}
              </Text>
              <Text className="mb-6">{problemSection.brutalMath.description}</Text>
              <WhatsAppButton
                text={problemSection.brutalMath.ctaText}
                size="large"
                className="!bg-red-600 hover:!bg-red-700"
              />
            </Card>
          </div>
        </AnimatedItem>
      </Section>

      {/* Our Results */}
      <Section background="teal">
        <AnimatedItem animation="slide-up">
          <div className="max-w-4xl mx-auto text-center">
            <Heading level={2} color="white" className="mb-8">
              How We Fixed Our Own Dead Midweek Nights
            </Heading>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
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
                      After 30 days:
                    </Text>
                    <Text weight="semibold" className="text-green-600">
                      25-30 regular teams monthly, stronger takings
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" className="text-charcoal/60">
                      Secret:
                    </Text>
                    <Text>WhatsApp quiz group + weekly reminders</Text>
                  </div>
                </div>
              </Card>

              <Card background="white" padding="large">
                <Heading level={3} className="mb-4 text-teal">
                  Wednesday Steak Night
                </Heading>
                <div className="space-y-4">
                  <div>
                    <Text size="sm" className="text-charcoal/60">
                      Before:
                    </Text>
                    <Text weight="semibold">Random walk-ins only</Text>
                  </div>
                  <div>
                    <Text size="sm" className="text-charcoal/60">
                      After 30 days:
                    </Text>
                    <Text weight="semibold" className="text-green-600">
                      Consistent midweek bookings, filled early in the week
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" className="text-charcoal/60">
                      Secret:
                    </Text>
                    <Text>Simple set-price deal + social media countdown</Text>
                  </div>
                </div>
              </Card>
            </div>

            <Text size="lg" color="white" className="mb-6">
              We went from losing money on quiet nights to making meaningful midweek profit. Here's
              the exact system we used...
            </Text>
          </div>
        </AnimatedItem>
      </Section>

      {/* The System */}
      {false && (
        <Section>
          <AnimatedItem animation="fade-in">
            <div className="max-w-4xl mx-auto">
              <Heading level={2} align="center" className="mb-4">
                The Midweek Momentum System™
              </Heading>
              <Text size="lg" align="center" className="mb-12 text-charcoal/70">
                5 proven strategies that transform dead nights into your busiest (and most
                profitable) evenings
              </Text>

              <div className="space-y-8">
                {midweekStrategies.map((strategy, index) => (
                  <Card
                    key={strategy._key}
                    padding="large"
                    variant="bordered"
                    className="relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-20 h-20 bg-orange/10 rounded-br-full flex items-center justify-center">
                      <Text size="2xl" weight="bold" className="text-orange">
                        {index + 1}
                      </Text>
                    </div>
                    <div className="ml-16">
                      <Heading level={3} className="mb-4">
                        {strategy.title}
                      </Heading>
                      {strategy.description && <Text className="mb-4">{strategy.description}</Text>}
                      {strategy.points && strategy.points.length > 0 && (
                        <div className="bg-cream rounded-lg p-4">
                          <FeatureList
                            items={strategy.points}
                            icon="check"
                            iconColor="green"
                            spacing="tight"
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </AnimatedItem>
        </Section>
      )}

      {/* Implementation Timeline */}
      {false && (
        <Section background="orange-light">
          <AnimatedItem animation="slide-up">
            <div className="max-w-4xl mx-auto">
              <Heading level={2} align="center" className="mb-12">
                Your 4-Week Midweek Transformation
              </Heading>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-orange/30 hidden md:block" />

                <div className="space-y-8">
                  {timeline.weeks.map((week, index) => (
                    <div key={index} className="relative flex gap-6 items-start">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-orange text-white flex items-center justify-center font-bold text-lg z-10">
                        W{index + 1}
                      </div>
                      <Card background="white" padding="large" className="flex-1">
                        <Heading level={3} className="mb-2">
                          {week.week}: {week.title}
                        </Heading>
                        {week.description && (
                          <Text className="mb-4 text-charcoal/80">{week.description}</Text>
                        )}
                        {week.result && (
                          <Text weight="semibold" className="text-orange">
                            Result: {week.result}
                          </Text>
                        )}
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              <Card background="teal" padding="large" className="mt-12 text-center">
                <Heading level={3} color="white" className="mb-4">
                  By Week 4: Your Midweek Nights Are Transformed
                </Heading>
                <Text color="white" className="mb-6">
                  Tuesday quiz packed. Wednesday offers selling out. Thursday becoming the new
                  Friday. You're making £2,000+ more per week and working less.
                </Text>
                <WhatsAppButton
                  text="Start my midweek transformation"
                  size="large"
                  variant="secondary"
                />
              </Card>
            </div>
          </AnimatedItem>
        </Section>
      )}

      {successMetrics?.metrics && successMetrics.metrics.length > 0 && (
        <Section background="white">
          <AnimatedItem animation="fade-in">
            <div className="max-w-4xl mx-auto text-center">
              <Heading level={2} className="mb-12">
                {successMetrics.title || 'Average Results After 30 Days'}
              </Heading>

              <div className="grid md:grid-cols-4 gap-6 mb-12">
                {successMetrics.metrics.map((metric) => (
                  <Card key={metric._key} background="cream" padding="large">
                    <Text size="2xl" weight="bold" className="text-orange mb-2">
                      {metric.value}
                    </Text>
                    <Text weight="semibold" className="mb-1">
                      {metric.label}
                    </Text>
                    {metric.description && (
                      <Text size="sm" className="text-charcoal/60">
                        {metric.description}
                      </Text>
                    )}
                  </Card>
                ))}
              </div>

              <Text size="lg" className="mb-8">
                These aren't cherry-picked success stories. This is the average improvement pubs see
                when they implement our Midweek Momentum System.
              </Text>
            </div>
          </AnimatedItem>
        </Section>
      )}

      {/* Event Ideas */}
      <Section background="cream">
        <AnimatedItem animation="slide-up">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-12">
              Steal These Proven Midweek Events
            </Heading>

            <Grid columns={{ default: 1, md: 2 }} gap="large">
              <Card variant="bordered" padding="large">
                <Heading level={3} className="mb-6">
                  🎯 Tuesday Winners
                </Heading>
                <div className="space-y-4">
                  <div>
                    <Text weight="semibold">Quiz Night 2.0</Text>
                    <Text size="sm" className="text-charcoal/70">
                      Not your grandad's pub quiz. Fast-paced, phone-friendly, prizes that matter.
                    </Text>
                  </div>
                  <div>
                    <Text weight="semibold">Taco Tuesday</Text>
                    <Text size="sm" className="text-charcoal/70">
                      £2 tacos, £5 margaritas. Simple menu, huge margins, Instagram gold.
                    </Text>
                  </div>
                  <div>
                    <Text weight="semibold">Open Mic Night</Text>
                    <Text size="sm" className="text-charcoal/70">
                      Performers bring friends. Friends buy drinks. Everyone wins.
                    </Text>
                  </div>
                </div>
              </Card>

              <Card variant="bordered" padding="large">
                <Heading level={3} className="mb-6">
                  🎯 Wednesday Winners
                </Heading>
                <div className="space-y-4">
                  <div>
                    <Text weight="semibold">Steak Night</Text>
                    <Text size="sm" className="text-charcoal/70">
                      Two steaks + bottle of wine for £39.95. Books out every week.
                    </Text>
                  </div>
                  <div>
                    <Text weight="semibold">Wing Wednesday</Text>
                    <Text size="sm" className="text-charcoal/70">
                      50p wings. Yes, you lose money on wings. You make it on £6 pints.
                    </Text>
                  </div>
                  <div>
                    <Text weight="semibold">Wine & Paint Night</Text>
                    <Text size="sm" className="text-charcoal/70">
                      £25 ticket includes materials + first drink. 30 guaranteed customers.
                    </Text>
                  </div>
                </div>
              </Card>

              <Card variant="bordered" padding="large">
                <Heading level={3} className="mb-6">
                  🎯 Thursday Winners
                </Heading>
                <div className="space-y-4">
                  <div>
                    <Text weight="semibold">Curry Club</Text>
                    <Text size="sm" className="text-charcoal/70">
                      £12.95 curry + rice + naan + pint. Batch cook, minimal waste, packed tables.
                    </Text>
                  </div>
                  <div>
                    <Text weight="semibold">Speed Dating</Text>
                    <Text size="sm" className="text-charcoal/70">
                      Partner with dating company. They bring 40+ people. You provide drinks.
                    </Text>
                  </div>
                  <div>
                    <Text weight="semibold">Cocktail Masterclass</Text>
                    <Text size="sm" className="text-charcoal/70">
                      £30 per person. Teach 3 cocktails. They drink them all. High margins.
                    </Text>
                  </div>
                </div>
              </Card>

              <Card background="orange-light" padding="large">
                <Heading level={3} className="mb-4">
                  🚀 The Secret Sauce
                </Heading>
                <Text className="mb-4">
                  It's not about the event - it's about the promotion. We'll show you exactly how to
                  fill ANY midweek event using our proven social media templates, WhatsApp
                  broadcasts, and community engagement tactics.
                </Text>
                <WhatsAppButton text="Get the promotion templates" fullWidth />
              </Card>
            </Grid>
          </div>
        </AnimatedItem>
      </Section>

      {/* FAQ Section */}
      {false && (
        <Section>
          <AnimatedItem animation="fade-in">
            <div className="max-w-3xl mx-auto">
              <Heading level={2} align="center" className="mb-12">
                Common Questions About Fixing Quiet Midweek Nights
              </Heading>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </AnimatedItem>
        </Section>
      )}

      {/* Investment Section */}
      <Section background="white">
        <AnimatedItem animation="slide-up">
          <div className="max-w-4xl mx-auto">
            <Card background="orange-light" padding="large" className="text-center">
              <Heading level={2} className="mb-8">
                Transform Your Midweek Nights in 30 Days
              </Heading>

              <Grid columns={{ default: 1, md: 3 }} gap="medium" className="mb-8">
                <div>
                  <div className="text-4xl mb-2">📅</div>
                  <Heading level={4} className="mb-2">
                    Week 1-2
                  </Heading>
                  <Text size="sm">
                    Launch first events, see immediate increase in Tuesday/Wednesday covers
                  </Text>
                </div>
                <div>
                  <div className="text-4xl mb-2">📈</div>
                  <Heading level={4} className="mb-2">
                    Week 3-4
                  </Heading>
                  <Text size="sm">
                    Events gaining momentum, regulars forming, bookings coming in advance
                  </Text>
                </div>
                <div>
                  <div className="text-4xl mb-2">💰</div>
                  <Heading level={4} className="mb-2">
                    Month 2+
                  </Heading>
                  <Text size="sm">
                    Midweek as busy as weekends, £8,000+ extra monthly revenue locked in
                  </Text>
                </div>
              </Grid>

              <div className="bg-white rounded-lg p-6 mb-6">
                <Text size="2xl" weight="bold" className="text-orange mb-2">
                  Investment: £75/hour + VAT
                </Text>
                <Text className="text-charcoal/70">
                  Most pubs see meaningful progress inside 30 days
                </Text>
              </div>

              <Text weight="semibold" className="mb-6">
                30-Day Intensive Support: Weekly check-ins and adjustments until your midweek is
                busy again
              </Text>

              <WhatsAppButton text="Fix my quiet midweek nights" size="large" />
            </Card>
          </div>
        </AnimatedItem>
      </Section>

      {/* Urgency Section */}
      <Section background="cream">
        <div className="max-w-4xl mx-auto text-center">
          <Heading level={2} className="mb-6 text-red-700">
            ⚠️ Every Dead Tuesday Costs You Money. Every Dead Wednesday Does Too.
          </Heading>
          <Text size="lg" className="mb-8">
            Money vanishes while your competition gets busier. The longer you wait, the harder it is
            to recover.
          </Text>
          <Card background="white" padding="large">
            <Heading level={3} className="mb-4">
              Stop The Bleeding Today
            </Heading>
            <Text className="mb-6">
              Next Tuesday could be busy instead of quiet. Next Wednesday could be fully booked. But
              only if you act now. Limited spots available - I can only properly support a small
              number of pubs at once.
            </Text>
            <WhatsAppButton
              text="URGENT: Save my midweek nights"
              size="large"
              className="!bg-red-600 hover:!bg-red-700"
            />
          </Card>
        </div>
      </Section>

      {/* Final CTA */}
      <CTASection
        title="Your Midweek Nights Are 30 Days From Packed"
        subtitle="Join the smart pub owners who turned their quietest nights into their most profitable. Get the exact system, templates, and support that transformed The Anchor's dead midweek into meaningful monthly profit."
        buttonText="Transform My Midweek Nights Now"
        whatsappMessage="Peter, my Tuesday and Wednesday nights are dead. I need the Midweek Momentum System."
      />

      {/* Structured Data */}
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
    </>
  );
}
