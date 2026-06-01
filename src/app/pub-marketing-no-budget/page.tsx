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
    title: 'No-Budget Pub Marketing - Practical Free Strategies',
    description:
      'No budget for marketing? Use practical free strategies for local visibility, community engagement, and repeat visits. Professional help from just £375 + VAT.',
    path: '/pub-marketing-no-budget',
  });
}

const faqs = [
  {
    question: 'Can I really market my pub without spending money?',
    answer:
      'Absolutely. The best pub marketing is often free — word of mouth, social media, community partnerships, and email marketing cost nothing but time. We built The Anchor using mostly free strategies before investing in paid advertising.',
  },
  {
    question: 'What free marketing works best for pubs?',
    answer:
      'Social media (especially local Facebook groups), Google My Business optimisation, email marketing to existing customers, community partnerships, and creating shareable moments. These strategies consistently outperform paid ads for local pubs.',
  },
  {
    question: 'How long until free marketing shows results?',
    answer:
      'Inside 30 days. Fixing your Google listing can bring customers quickly. Social media posts start working within days. Email campaigns show momentum fast.',
  },
  {
    question: 'What if I want professional help but my budget is tight?',
    answer:
      'A Growth Fix starts from just £375 + VAT — 5 focused hours on your biggest marketing bottleneck. It is designed to be a low-friction entry point that delivers a clear win you can build on. Payment plans are also available.',
  },
  {
    question: "What if I don't have time for marketing?",
    answer:
      'Short daily sessions are enough with the right systems. Batch content creation, automation tools, and simple templates mean you can market effectively without it taking over your day.',
  },
];

const freeStrategies = [
  {
    title: 'Google My Business',
    effort: 'Quick setup',
    impact: 'Noticeable call lift',
    tactics: [
      'Complete every section',
      'Add photos weekly',
      'Post updates regularly',
      'Respond to all reviews',
    ],
  },
  {
    title: 'Local Facebook Groups',
    effort: 'Short daily touchpoint',
    impact: 'New customers each week',
    tactics: [
      'Join all local groups',
      'Share genuinely helpful content',
      'Announce events personally',
      'Build relationships, not spam',
    ],
  },
  {
    title: 'Email Marketing',
    effort: 'Short weekly send',
    impact: 'Steady bookings per campaign',
    tactics: [
      'Collect emails at point of sale',
      "Weekly 'what's on' emails",
      'VIP offers for subscribers',
      'Birthday club automated',
    ],
  },
  {
    title: 'Community Partnerships',
    effort: 'Monthly outreach',
    impact: 'Consistent event turnout',
    tactics: [
      'Host local groups free',
      'Cross-promote with shops',
      'Support local causes',
      'Become the community hub',
    ],
  },
];

