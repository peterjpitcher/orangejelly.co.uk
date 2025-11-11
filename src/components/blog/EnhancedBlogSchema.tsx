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
}

export default function EnhancedBlogSchema({ post, baseUrl }: EnhancedBlogSchemaProps) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `${baseUrl}/licensees-guide/${post.slug}`,
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
        url: `${baseUrl}/images/logo.png`,
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

  // HowTo schema if the title suggests it's a guide
  const isHowTo =
    post.title.toLowerCase().includes('how to') || post.title.toLowerCase().includes('guide');

  const howToSchema =
    isHowTo && post.quickAnswer
      ? {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: post.title,
          description: post.excerpt,
          totalTime: 'PT10M', // Estimate based on implementation
          supply: [],
          tool: [],
          step: [
            {
              '@type': 'HowToStep',
              name: 'Quick Solution',
              text: post.quickAnswer,
            },
          ],
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
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema),
          }}
        />
      )}
    </>
  );
}
