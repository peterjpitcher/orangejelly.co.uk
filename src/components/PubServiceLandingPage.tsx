import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Container from '@/components/Container';
import FAQItem from '@/components/FAQItem';
import { FAQSchema, ServiceSchema } from '@/components/StructuredData';
import { URLS } from '@/lib/constants';
import { type BreadcrumbItem } from '@/components/Breadcrumb';
import { getBaseUrl } from '@/lib/site-config';

type LandingItem = {
  title: string;
  description: string;
};

type LandingStep = {
  number: string;
  title: string;
  description: string;
};

export type PubServiceLandingData = {
  service: {
    name: string;
    description: string;
    url: string;
    price: string;
    currency?: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    bottomText: string;
  };
  intro: {
    heading: string;
    paragraphs: string[];
  };
  deliverables: {
    heading: string;
    items: LandingItem[];
  };
  process: {
    heading: string;
    steps: LandingStep[];
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  cta: {
    title: string;
    subtitle: string;
    whatsappMessage: string;
  };
};

export default function PubServiceLandingPage({
  data,
  breadcrumbs,
}: {
  data: PubServiceLandingData;
  breadcrumbs: BreadcrumbItem[];
}) {
  const baseUrl = getBaseUrl();
  const serviceUrl = data.service.url.startsWith('http')
    ? data.service.url
    : `${baseUrl}${data.service.url}`;

  return (
    <>
      <ServiceSchema
        services={[
          {
            name: data.service.name,
            description: data.service.description,
            price: data.service.price,
            currency: data.service.currency,
            url: serviceUrl,
          },
        ]}
      />
      <FAQSchema faqs={data.faqs} />

      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        showCTA
        ctaText={data.hero.ctaText}
        bottomText={data.hero.bottomText}
        breadcrumbs={breadcrumbs}
      />

      <Section background="white" padding="large">
        <Container maxWidth="4xl">
          <Heading level={2} align="center" className="mb-6">
            {data.intro.heading}
          </Heading>
          <div className="space-y-4 max-w-3xl mx-auto">
            {data.intro.paragraphs.map((paragraph) => (
              <Text key={paragraph} size="lg" className="text-charcoal/80">
                {paragraph}
              </Text>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="cream" padding="large">
        <Container maxWidth="6xl">
          <Heading level={2} align="center" className="mb-10">
            {data.deliverables.heading}
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {data.deliverables.items.map((item) => (
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

      <Section background="white" padding="large">
        <Container maxWidth="6xl">
          <Heading level={2} align="center" className="mb-12">
            {data.process.heading}
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.process.steps.map((step) => (
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

      <Section background="teal" padding="large">
        <Container maxWidth="3xl">
          <div className="text-center">
            <Heading level={2} color="white" className="mb-4">
              {data.cta.title}
            </Heading>
            <Text size="lg" color="white" className="opacity-90 mb-8 max-w-2xl mx-auto">
              {data.cta.subtitle}
            </Text>
            <Button
              href={URLS.whatsapp(data.cta.whatsappMessage)}
              variant="secondary"
              size="large"
              external
              className="!bg-white !text-charcoal hover:!bg-cream"
            >
              Message Peter on WhatsApp
            </Button>
          </div>
        </Container>
      </Section>

      <Section background="white" padding="large">
        <Container maxWidth="4xl">
          <Heading level={2} align="center" className="mb-12">
            Common Questions
          </Heading>
          <div className="space-y-4">
            {data.faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
