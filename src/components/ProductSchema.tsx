import { logStructuredDataValidation } from '@/lib/structured-data-validator';
import { getBaseUrl } from '@/lib/site-config';

interface ProductSchemaProps {
  name: string;
  description: string;
  image?: string;
  price: string | number;
  priceCurrency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  category?: string;
  url?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  review?: Array<{
    author: string;
    ratingValue: number;
    reviewBody: string;
    datePublished?: string;
  }>;
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  priceCurrency = 'GBP',
  availability = 'InStock',
  brand = 'Orange Jelly',
  category,
  url,
  aggregateRating,
  review = [],
}: ProductSchemaProps) {
  const baseUrl = getBaseUrl();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: description,
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: `${baseUrl}${image}`,
      },
    }),
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    ...(category && { category: category }),
    ...(url && { url: `${baseUrl}${url}` }),
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: priceCurrency,
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: 'Orange Jelly Limited',
      },
    },
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
      },
    }),
    ...(review.length > 0 && {
      review: review.map((r) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: r.author,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.ratingValue,
        },
        reviewBody: r.reviewBody,
        ...(r.datePublished && { datePublished: r.datePublished }),
      })),
    }),
  };

  // Validate in development
  if (process.env.NODE_ENV === 'development') {
    logStructuredDataValidation(schema, 'ProductSchema');
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