export default function PubMarketingNoBudget() {
  return (
    <>
      <FAQSchema faqs={faqs} />

      <Hero
        title={
          <>
            No Marketing Budget?
            <br />
            No Problem.
          </>
        }
        subtitle="Free strategies that help pubs build visibility and momentum without paid spend — and professional support from just £375 + VAT when you are ready"
        secondaryAction={{
          text: 'See Growth Fix Package',
          href: '/ways-to-work/growth-fix',
        }}
        bottomText="Free strategies inside • Professional help from £375 + VAT • Payment plans available"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Pub Marketing No Budget' }]}
        backgroundImage="/images/headers/pub-marketing-no-budget.png"
      />

      <ProofStrip claimIds={['search-visibility', 'table-bookings', 'food-revenue', 'no-shows']} />

      {/* The Truth */}
      <Section>
        <AnimatedItem animation="fade-in">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={2} className="mb-6">
              The Best Pub Marketing Costs Nothing
            </Heading>
            <Text size="xl" color="muted" className="mb-8">
              Many of the strongest pub marketing actions are low cost or free. The key is
              consistency, clear offers, and practical community visibility.
            </Text>
            <Grid columns={{ default: 1, md: 3 }} gap="medium">
              <Card variant="bordered" padding="medium" className="text-center">
                <Text size="2xl" weight="bold" className="text-orange mb-2">
                  +828%
                </Text>
                <Text size="sm">Google Search visibility</Text>
              </Card>
              <Card variant="bordered" padding="medium" className="text-center">
                <Text size="2xl" weight="bold" className="text-teal mb-2">
                  +98%
                </Text>
                <Text size="sm">Food revenue in three months</Text>
              </Card>
              <Card variant="bordered" padding="medium" className="text-center">
                <Text size="2xl" weight="bold" className="text-green-600 mb-2">
                  +403%
                </Text>
                <Text size="sm">Table bookings</Text>
              </Card>
            </Grid>
          </div>
        </AnimatedItem>
      </Section>

      {/* Free Strategies */}
      <Section background="teal">
        <AnimatedItem animation="slide-up">
          <Heading level={2} align="center" color="white" className="mb-12">
            The 4 Free Strategies That Actually Work
          </Heading>
          <Grid columns={{ default: 1, md: 2 }} gap="large">
            {freeStrategies.map((item, index) => (
              <Card key={index} background="white" padding="large">
                <div className="flex justify-between items-start mb-4">
                  <Heading level={3} color="teal">
                    {item.title}
                  </Heading>
                  <Text size="sm" color="muted">
                    {item.effort}
                  </Text>
                </div>
                <Text weight="semibold" className="text-green-600 mb-4">
                  Result: {item.impact}
                </Text>
                <FeatureList
                  items={item.tactics}
                  icon="bullet"
                  iconColor="orange"
                  spacing="normal"
                />
              </Card>
            ))}
          </Grid>
        </AnimatedItem>
      </Section>

      {/* Results Proof */}
      <Section>
        <AnimatedItem animation="fade-in">
          <div className="max-w-4xl mx-auto text-center">
            <Heading level={2} className="mb-4">
              What Happens When You Get the Basics Right
            </Heading>
            <Text size="lg" color="muted" className="mb-10">
              These results at The Anchor started with free strategies before any paid investment.
            </Text>
            <Grid columns={{ default: 1, md: 3 }} gap="large">
              <CaseStudyCard id="anchor-midweek-turnaround" />
              <CaseStudyCard id="anchor-food-gp" />
              <CaseStudyCard id="anchor-social-growth" />
            </Grid>
          </div>
        </AnimatedItem>
      </Section>

      {/* When You Are Ready for Professional Help */}
      <Section background="cream">
        <AnimatedItem animation="slide-up">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-4">
              When You Are Ready for Professional Help
            </Heading>
            <Text size="lg" color="muted" align="center" className="mb-10">
              Even with a tight budget, a focused Growth Fix can deliver a clear win from just £375
              + VAT. Five hours on your biggest bottleneck — with a clear action plan you can
              implement yourself.
            </Text>

            <div className="max-w-md mx-auto">
              <PackageCard packageId="growth-fix" highlighted />
            </div>

            <Card background="white" padding="large" className="mt-8 text-center">
              <Heading level={3} className="mb-3">
                What a Growth Fix Gets You
              </Heading>
              <Grid columns={{ default: 1, md: 2 }} gap="medium">
                <FeatureList
                  items={[
                    'Diagnosis of your main bottleneck',
                    'One clear action plan',
                    'Messaging and offer refinement',
                  ]}
                  icon="check"
                  iconColor="green"
                  spacing="normal"
                />
                <FeatureList
                  items={[
                    'Templates you can use immediately',
                    'A focused intervention in 5 hours',
                    'No ongoing commitment required',
                  ]}
                  icon="check"
                  iconColor="green"
                  spacing="normal"
                />
              </Grid>
            </Card>
          </div>
        </AnimatedItem>
      </Section>

      {/* FAQ */}
      <Section background="white">
        <Heading level={2} className="text-center mb-8">
          Common Questions About Free Pub Marketing
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
            No Budget Does Not Mean No Progress
          </Heading>
          <Text size="lg" align="center" className="mb-6">
            Use the right free strategies, keep execution consistent, and build momentum week by
            week. When you are ready for professional help, a Growth Fix is just £375 + VAT.
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
