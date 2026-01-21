import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Button from '@/components/Button';
import Card from '@/components/Card';
import OptimizedImage from '@/components/OptimizedImage';
import FAQItem from '@/components/FAQItem';
import { FAQAccordion } from '@/components/ui/faq-accordion';
import Input from '@/components/forms/Input';
import Grid from '@/components/Grid';
import { PLACEHOLDERS, VALIDATION_MESSAGES } from '@/lib/validation-messages';
import { generateStaticMetadata } from '@/lib/metadata';

export const metadata = generateStaticMetadata({
  title: 'Component Test (Internal)',
  description: 'Internal UI component testing page. Not intended for search results.',
  path: '/test-shadcn',
  noIndex: true,
});

export default function TestShadcnPage() {
  const faqs = [
    {
      id: '1',
      question: 'Do the shadcn components work?',
      answer: 'Yes! This accordion is using the new shadcn FAQ component with SEO schema markup.',
    },
    {
      id: '2',
      question: 'Are the adapters working properly?',
      answer: 'The adapters ensure backward compatibility while we migrate to shadcn components.',
    },
    {
      id: '3',
      question: 'Is this SEO optimized?',
      answer:
        'Absolutely! Every component includes proper schema.org markup and accessibility features.',
    },
  ];

  return (
    <>
      <Hero
        title="shadcn Component Test"
        subtitle="Testing all new components and adapters"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Test shadcn' }]}
      />

      <Section>
        <Heading level={2} align="center" className="mb-8">
          Typography Components
        </Heading>
        <div className="space-y-4 max-w-3xl mx-auto">
          <Heading level={1}>Heading Level 1</Heading>
          <Heading level={2}>Heading Level 2</Heading>
          <Heading level={3}>Heading Level 3</Heading>
          <Text size="xs">Extra small text</Text>
          <Text size="sm">Small text</Text>
          <Text size="base">Base text (default)</Text>
          <Text size="lg">Large text</Text>
          <Text size="xl">Extra large text</Text>
          <Text size="2xl">2XL text</Text>
          <Text weight="bold" className="text-orange">
            Bold orange text
          </Text>
          <Text weight="semibold" className="text-teal">
            Semibold teal text
          </Text>
        </div>
      </Section>

      <Section background="cream">
        <Heading level={2} align="center" className="mb-8">
          Button Components
        </Heading>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button loading>Loading Button</Button>
          <Button disabled>Disabled Button</Button>
          <Button whatsapp>WhatsApp Button</Button>
          <Button href="/" external>
            External Link
          </Button>
        </div>
      </Section>

      <Section>
        <Heading level={2} align="center" className="mb-8">
          Card Components
        </Heading>
        <Grid columns={{ default: 1, md: 3 }} gap="medium">
          <Card>
            <Heading level={3}>Default Card</Heading>
            <Text>This is a default card with standard styling.</Text>
          </Card>
          <Card variant="bordered">
            <Heading level={3}>Bordered Card</Heading>
            <Text>This card has a border variant.</Text>
          </Card>
          <Card variant="shadowed">
            <Heading level={3}>Shadowed Card</Heading>
            <Text>This card has a shadow effect.</Text>
          </Card>
          <Card variant="colored" background="orange-light">
            <Heading level={3}>Colored Card</Heading>
            <Text>This card has a colored background.</Text>
          </Card>
          <Card variant="colored" background="teal-dark">
            <Heading level={3} color="white">
              Dark Card
            </Heading>
            <Text color="white">This card has a dark background.</Text>
          </Card>
          <Card variant="shadowed" className="hover:shadow-xl transition-shadow">
            <Heading level={3}>Interactive Card</Heading>
            <Text>This card has hover effects.</Text>
          </Card>
        </Grid>
      </Section>

      <Section background="teal">
        <Heading level={2} align="center" color="white" className="mb-8">
          Image Component
        </Heading>
        <div className="max-w-2xl mx-auto">
          <Card background="white">
            <OptimizedImage
              src="/images/pub-transformation.jpg"
              alt="Test image with SEO optimization"
              width={800}
              height={400}
              priority
              className="rounded-lg"
            />
            <Text className="mt-4">
              The image component includes loading states, error handling, and SEO optimization.
            </Text>
          </Card>
        </div>
      </Section>

      <Section>
        <Heading level={2} align="center" className="mb-8">
          Form Components
        </Heading>
        <div className="max-w-md mx-auto space-y-4">
          <Input label="Name" placeholder={PLACEHOLDERS.name.default} required />
          <Input
            label="Email"
            type="email"
            placeholder={PLACEHOLDERS.email.default}
            helperText="We'll never share your email"
          />
          <Input
            label="Phone"
            type="tel"
            placeholder={PLACEHOLDERS.phone.default}
            error={VALIDATION_MESSAGES.phone.invalid}
          />
          <Input label="Message" placeholder={PLACEHOLDERS.message.general} variant="filled" />
        </div>
      </Section>

      <Section background="orange-light">
        <Heading level={2} align="center" className="mb-8">
          FAQ Components
        </Heading>
        <div className="max-w-3xl mx-auto">
          <Text align="center" className="mb-8">
            Traditional card-based FAQ items:
          </Text>
          <div className="space-y-4 mb-12">
            <FAQItem
              question="Is this the old FAQ style?"
              answer="Yes, this uses the card-based FAQ component."
              icon="❓"
            />
          </div>

          <Text align="center" className="mb-8">
            New accordion-based FAQ with SEO schema:
          </Text>
          <FAQAccordion items={faqs} defaultOpen="1" />
        </div>
      </Section>

      <Section>
        <div className="text-center">
          <Heading level={2} className="mb-4">
            Component Migration Complete! 🎉
          </Heading>
          <Text size="lg" color="muted" className="mb-8">
            All components are working with shadcn/ui and maintaining backward compatibility.
          </Text>
          <Button href="/" size="large">
            Back to Home
          </Button>
        </div>
      </Section>
    </>
  );
}
