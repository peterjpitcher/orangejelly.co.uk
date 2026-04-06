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
import OptimizedImage from '@/components/OptimizedImage';
import { CaseStudyCard, PackageCTA } from '@/components/packages';
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

      {/* Organic Traffic Growth */}
      <Section background="white" padding="large">
        <div className="max-w-4xl mx-auto">
          <AnimatedItem animation="fade-in">
            <Heading level={2} align="center" className="mb-4">
              Search Optimisation That Drives Real Revenue
            </Heading>
            <Text align="center" color="muted" className="mb-8 max-w-2xl mx-auto">
              We launched the-anchor.pub as an AI-optimised website in August 2025. The results
              speak for themselves.
            </Text>
          </AnimatedItem>

          <AnimatedItem animation="slide-up" delay={100}>
            <Card variant="shadowed" padding="large" className="bg-white mb-8">
              <OptimizedImage
                src="/images/anchor-organic-traffic-growth.png"
                alt="Google Search Console showing organic traffic growth for the-anchor.pub after launching AI-optimised website in August 2025"
                width={1470}
                height={232}
                className="w-full rounded-lg"
              />
              <Text size="sm" color="muted" align="center" className="mt-3">
                Organic search traffic for the-anchor.pub — Google Search Console
              </Text>
            </Card>
          </AnimatedItem>

          <AnimatedItem animation="slide-up" delay={200}>
            <Grid columns={{ default: 1, md: 3 }} gap="medium" className="mb-8">
              <Card variant="bordered" className="text-center p-6">
                <Text size="2xl" weight="bold" className="text-orange block mb-1">
                  More Bookings
                </Text>
                <Text size="sm" color="muted">
                  People finding us through search are booking tables directly
                </Text>
              </Card>
              <Card variant="bordered" className="text-center p-6">
                <Text size="2xl" weight="bold" className="text-orange block mb-1">
                  Private Events
                </Text>
                <Text size="sm" color="muted">
                  Search visibility driving enquiries for private hire and functions
                </Text>
              </Card>
              <Card variant="bordered" className="text-center p-6">
                <Text size="2xl" weight="bold" className="text-orange block mb-1">
                  Real Revenue
                </Text>
                <Text size="sm" color="muted">
                  Turning organic search presence into measurable income
                </Text>
              </Card>
            </Grid>
          </AnimatedItem>

          <AnimatedItem animation="fade-in" delay={300}>
            <Text align="center" size="lg" className="mb-6 max-w-2xl mx-auto">
              This is what happens when your website is built to be found — not just to look good.
              We can do the same for your venue.
            </Text>
            <div className="text-center">
              <Button href="/ways-to-work" variant="primary" size="large">
                See Our Packages
              </Button>
            </div>
          </AnimatedItem>
        </div>
      </Section>

      {/* Case Study Selector */}
      <Section background="white" padding="small">
        <AnimatedItem animation="fade-in">
          <CaseStudySelector results={transformedCaseStudies} />
        </AnimatedItem>
      </Section>

      {/* Percentage-based proof section */}
      <Section background="cream" padding="large">
        <div className="max-w-4xl mx-auto">
          <Heading level={2} align="center" className="mb-4">
            The Numbers Don&apos;t Lie
          </Heading>
          <Text align="center" color="muted" className="mb-12">
            Every metric comes from our own venue. Apply these percentages to your turnover.
          </Text>
          <Grid columns={{ default: 2, md: 4 }} gap="medium">
            <Card variant="bordered" className="text-center p-6">
              <Text size="2xl" weight="bold" className="text-orange block mb-1">
                +22%
              </Text>
              <Text size="sm" color="muted">
                Gross Profit Improvement
              </Text>
            </Card>
            <Card variant="bordered" className="text-center p-6">
              <Text size="2xl" weight="bold" className="text-orange block mb-1">
                +20%
              </Text>
              <Text size="sm" color="muted">
                Weekday Revenue Lift
              </Text>
            </Card>
            <Card variant="bordered" className="text-center p-6">
              <Text size="2xl" weight="bold" className="text-orange block mb-1">
                30%
              </Text>
              <Text size="sm" color="muted">
                Food Waste Eliminated
              </Text>
            </Card>
            <Card variant="bordered" className="text-center p-6">
              <Text size="2xl" weight="bold" className="text-orange block mb-1">
                93%
              </Text>
              <Text size="sm" color="muted">
                Marketing Time Reclaimed
              </Text>
            </Card>
          </Grid>
        </div>
      </Section>

      {/* Case Studies with CaseStudyCard */}
      <Section background="white" padding="large">
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
                What This Means For You
              </Heading>
              <Grid columns={{ default: 2 }} gap="medium">
                <div className="text-center">
                  <Text size="2xl" weight="bold" className="text-orange block mb-1">
                    100%
                  </Text>
                  <Text size="sm" color="muted">
                    Event Sell-Out Rate
                  </Text>
                </div>
                <div className="text-center">
                  <Text size="2xl" weight="bold" className="text-orange block mb-1">
                    85%
                  </Text>
                  <Text size="sm" color="muted">
                    Return Within 30 Days
                  </Text>
                </div>
                <div className="text-center">
                  <Text size="2xl" weight="bold" className="text-orange block mb-1">
                    +300%
                  </Text>
                  <Text size="sm" color="muted">
                    Online Reach Growth
                  </Text>
                </div>
                <div className="text-center">
                  <Text size="2xl" weight="bold" className="text-orange block mb-1">
                    250+
                  </Text>
                  <Text size="sm" color="muted">
                    Opted-In Contacts Built
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
