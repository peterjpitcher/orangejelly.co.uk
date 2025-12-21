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
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';
import { URLS, CONTACT } from '@/lib/constants';
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
      problem.description || problem.solution || 'We have the solution to help your pub thrive.',
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
                  'Every pub is different. See exactly how much more revenue you could generate with proven strategies.'}
              </Text>
              <ROICalculator />

              <div className="text-center mt-8">
                <Text size="lg" className="mb-4">
                  Ready to Increase Your Revenue?
                </Text>
                <Text color="muted" className="mb-6">
                  Choose the solution that fits your budget and timeline
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card variant="bordered" padding="large">
                    <Heading level={4} className="mb-3">
                      Quick Win
                    </Heading>
                    <Text className="mb-4">Single consultation to tackle your biggest problem</Text>
                    <Button href="/services" variant="ghost">
                      Start Here →
                    </Button>
                  </Card>
                  <Card variant="bordered" padding="large">
                    <Heading level={4} className="mb-3">
                      Full Recovery
                    </Heading>
                    <Text className="mb-4">Complete marketing makeover with ongoing support</Text>
                    <Button href="/services" variant="primary">
                      Learn More
                    </Button>
                  </Card>
                  <Card variant="bordered" padding="large">
                    <Heading level={4} className="mb-3">
                      DIY Training
                    </Heading>
                    <Text className="mb-4">AI tools and training to do it yourself</Text>
                    <Button href="/services" variant="ghost">
                      Get Training →
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
                {sectionHeadings?.aboutHeading || "We're licensees, Just Like You"}
              </Heading>
              <Text size="lg" color="muted" className="mb-4">
                {sectionHeadings?.aboutText1 ||
                  "I'm Peter. Billy runs The Anchor in Stanwell Moor day-to-day, and I handle marketing and business development around a full-time role. We faced the same struggles - empty tables, rising costs, fierce competition."}
              </Text>
              <Text size="lg" color="muted" className="mb-6">
                {sectionHeadings?.aboutText2 ||
                  "Orange Jelly exists because we discovered how AI can add 25 hours of value per week. I've been an early AI adopter since 2021, and now I help other pubs implement the same strategies that transformed our business."}
              </Text>
              <Button href="/about" variant="ghost" className="text-lg">
                {sectionHeadings?.aboutButtonText || 'Read Our Full Story →'}
              </Button>
            </Box>
            <Card
              variant="colored"
              background="white"
              padding="large"
              className="!bg-teal text-center relative overflow-hidden"
            >
              {/* Orange Jelly watermark in corner */}
              <Box className="absolute top-2 right-2 opacity-20" position="absolute">
                <OptimizedImage
                  src="/logo.png"
                  alt=""
                  width={60}
                  height={60}
                  className="rounded-lg"
                  loading="lazy"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </Box>

              <Text size="xs" color="white" align="center" className="mb-4 opacity-90">
                {sectionHeadings?.aboutCardLabel || 'Proven Daily At'}
              </Text>
              <OptimizedImage
                src="/logo_the-anchor.png"
                alt="The Anchor - Stanwell Moor"
                width={240}
                height={120}
                className="mx-auto mb-4"
                priority
                style={{ width: 'auto', height: 'auto' }}
              />
              <Text color="white" align="center" className="opacity-90 font-semibold">
                {sectionHeadings?.aboutCardText ||
                  'Real pub experience + proven strategies = Orange Jelly'}
              </Text>

              {/* Orange accent line */}
              <Box
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange to-transparent"
                position="absolute"
              ></Box>
            </Card>
          </Grid>
        </AnimatedItem>
      </Section>

      {/* Free Chat Banner */}
      <Section background="orange-light" padding="small">
        <AnimatedItem animation="scale" delay={300}>
          <Container maxWidth="3xl" center className="text-center">
            <Heading level={3} align="center" className="mb-4">
              {sectionHeadings?.ctaBannerHeading || 'Stop Struggling. Start Thriving.'}
            </Heading>
            <Text size="lg" align="center" className="mb-6 max-w-2xl mx-auto">
              {sectionHeadings?.ctaBannerText ||
                "Tell me what's killing your business. I'll share exactly how we fixed the same problems at The Anchor. Real solutions, no fluff."}
            </Text>
            <Button
              href={URLS.whatsapp()}
              variant="primary"
              size="medium"
              external
              aria-label={`Contact ${CONTACT.owner} on WhatsApp at ${CONTACT.phone}`}
            >
              {sectionHeadings?.ctaBannerButton || 'Get Marketing Help'}
            </Button>
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
        title={sectionHeadings?.finalCtaTitle || 'Ready to Turn Your Pub Around?'}
        subtitle={
          sectionHeadings?.finalCtaSubtitle ||
          "Let's talk about what's really hurting your business. I'll share the exact strategies that saved ours."
        }
      />
    </>
  );
}
