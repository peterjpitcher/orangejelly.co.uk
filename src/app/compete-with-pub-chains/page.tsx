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
    title: 'Compete with Pub Chains - Practical Challenger Strategy',
    description:
      'Stop losing customers to chain pubs. Practical strategies to compete through differentiation, community, and experience. Packages from £375 + VAT.',
    path: '/compete-with-pub-chains',
  });
}

const faqs = [
  {
    question: 'Can an independent pub really compete with chains?',
    answer:
      'Absolutely. Chains compete on price and scale. Independents win on personality, agility, community, and experience. We prove this every day at The Anchor — competing against a local Wetherspoons with higher average spend and better repeat visit rates.',
  },
  {
    question: 'How much does it cost to build a challenger strategy?',
    answer:
      'A Growth Fix starts from £375 + VAT — 5 focused hours on your positioning and competitive advantage. For ongoing support building your independent brand, Growth Partner is £1,800 + VAT per month. Payment plans are available.',
  },
  {
    question: 'How long does it take to see results?',
    answer:
      'Positioning changes show up quickly — within 2-4 weeks you will notice different conversations with customers. Building a loyal community that chooses you over chains takes 2-3 months of consistent execution.',
  },
  {
    question: 'Do I need to change my whole pub?',
    answer:
      'No. You need to identify and amplify what already makes you different. Most independents are already doing things chains cannot — they just are not promoting it.',
  },
];

