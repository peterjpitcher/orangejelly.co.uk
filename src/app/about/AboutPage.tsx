import Hero from '@/components/Hero';
import Section from '@/components/Section';
import CTASection from '@/components/CTASection';
import OptimizedImage from '@/components/OptimizedImage';
import Heading from '@/components/Heading';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';
import FeatureList from '@/components/FeatureList';
import FAQItem from '@/components/FAQItem';
import { breadcrumbPaths } from '@/components/Breadcrumb';
import RelatedLinks from '@/components/RelatedLinks';

// Import related links data
import relatedLinksData from '../../../content/data/related-links.json';
import Text from '@/components/Text';
import Container from '@/components/Container';
import Box from '@/components/Box';
import { FAQSchema } from '@/components/StructuredData';
import PartnershipsSection from '@/components/PartnershipsSection';
// Icons not needed for basic about page
import Link from 'next/link';
// Local data imports
import aboutData from '../../../content/data/about.json';

type AboutPartner = {
  name: string;
  relationship?: string;
  logo?: string;
};

type RelatedLinkGroup = {
  links: Array<{
    title: string;
    href: string;
    description?: string;
  }>;
};

interface FAQ {
  question: string;
  answer: string;
}

interface AboutPageProps {
  faqs?: FAQ[];
}

