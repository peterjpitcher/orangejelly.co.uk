import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import CTASection from '@/components/CTASection';
import FAQItem from '@/components/FAQItem';
import Section from '@/components/Section';
import ROICalculator from '@/components/ROICalculator';
import OptimizedImage from '@/components/OptimizedImage';
import Heading from '@/components/Heading';
import Card from '@/components/Card';
import Button from '@/components/Button';
import WhatsAppButton from '@/components/WhatsAppButton';
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';
import Text from '@/components/Text';
import Container from '@/components/Container';
import Box from '@/components/Box';
import { FAQSchema } from '@/components/StructuredData';
import { SpeakableContent } from '@/components/SpeakableContent';
import FeaturesGrid from '@/components/FeaturesGrid';
import PartnershipsSection from '@/components/PartnershipsSection';
import ProblemCardsSection from '@/components/ProblemCardsSection';
import ResultsSection from '@/components/ResultsSection';
// Type definitions
interface FAQ {
  question: string;
  answer: string;
}

interface TrustBadge {
  name: string;
  description: string;
  icon?: string;
}

interface SiteSettings {
  title: string;
  description: string;
}

interface Problem {
  emoji?: string;
  icon?: string;
  title: string;
  description?: string;
  problem?: string;
  solution?: string;
  linkHref?: string; // Add linkHref to Problem interface
}

interface HomeFeature {
  icon?: string;
  title: string;
  description?: string;
  highlight?: boolean;
}

interface Partnership {
  name: string;
  description?: string;
  logoUrl?: string;
  url?: string;
}

interface Metrics {
  quizNight?: string;
  quizNightContext?: string;
  foodGP?: string;
  foodGPContext?: string;
  socialViews?: string;
  socialViewsContext?: string;
  hoursSaved?: string;
  hoursSavedContext?: string;
  [key: string]: string | undefined; // Allow additional properties
}

interface SectionHeadings {
  problemsHeading?: string;
  solutionsHeading?: string;
  resultsHeading?: string;
  resultsTestimonial?: string;
  resultsSubtext?: string;
  resultsButtonText?: string;
  calculatorHeading?: string;
  calculatorSubtext?: string;
  aboutHeading?: string;
  aboutText1?: string;
  aboutText2?: string;
  aboutButtonText?: string;
  aboutCardText?: string;
  aboutCardLabel?: string;
  ctaBannerHeading?: string;
  ctaBannerText?: string;
  ctaBannerButton?: string;
  faqHeading?: string;
  finalCtaTitle?: string;
  finalCtaSubtitle?: string;
}

interface HomePageProps {
  faqs?: FAQ[];
  problems?: Problem[];
  features?: HomeFeature[];
  metrics?: Metrics;
  trustBadges?: TrustBadge[];
  siteSettings?: SiteSettings | null;
  partnerships?: Partnership[];
  hero?: {
    title: string;
    subtitle: string;
    ctaText: string;
    bottomText: string;
    backgroundImage?: string;
  };
  sectionHeadings?: SectionHeadings;
  trustBarItems?: Array<{ value: string; label: string }> | null;
}