export default function CompeteWithPubChains() {
  return (
    <>
      <FAQSchema faqs={faqs} />

      <Hero
        title="Stop Competing on Price. Start Winning on Experience."
        subtitle="Chain pubs have scale and cheap pints. You have personality, community, and agility. We will help you turn those into an unbeatable advantage."
        secondaryAction={{
          text: 'See Our Packages',
          href: '/ways-to-work',
        }}
        bottomText="Packages from £375 + VAT • Proven at The Anchor • Payment plans available"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Compete With Chains' }]}
      />

      <ProofStrip claimIds={['quiz-regulars', 'social-views', 'food-gp-growth', 'value-added']} />

      {/* The Problem */}
      <Section>
        <AnimatedItem animation="fade-in">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={2} align="center" className="mb-6">
              You Cannot Out-Spend a Chain. But You Can Out-Care One.
            </Heading>
            <Text size="lg" color="muted" align="center" className="mb-4">
              Chains compete on price, consistency, and marketing budgets you will never match. If
              you try to play their game, you will lose.
            </Text>
            <Text size="lg" color="muted" align="center" className="mb-8">
              The good news? They cannot compete on what you have: personality, agility, local
              knowledge, and the ability to create experiences worth more than cheap pints.
            </Text>
          </div>
        </AnimatedItem>
      </Section>

      {/* How We Compete */}
      <Section background="teal">
        <AnimatedItem animation="slide-up">
          <div className="max-w-4xl mx-auto text-center">
            <Heading level={2} color="white" className="mb-4">
              How We Compete With Our Local Wetherspoons
            </Heading>
            <Text size="lg" color="white" className="opacity-90 mb-10">
              At The Anchor, we stopped trying to match chain prices and focused on what they cannot
              do.
            </Text>

            <Grid columns={{ default: 1, md: 2 }} gap="large" className="mb-8">
              <Card background="white" padding="large">
                <Heading level={3} className="mb-4 text-red-600">
                  They Have
                </Heading>
                <FeatureList
                  items={[
                    'Low prices all day',
                    '500+ capacity',
                    'App ordering',
                    'National TV advertising',
                  ]}
                  icon="bullet"
                  iconColor="red"
                  spacing="normal"
                />
              </Card>
              <Card background="white" padding="large">
                <Heading level={3} className="mb-4 text-green-600">
                  We Have
                </Heading>
                <FeatureList
                  items={[
                    'Customers know our names',
                    'Dogs welcome everywhere',
                    'WhatsApp group with 180+ locals',
                    'Atmosphere you cannot fake',
                  ]}
                  icon="check"
                  iconColor="green"
                  spacing="normal"
                />
              </Card>
            </Grid>

            <CaseStudyCard id="anchor-midweek-turnaround" variant="full" />
          </div>
        </AnimatedItem>
      </Section>

      {/* Your Advantages */}
      <Section background="cream">
        <AnimatedItem animation="fade-in">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-4">
              Your Practical Advantages Over Chain Pubs
            </Heading>
            <Text size="lg" color="muted" align="center" className="mb-10">
              Every independent pub has advantages chains cannot replicate. We help you identify and
              amplify them.
            </Text>
            <Grid columns={{ default: 1, md: 3 }} gap="medium">
              <Card variant="bordered" padding="large">
                <Heading level={3} className="mb-3">
                  Speed
                </Heading>
                <Text size="sm" color="muted">
                  New event idea? Launch it tomorrow. Menu change? Done today. Chains need 6 months
                  and board approval.
                </Text>
              </Card>
              <Card variant="bordered" padding="large">
                <Heading level={3} className="mb-3">
                  Personality
                </Heading>
                <Text size="sm" color="muted">
                  You are not employee number 47823. People come to see YOU, not just for a pint.
                </Text>
              </Card>
              <Card variant="bordered" padding="large">
                <Heading level={3} className="mb-3">
                  Community
                </Heading>
                <Text size="sm" color="muted">
                  You know the regulars by name, their birthdays, their favourite drink. Chains sell
                  transactions. You build relationships.
                </Text>
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
              The Right Package to Build Your Challenger Position
            </Heading>
            <Text size="lg" color="muted" align="center" className="mb-10">
              Start with a Growth Fix for positioning and competitive strategy, or go deeper with
              Growth Partner for ongoing brand building and execution.
            </Text>

            <Grid columns={{ default: 1, md: 2 }} gap="large">
              <div>
                <Card background="cream" padding="large" className="mb-4">
                  <Heading level={3} className="mb-3">
                    Find Your Competitive Angle
                  </Heading>
                  <Text color="muted" className="mb-4">
                    A Growth Fix gives you 5 focused hours on your positioning, competitive
                    advantage, and a clear action plan to differentiate from the chains.
                  </Text>
                  <FeatureList
                    items={[
                      'Positioning audit vs local chains',
                      'Unique selling point refinement',
                      'Community engagement strategy',
                      'From £375 + VAT',
                    ]}
                    icon="check"
                    iconColor="green"
                    spacing="tight"
                  />
                </Card>
                <PackageCard packageId="growth-fix" />
              </div>
              <div>
                <Card background="orange-light" padding="large" className="mb-4">
                  <Heading level={3} className="mb-3">
                    Build an Unbeatable Brand
                  </Heading>
                  <Text color="muted" className="mb-4">
                    Growth Partner gives you ongoing strategy, events, social media, and community
                    building — everything you need to become the independent pub of choice.
                  </Text>
                  <FeatureList
                    items={[
                      '24 hours per month',
                      'Event strategy and promotion',
                      'Social media and community building',
                      'Weekly execution and accountability',
                    ]}
                    icon="check"
                    iconColor="green"
                    spacing="tight"
                  />
                </Card>
                <PackageCard packageId="growth-partner" highlighted />
              </div>
            </Grid>
          </div>
        </AnimatedItem>
      </Section>

      {/* FAQ */}
      <Section background="white">
        <Heading level={2} align="center" className="mb-8">
          Common Questions About Competing With Chain Pubs
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
            Ready to Build a Stronger Independent Position?
          </Heading>
          <Text size="lg" align="center" className="mb-6">
            Stop playing the chains&apos; game. Tell Peter about your local competition and he will
            help you find your unbeatable angle.
          </Text>
          <PackageCTA />
          <Text size="sm" color="muted" align="center" className="mt-4">
            Packages from £375 + VAT. Payment plans available.
          </Text>
        </div>
      </Section>
    </>
  );
}
