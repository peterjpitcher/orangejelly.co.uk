import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPackages, getPackageBySlug } from '@/lib/packages';
import { getBaseUrl } from '@/lib/site-config';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { PackageDetail } from '@/components/packages';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';

// Metadata titles per slug (from spec)
const metaTitles: Record<string, string> = {
  'growth-fix': 'Growth Fix — Solve One Pub Problem Fast | From £375 + VAT',
  'momentum-month': 'Momentum Month — Ongoing Pub Marketing Support | £900/mo + VAT',
  'growth-partner': 'Growth Partner — Full Pub Marketing Support | Orange Jelly',
  'turnaround-intensive': 'Pub Turnaround Intensive — 30-Day Commercial Reset | Orange Jelly',
};

const metaDescriptions: Record<string, string> = {
  'growth-fix':
    'Solve one clear pub problem fast. The Growth Fix gives you a focused action plan and one targeted intervention in just 5 hours. From £375 + VAT.',
  'momentum-month':
    'Ongoing monthly pub marketing support. One clear objective, weekly priorities, and hands-on help for £900/mo + VAT. Build consistent momentum.',
  'growth-partner':
    'Full pub marketing support — strategy, events, social, local visibility, and accountability. The strongest ongoing package from Orange Jelly.',
  'turnaround-intensive':
    'A 30-day commercial reset for pubs needing a complete turnaround. Deep diagnostic, offer reset, lean website rebuild, and stabilisation playbooks.',
};

interface PackagePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const packages = getPackages();
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);

  if (!pkg) {
    return { title: 'Package Not Found' };
  }

  const baseUrl = getBaseUrl();
  const title = metaTitles[slug] || `${pkg.name} | Orange Jelly`;
  const description = metaDescriptions[slug] || pkg.shortDescription;
  const canonicalUrl = `${baseUrl}/ways-to-work/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Orange Jelly',
      type: 'website',
      locale: 'en_GB',
      images: [
        {
          url: `${baseUrl}/images/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: pkg.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

function ServiceSchema({ slug }: { slug: string }) {
  const pkg = getPackageBySlug(slug);
  if (!pkg) return null;

  const baseUrl = getBaseUrl();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: pkg.name,
    description: pkg.shortDescription,
    provider: {
      '@type': 'Organization',
      name: 'Orange Jelly',
      url: baseUrl,
    },
    url: `${baseUrl}/ways-to-work/${slug}`,
    ...(pkg.price.amount !== null && {
      offers: {
        '@type': 'Offer',
        price: pkg.price.amount,
        priceCurrency: 'GBP',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: pkg.price.amount,
          priceCurrency: 'GBP',
          ...(pkg.price.type === 'monthly' && {
            unitText: 'MONTH',
            billingIncrement: 1,
          }),
        },
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Website rebuild scope section for Turnaround Intensive
function WebsiteRebuildScope() {
  const includedItems = [
    '5-8 core pages',
    'Template-led build',
    'Mobile-first',
    'CMS-managed',
    'Refreshed positioning and offer structure',
    'Proof and contact flow',
    'Basic SEO setup',
    'Analytics installed',
    'One controlled round of amends',
    'Reuse of existing content where sensible, with selective rewriting',
  ];

  const separateItems = [
    'Advanced integrations',
    'Bespoke booking tools',
    'Complex migrations',
    'Deep copywriting across a large archive',
    'Full rebrand',
    'Fully bespoke custom design system',
    'Large functionality builds',
  ];

  return (
    <Section background="cream" padding="large">
      <Container maxWidth="4xl">
        <div className="text-center mb-8">
          <Heading level={2} align="center" color="charcoal">
            Website Rebuild Scope
          </Heading>
          <Text size="lg" color="muted" className="mt-4 max-w-2xl mx-auto">
            The Turnaround Intensive includes a lean website rebuild to support your commercial
            reset.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <Heading level={3} color="teal">
              Included in Package
            </Heading>
            <ul className="mt-4 space-y-2">
              {includedItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5 shrink-0" aria-hidden="true">
                    &#10003;
                  </span>
                  <Text size="sm" color="charcoal">
                    {item}
                  </Text>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <Heading level={3} color="charcoal">
              Separate Scope
            </Heading>
            <Text size="sm" color="muted" className="mt-1">
              Requires separate agreement
            </Text>
            <ul className="mt-4 space-y-2">
              {separateItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5 shrink-0" aria-hidden="true">
                    &mdash;
                  </span>
                  <Text size="sm" color="muted">
                    {item}
                  </Text>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Container>
    </Section>
  );
}

export default async function PackagePage({ params }: PackagePageProps) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  return (
    <>
      <ServiceSchema slug={slug} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Ways to Work', url: '/ways-to-work' },
          { name: pkg.name, url: `/ways-to-work/${slug}` },
        ]}
      />

      <PackageDetail slug={slug} />

      {slug === 'turnaround-intensive' && <WebsiteRebuildScope />}
    </>
  );
}
