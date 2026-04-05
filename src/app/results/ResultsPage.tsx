import Hero from '@/components/Hero';
import Section from '@/components/Section';
import CTASection from '@/components/CTASection';
import Heading from '@/components/Heading';
import Card from '@/components/Card';
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';
import CaseStudySelector from '@/components/CaseStudySelector';
import { breadcrumbPaths } from '@/components/Breadcrumb';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { Claim, CaseStudyCard, PackageCTA } from '@/components/packages';
// Local data imports
import resultsData from '../../../content/data/results.json';

export default function ResultsPage() {
  // Use local case study data
  const transformedCaseStudies = resultsData.caseStudies;

  return (
    <>
      <Hero
        title={resultsData.hero.title}
        subtitle={resultsData.hero.subtitle}
        breadcrumbs={breadcrumbPaths.results}
        backgroundImage={resultsData.hero.backgroundImage}
      />

      {/* Case Study Selector */}
      <Section background="cream" padding="small">
        <AnimatedItem animation="fade-in">
          <CaseStudySelector results={transformedCaseStudies} />
        </AnimatedItem>
      </Section>

      {/* Claims-governed proof section */}
      <Section background="white" padding="large">
        <div className="max-w-4xl mx-auto">
          <Heading level={2} align="center" className="mb-4">
            The Numbers Don&apos;t Lie
          </Heading>
          <Text align="center" color="muted" className="mb-12">
            Every metric comes from our own venue. Verified quarterly.
          </Text>
          <Grid columns={{ default: 2, md: 4 }} gap="medium">
            <Card variant="bordered" className="text-center p-6">
              <Text size="2xl" weight="bold" className="text-orange block mb-1">
                <Claim id="food-gp-growth" variant="metric-only" />
              </Text>
              <Text size="sm" color="muted">
                Food GP Growth
              </Text>
            </Card>
            <Card variant="bordered" className="text-center p-6">
              <Text size="2xl" weight="bold" className="text-orange block mb-1">
                <Claim id="quiz-regulars" variant="metric-only" />
              </Text>
              <Text size="sm" color="muted">
                Weekly Quiz Regulars
              </Text>
            </Card>
            <Card variant="bordered" className="text-center p-6">
              <Text size="2xl" weight="bold" className="text-orange block mb-1">
                <Claim id="social-views" variant="metric-only" />
              </Text>
              <Text size="sm" color="muted">
                Monthly Social Views
              </Text>
            </Card>
            <Card variant="bordered" className="text-center p-6">
              <Text size="2xl" weight="bold" className="text-orange block mb-1">
                <Claim id="value-added" variant="metric-only" />
              </Text>
              <Text size="sm" color="muted">
                Value Added
              </Text>
            </Card>
          </Grid>
        </div>
      </Section>

      {/* Case Studies with CaseStudyCard */}
      <Section background="cream" padding="large">
        <div className="max-w-4xl mx-auto">
          <Heading level={2} align="center" className="mb-4">
            How We Did It
          </Heading>
          <Text align="center" color="muted" className="mb-12">
            Three case studies from The Anchor, each with verified claims.
          </Text>
          <Grid columns={{ default: 1, md: 3 }} gap="medium">
            <AnimatedItem animation="slide-up" delay={0}>
              <CaseStudyCard id="anchor-midweek-turnaround" variant="full" />
            </AnimatedItem>
            <AnimatedItem animation="slide-up" delay={100}>
              <CaseStudyCard id="anchor-food-gp" variant="full" />
            </AnimatedItem>
            <AnimatedItem animation="slide-up" delay={200}>
              <CaseStudyCard id="anchor-social-growth" variant="full" />
            </AnimatedItem>
          </Grid>
        </div>
      </Section>

      {/* Trust Section */}
      <Section background="orange-light">
        <AnimatedItem animation="fade-in" delay={200}>
          <Grid columns={{ default: 1, md: 2 }} gap="large" className="items-center">
            <div>
              <Heading level={2} className="mb-4">
                This Isn&apos;t Theory
              </Heading>
              <Text size="lg" className="mb-6">
                Every strategy, every number, every result comes from our own pub. We&apos;ve tested
                it all at The Anchor first. The failures taught us what to avoid. The successes
                showed us what to share.
              </Text>
              <Text size="lg" className="mb-6">
                When you work with Orange Jelly, you get proven strategies from a small, hands-on
                team working in hospitality every week.
              </Text>
              <Button href="/ways-to-work" variant="primary" size="large">
                See Our Packages
              </Button>
            </div>
            <Card variant="shadowed" padding="large" className="bg-white">
              <Heading level={3} className="mb-4 text-center">
                Additional Proof Points
              </Heading>
              <Grid columns={{ default: 2 }} gap="medium">
                <div className="text-center">
                  <Text size="2xl" weight="bold" className="text-orange block mb-1">
                    <Claim id="sunday-margin-growth" variant="metric-only" />
                  </Text>
                  <Text size="sm" color="muted">
                    Sunday Margin Growth
                  </Text>
                </div>
                <div className="text-center">
                  <Text size="2xl" weight="bold" className="text-orange block mb-1">
                    <Claim id="tasting-retention" variant="metric-only" />
                  </Text>
                  <Text size="sm" color="muted">
                    Tasting Retention
                  </Text>
                </div>
                <div className="text-center">
                  <Text size="2xl" weight="bold" className="text-orange block mb-1">
                    <Claim id="ai-time-reclaimed" variant="metric-only" />
                  </Text>
                  <Text size="sm" color="muted">
                    AI Time Reclaimed
                  </Text>
                </div>
                <div className="text-center">
                  <Text size="2xl" weight="bold" className="text-orange block mb-1">
                    <Claim id="contact-database" variant="metric-only" />
                  </Text>
                  <Text size="sm" color="muted">
                    Customer Contacts
                  </Text>
                </div>
              </Grid>
            </Card>
          </Grid>
        </AnimatedItem>
      </Section>

      {/* Package CTA */}
      <Section background="white" padding="large">
        <PackageCTA />
      </Section>

      <CTASection
        title="Let's Fix Your Biggest Problem First"
        subtitle="Tell me where performance is stuck. I'll share exactly how we moved the numbers at The Anchor."
      />
    </>
  );
}
