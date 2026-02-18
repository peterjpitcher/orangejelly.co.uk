import { logStructuredDataValidation } from '@/lib/structured-data-validator';
import { getBaseUrl } from '@/lib/site-config';

interface BlogPostingSchemaProps {
  title: string;
  description: string;
  content: string;
  author: {
    name: string;
    url?: string;
  };
  datePublished: string;
  dateModified?: string;
  image: string;
  url: string;
  keywords?: string[];
  speakableSections?: string[]; // CSS selectors for speakable content
}

export function BlogPostingSchema({
  title,
  description,
  content,
  author,
  datePublished,
  dateModified,
  image,
  url,
  keywords = [],
  speakableSections = [],
}: BlogPostingSchemaProps) {
  const isAbsolute = (u: string) => /^https?:\/\//i.test(u);
  const site = getBaseUrl();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: {
      '@type': 'ImageObject',
      url: isAbsolute(image) ? image : `${site}${image}`,
      width: 1200,
      height: 630,
    },
    datePublished: datePublished,
    ...(dateModified && { dateModified: dateModified }),
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: isAbsolute(author.url) ? author.url : `${site}${author.url}` }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Orange Jelly Limited',
      logo: {
        '@type': 'ImageObject',
        url: `${site}/logo.png`,
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': isAbsolute(url) ? url : `${site}${url}`,
    },
    articleBody: content,
    ...(keywords.length > 0 && { keywords: keywords.join(', ') }),
    ...(speakableSections.length > 0 && {
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: speakableSections,
      },
    }),
  };

  // Validate in development
  if (process.env.NODE_ENV === 'development') {
    logStructuredDataValidation(schema, 'BlogPostingSchema');
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
