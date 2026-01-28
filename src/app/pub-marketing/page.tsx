import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Container from '@/components/Container';
import { FAQSchema } from '@/components/StructuredData';
import { generateMetadata } from '@/lib/metadata';
import { URLS } from '@/lib/constants';
import Link from 'next/link';
import pubMarketingData from '../../../content/data/pub-marketing.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Consultant (UK) - Fill Tables & Boost Profit',
  description:
    'Pub marketing help from a working licensee. Fix quiet nights, improve local visibility, and build repeat trade with simple systems. £75/hour + VAT.',
  path: '/pub-marketing',
  keywords:
    'pub marketing consultant, pub marketing agency, pub marketing services, pub marketing UK, marketing for pubs, increase pub footfall, fill pub tables',
  ogType: 'website',
});

type PubMarketingCard = {
  title: string;
  description: string;
  href: string;
  ctaText: string;
};

type PubMarketingStep = {
  number: string;
  title: string;
  description: string;
};

export default function PubMarketingPage() {
  const faqsForDisplay = pubMarketingData.faqs;
  const focusAreas = pubMarketingData.focusAreas.items;
  const solutionCards = pubMarketingData.solutions.cards as PubMarketingCard[];
  const processSteps = pubMarketingData.process.steps as PubMarketingStep[];

  return (
    <>
      <FAQSchema faqs={faqsForDisplay} />

      <Hero
        title={pubMarketingData.hero.title}
        subtitle={pubMarketingData.hero.subtitle}
        showCTA
        ctaText={pubMarketingData.hero.ctaText}
        bottomText={pubMarketingData.hero.bottomText}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Pub Marketing' }]}
        backgroundImage="/images/headers/services.png"
      />

      {/* Intro */}
      <Section background="white" padding="large">
        <Container maxWidth="4xl">
          <Heading level={2} align="center" className="mb-6">
            {pubMarketingData.intro.heading}
          </Heading>
          <div className="space-y-4 max-w-3xl mx-auto">
            {pubMarketingData.intro.paragraphs.map((paragraph) => (
              <Text key={paragraph} size="lg" className="text-charcoal/80">
                {paragraph}
              </Text>
            ))}
          </div>
        </Container>
      </Section>

      {/* Focus areas */}
      <Section background="cream" padding="large">
        <Container maxWidth="6xl">
          <Heading level={2} align="center" className="mb-10">
            {pubMarketingData.focusAreas.heading}
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {focusAreas.map((item) => (
              <Card key={item.title} variant="bordered" padding="large">
                <Heading level={3} className="mb-3">
                  {item.title}
                </Heading>
                <Text color="muted">{item.description}</Text>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Solutions */}
      <Section background="white" padding="large">
        <Container maxWidth="6xl">
          <Heading level={2} align="center" className="mb-10">
            {pubMarketingData.solutions.heading}
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {solutionCards.map((card) => (
              <Card key={card.href} variant="bordered" padding="large" className="flex flex-col">
                <div className="flex-1">
                  <Heading level={3} className="mb-3">
                    {card.title}
                  </Heading>
                  <Text color="muted" className="mb-6">
                    {card.description}
                  </Text>
                </div>
                <div>
                  <Button href={card.href} variant="primary" size="medium">
                    {card.ctaText}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Locations */}
      <Section background="teal" padding="large">
        <Container maxWidth="4xl">
          <div className="text-center">
            <Heading level={2} color="white" className="mb-4">
              {pubMarketingData.locations.heading}
            </Heading>
            <Text size="lg" color="white" className="opacity-90 mb-8">
              {pubMarketingData.locations.description}
            </Text>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {pubMarketingData.locations.areas.map((area) => {
              const areaSlug = area
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

              return (
                <Link
                  key={area}
                  href={`/pub-marketing-${areaSlug}`}
                  className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  {area}
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section background="white" padding="large">
        <Container maxWidth="6xl">
          <Heading level={2} align="center" className="mb-12">
            {pubMarketingData.process.heading}
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 bg-orange text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {step.number}
                </div>
                <Heading level={4} className="mb-3">
                  {step.title}
                </Heading>
                <Text size="sm" color="muted">
                  {step.description}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section background="cream" padding="large">
        <Container maxWidth="4xl">
          <Heading level={2} align="center" className="mb-12">
            Common Questions
          </Heading>
          <div className="space-y-4">
            {faqsForDisplay.map((faq, index) => (
              <Card key={index} variant="bordered" padding="medium" background="white">
                <Heading level={3} className="mb-2">
                  {faq.question}
                </Heading>
                <Text color="muted">{faq.answer}</Text>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section background="orange-light" padding="large">
        <Container maxWidth="3xl">
          <div className="text-center">
            <Heading level={2} className="mb-4">
              {pubMarketingData.cta.title}
            </Heading>
            <Text size="lg" className="mb-8 max-w-2xl mx-auto">
              {pubMarketingData.cta.subtitle}
            </Text>
            <Button
              href={URLS.whatsapp(pubMarketingData.cta.whatsappMessage)}
              variant="primary"
              size="large"
              external
              className="mb-2"
            >
              Message Peter on WhatsApp
            </Button>
            <Text size="sm" color="muted">
              £75/hour + VAT • No packages • No pressure
            </Text>
          </div>
        </Container>
      </Section>
    </>
  );
}
