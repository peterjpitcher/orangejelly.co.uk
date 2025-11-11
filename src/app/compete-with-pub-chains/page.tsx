import { type Metadata } from 'next';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Card from '@/components/Card';
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';
import CTASection from '@/components/CTASection';
import FAQItem from '@/components/FAQItem';
import Text from '@/components/Text';
import FeatureList from '@/components/FeatureList';
import { generateMetadata as generateMeta } from '@/lib/metadata';
import { FAQSchema } from '@/components/StructuredData';
// Import local data
import competeData from '../../../content/data/compete-with-chains.json';
import WhatsAppButton from '@/components/WhatsAppButton';
import Button from '@/components/Button';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: 'Beat Wetherspoons & Pub Chains - David vs Goliath Strategy',
    description:
      'Stop losing customers to chain pubs. Proven strategies to compete and win against Wetherspoons, Greene King, and Marstons. Turn their weaknesses into your strengths.',
    path: '/compete-with-pub-chains',
  });
}

export default function CompeteWithPubChains() {
  // Use local data
  const heroSection = competeData.heroSection;
  const problemSection = competeData.problemSection;
  const strategies = competeData.strategies;
  const successMetrics = competeData.successMetrics;
  const faqs = competeData.faqs;

  return (
    <>
      {heroSection && (
        <Hero
          title={heroSection.title}
          subtitle={heroSection.subtitle}
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Compete With Chains' }]}
        />
      )}

      {/* Problem Section */}
      <Section background="cream" padding="small">
        <AnimatedItem animation="fade-in">
          <div className="max-w-4xl mx-auto text-center">
            <Heading level={2} className="mb-8">
              {problemSection.heading}
            </Heading>

            <Grid columns={{ default: 1, md: 3 }} gap="medium" className="mb-8">
              {problemSection.challenges.map((challenge, index) => (
                <Card key={index} background="white" padding="medium">
                  <div className="text-3xl mb-3">{challenge.icon}</div>
                  <Heading level={4} className="mb-2">
                    {challenge.title}
                  </Heading>
                  <Text size="sm">{challenge.description}</Text>
                </Card>
              ))}
            </Grid>

            <Card background="cream" padding="large" variant="bordered" className="border-red-200">
              <Text size="lg" weight="semibold" className="text-red-600 mb-4">
                {problemSection.truthStatement}
              </Text>
              <Text className="mb-6">{problemSection.solution}</Text>
              <WhatsAppButton text={problemSection.ctaText} size="large" />
            </Card>
          </div>
        </AnimatedItem>
      </Section>

      {/* David vs Goliath Strategy */}
      {strategies.length > 0 && (
        <Section>
          <AnimatedItem animation="slide-up">
            <div className="max-w-4xl mx-auto">
              <Heading level={2} align="center" className="mb-4">
                The David vs Goliath Strategy
              </Heading>
              <Text size="lg" align="center" className="mb-12 text-charcoal/70">
                Turn their biggest strengths into weaknesses. Your small size is your superpower.
              </Text>

              <div className="space-y-6">
                {strategies.map((strategy, index) => (
                  <Card
                    key={strategy._key}
                    padding="large"
                    variant="bordered"
                    background={index % 2 === 0 ? 'white' : 'cream'}
                  >
                    <Grid columns={{ default: 1, md: 2 }} gap="large" className="items-center">
                      <div className={index % 2 === 0 ? '' : 'md:order-2'}>
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-orange text-white flex items-center justify-center font-bold mr-4">
                            {index + 1}
                          </div>
                          <Heading level={3}>{strategy.title}</Heading>
                        </div>
                        {strategy.description && (
                          <Text className="mb-4">{strategy.description}</Text>
                        )}
                        {strategy.tactics && strategy.tactics.length > 0 && (
                          <FeatureList
                            items={strategy.tactics}
                            icon="check"
                            iconColor="green"
                            spacing="tight"
                          />
                        )}
                        {strategy.result && (
                          <Text size="sm" weight="semibold" className="mt-4 text-orange">
                            → {strategy.result}
                          </Text>
                        )}
                      </div>
                      <div className={`text-center ${index % 2 === 0 ? '' : 'md:order-1'}`}>
                        <div className="text-6xl opacity-20">
                          {index === 0 && '👥'}
                          {index === 1 && '⚡'}
                          {index === 2 && '🎯'}
                          {index === 3 && '💝'}
                          {index === 4 && '🏆'}
                        </div>
                      </div>
                    </Grid>
                  </Card>
                ))}
              </div>
            </div>
          </AnimatedItem>
        </Section>
      )}

      {/* Real Examples */}
      <Section background="teal">
        <AnimatedItem animation="fade-in">
          <div className="max-w-4xl mx-auto text-center">
            <Heading level={2} color="white" className="mb-12">
              How We Beat Our Local Wetherspoons
            </Heading>

            <Grid columns={{ default: 1, md: 2 }} gap="large" className="mb-8">
              <Card background="white" padding="large">
                <Heading level={3} className="mb-4 text-teal">
                  They Have
                </Heading>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Text className="text-red-500 mr-2">✗</Text>
                    <Text size="sm">£2.49 pints all day</Text>
                  </div>
                  <div className="flex items-start">
                    <Text className="text-red-500 mr-2">✗</Text>
                    <Text size="sm">500+ capacity venue</Text>
                  </div>
                  <div className="flex items-start">
                    <Text className="text-red-500 mr-2">✗</Text>
                    <Text size="sm">App ordering from table</Text>
                  </div>
                  <div className="flex items-start">
                    <Text className="text-red-500 mr-2">✗</Text>
                    <Text size="sm">Open from 8am daily</Text>
                  </div>
                  <div className="flex items-start">
                    <Text className="text-red-500 mr-2">✗</Text>
                    <Text size="sm">National TV advertising</Text>
                  </div>
                </div>
              </Card>

              <Card background="white" padding="large">
                <Heading level={3} className="mb-4 text-orange">
                  We Have
                </Heading>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Text className="text-green-500 mr-2">✓</Text>
                    <Text size="sm">Customers know our names</Text>
                  </div>
                  <div className="flex items-start">
                    <Text className="text-green-500 mr-2">✓</Text>
                    <Text size="sm">Dogs welcome everywhere</Text>
                  </div>
                  <div className="flex items-start">
                    <Text className="text-green-500 mr-2">✓</Text>
                    <Text size="sm">WhatsApp group with 180+ locals</Text>
                  </div>
                  <div className="flex items-start">
                    <Text className="text-green-500 mr-2">✓</Text>
                    <Text size="sm">Birthday cards for regulars</Text>
                  </div>
                  <div className="flex items-start">
                    <Text className="text-green-500 mr-2">✓</Text>
                    <Text size="sm">Atmosphere you can't fake</Text>
                  </div>
                </div>
              </Card>
            </Grid>

            <Card background="orange-light" padding="large">
              <Heading level={3} className="mb-4">
                The Result?
              </Heading>
              <Text size="lg" className="mb-4">
                They get the bargain hunters. We get the community.
              </Text>
              <Text className="mb-6">
                Our average spend is £18 vs their £8. Our customers come 3x per week vs their 1x.
                Our Trip Advisor is 4.8 vs their 3.2. We're not competing - we're in different
                leagues.
              </Text>
              <WhatsAppButton text="Help me create my unique position" size="large" />
            </Card>
          </div>
        </AnimatedItem>
      </Section>

      {/* Success Metrics */}
      {successMetrics && successMetrics.metrics && (
        <Section background="white">
          <AnimatedItem animation="slide-up">
            <div className="max-w-4xl mx-auto text-center">
              <Heading level={2} className="mb-12">
                {successMetrics.title || 'What Happens When You Stop Competing on Price'}
              </Heading>

              {(() => {
                const count = successMetrics.metrics.length;
                const mdCols = (count >= 4 ? 4 : count === 3 ? 3 : count === 2 ? 2 : 1) as
                  | 1
                  | 2
                  | 3
                  | 4;
                return (
                  <Grid columns={{ default: 1, md: mdCols }} gap="large" className="mb-12">
                    {successMetrics.metrics.map((metric, index) => (
                      <Card key={index} background="white" padding="large" variant="bordered">
                        <Heading level={4} className="mb-3">
                          {metric.metric}
                        </Heading>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Text size="sm" weight="semibold" className="text-red-600">
                              Before:
                            </Text>
                            <Text size="sm">{metric.before}</Text>
                          </div>
                          <div className="flex items-center gap-2">
                            <Text size="sm" weight="semibold" className="text-green-600">
                              After:
                            </Text>
                            <Text size="sm">{metric.after}</Text>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </Grid>
                );
              })()}

              <Text size="lg" className="max-w-3xl mx-auto">
                When you stop trying to be a cheaper Wetherspoons and start being the best version
                of YOUR pub, everything changes. Margins improve. Stress reduces. Customers become
                advocates.
              </Text>
            </div>
          </AnimatedItem>
        </Section>
      )}

      {/* Your Unfair Advantages */}
      <Section background="cream">
        <AnimatedItem animation="fade-in">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-12">
              Your Unfair Advantages Over Chain Pubs
            </Heading>

            <Grid columns={{ default: 1, md: 3 }} gap="medium">
              <Card variant="bordered" padding="large">
                <div className="text-3xl mb-4">🚀</div>
                <Heading level={3} className="mb-3">
                  Speed
                </Heading>
                <Text size="sm" className="mb-4">
                  New event idea? Launch it tomorrow. Menu change? Done today. Chains need 6 months
                  and board approval.
                </Text>
                <Text size="xs" className="text-green-600 font-semibold">
                  Your superpower: Agility
                </Text>
              </Card>

              <Card variant="bordered" padding="large">
                <div className="text-3xl mb-4">❤️</div>
                <Heading level={3} className="mb-3">
                  Personality
                </Heading>
                <Text size="sm" className="mb-4">
                  You're not employee #47823. You're Sarah, Mike, or Dave. People come to see YOU,
                  not just for a pint.
                </Text>
                <Text size="xs" className="text-green-600 font-semibold">
                  Your superpower: Being human
                </Text>
              </Card>

              <Card variant="bordered" padding="large">
                <div className="text-3xl mb-4">🎯</div>
                <Heading level={3} className="mb-3">
                  Focus
                </Heading>
                <Text size="sm" className="mb-4">
                  Chains try to please everyone. You can be THE place for craft beer, dogs, or
                  Sunday roasts.
                </Text>
                <Text size="xs" className="text-green-600 font-semibold">
                  Your superpower: Specialization
                </Text>
              </Card>

              <Card variant="bordered" padding="large">
                <div className="text-3xl mb-4">🏘️</div>
                <Heading level={3} className="mb-3">
                  Local Knowledge
                </Heading>
                <Text size="sm" className="mb-4">
                  You know Mrs. Johnson likes her wine cold. That Jim's birthday is Tuesday. That
                  the football team meets Thursdays.
                </Text>
                <Text size="xs" className="text-green-600 font-semibold">
                  Your superpower: Community insider
                </Text>
              </Card>

              <Card variant="bordered" padding="large">
                <div className="text-3xl mb-4">🎨</div>
                <Heading level={3} className="mb-3">
                  Creativity
                </Heading>
                <Text size="sm" className="mb-4">
                  Weird Wednesday? Do it. Dog birthday parties? Why not. Chains can't risk their
                  brand with fun.
                </Text>
                <Text size="xs" className="text-green-600 font-semibold">
                  Your superpower: Freedom to experiment
                </Text>
              </Card>

              <Card variant="bordered" padding="large">
                <div className="text-3xl mb-4">💪</div>
                <Heading level={3} className="mb-3">
                  Flexibility
                </Heading>
                <Text size="sm" className="mb-4">
                  Customer wants off-menu item? Sure. Need to stay late for a wake? Of course.
                  Chains say computer says no.
                </Text>
                <Text size="xs" className="text-green-600 font-semibold">
                  Your superpower: Saying yes
                </Text>
              </Card>
            </Grid>

            <Card background="orange-light" padding="large" className="mt-8 text-center">
              <Heading level={3} className="mb-4">
                Stop Playing Their Game. Start Playing Yours.
              </Heading>
              <Text className="mb-6 max-w-2xl mx-auto">
                We'll help you identify your unique strengths, build an unbeatable position, and
                create customers so loyal they'd never dream of going to Spoons.
              </Text>
              <WhatsAppButton text="Create my chain-beating strategy" size="large" />
            </Card>
          </div>
        </AnimatedItem>
      </Section>

      {/* Action Plan */}
      <Section>
        <AnimatedItem animation="slide-up">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-12">
              Your 30-Day Chain-Beating Action Plan
            </Heading>

            <div className="space-y-4">
              <Card padding="large" variant="bordered">
                <Grid columns={{ default: 1, md: 3 }} gap="large" className="items-center">
                  <div>
                    <Text size="lg" weight="bold" className="text-orange mb-2">
                      Days 1-10
                    </Text>
                    <Heading level={4}>Stop the Bleeding</Heading>
                  </div>
                  <div className="md:col-span-2">
                    <FeatureList
                      items={[
                        'Identify exactly who your ideal customer is (hint: not everyone)',
                        "List 10 things you can do that chains can't",
                        'Create your "Never Compete on Price" promise',
                        'Start a WhatsApp community group',
                      ]}
                      icon="arrow"
                      iconColor="orange"
                      spacing="tight"
                    />
                  </div>
                </Grid>
              </Card>

              <Card padding="large" variant="bordered">
                <Grid columns={{ default: 1, md: 3 }} gap="large" className="items-center">
                  <div>
                    <Text size="lg" weight="bold" className="text-orange mb-2">
                      Days 11-20
                    </Text>
                    <Heading level={4}>Build Your Fortress</Heading>
                  </div>
                  <div className="md:col-span-2">
                    <FeatureList
                      items={[
                        "Launch one signature thing chains can't copy",
                        'Create a loyalty program based on recognition, not points',
                        'Partner with 3 local businesses for cross-promotion',
                        'Start birthday/anniversary program for regulars',
                      ]}
                      icon="arrow"
                      iconColor="orange"
                      spacing="tight"
                    />
                  </div>
                </Grid>
              </Card>

              <Card padding="large" variant="bordered">
                <Grid columns={{ default: 1, md: 3 }} gap="large" className="items-center">
                  <div>
                    <Text size="lg" weight="bold" className="text-orange mb-2">
                      Days 21-30
                    </Text>
                    <Heading level={4}>Go on Offense</Heading>
                  </div>
                  <div className="md:col-span-2">
                    <FeatureList
                      items={[
                        'Launch "Refugees from Chains" welcome campaign',
                        'Create experiences worth more than cheap pints',
                        'Build reputation as THE place for something specific',
                        'Turn your best customers into evangelical advocates',
                      ]}
                      icon="arrow"
                      iconColor="orange"
                      spacing="tight"
                    />
                  </div>
                </Grid>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Button href="#cta" size="large" variant="primary">
                Start My 30-Day Plan Today
              </Button>
            </div>
          </div>
        </AnimatedItem>
      </Section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <Section background="white">
          <AnimatedItem animation="fade-in">
            <div className="max-w-3xl mx-auto">
              <Heading level={2} align="center" className="mb-12">
                Common Questions About Competing With Chain Pubs
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

      {/* Investment */}
      <Section background="charcoal">
        <AnimatedItem animation="slide-up">
          <div className="max-w-4xl mx-auto text-center">
            <Heading level={2} color="white" className="mb-8">
              Ready to Stop Losing to Chain Pubs?
            </Heading>

            <Card background="white" padding="large">
              <Heading level={3} className="mb-6">
                The Chain-Beater Package
              </Heading>

              <Grid columns={{ default: 1, md: 3 }} gap="medium" className="mb-8">
                <div>
                  <div className="text-3xl mb-3">🎯</div>
                  <Text weight="semibold" className="mb-2">
                    Positioning Workshop
                  </Text>
                  <Text size="sm">Find your unique angle that chains can't touch</Text>
                </div>
                <div>
                  <div className="text-3xl mb-3">📱</div>
                  <Text weight="semibold" className="mb-2">
                    Community Building
                  </Text>
                  <Text size="sm">Create loyalty that transcends price</Text>
                </div>
                <div>
                  <div className="text-3xl mb-3">🚀</div>
                  <Text weight="semibold" className="mb-2">
                    30-Day Action Plan
                  </Text>
                  <Text size="sm">Daily steps to beat the chains at their own game</Text>
                </div>
              </Grid>

              <div className="bg-cream rounded-lg p-6 mb-6">
                <Text size="2xl" weight="bold" className="text-orange mb-2">
                  £75/hour + VAT
                </Text>
                <Text className="text-charcoal/70 mb-4">
                  Most pubs see 25% revenue increase within 60 days
                </Text>
                <Text size="sm" weight="semibold" className="text-green-600">
                  30-Day Partnership: weekly optimisation with a working licensee
                </Text>
              </div>

              <WhatsAppButton text="I'm ready to beat the chains" size="large" />

              <Text size="sm" className="mt-4 text-charcoal/60">
                Limited availability - I only work with 5 pubs at a time to ensure results
              </Text>
            </Card>
          </div>
        </AnimatedItem>
      </Section>

      {/* Final CTA */}
      <CTASection
        title="David Beat Goliath. So Can You."
        subtitle="Stop competing on price. Start competing on what matters. Get the strategy, tools, and support to build a pub that chain customers wish they had."
        buttonText="Start Beating Chain Pubs Today"
        whatsappMessage="Peter, I'm losing customers to chain pubs. Help me create my unique position and win them back."
      />

      {/* Structured Data */}
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}
    </>
  );
}
