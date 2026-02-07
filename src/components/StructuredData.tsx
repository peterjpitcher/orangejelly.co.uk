// Structured data components for SEO and voice search optimization
import { logStructuredDataValidation } from '@/lib/structured-data-validator';
import { getBaseUrl } from '@/lib/site-config';

const baseUrl = getBaseUrl();

interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  // Don't render FAQSchema if there are no FAQs
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const faqSchema = {
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

  // Validate in development
  if (process.env.NODE_ENV === 'development') {
    logStructuredDataValidation(faqSchema, 'FAQSchema');
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

interface ServiceSchemaProps {
  services: Array<{
    name: string;
    description: string;
    price: string;
    currency?: string;
    priceRange?: string;
    duration?: string;
    url?: string;
  }>;
}

export function ServiceSchema({ services }: ServiceSchemaProps) {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@graph': services.map((service, index) => ({
      '@type': 'Service',
      '@id': service.url || `#service-${index}`,
      name: service.name,
      description: service.description,
      provider: {
        '@type': 'LocalBusiness',
        name: 'Orange Jelly Limited',
        '@id': `${baseUrl}/#organization`,
      },
      areaServed: {
        '@type': 'Country',
        name: 'United Kingdom',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: service.name,
        itemListElement: [
          {
            '@type': 'Offer',
            price: service.price,
            priceCurrency: service.currency || 'GBP',
            priceSpecification: {
              '@type': 'PriceSpecification',
              price: service.price,
              priceCurrency: service.currency || 'GBP',
              valueAddedTaxIncluded: false,
            },
            availability: 'https://schema.org/InStock',
          },
        ],
      },
      ...(service.duration && { duration: service.duration }),
      ...(service.priceRange && { priceRange: service.priceRange }),
    })),
  };

  // Validate in development
  if (process.env.NODE_ENV === 'development') {
    logStructuredDataValidation(serviceSchema, 'ServiceSchema');
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  );
}

interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  telephone: string;
  email: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  openingHours?: string[];
  priceRange?: string;
}

export function LocalBusinessSchema({
  name,
  description,
  telephone,
  email,
  address,
  openingHours,
  priceRange = '££',
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#localbusiness`,
    name: name,
    description: description,
    url: baseUrl,
    telephone: telephone,
    email: email,
    priceRange: priceRange,
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...address,
      },
    }),
    ...(openingHours && { openingHours: openingHours }),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: telephone,
      contactType: 'Customer Service',
      email: email,
      availableLanguage: ['English', 'en-GB'],
      areaServed: 'GB',
    },
    sameAs: ['https://www.the-anchor.pub'],
  };

  // Validate in development
  if (process.env.NODE_ENV === 'development') {
    logStructuredDataValidation(schema, 'LocalBusinessSchema');
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  // Validate in development
  if (process.env.NODE_ENV === 'development') {
    logStructuredDataValidation(schema, 'BreadcrumbSchema');
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface HowToSchemaProps {
  name: string;
  description: string;
  totalTime?: string;
  image?: string;
  estimatedCost?: {
    currency: string;
    value: string;
  };
  supply?: string[];
  tool?: string[];
  url?: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
    url?: string;
  }>;
}

export function HowToSchema({
  name,
  description,
  totalTime,
  image,
  estimatedCost,
  supply,
  tool,
  url,
  steps,
}: HowToSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: name,
    description: description,
    ...(totalTime && { totalTime: totalTime }),
    ...(image && { image: image }),
    ...(estimatedCost && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: estimatedCost.currency,
        value: estimatedCost.value,
      },
    }),
    ...(supply && { supply: supply.map((item) => ({ '@type': 'HowToSupply', name: item })) }),
    ...(tool && { tool: tool.map((item) => ({ '@type': 'HowToTool', name: item })) }),
    ...(url && { url: url }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url }),
      ...(step.image && {
        image: {
          '@type': 'ImageObject',
          url: step.image,
        },
      }),
    })),
  };

  // Validate in development
  if (process.env.NODE_ENV === 'development') {
    logStructuredDataValidation(schema, 'HowToSchema');
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
