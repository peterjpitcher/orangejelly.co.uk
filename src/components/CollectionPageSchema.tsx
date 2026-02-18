import { logStructuredDataValidation } from '@/lib/structured-data-validator';
import { getBaseUrl } from '@/lib/site-config';

interface CollectionItem {
  url: string;
  name: string;
  description?: string;
  datePublished?: string;
  author?: string;
  image?: string;
}

interface CollectionPageSchemaProps {
  name: string;
  description: string;
  url: string;
  items: CollectionItem[];
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

export function CollectionPageSchema({
  name,
  description,
  url,
  items,
  breadcrumbs = [],
}: CollectionPageSchemaProps) {
  const isAbsolute = (u: string) => /^https?:\/\//i.test(u);
  const site = getBaseUrl();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: name,
    description: description,
    url: isAbsolute(url) ? url : `${site}${url}`,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${site}/#website`,
    },
    breadcrumb:
      breadcrumbs.length > 0
        ? {
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((crumb, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: crumb.name,
              item: isAbsolute(crumb.url) ? crumb.url : `${site}${crumb.url}`,
            })),
          }
        : undefined,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'BlogPosting',
        position: index + 1,
        url: isAbsolute(item.url) ? item.url : `${site}${item.url}`,
        headline: item.name,
        ...(item.description && { description: item.description }),
        ...(item.datePublished && { datePublished: item.datePublished }),
        ...(item.author && {
          author: {
            '@type': 'Person',
            name: item.author,
          },
        }),
        ...(item.image && {
          image: {
            '@type': 'ImageObject',
            url: isAbsolute(item.image) ? item.image : `${site}${item.image}`,
          },
        }),
        publisher: {
          '@type': 'Organization',
          name: 'Orange Jelly Limited',
        },
      })),
    },
  };

  // Validate in development
  if (process.env.NODE_ENV === 'development') {
    logStructuredDataValidation(schema, 'CollectionPageSchema');
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
