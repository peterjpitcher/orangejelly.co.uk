import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import WhatsAppButton from '@/components/WhatsAppButton';
import Container from '@/components/Container';
import FAQItem from '@/components/FAQItem';
import { FAQSchema, ServiceSchema } from '@/components/StructuredData';
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
        <Container width="measure-wide">
          <Heading level={2} align="center" className="mb-6">
            {data.intro.heading}
          </Heading>
          <div className="space-y-4 measure">
            {data.intro.paragraphs.map((paragraph) => (
              <Text key={paragraph} size="lg" className="text-brand-base/80">
                {paragraph}
              </Text>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="surface" padding="large">
        <Container>
          <Heading level={2} align="center" className="mb-10">
            {data.deliverables.heading}
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <Container>
          <Heading level={2} align="center" className="mb-12">
            {data.process.heading}
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.process.steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 bg-orange text-brand-base rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
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

      <Section background="brand-base" padding="medium">
        <Container>
          <Heading level={2} align="center" color="white" className="mb-8">
            Real Results from The Anchor
          </Heading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <Text size="2xl" weight="bold" color="white">
                +98%
              </Text>
              <Text size="sm" color="white" className="opacity-80">
                Food revenue in 3 months
              </Text>
            </div>
            <div>
              <Text size="2xl" weight="bold" color="white">
                +403%
              </Text>
              <Text size="sm" color="white" className="opacity-80">
                Table bookings
              </Text>
            </div>
            <div>
              <Text size="2xl" weight="bold" color="white">
                +828%
              </Text>
              <Text size="sm" color="white" className="opacity-80">
                Google Search visibility
              </Text>
            </div>
            <div>
              <Text size="2xl" weight="bold" color="white">
                +567%
              </Text>
              <Text size="sm" color="white" className="opacity-80">
                Private hire bookings
              </Text>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="blue-support" padding="large">
        <Container width="measure">
          <div className="text-center">
            <Heading level={2} color="white" className="mb-4">
              {data.cta.title}
            </Heading>
            <Text size="lg" color="white" className="opacity-90 mb-8 measure">
              {data.cta.subtitle}
            </Text>
            <WhatsAppButton
              text={data.cta.whatsappMessage}
              label="Message Peter on WhatsApp"
              size="large"
              variant="secondary"
              className="!bg-white !text-brand-base hover:!bg-surface"
              showPhone={false}
            />
          </div>
        </Container>
      </Section>

      <Section background="white" padding="large">
        <Container width="measure-wide">
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
