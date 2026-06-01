import { generateMetadata as generateMeta } from '@/lib/metadata';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';
import FeatureList from '@/components/FeatureList';
import FAQItem from '@/components/FAQItem';
import { FAQSchema } from '@/components/StructuredData';
import { PackageCard, CaseStudyCard, ProofStrip, PackageCTA } from '@/components/packages';

export const metadata = generateMeta({
  title: 'Fix My Pub — Emergency Turnaround Help From a Working Licensee',
  description:
    'Pub in crisis or just struggling? I run one myself. Tell me what is wrong and I will show you the fastest fix — diagnosis, reset plan, and hands-on support. Packages from £375 + VAT.',
  path: '/fix-my-pub',
  ogType: 'website',
});

const faqs = [
  {
    question: 'How quickly can you help a struggling pub?',
    answer:
      'The Turnaround Intensive starts with a 2-3 day diagnostic, then a 30-day sprint to reset your commercial model. You will see the first changes within the first week.',
  },
  {
    question: 'What if my pub just needs a small fix, not a full turnaround?',
    answer:
      'Start with a Growth Fix. Five focused hours on your biggest bottleneck, from just £375 + VAT. If you need more, you can step up to a bigger package later.',
  },
  {
    question: 'Do you only work with pubs in crisis?',
    answer:
      'No. The Turnaround Intensive is for pubs that need a complete reset, but most of our clients are pubs that just want to grow faster. We have packages for every stage.',
  },
];

export default function FixMyPubPage() {
  return (
    <>
      <FAQSchema faqs={faqs} />

      <Hero
        title="Pub Struggling? Let's Fix It."
        subtitle="Whether your pub is in crisis or just needs a reset, tell me what is broken. I run The Anchor myself — I know what it takes to turn things around under real trading pressure."
        secondaryAction={{
          text: 'See Turnaround Package',
          href: '/ways-to-work/turnaround-intensive',
        }}
        bottomText="Packages from £375 + VAT • 30-day intensive option • No lock-in"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Fix My Pub' }]}
        backgroundImage="/images/headers/fix-my-pub.png"
      />

      <ProofStrip claimIds={['search-visibility', 'table-bookings', 'food-revenue', 'no-shows']} />

      {/* The Problem */}
      <Section>
        <AnimatedItem animation="fade-in">
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={2} align="center" className="mb-6">
              Most Pubs Do Not Need More Ideas. They Need One Clear Priority.
            </Heading>
            <Text size="lg" color="muted" align="center" className="mb-4">
              When trade drops, it is tempting to try everything at once. More offers, more events,
              more social posts. But scattergun marketing wastes time and money.
            </Text>
            <Text size="lg" color="muted" align="center" className="mb-8">
              What works is a focused diagnosis, a clear plan, and disciplined execution. That is
              exactly what we deliver — because we have done it ourselves at The Anchor.
            </Text>
          </div>
        </AnimatedItem>
      </Section>

      {/* What We Did at The Anchor */}
      <Section background="teal">
        <AnimatedItem animation="slide-up">
          <div className="max-w-4xl mx-auto text-center">
            <Heading level={2} color="white" className="mb-4">
              How We Turned The Anchor Around
            </Heading>
            <Text size="lg" color="white" className="opacity-90 mb-10">
              We faced the same problems. Here is what we did.
            </Text>
            <Grid columns={{ default: 1, md: 3 }} gap="large">
              <CaseStudyCard id="anchor-midweek-turnaround" />
              <CaseStudyCard id="anchor-food-gp" />
              <CaseStudyCard id="anchor-social-growth" />
            </Grid>
          </div>
        </AnimatedItem>
      </Section>

      {/* The Solution */}
      <Section>
        <AnimatedItem animation="fade-in">
          <div className="max-w-4xl mx-auto">
            <Heading level={2} align="center" className="mb-4">
              The Right Package for Your Situation
            </Heading>
            <Text size="lg" color="muted" align="center" className="mb-10">
              If your pub needs a complete reset, the Turnaround Intensive is designed for exactly
              that. If you need a focused fix on one issue, start with a Growth Fix.
            </Text>

            <Grid columns={{ default: 1, md: 2 }} gap="large" className="mb-8">
              <div>
                <Card background="orange-light" padding="large" className="mb-4">
                  <Heading level={3} className="mb-3">
                    Full Turnaround Needed?
                  </Heading>
                  <Text color="muted" className="mb-4">
                    If your pub needs a complete commercial reset — offer, messaging, events, local
                    visibility, and potentially a website rebuild — the Turnaround Intensive is a
                    30-day sprint with deep founder involvement.
                  </Text>
                  <FeatureList
                    items={[
                      'Deep diagnostic (2-3 days)',
                      'Complete commercial reset plan',
                      '30-day intensive implementation',
                      'Lean website rebuild included',
                      'Stabilisation playbooks',
                    ]}
                    icon="check"
                    iconColor="green"
                    spacing="tight"
                  />
                </Card>
                <PackageCard packageId="turnaround-intensive" highlighted />
              </div>
              <div>
                <Card background="cream" padding="large" className="mb-4">
                  <Heading level={3} className="mb-3">
                    Just Need a Focused Fix?
                  </Heading>
                  <Text color="muted" className="mb-4">
                    If your pub has one clear bottleneck — quiet midweek, weak events, low local
                    visibility — a Growth Fix solves one problem fast with a clear action plan.
                  </Text>
                  <FeatureList
                    items={[
                      'Diagnosis of main issue',
                      'One clear action plan',
                      'Messaging and offer refinement',
                      '5 focused hours',
                    ]}
                    icon="check"
                    iconColor="green"
                    spacing="tight"
                  />
                </Card>
                <PackageCard packageId="growth-fix" />
              </div>
            </Grid>
          </div>
        </AnimatedItem>
      </Section>

      {/* FAQ */}
      <Section background="cream">
        <Heading level={2} align="center" className="mb-8">
          Common Questions
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
            Ready to Fix What Is Holding Your Pub Back?
          </Heading>
          <Text size="lg" align="center" className="mb-6">
            Message Peter. Tell him what is not working. He will point you to the right package and
            the fastest next step.
          </Text>
          <PackageCTA packageId="turnaround-intensive" />
        </div>
      </Section>
    </>
  );
}