export default function AboutPage({ faqs }: AboutPageProps) {
  // Load FAQs from data file
  const aboutFAQs = faqs || aboutData.faqs || [];
  const partners = (aboutData.partnerships as AboutPartner[]) || [];
  const aboutLinks = ((relatedLinksData as { about?: RelatedLinkGroup }).about?.links || []).map(
    (link) => ({
      ...link,
      description: link.description || '',
    })
  );

  return (
    <>
      <FAQSchema faqs={aboutFAQs} />

      <Hero
        title={aboutData.heroSection.title}
        subtitle={aboutData.heroSection.subtitle}
        breadcrumbs={breadcrumbPaths.about}
        backgroundImage={aboutData.heroSection.backgroundImage}
      />

      {/* The Story */}
      <Section>
        <AnimatedItem animation="fade-in">
          <Container maxWidth="4xl">
            <Heading level={2} className="mb-6">
              The Real Story Behind Orange Jelly
            </Heading>
            <Box className="prose prose-lg">
              {aboutData.story.map((paragraph, index) => (
                <Text key={index} size="lg" className="mb-6">
                  {paragraph}
                </Text>
              ))}
            </Box>

            <Button href="/results" variant="ghost" className="text-lg">
              See Our Proven Results →
            </Button>
          </Container>
        </AnimatedItem>
      </Section>

      {/* Quick Facts */}
      <Section background="cream">
        <AnimatedItem animation="fade-in">
          <div className="max-w-4xl mx-auto">
            <Card variant="colored" background="orange-light" padding="large">
              <Heading level={3} className="mb-4">
                {aboutData.quickFacts.title}
              </Heading>
              <FeatureList items={aboutData.quickFacts.facts} columns={1} />
            </Card>
          </div>
        </AnimatedItem>
      </Section>

      {/* Journey Timeline */}
      <Section background="cream">
        <AnimatedItem animation="slide-up">
          <Heading level={2} align="center" className="mb-12">
            Our Journey from Struggle to Success
          </Heading>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {aboutData.timeline.map((event, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 ${event.highlight ? 'scale-105' : ''}`}
                >
                  <div
                    className={`w-24 flex-shrink-0 text-right ${event.highlight ? 'font-bold text-orange' : 'text-charcoal/60'}`}
                  >
                    {event.date}
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 ${event.highlight ? 'bg-orange' : 'bg-charcoal/30'}`}
                  />
                  <div className="flex-grow">
                    <Heading level={4} className={event.highlight ? 'text-orange' : ''}>
                      {event.title}
                    </Heading>
                    {event.description && <Text color="muted">{event.description}</Text>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedItem>
      </Section>

      {/* Meet Peter */}
      <Section>
        <AnimatedItem animation="fade-in" delay={100}>
          <Grid columns={{ default: 1, md: 2 }} gap="large" className="items-center">
            <div className="order-2 md:order-1">
              <div className="relative aspect-square max-w-[400px] mx-auto md:mx-0">
                <OptimizedImage
                  src={aboutData.founderSection.image}
                  alt="Peter Pitcher, founder of Orange Jelly"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="rounded-lg shadow-xl object-cover"
                  priority
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Heading level={2} className="mb-6">
                {aboutData.founderSection.name}
              </Heading>
              <Text size="sm" color="muted" className="mb-4 uppercase tracking-wide">
                {aboutData.founderSection.role}
              </Text>

              <div className="prose prose-lg mb-6">
                {aboutData.founderSection.bio.map((paragraph, index) => (
                  <Text key={index} size="lg" className="mb-4">
                    {paragraph}
                  </Text>
                ))}
              </div>

              <Card variant="colored" background="cream" padding="medium">
                <Text size="lg" className="italic text-charcoal">
                  "{aboutData.founderSection.quote}"
                </Text>
              </Card>
            </div>
          </Grid>
        </AnimatedItem>
      </Section>

      {/* Our Values */}
      <Section background="orange-light">
        <AnimatedItem animation="slide-up" delay={200}>
          <Heading level={2} align="center" className="mb-12">
            What We Stand For
          </Heading>

          <Grid columns={{ default: 1, md: 2, lg: 4 }} gap="medium">
            {aboutData.values.map((value, index) => (
              <Card
                key={index}
                variant="shadowed"
                background="white"
                padding="medium"
                className="text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <Heading level={4} className="mb-2">
                  {value.title}
                </Heading>
                <Text size="sm" color="muted">
                  {value.description}
                </Text>
              </Card>
            ))}
          </Grid>
        </AnimatedItem>
      </Section>

      {/* Why Orange Jelly */}
      <Section>
        <AnimatedItem animation="fade-in" delay={300}>
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={2} align="center" className="mb-6">
              {aboutData.whyOrangeJelly.title}
            </Heading>
            <div className="prose prose-lg mx-auto">
              {aboutData.whyOrangeJelly.content.map((paragraph, index) => (
                <Text key={index} size="lg" className="mb-4">
                  {paragraph}
                </Text>
              ))}
            </div>
          </div>
        </AnimatedItem>
      </Section>

      {/* FAQs */}
      <Section background="cream">
        <AnimatedItem animation="fade-in" delay={400}>
          <Heading level={2} align="center" className="mb-12">
            Your Questions Answered
          </Heading>

          {aboutFAQs.length > 0 && (
            <div className="max-w-3xl mx-auto space-y-6">
              {aboutFAQs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          )}
        </AnimatedItem>
      </Section>

      {/* Partners */}
      <PartnershipsSection
        partners={partners.map((partner) => ({
          name: partner.name,
          description: partner.relationship || '',
          logoUrl: partner.logo || '/logo.png',
          url:
            partner.name === 'Greene King'
              ? 'https://www.greeneking.co.uk/'
              : 'https://www.bii.org/',
        }))}
        title="Working With Industry Leaders"
      />

      {/* Visit CTA */}
      <Section background="teal">
        <AnimatedItem animation="scale" delay={500}>
          <div className="max-w-3xl mx-auto text-center">
            <Heading level={2} color="white" className="mb-6">
              {aboutData.visitCTA.title}
            </Heading>
            <Text size="lg" color="white" className="mb-8">
              {aboutData.visitCTA.subtitle}
            </Text>
            <Card
              variant="shadowed"
              className="inline-block max-w-md bg-black/20 backdrop-blur"
              padding="large"
            >
              <Heading level={4} color="white" className="mb-2">
                {aboutData.visitCTA.locationName}
              </Heading>
              {aboutData.visitCTA.address.split('\n').map((line, i, arr) => (
                <Text key={i} color="white" className={i === arr.length - 1 ? 'mb-4' : ''}>
                  {line}
                </Text>
              ))}
              <Link
                href={aboutData.visitCTA.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-200 transition-colors underline font-medium"
              >
                {aboutData.visitCTA.ctaText}
              </Link>
            </Card>
          </div>
        </AnimatedItem>
      </Section>

      {/* Related Links */}
      <Section background="cream" padding="medium">
        <RelatedLinks
          title="See How We Can Help"
          subtitle="Choose where to start based on your biggest challenge"
          links={aboutLinks}
          variant="card"
          columns={{ default: 1, md: 3 }}
        />
      </Section>

      <CTASection
        title="Ready to Transform Your Pub?"
        subtitle="Let's chat about your challenges. No sales pitch, just one licensee to another."
      />
    </>
  );
}
