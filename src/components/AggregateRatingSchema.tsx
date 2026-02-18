interface AggregateRatingSchemaProps {
  itemReviewed: {
    type: 'Product' | 'Service' | 'Organization' | 'LocalBusiness';
    name: string;
    description?: string;
    url?: string;
  };
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export function AggregateRatingSchema({
  itemReviewed,
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1,
}: AggregateRatingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': itemReviewed.type,
      name: itemReviewed.name,
      ...(itemReviewed.description && { description: itemReviewed.description }),
      ...(itemReviewed.url && { url: itemReviewed.url }),
    },
    ratingValue,
    reviewCount,
    bestRating,
    worstRating,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default AggregateRatingSchema;
