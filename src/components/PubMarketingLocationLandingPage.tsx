import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Button from '@/components/Button';
import WhatsAppButton from '@/components/WhatsAppButton';
import FAQItem from '@/components/FAQItem';
import Container from '@/components/Container';
import { FAQSchema } from '@/components/StructuredData';

type LandingFaq = {
  question: string;
  answer: string;
};

type LandingCardLink = {
  title: string;
  description: string;
  href: string;
  ctaText: string;
};

type LandingItem = {
  title: string;
  description: string;
};

export type PubMarketingLocationLandingData = {
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
  wins: {
    heading: string;
    items: LandingItem[];
  };
  nextSteps: {
    heading: string;
    links: LandingCardLink[];
  };
  faqs: LandingFaq[];
  cta: {
    title: string;
    subtitle: string;
    whatsappMessage: string;
  };
};

export default function PubMarketingLocationLandingPage({
  data,
  breadcrumbLabel,
}: {
  data: PubMarketingLocationLandingData;
  breadcrumbLabel: string;
}) {
  const faqsForDisplay = data.faqs;
  const winItems = data.wins.items;
  const nextStepLinks = data.nextSteps.links;

  return (
    <>
      <FAQSchema faqs={faqsForDisplay} />

      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        showCTA
        ctaText={data.hero.ctaText}
        bottomText={data.hero.bottomText}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: breadcrumbLabel }]}
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
            {data.wins.heading}
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {winItems.map((item) => (
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
          <Heading level={2} align="center" className="mb-10">
            {data.nextSteps.heading}
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {nextStepLinks.map((link) => (
              <Card key={link.href} variant="bordered" padding="large" className="flex flex-col">
                <div className="flex-1">
                  <Heading level={3} className="mb-3">
                    {link.title}
                  </Heading>
                  <Text color="muted" className="mb-6">
                    {link.description}
                  </Text>
                </div>
                <div>
                  <Button href={link.href} variant="primary" size="medium">
                    {link.ctaText}
                  </Button>
                </div>
              </Card>
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
            <WhatsAppButton
              text={data.cta.whatsappMessage}
              label="Message Peter on WhatsApp"
              size="large"
              variant="secondary"
              className="!bg-white !text-charcoal hover:!bg-cream"
              showPhone={false}
            />
          </div>
        </Container>
      </Section>

      <Section background="white" padding="large">
        <Container maxWidth="4xl">
          <Heading level={2} align="center" className="mb-12">
            Common Questions
          </Heading>
          <div className="space-y-4">
            {faqsForDisplay.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
