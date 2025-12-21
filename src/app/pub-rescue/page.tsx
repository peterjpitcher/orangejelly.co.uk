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
    title: 'Pub Rescue - Emergency Help for Struggling UK Pubs',
    description:
      'Struggling pub? Get emergency help now. From empty Tuesday nights to staff crises, we provide immediate solutions proven at The Anchor.',
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
              className="!bg-red-600 hover:!bg-red-700 !text-white"
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
            What's Your Biggest Emergency Right Now?
          </Heading>
          <Text size="lg" align="center" className="mb-12 max-w-3xl mx-auto">
            Click your most urgent problem. We'll share how we fixed the same crisis at The Anchor
            and create an action plan to save your pub.
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
              When we took over The Anchor, it was failing. Empty most nights. Losing money every
              month. Sound familiar?
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

          {/* Emergency Response Promise */}
          <div className="bg-gradient-to-r from-orange/10 to-orange/5 rounded-lg p-8 border-2 border-orange/20">
            <Heading level={3} align="center" className="mb-6">
              Our Emergency Response Promise
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
                <Text size="sm">We stay involved until the turnaround sticks</Text>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Crisis Calculator */}
      <Section background="cream" padding="small">
        <div className="text-center max-w-3xl mx-auto">
          <Heading level={3} className="mb-4">
            Every Day You Wait Costs Money
          </Heading>
          <div className="bg-white rounded-lg p-6 border-2 border-red-200">
            <Text size="lg" className="font-semibold mb-4">
              Your crisis is costing you:
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
                <Text size="sm">Every empty night compounds the problem</Text>
              </div>
            </div>
            <Text size="sm" className="text-charcoal/70 mb-4">
              Most pubs see meaningful progress inside 30 days
            </Text>
            <WhatsAppButton text="Calculate my exact losses" size="medium" />
          </div>
        </div>
      </Section>

      {/* Our Rescue Methodology */}
      <Section background="white">
        <AnimatedItem animation="fade-in">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-12">
              The Orange Jelly Pub Rescue Method
            </Heading>

            <Text size="lg" align="center" className="mb-12 text-charcoal/70 max-w-3xl mx-auto">
              We don't guess what your pub needs. We follow a proven process that transformed The
              Anchor from struggling to thriving. Here's exactly how we turn things around:
            </Text>

            <Grid columns={{ default: 1, md: 2 }} gap="large">
              <Card variant="bordered" padding="large">
                <div className="text-4xl mb-4">📊</div>
                <Heading level={3} className="mb-4">
                  Week 1: Emergency Triage
                </Heading>
                <Text className="mb-4">
                  We identify what's bleeding money RIGHT NOW. Empty nights? Bad GP? No bookings? We
                  find the biggest leaks and plug them fast.
                </Text>
                <FeatureList
                  items={[
                    'Analyze your numbers quickly',
                    'Identify top 3 profit killers',
                    'Implement quick wins immediately',
                    'Early savings from waste and cost fixes',
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
                  While planning long-term fixes, we implement strategies that show results fast.
                  You need cash flow NOW, not in 6 months.
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
                    'Automate marketing (save up to 25 hours/week)',
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
                  Your pub is transformed. Busy nights, better margins, happy customers. Now we make
                  sure it stays that way.
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

      {/* Why Pubs Fail Section */}
      <Section background="cream">
        <AnimatedItem animation="slide-up">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-12">
              Why Good Pubs Fail (And How We Stop It)
            </Heading>

            <div className="space-y-6">
              <Card background="white" padding="large">
                <Grid columns={{ default: 1, md: 2 }} gap="large" className="items-center">
                  <div>
                    <Heading level={3} className="mb-4 text-red-600">
                      They Work IN the Business, Not ON It
                    </Heading>
                    <Text className="mb-4">
                      You're behind the bar 7 days a week. No time to plan events, update social
                      media, or analyze what's working. You're too busy surviving to actually grow.
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
                      bottom that kills your margins and attracts the wrong customers.
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
                      They Hope Things Will Get Better
                    </Heading>
                    <Text className="mb-4">
                      "Summer will be busier." "Once the roadworks finish." "When the economy
                      improves." Hope isn't a strategy, and waiting costs you money every single
                      day.
                    </Text>
                    <Text weight="semibold" className="text-green-600">
                      We Fix This: Take action NOW. Our quick wins show results in days, not months.
                      Every week you wait is money lost forever.
                    </Text>
                  </div>
                  <div className="text-6xl text-center opacity-20">⏳</div>
                </Grid>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Heading level={3} className="mb-6">
                Your Pub Doesn't Have to Be Another Statistic
              </Heading>
              <Text size="lg" className="mb-8 text-charcoal/70 max-w-2xl mx-auto">
                Pubs close every week in the UK. But with the right help, the right strategies, and
                action taken TODAY, yours won't be one of them.
              </Text>
              <WhatsAppButton text="I refuse to let my pub fail - help me" size="large" />
            </div>
          </div>
        </AnimatedItem>
      </Section>

      {/* What You Get Section */}
      <Section>
        <AnimatedItem animation="fade-in">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-12">
              What You Actually Get With Pub Rescue
            </Heading>

            <Grid columns={{ default: 1, md: 2 }} gap="large" className="mb-12">
              <Card background="orange-light" padding="large">
                <Heading level={3} className="mb-6">
                  Immediate Support
                </Heading>
                <FeatureList
                  items={[
                    'Quick response when possible',
                    'Emergency triage call same day',
                    'Quick wins to implement NOW',
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
                  30-Day Transformation
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
                Plus These Business-Saving Tools
              </Heading>
              <Grid columns={{ default: 1, md: 3 }} gap="medium">
                <div className="text-center">
                  <div className="text-3xl mb-3">📱</div>
                  <Heading level={4} className="mb-2">
                    AI Marketing Assistant
                  </Heading>
                  <Text size="sm">
                    Creates all your social media, emails, and promotions. Saves up to 25 hours
                    every week.
                  </Text>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">📊</div>
                  <Heading level={4} className="mb-2">
                    Profit Analysis Tools
                  </Heading>
                  <Text size="sm">
                    Find where you're losing money. Identify £4,000+ in monthly savings
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
                Common Questions From Struggling Licensees
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
            title="Choose Your Rescue Plan"
            subtitle="Pick the idea that matches your biggest crisis and we'll tailor the hours"
            links={[
              {
                title: 'Empty Pub Recovery',
                description: 'Fill your quiet nights in 30 days with hands-on support',
                href: '/services#empty-pub-recovery',
                emoji: '🏚️',
                highlight: true,
              },
              {
                title: 'Menu Makeover',
                description: 'Psychology-based menus that lift spend and margins',
                href: '/services#boost-food-sales',
                emoji: '🍽️',
              },
              {
                title: 'Marketing Automation',
                description: 'Never worry about social media again',
                href: '/services#done-for-you-marketing',
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
        title="Don't Let Your Pub Become Another Statistic"
        subtitle="Pubs close every week in the UK. With the right help, yours doesn't have to be one of them. Message me now - let's fix your biggest problem first."
        whatsappMessage="Peter, my pub needs urgent help with [describe your crisis]"
        buttonText="Get Emergency Pub Help Now"
      />

      {/* Add FAQ Schema */}
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
    </>
  );
}
