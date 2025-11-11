import Hero from '@/components/Hero';
import Section from '@/components/Section';
import CTASection from '@/components/CTASection';
import Heading from '@/components/Heading';
import Card from '@/components/Card';
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';
import CaseStudySelector from '@/components/CaseStudySelector';
import { breadcrumbPaths } from '@/components/Breadcrumb';
import RelatedLinks from '@/components/RelatedLinks';

// Import related links data
import relatedLinksData from '../../../content/data/related-links.json';
import Text from '@/components/Text';
import Button from '@/components/Button';
// Local data imports
import resultsData from '../../../content/data/results.json';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ResultsPageProps {
  // No props needed - using local data
}

interface QuickWinLink {
  title: string;
  href: string;
  description: string;
  emoji?: string;
  highlight?: boolean;
}

export default function ResultsPage({}: ResultsPageProps) {
  // Use local case study data
  const transformedCaseStudies = resultsData.caseStudies;
  const quickWinLinks =
    (relatedLinksData as { quickWins?: { links: QuickWinLink[] } }).quickWins?.links || [];

  return (
    <>
      <Hero
        title={resultsData.hero.title}
        subtitle={resultsData.hero.subtitle}
        breadcrumbs={breadcrumbPaths.results}
      />

      {/* Case Study Selector */}
      <Section background="cream" padding="small">
        <AnimatedItem animation="fade-in">
          <CaseStudySelector results={transformedCaseStudies} />
        </AnimatedItem>
      </Section>

      {/* Trust Section */}
      <Section background="orange-light">
        <AnimatedItem animation="fade-in" delay={200}>
          <Grid columns={{ default: 1, md: 2 }} gap="large" className="items-center">
            <div>
              <Heading level={2} className="mb-4">
                These Aren't Just Case Studies
              </Heading>
              <Text size="lg" className="mb-6">
                Every strategy, every number, every result comes from our own pub. We've tested it
                all at The Anchor first. The failures taught us what to avoid. The successes showed
                us what to share.
              </Text>
              <Text size="lg" className="mb-6">
                When you work with Orange Jelly, you're getting proven strategies from someone who's
                been in your shoes and found a way out.
              </Text>
              <Button href="/services" variant="primary" size="large">
                See How We Can Help You
              </Button>
            </div>
            <Card variant="shadowed" padding="large" className="bg-white">
              <Heading level={3} className="mb-4 text-center">
                The Numbers Don't Lie
              </Heading>
              <Grid columns={{ default: 2 }} gap="medium">
                <div className="text-center">
                  <Text size="2xl" weight="bold" className="text-orange">
                    {resultsData.stats.foodGP}
                  </Text>
                  <Text size="sm" color="muted">
                    Food GP
                  </Text>
                </div>
                <div className="text-center">
                  <Text size="2xl" weight="bold" className="text-orange">
                    {resultsData.stats.quizRegulars}
                  </Text>
                  <Text size="sm" color="muted">
                    Quiz Regulars
                  </Text>
                </div>
                <div className="text-center">
                  <Text size="2xl" weight="bold" className="text-orange">
                    {resultsData.stats.weeklySavings}
                  </Text>
                  <Text size="sm" color="muted">
                    Weekly Savings
                  </Text>
                </div>
                <div className="text-center">
                  <Text size="2xl" weight="bold" className="text-orange">
                    {resultsData.stats.monthlyViews}
                  </Text>
                  <Text size="sm" color="muted">
                    Monthly Views
                  </Text>
                </div>
              </Grid>
            </Card>
          </Grid>
        </AnimatedItem>
      </Section>

      {/* Related Links */}
      <Section background="cream" padding="medium">
        <RelatedLinks
          title="Ready to Get Similar Results?"
          subtitle="Choose where to start based on your biggest challenge"
          links={quickWinLinks}
          variant="card"
          columns={{ default: 1, md: 2, lg: 3 }}
        />
      </Section>

      <CTASection
        title="Let's Fix Your Biggest Problem First"
        subtitle="Tell me what's killing your business. I'll share exactly how we solved it at The Anchor."
      />
    </>
  );
}
