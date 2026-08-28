import React from 'react';

interface EnhancedBlogSchemaProps {
  post: {
    title: string;
    excerpt: string;
    slug: string;
    publishedDate: string;
    updatedDate?: string;
    author?: {
      name: string;
    };
    quickAnswer?: string;
    faqs?: Array<{
      question: string;
      answer: string;
    }>;
    localSEO?: {
      targetLocation?: string;
      title?: string;
      description?: string;
      keywords?: string[];
    };
    voiceSearchQueries?: string[];
  };
  baseUrl: string;
  /**
   * Absolute URL of an image that actually resolves. Google lists `image` as a
   * recommended property on Article/BlogPosting and uses it for rich results, so
   * omitting it left every guide ineligible for image-bearing article treatment.
   */
  imageUrl?: string;
}

export default function EnhancedBlogSchema({ post, baseUrl, imageUrl }: EnhancedBlogSchemaProps) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `${baseUrl}/licensees-guide/${post.slug}`,
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: 1600,
        height: 900,
      },
    }),
    datePublished: post.publishedDate,
    dateModified: post.updatedDate || post.publishedDate,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Peter Pitcher',
      url: `${baseUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Orange Jelly Limited',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/licensees-guide/${post.slug}`,
    },
    // Add speakable for voice search optimization
    ...(post.quickAnswer && {
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.quick-answer'],
        xpath: ['//*[@class="quick-answer"]'],
      },
    }),
    // Add location for local SEO
    ...(post.localSEO?.targetLocation && {
      locationCreated: {
        '@type': 'Place',
        name: post.localSEO.targetLocation,
      },
    }),
    ...(post.localSEO?.targetLocation && {
      spatialCoverage: {
        '@type': 'Place',
        name: post.localSEO.targetLocation,
      },
    }),
    ...(post.localSEO?.keywords &&
      post.localSEO.keywords.length > 0 && {
        about: post.localSEO.keywords.map((keyword) => ({
          '@type': 'Thing',
          name: keyword,
        })),
      }),
    // Add voice search queries as keywords
    ...(post.voiceSearchQueries && {
      keywords: post.voiceSearchQueries.join(', '),
    }),
  };

  // Separate FAQ schema if FAQs exist
  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}
    </>
  );
}
