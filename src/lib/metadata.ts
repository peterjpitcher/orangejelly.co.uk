import { type Metadata } from 'next';
import { getBaseUrl } from './site-config';

interface GenerateMetadataProps {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  ogImage?: string;
  noIndex?: boolean;
  ogType?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export function generateMetadata({
  title,
  description,
  path,
  keywords,
  ogImage = '/logo.png',
  noIndex = false,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
}: GenerateMetadataProps): Metadata {
  const baseUrl = getBaseUrl();

  // Normalize path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const cleanPath = normalizedPath === '/' ? normalizedPath : normalizedPath.replace(/\/$/, '');

  const canonicalUrl = `${baseUrl}${cleanPath}`;
  const fullTitle = `${title} | Orange Jelly`;

  return {
    title: fullTitle,
    description,
    keywords,
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'Orange Jelly',
      type: ogType,
      locale: 'en_GB',
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && {
        authors: [author],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-GB': canonicalUrl,
        'x-default': canonicalUrl,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'format-detection': 'telephone=no',
    },
  };
}

// Static metadata generator with sensible defaults
export function generateStaticMetadata(overrides: Partial<GenerateMetadataProps> = {}): Metadata {
  const defaults: GenerateMetadataProps = {
    title: 'Orange Jelly',
    description:
      'AI-powered hospitality marketing for UK pubs, restaurants, and bars from real operators who understand your challenges.',
    path: '/',
    ogType: 'website',
    ogImage: '/images/og-default.jpg', // Standard OG image for non-article pages
  };

  return generateMetadata({ ...defaults, ...overrides });
}

// Helper for page-specific metadata
export const pageMetadata = {
  home: {
    title: 'Hospitality Marketing Specialist for Pubs, Restaurants & Bars',
    description:
      'Hospitality marketing specialist leveraging AI to deliver great results for pubs, restaurants, and bars. Proven at The Anchor.',
    keywords:
      'hospitality marketing specialist, pub marketing UK, restaurant marketing, bar marketing, fill tables, increase bookings',
  },
  services: {
    title: 'Hospitality Marketing Services | Fill Tables & Boost Revenue',
    description:
      'Proven hospitality marketing services that fill empty tables. Menu optimization, social media automation, website design. From real operators who understand your challenges.',
    keywords:
      'hospitality marketing services, pub marketing, restaurant marketing, bar marketing, social media management',
  },
  results: {
    title: 'Hospitality Marketing Success Stories | Real Results',
    description:
      'See how we helped pubs, restaurants, and bars increase covers with proven marketing strategies. Real results, real testimonials, real revenue growth.',
    keywords:
      'hospitality marketing results, pub success stories, restaurant marketing results, bar marketing results',
  },
  about: {
    title: 'About Orange Jelly | Hospitality Marketing Specialist',
    description:
      'Meet Peter Pitcher, owner of The Anchor pub and founder of Orange Jelly. Learn how AI-powered marketing helps pubs, restaurants, and bars thrive.',
    keywords:
      'Orange Jelly, hospitality marketing specialist, Peter Pitcher, The Anchor Stanwell Moor, pub marketing, restaurant marketing',
  },
  contact: {
    title: 'Contact Orange Jelly | Hospitality Marketing Help',
    description:
      'Ready to fill your tables? Contact Orange Jelly for a free chat about your hospitality marketing challenges. Real advice from a real operator.',
    keywords:
      'contact hospitality marketing, pub marketing consultation, restaurant marketing help, bar marketing help UK',
  },
};
