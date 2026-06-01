import { generateStaticMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/site-config';
import { getPackages } from '@/lib/packages';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import {
  PackageCard,
  PackageComparison,
  AddOnList,
  PaymentPlanBanner,
  PackageCTA,
} from '@/components/packages';
import FAQAccordionWrapper from '@/components/FAQAccordionWrapper';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

export function generateMetadata() {
  return generateStaticMetadata({
    title: 'Pub Marketing Packages — Clear Pricing, Real Expertise',
    description:
      'Four clear packages for pub and hospitality marketing. From a one-off Growth Fix to ongoing Growth Partner support. Payment plans available. No hidden fees.',
    path: '/ways-to-work',
  });
}

const faqs = [
  {
    question: 'Which package is right for my pub?',
    answer:
      'If you have one clear issue, start with Growth Fix. If you need ongoing monthly support, Momentum Month or Growth Partner. If your pub needs a complete reset, the Turnaround Intensive.',
  },
  {
    question: 'Can I switch between packages?',
    answer:
      'Yes. Many clients start with a Growth Fix and move to Momentum Month or Growth Partner once they see results.',
  },
  {
    question: 'What about content creation?',
    answer:
      'Strategy and content planning are included. Content production (filming, photography, heavy editing) is available as a separately scoped add-on.',
  },
  {
    question: 'Do you offer payment plans?',
    answer:
      'Yes. We offer flexible payment options to make support accessible. Ask Peter when you get in touch.',
  },
  {
    question: 'How quickly will I see results?',
    answer:
      'Growth Fix clients typically see their first win within 2 weeks. Momentum Month and Growth Partner clients build visible momentum within 30-60 days.',
  },
  {
    question: 'What happens after a Growth Fix?',
    answer:
      'You get your action plan and results. If you want ongoing support, step up to Momentum Month or Growth Partner. No pressure.',
  },
  {
    question: 'What is included in the Turnaround Intensive website rebuild?',
    answer:
      'A lean, template-led website of 5-8 core pages, mobile-first, with refreshed positioning, proof flow, and basic SEO. Advanced integrations and bespoke development are separate scope.',
  },
  {
    question: 'Can I add extra hours?',
    answer:
      'Additional hours can be arranged as needed. We will always discuss scope and pricing upfront.',
  },
];

function ItemListSchema() {
  const baseUrl = getBaseUrl();
  const packages = getPackages();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: packages.map((pkg, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: pkg.name,
      url: `${baseUrl}/ways-to-work/${pkg.slug}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function WaysToWorkPage() {
  return (
    <>
      <ItemListSchema />
      <FAQSchema />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Ways to Work', url: '/ways-to-work' },
        ]}
      />

      {/* Hero */}
      <Hero
        title="Clear packages. Honest pricing. Real hospitality expertise."
        subtitle="Four ways to work with Orange Jelly — from a focused one-off fix to full ongoing partnership. Pick the level that fits your venue today."
        showCTA={false}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Ways to Work' }]}
        backgroundImage="/images/headers/ways-to-work.png"
      />

      {/* Package Cards */}
      <Section background="white" padding="large">
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} align="center" color="charcoal">
              Our Packages
            </Heading>
            <Text size="lg" color="muted" className="mt-4 max-w-2xl mx-auto">
              Every package is built around real hospitality experience. No filler, no fluff — just
              practical support that moves the needle.
            </Text>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PackageCard packageId="growth-fix" />
            <PackageCard packageId="momentum-month" />
            <PackageCard packageId="growth-partner" highlighted />
            <PackageCard packageId="turnaround-intensive" />
          </div>
        </Container>
      </Section>

      {/* Comparison */}
      <Section background="cream" padding="large">
        <Container>
          <div className="text-center mb-8">
            <Heading level={2} align="center" color="charcoal">
              Compare Packages
            </Heading>
            <Text size="lg" color="muted" className="mt-4 max-w-2xl mx-auto">
              See exactly what is included at each level. No hidden extras.
            </Text>
          </div>
          <PackageComparison />
        </Container>
      </Section>

      {/* Add-ons */}
      <Section background="white" padding="large">
        <Container>
          <div className="text-center mb-8">
            <Heading level={2} align="center" color="charcoal">
              Add-ons
            </Heading>
            <Text size="lg" color="muted" className="mt-4 max-w-2xl mx-auto">
              Need something extra? These can be added to any package.
            </Text>
          </div>
          <AddOnList />
        </Container>
      </Section>

      {/* Payment Plans */}
      <PaymentPlanBanner />

      {/* FAQs */}
      <Section background="white" padding="large">
        <Container maxWidth="3xl">
          <div className="text-center mb-8">
            <Heading level={2} align="center" color="charcoal">
              Frequently Asked Questions
            </Heading>
          </div>
          <FAQAccordionWrapper items={faqs} />
        </Container>
      </Section>

      {/* CTA */}
      <Section background="cream" padding="large">
        <Container>
          <PackageCTA />
        </Container>
      </Section>
    </>
  );
}
