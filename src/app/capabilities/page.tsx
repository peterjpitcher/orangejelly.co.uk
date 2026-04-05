import Link from 'next/link';
import { generateStaticMetadata } from '@/lib/metadata';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import { CapabilityGrid, ContentBoundaries, PackageCTA } from '@/components/packages';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

export function generateMetadata() {
  return generateStaticMetadata({
    title: 'Pub Marketing Capabilities — Social Media, Events, SEO & More',
    description:
      'Full-stack pub marketing support: social media, events, paid ads, local visibility, content, website optimisation, and more. See what is included in each package.',
    path: '/capabilities',
  });
}

export default function CapabilitiesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Capabilities', url: '/capabilities' },
        ]}
      />

      {/* Hero */}
      <Hero
        title="Everything we can help with"
        subtitle="From social media strategy to event marketing, local visibility to paid ads — this is our full digital capability stack, tested at The Anchor and delivered for your venue."
        showCTA={false}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Capabilities' }]}
      />

      {/* Capability Grid (full mode) */}
      <Section background="white" padding="large">
        <Container>
          <CapabilityGrid />
          <div className="mt-8 text-center">
            <Text size="base" color="muted">
              Support depth varies by package.{' '}
              <Link href="/ways-to-work" className="text-teal underline hover:no-underline">
                See our packages
              </Link>{' '}
              to find the right fit.
            </Text>
          </div>
        </Container>
      </Section>

      {/* Content Boundaries */}
      <Section background="cream" padding="large">
        <Container>
          <div className="text-center mb-8">
            <Heading level={2} align="center" color="charcoal">
              Content Creation — What Is and Is Not Included
            </Heading>
            <Text size="lg" color="muted" className="mt-4 max-w-2xl mx-auto">
              We believe in being upfront about what you get. Here is how content creation works
              across our packages.
            </Text>
          </div>
          <ContentBoundaries />
        </Container>
      </Section>

      {/* CTA */}
      <Section background="white" padding="large">
        <Container>
          <div className="text-center mb-8">
            <Heading level={2} align="center" color="charcoal">
              Find the Right Package
            </Heading>
            <Text size="lg" color="muted" className="mt-4 max-w-2xl mx-auto">
              Every capability above is delivered through one of our four packages. Find the level
              that fits your venue.
            </Text>
          </div>
          <PackageCTA />
        </Container>
      </Section>
    </>
  );
}