export default function HomePage({
  faqs,
  problems,
  features,
  metrics: _metrics,
  trustBadges: _trustBadges,
  siteSettings: _siteSettings,
  partnerships,
  hero,
  sectionHeadings,
  trustBarItems,
}: HomePageProps) {
  // Process FAQs if available
  const displayFAQs = faqs ?? [];

  const displayProblems = (problems ?? []).map((problem) => ({
    emoji: problem.emoji || problem.icon || '🍺',
    title: problem.title || problem.problem || '',
    description:
      problem.description ||
      problem.solution ||
      'We have practical support to help your venue build momentum.',
    linkHref: problem.linkHref || '/services',
  }));

  const displayFeatures = (features ?? []).map((feature) => ({
    icon: feature.icon || '🎯',
    title: feature.title,
    description: feature.description || '',
    highlight: feature.highlight,
  }));

  return (
    <>
      <FAQSchema faqs={displayFAQs} />
      <SpeakableContent
        cssSelectors={[
          '.hero-title',
          '.hero-subtitle',
          '.trust-bar',
          '.problem-card h3',
          '.cta-section h2',
          '.cta-section p',
        ]}
        url="/"
      />

      {hero && (
        <Hero
          title={hero.title}
          subtitle={hero.subtitle}
          secondaryAction={{
            text: hero.ctaText,
            href: '/services',
          }}
          bottomText={hero.bottomText}
          backgroundImage={hero.backgroundImage}
        />
      )}

      <TrustBar items={trustBarItems || undefined} />

      <FeaturesGrid features={displayFeatures} />

      <PartnershipsSection
        partners={(partnerships || []).map((partner) => ({
          name: partner.name,
          description: partner.description || '',
          logoUrl: partner.logoUrl || '/logo.png',
          url: partner.url || 'https://www.orangejelly.co.uk',
        }))}
      />

      <ProblemCardsSection problems={displayProblems} title={sectionHeadings?.problemsHeading} />

      <ResultsSection
        title={sectionHeadings?.resultsHeading}
        testimonial={sectionHeadings?.resultsTestimonial}
        subtext={sectionHeadings?.resultsSubtext}
        buttonText={sectionHeadings?.resultsButtonText}
      />

      {/* ROI Calculator Section */}
      <Box id="roi-calculator">
        <Section background="white">
          <AnimatedItem animation="fade-in" delay={100}>
            <Container maxWidth="4xl">
              <Heading level={2} align="center" className="mb-4">
                {sectionHeadings?.calculatorHeading || 'Calculate Your Potential Revenue'}
              </Heading>
              <Text size="lg" color="muted" align="center" className="mb-12 max-w-2xl mx-auto">
                {sectionHeadings?.calculatorSubtext ||
                  'Every venue is different. See how much more revenue you could generate with focused action-first strategy.'}
              </Text>
              <ROICalculator />

              <div className="text-center mt-8">
                <Text size="lg" className="mb-4">
                  Ready to Increase Your Revenue?
                </Text>
                <Text color="muted" className="mb-6">
                  Choose the support focus that fits your priorities
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card variant="bordered" padding="large">
                    <Heading level={4} className="mb-3">
                      Event Innovation
                    </Heading>
                    <Text className="mb-4">
                      Fresh event formats that are easier to run and easier to sell
                    </Text>
                    <Button href="/services" variant="ghost">
                      Explore Service →
                    </Button>
                  </Card>
                  <Card variant="bordered" padding="large">
                    <Heading level={4} className="mb-3">
                      Transformational Marketing
                    </Heading>
                    <Text className="mb-4">
                      Clear plans, campaigns, and weekly execution that builds momentum
                    </Text>
                    <Button href="/services" variant="primary">
                      Explore Service
                    </Button>
                  </Card>
                  <Card variant="bordered" padding="large">
                    <Heading level={4} className="mb-3">
                      Simplified Technology Tools
                    </Heading>
                    <Text className="mb-4">
                      Simpler tools, lower waste, and practical systems your team can run
                    </Text>
                    <Button href="/services" variant="ghost">
                      Explore Service →
                    </Button>
                  </Card>
                </div>
              </div>
            </Container>
          </AnimatedItem>
        </Section>
      </Box>

      {/* About Preview with The Anchor Logo */}
      <Section>
        <AnimatedItem animation="slide-up" delay={200}>
          <Grid columns={{ default: 1, md: 2 }} gap="large" className="items-center">
            <Box>
              <Heading level={2} className="mb-6">
                {sectionHeadings?.aboutHeading || "We're hospitality operators, just like you"}
              </Heading>
              <Text size="lg" color="muted" className="mb-4">
                {sectionHeadings?.aboutText1 ||
                  "I'm Peter. Billy runs The Anchor in Stanwell Moor day-to-day, and I lead marketing and growth. We face the same trading pressure every week."}
              </Text>
              <Text size="lg" color="muted" className="mb-6">
                {sectionHeadings?.aboutText2 ||
                  'Orange Jelly exists to help hospitality partners accelerate growth with proactive plans, AI-enabled delivery, and practical systems tested at The Anchor first. Small team, direct support, no layers.'}
              </Text>
              <Button href="/about" variant="ghost" className="text-lg">
                {sectionHeadings?.aboutButtonText || 'Read Our Full Story →'}
              </Button>
            </Box>
            <a
              href="https://www.the-anchor.pub"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              aria-label="Visit The Anchor website"
            >
              <Card
                variant="colored"
                background="white"
                padding="large"
                className="!bg-teal text-center relative overflow-hidden transition-opacity hover:opacity-95"
              >
                <Text size="xs" color="white" align="center" className="mb-4 opacity-90">
                  {sectionHeadings?.aboutCardLabel || 'Proven Daily At'}
                </Text>
                <OptimizedImage
                  src="/images/the-anchor/the-anchor-exterior.jpg"
                  alt="Exterior of The Anchor in Stanwell Moor"
                  width={320}
                  height={180}
                  className="mx-auto mb-4 rounded-lg"
                  style={{ width: 'auto', height: 'auto' }}
                />
                <Text color="white" align="center" className="opacity-90 font-semibold">
                  {sectionHeadings?.aboutCardText ||
                    'Real hospitality experience + proven growth systems'}
                </Text>

                {/* Orange accent line */}
                <Box
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange to-transparent"
                  position="absolute"
                ></Box>
              </Card>
            </a>
          </Grid>
        </AnimatedItem>
      </Section>

      {/* Free Chat Banner */}
      <Section background="orange-light" padding="small">
        <AnimatedItem animation="scale" delay={300}>
          <Container maxWidth="3xl" center className="text-center">
            <Heading level={3} align="center" className="mb-4">
              {sectionHeadings?.ctaBannerHeading || 'Less Talk. More Traction.'}
            </Heading>
            <Text size="lg" align="center" className="mb-6 max-w-2xl mx-auto">
              {sectionHeadings?.ctaBannerText ||
                "Tell me where performance is stuck. I'll share the highest-impact next steps we use at The Anchor to create measurable movement."}
            </Text>
            <WhatsAppButton
              text="Hi Peter, I'd like help building momentum for my venue."
              label={sectionHeadings?.ctaBannerButton || 'Start a Growth Conversation'}
              size="medium"
            />
          </Container>
        </AnimatedItem>
      </Section>

      {/* FAQ Section */}
      {displayFAQs.length > 0 && (
        <Section background="cream">
          <Heading level={2} className="text-center mb-8">
            {sectionHeadings?.faqHeading || 'Frequently Asked Questions'}
          </Heading>
          <div className="max-w-3xl mx-auto space-y-4">
            {displayFAQs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Section>
      )}

      <CTASection
        title={sectionHeadings?.finalCtaTitle || 'Ready for a Step-Change in Performance?'}
        subtitle={
          sectionHeadings?.finalCtaSubtitle ||
          "Let's focus on the biggest bottleneck first and build weekly momentum from there."
        }
      />
    </>
  );
}
