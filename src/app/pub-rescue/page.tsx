import { type Metadata } from 'next';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import CTASection from '@/components/CTASection';
import WhatsAppButton from '@/components/WhatsAppButton';
import Text from '@/components/Text';
import Heading from '@/components/Heading';
import Card from '@/components/Card';
import Grid from '@/components/Grid';
import FeatureList from '@/components/FeatureList';
import AnimatedItem from '@/components/AnimatedItem';
import FAQItem from '@/components/FAQItem';
import RelatedLinks from '@/components/RelatedLinks';
import { generateMetadata as generateMeta } from '@/lib/metadata';
import { FAQSchema } from '@/components/StructuredData';
// Import local data
import pubRescueData from '../../../content/data/pub-rescue.json';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Pub Recovery Support - Action-First Help for UK Pubs',
    description:
      'If trade is under pressure, get practical action-first support to stabilise performance and rebuild momentum. Proven at The Anchor.',
    path: '/pub-rescue',
  });
}

export default function PubRescue() {
  // Use local data
  const heroSection = pubRescueData.heroSection;
  const emergencyCategories = pubRescueData.emergencyCategories;
  const faqs = pubRescueData.faqs;

  return (
    <>
      {heroSection && (
        <Hero
          title={heroSection.title}
          subtitle={heroSection.subtitle}
          showCTA={false}
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Pub Rescue' }]}
        />
      )}

      {/* Emergency Banner */}
      <Section background="orange-light" padding="small">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <Text size="xl" className="mr-3">
              🚨
            </Text>
            <Heading level={2}>{pubRescueData.emergencyBanner.heading}</Heading>
            <Text size="xl" className="ml-3">
              🚨
            </Text>
          </div>
          <Text size="lg" className="mb-6 max-w-3xl mx-auto">
            {pubRescueData.emergencyBanner.description}
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <WhatsAppButton
              text={pubRescueData.emergencyBanner.ctaText}
              size="large"
              className="!bg-orange hover:!bg-orange-dark !text-white"
            />
            <Text size="sm" className="text-charcoal/60">
              {pubRescueData.emergencyBanner.supportText}
            </Text>
          </div>
        </div>
      </Section>

      {/* Crisis Categories */}
      {emergencyCategories.length > 0 && (
        <Section background="white">
          <Heading level={2} align="center" className="mb-4">
            What's Your Biggest Growth Bottleneck Right Now?
          </Heading>
          <Text size="lg" align="center" className="mb-12 max-w-3xl mx-auto">
            Pick the issue slowing performance most. We'll share how we solved similar challenges at
            The Anchor and build a practical action plan.
          </Text>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {emergencyCategories.map((category) => (
              <div
                key={category._key}
                className="bg-white rounded-lg p-6 border-2 border-orange/20 hover:border-orange transition-all hover:shadow-lg"
              >
                <div className="flex items-start mb-4">
                  <Text size="xl" className="mr-4">
                    {category.icon}
                  </Text>
                  <div className="flex-1">
                    <Heading level={3} className="mb-2">
                      {category.title}
                    </Heading>
                    <Text size="sm" className="mb-2 text-charcoal/80">
                      {category.description}
                    </Text>
                    {category.impact && (
                      <Text size="sm" className="font-semibold text-red-600 mb-2">
                        Impact: {category.impact}
                      </Text>
                    )}
                    {category.solution && (
                      <Text size="sm" className="text-teal-600">
                        Solution: {category.solution}
                      </Text>
                    )}
                  </div>
                </div>

                <WhatsAppButton
                  text={`Help with ${category.title}`}
                  fullWidth
                  size="medium"
                  className="!bg-orange hover:!bg-orange-dark"
                />
              </div>
            ))}
          </div>

          {/* Our Story Box */}
          <div className="bg-teal text-white rounded-lg p-8 mb-12">
            <Heading level={3} align="center" className="mb-6">
              We've Been Where You Are Now
            </Heading>
            <Text size="lg" align="center" className="mb-6 text-cream/90 max-w-3xl mx-auto">
              When we took over The Anchor, performance was flat and midweek trade was weak. Sound
              familiar?
            </Text>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-teal-dark/30 rounded-lg p-4">
                <Heading level={4} className="mb-2">
                  Our Tuesday Nights
                </Heading>
                <Text size="sm" className="mb-2">
                  Were: sparse attendance, losing money
                </Text>
                <Text size="sm" className="font-semibold">
                  Now: 25-30 regular teams monthly, good atmosphere
                </Text>
              </div>
              <div className="bg-teal-dark/30 rounded-lg p-4">
                <Heading level={4} className="mb-2">
                  Our Sunday Roasts
                </Heading>
                <Text size="sm" className="mb-2">
                  Were: half-full room
                </Text>
                <Text size="sm" className="font-semibold">
                  Now: £250/week waste cut with pre-orders
                </Text>
              </div>
              <div className="bg-teal-dark/30 rounded-lg p-4">
                <Heading level={4} className="mb-2">
                  Our Time
                </Heading>
                <Text size="sm" className="mb-2">
                  Were: long weeks, no family time
                </Text>
                <Text size="sm" className="font-semibold">
                  Now: Evenings off, AI handles admin
                </Text>
              </div>
            </div>
          </div>

          {/* Support Promise */}
          <div className="bg-gradient-to-r from-orange/10 to-orange/5 rounded-lg p-8 border-2 border-orange/20">
            <Heading level={3} align="center" className="mb-6">
              Our Action-First Support Promise
            </Heading>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl mb-2">⚡</div>
                <Heading level={4} className="mb-1">
                  Fast Response
                </Heading>
                <Text size="sm">Message anytime - I'll reply as quickly as I can</Text>
              </div>
              <div>
                <div className="text-3xl mb-2">🎯</div>
                <Heading level={4} className="mb-1">
                  Quick Diagnosis
                </Heading>
                <Text size="sm">Identify root problems, not just symptoms</Text>
              </div>
              <div>
                <div className="text-3xl mb-2">💰</div>
                <Heading level={4} className="mb-1">
                  ROI Focused
                </Heading>
                <Text size="sm">Solutions that pay for themselves fast</Text>
              </div>
              <div>
                <div className="text-3xl mb-2">🛡️</div>
                <Heading level={4} className="mb-1">
                  30-Day Partnership
                </Heading>
                <Text size="sm">We stay involved until momentum sticks</Text>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Crisis Calculator */}
      <Section background="cream" padding="small">
        <div className="text-center max-w-3xl mx-auto">
          <Heading level={3} className="mb-4">
            Delays Have A Cost
          </Heading>
          <div className="bg-white rounded-lg p-6 border-2 border-red-200">
            <Text size="lg" className="font-semibold mb-4">
              When action is delayed, trade often drifts:
            </Text>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <Text className="text-3xl font-bold text-red-600">£30-£50</Text>
                <Text size="sm">Typical online estimate per empty table</Text>
              </div>
              <div>
                <Text className="text-3xl font-bold text-red-600">Context</Text>
                <Text size="sm">Wet-led tables cost less than headline figures</Text>
              </div>
              <div>
                <Text className="text-3xl font-bold text-red-600">Act Now</Text>
                <Text size="sm">Every empty night compounds the gap</Text>
              </div>
            </div>
            <Text size="sm" className="text-charcoal/70 mb-4">
              Most pubs see meaningful progress inside 30 days
            </Text>
            <WhatsAppButton text="Help me assess the gap" size="medium" />
          </div>
        </div>
      </Section>

      {/* Our Rescue Methodology */}
      <Section background="white">
        <AnimatedItem animation="fade-in">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-12">
              The Orange Jelly Recovery Method
            </Heading>

            <Text size="lg" align="center" className="mb-12 text-charcoal/70 max-w-3xl mx-auto">
              We don't guess. We use a proven process that created a step-change at The Anchor. Here
              is how we rebuild momentum:
            </Text>

            <Grid columns={{ default: 1, md: 2 }} gap="large">
              <Card variant="bordered" padding="large">
                <div className="text-4xl mb-4">📊</div>
                <Heading level={3} className="mb-4">
                  Week 1: Performance Triage
                </Heading>
                <Text className="mb-4">
                  We identify what is creating drag right now. Empty nights? Low GP? Weak bookings?
                  We prioritise the biggest levers first.
                </Text>
                <FeatureList
                  items={[
                    'Analyse your numbers quickly',
                    'Identify top 3 profit drags',
                    'Implement quick wins immediately',
                    'Early margin gains from waste and cost fixes',
                  ]}
                  icon="check"
                  iconColor="green"
                  spacing="tight"
                />
              </Card>

              <Card variant="bordered" padding="large">
                <div className="text-4xl mb-4">🚀</div>
                <Heading level={3} className="mb-4">
                  Week 2-3: Quick Wins
                </Heading>
                <Text className="mb-4">
                  While we plan longer-term fixes, we execute actions that show visible movement
                  quickly.
                </Text>
                <FeatureList
                  items={[
                    'Launch "must-attend" midweek events',
                    'Fix your Google presence (huge impact)',
                    'Rewrite menu for stronger margins',
                    'Start social media that actually works',
                  ]}
                  icon="check"
                  iconColor="orange"
                  spacing="tight"
                />
              </Card>

              <Card variant="bordered" padding="large">
                <div className="text-4xl mb-4">📈</div>
                <Heading level={3} className="mb-4">
                  Week 4: Momentum Building
                </Heading>
                <Text className="mb-4">
                  Now we're seeing results. Tables filling up. Phone ringing. Time to lock in
                  sustainable growth that keeps building.
                </Text>
                <FeatureList
                  items={[
                    'Automate marketing (redirect 25 hours/week into growth)',
                    'Build customer database for repeat visits',
                    'Train your team on upselling techniques',
                    'Create systems so it runs without you',
                  ]}
                  icon="check"
                  iconColor="teal"
                  spacing="tight"
                />
              </Card>

              <Card variant="bordered" padding="large">
                <div className="text-4xl mb-4">🎯</div>
                <Heading level={3} className="mb-4">
                  Month 2+: Sustainable Success
                </Heading>
                <Text className="mb-4">
                  You have a step-change in consistency: stronger nights, better margins, and better
                  systems. Now we protect and compound it.
                </Text>
                <FeatureList
                  items={[
                    'Monthly check-ins to maintain momentum',
                    'Seasonal campaign planning',
                    'Advanced strategies for growth',
                    "You're working less, earning more",
                  ]}
                  icon="check"
                  iconColor="green"
                  spacing="tight"
                />
              </Card>
            </Grid>

            {/* successMetrics not defined - commenting out this section
            {successMetrics && successMetrics.metrics && successMetrics.metrics.length > 0 && (
              <Card background="orange-light" padding="large" className="mt-8">
                <Text size="lg" align="center" weight="semibold" className="mb-4">
                  {successMetrics.title || 'Most Pubs See These Results Within 30 Days:'}
                </Text>
                {(() => {
                  const count = successMetrics.metrics.length;
                  const mdCols = (count >= 4 ? 4 : count === 3 ? 3 : count === 2 ? 2 : 1) as
                    | 1
                    | 2
                    | 3
                    | 4;
                  return (
                    <Grid columns={{ default: 1, md: mdCols }} gap="medium">
                      {successMetrics.metrics.map((metric) => (
                        <div key={metric._key} className="text-center">
                          <Text size="2xl" weight="bold" className="text-orange">
                            {metric.value}
                          </Text>
                          <Text size="sm">{metric.label}</Text>
                          {metric.description && (
                            <Text size="xs" className="text-charcoal/60 mt-1">
                              {metric.description}
                            </Text>
                          )}
                        </div>
                      ))}
                    </Grid>
                  );
                })()}
              </Card>
            )} */}
          </div>
        </AnimatedItem>
      </Section>

      {/* Why Pubs Plateau Section */}
      <Section background="cream">
        <AnimatedItem animation="slide-up">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-12">
              Why Good Pubs Plateau (And How We Reset Momentum)
            </Heading>

            <div className="space-y-6">
              <Card background="white" padding="large">
                <Grid columns={{ default: 1, md: 2 }} gap="large" className="items-center">
                  <div>
                    <Heading level={3} className="mb-4 text-red-600">
                      They Work IN the Business, Not ON It
                    </Heading>
                    <Text className="mb-4">
                      You're behind the bar most of the week. No time to plan campaigns, update
                      channels, or analyse what is working. Delivery crowds out growth.
                    </Text>
                    <Text weight="semibold" className="text-green-600">
                      We Fix This: AI handles the boring bits. Marketing runs itself. You get
                      evenings back to think strategically (or just rest).
                    </Text>
                  </div>
                  <div className="text-6xl text-center opacity-20">😰</div>
                </Grid>
              </Card>

              <Card background="white" padding="large">
                <Grid columns={{ default: 1, md: 2 }} gap="large" className="items-center">
                  <div className="text-6xl text-center opacity-20 order-2 md:order-1">📉</div>
                  <div className="order-1 md:order-2">
                    <Heading level={3} className="mb-4 text-red-600">
                      They Compete on Price, Not Experience
                    </Heading>
                    <Text className="mb-4">
                      You can't beat chains on price. Trying to be the cheapest is a race to the
                      bottom that erodes your margins and attracts the wrong customers.
                    </Text>
                    <Text weight="semibold" className="text-green-600">
                      We Fix This: Position your pub as THE place for something specific. Quiz
                      nights, Sunday roasts, craft beer - own your niche and charge accordingly.
                    </Text>
                  </div>
                </Grid>
              </Card>

              <Card background="white" padding="large">
                <Grid columns={{ default: 1, md: 2 }} gap="large" className="items-center">
                  <div>
                    <Heading level={3} className="mb-4 text-red-600">
                      They Wait for Conditions to Improve
                    </Heading>
                    <Text className="mb-4">
                      "Summer will be busier." "Once the roadworks finish." "When the economy
                      improves." Waiting isn't a strategy, and delay has a cost.
                    </Text>
                    <Text weight="semibold" className="text-green-600">
                      We Fix This: Take action this week. Our quick wins create early movement, then
                      we build consistency month by month.
                    </Text>
                  </div>
                  <div className="text-6xl text-center opacity-20">⏳</div>
                </Grid>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Heading level={3} className="mb-6">
                Your Pub Can Move Faster Than the Market
              </Heading>
              <Text size="lg" className="mb-8 text-charcoal/70 max-w-2xl mx-auto">
                Trading conditions are tough, but proactive, modern execution still wins. Start with
                the biggest bottleneck and build momentum from there.
              </Text>
              <WhatsAppButton text="Help me build a recovery plan" size="large" />
            </div>
          </div>
        </AnimatedItem>
      </Section>

      {/* What You Get Section */}
      <Section>
        <AnimatedItem animation="fade-in">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-12">
              What You Get With Pub Recovery Support
            </Heading>

            <Grid columns={{ default: 1, md: 2 }} gap="large" className="mb-12">
              <Card background="orange-light" padding="large">
                <Heading level={3} className="mb-6">
                  Immediate Support
                </Heading>
                <FeatureList
                  items={[
                    'Quick response when possible',
                    'Priority triage call where possible',
                    'Quick wins to implement this week',
                    'Direct WhatsApp access to Peter',
                    'No corporate call centres',
                  ]}
                  icon="bullet"
                  iconColor="orange"
                  spacing="normal"
                />
              </Card>

              <Card background="teal-dark" padding="large">
                <Heading level={3} color="white" className="mb-6">
                  30-Day Momentum Sprint
                </Heading>
                <div className="text-white">
                  <FeatureList
                    items={[
                      'Complete marketing system setup',
                      'Menu rewrite for stronger margins',
                      'Event calendar that fills seats',
                      'Social media on autopilot',
                      'Staff training resources',
                    ]}
                    icon="bullet"
                    spacing="normal"
                  />
                </div>
              </Card>
            </Grid>

            <Card variant="bordered" padding="large" className="mb-8">
              <Heading level={3} align="center" className="mb-6">
                Plus These Practical Growth Tools
              </Heading>
              <Grid columns={{ default: 1, md: 3 }} gap="medium">
                <div className="text-center">
                  <div className="text-3xl mb-3">📱</div>
                  <Heading level={4} className="mb-2">
                    AI Marketing Assistant
                  </Heading>
                  <Text size="sm">
                    Creates all your social media, emails, and promotions. Redirects 25 hours every
                    week into growth actions.
                  </Text>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">📊</div>
                  <Heading level={4} className="mb-2">
                    Profit Analysis Tools
                  </Heading>
                  <Text size="sm">
                    Find where you're losing money. Identify £4,000+ in monthly margin gain
                    opportunities.
                  </Text>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">🎯</div>
                  <Heading level={4} className="mb-2">
                    Customer Magnet System
                  </Heading>
                  <Text size="sm">
                    Proven campaigns that fill empty tables. Tested at The Anchor and partner pubs.
                  </Text>
                </div>
              </Grid>
            </Card>

            <div className="text-center">
              <Text size="lg" className="mb-2">
                Investment is simple and transparent
              </Text>
              <Text size="2xl" weight="bold" className="text-orange mb-4">
                £75/hour + VAT
              </Text>
              <Text size="sm" color="muted" className="mb-8">
                Most pubs see meaningful progress inside 30 days
              </Text>
            </div>
          </div>
        </AnimatedItem>
      </Section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <Section background="white">
          <AnimatedItem animation="slide-up">
            <div className="max-w-3xl mx-auto">
              <Heading level={2} align="center" className="mb-12">
                Common Questions From Hospitality Partners
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

      {/* Related Links */}
      <Section background="cream">
        <div className="max-w-4xl mx-auto">
          <RelatedLinks
            title="Choose Your Recovery Focus"
            subtitle="Pick the issue that is slowing growth most and we'll tailor the support"
            links={[
              {
                title: 'Transformational Marketing',
                description: 'Clear plans and action-first delivery to rebuild momentum',
                href: '/services#transformational-marketing',
                emoji: '🏚️',
                highlight: true,
              },
              {
                title: 'Event Innovation',
                description: 'Fresh event formats that build repeat demand',
                href: '/services#event-innovation',
                emoji: '🍽️',
              },
              {
                title: 'Simplified Technology Tools',
                description: 'Simpler systems, lower waste, better consistency',
                href: '/services#simplified-technology-tools',
                emoji: '📱',
              },
            ]}
            variant="card"
            columns={{ default: 1, md: 3 }}
          />
        </div>
      </Section>

      {/* Final CTA */}
      <CTASection
        title="Ready to Rebuild Momentum?"
        subtitle="With the right priorities and consistent execution, performance can shift quickly. Message me and we'll fix the highest-impact issue first."
        whatsappMessage="Peter, I need help with my pub's performance. My biggest issue is [describe issue]."
        buttonText="Start My Pub Recovery Plan"
      />

      {/* Add FAQ Schema */}
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
    </>
  );
}
