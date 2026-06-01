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
    title: 'Fill Empty Pub Tables — 30-Day Footfall Recovery Plan',
    description:
      'Quiet midweek nights and empty tables? A practical plan to increase footfall and fill seats consistently. Proven at The Anchor. Packages from £375 + VAT.',
    path: '/empty-pub-solutions',
  });
}

const faqs = [
  {
    question: 'How quickly can I see results for my empty pub?',
    answer:
      'Growth Fix clients typically see their first win within 2 weeks. If you need ongoing support, Growth Partner clients build visible momentum within 30-60 days.',
  },
  {
    question: "What if I've tried everything and nothing works?",
    answer:
      "We hear this a lot. The difference is we are licensees who have solved this exact problem. Our strategies are not theories — they are proven methods that transformed The Anchor's quiet nights into profitable evenings.",
  },
  {
    question: 'How much does the empty pub recovery plan cost?',
    answer:
      'A focused Growth Fix starts from just £375 + VAT — 5 hours on your biggest bottleneck. If you need ongoing monthly support, Growth Partner is £1,800 + VAT per month. Payment plans are available.',
  },
  {
    question: 'Do I need to spend money on advertising?',
    answer:
      'No. Our system focuses on organic growth through better messaging, community engagement, and word-of-mouth. Optional paid ads can accelerate results, but they are not required.',
  },
  {
    question: 'Will this work for my type of pub?',
    answer:
      'Yes. The principles work for gastropubs, community locals, sports bars, and country inns because they are based on human psychology and proven hospitality fundamentals. We tailor the plan to your pub and your catchment.',
  },
];

export default function EmptyPubSolutions() {
  return (
    <>
      <FAQSchema faqs={faqs} />

      <Hero
        title={
          <>
            Empty Tables to
            <br />
            Full Houses in 30 Days.
          </>
        }
        subtitle="A step-by-step footfall plan to fill quiet nights, boost midweek covers, and keep tables turning — proven at The Anchor"
        secondaryAction={{
          text: 'See Our Packages',
          href: '/ways-to-work',
        }}
        bottomText="Packages from £375 + VAT • Proven at The Anchor • Payment plans available"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Empty Pub Solutions' }]}
        backgroundImage="/images/headers/empty-pub-solutions.png"
      />

      <ProofStrip claimIds={['search-visibility', 'table-bookings', 'food-revenue', 'no-shows']} />

      {/* The Problem */}
      <Section>
        <AnimatedItem animation="fade-in">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={2} align="center" className="mb-6">
              Every Empty Table Costs You Money
            </Heading>
            <Text size="xl" color="muted" align="center" className="mb-8">
              Empty chairs mean wasted overheads — rent, rates, and wages do not pause for quiet
              nights. The upside is significant when you improve local discovery, give people a
              clear reason to visit, and fill those midweek gaps consistently.
            </Text>
            <div className="bg-orange-light rounded-lg p-6">
              <Text size="lg" weight="semibold" align="center">
                Fixed costs stay the same regardless of covers. Improving demand consistency is
                often the fastest route to commercial stability.
              </Text>
            </div>
          </div>
        </AnimatedItem>
      </Section>

      {/* What We Did */}
      <Section background="teal">
        <AnimatedItem animation="slide-up">
          <div className="max-w-4xl mx-auto text-center">
            <Heading level={2} color="white" className="mb-4">
              How We Filled The Anchor
            </Heading>
            <Text size="lg" color="white" className="opacity-90 mb-10">
              We went from dead midweek nights to consistent trade. Here are the results.
            </Text>
            <Grid columns={{ default: 1, md: 3 }} gap="large">
              <CaseStudyCard id="anchor-midweek-turnaround" />
              <CaseStudyCard id="anchor-food-gp" />
              <CaseStudyCard id="anchor-social-growth" />
            </Grid>
          </div>
        </AnimatedItem>
      </Section>

      {/* What You Get */}
      <Section>
        <AnimatedItem animation="fade-in">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-4">
              The Right Package to Fill Your Tables
            </Heading>
            <Text size="lg" color="muted" align="center" className="mb-10">
              Start with a focused Growth Fix on your biggest bottleneck, or go deeper with Growth
              Partner for ongoing monthly support across multiple priorities.
            </Text>

            <Grid columns={{ default: 1, md: 2 }} gap="large" className="mb-8">
              <div>
                <Card background="cream" padding="large" className="mb-4">
                  <Heading level={3} className="mb-3">
                    One Clear Bottleneck?
                  </Heading>
                  <Text color="muted" className="mb-4">
                    If your main issue is one thing — weak midweek events, low local visibility, or
                    confusing offers — a Growth Fix solves it fast.
                  </Text>
                  <FeatureList
                    items={[
                      'Diagnosis of main footfall issue',
                      'One focused action plan',
                      'Messaging and offer refinement',
                      'From just £375 + VAT',
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
                    Multiple Growth Challenges?
                  </Heading>
                  <Text color="muted" className="mb-4">
                    If you need event strategy, social media, bookings, and local visibility working
                    together, Growth Partner delivers ongoing support across all of them.
                  </Text>
                  <FeatureList
                    items={[
                      '24 hours per month',
                      'Strategy plus hands-on implementation',
                      'Events, social, bookings, local visibility',
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
      <Section background="cream">
        <Heading level={2} align="center" className="mb-8">
          Common Questions About Filling Empty Tables
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
            Ready to Fill Those Empty Tables?
          </Heading>
          <Text size="lg" align="center" className="mb-6">
            Tell Peter what is not working. He will point you to the right package and the fastest
            footfall action.
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
