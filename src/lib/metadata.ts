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
  ogImage = '/images/og-default.jpg',
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
      'Transformative, action-first marketing for hospitality partners. Practical systems that accelerate bookings, footfall, repeat visits, and revenue.',
    path: '/',
    ogType: 'website',
    ogImage: '/images/og-default.jpg', // Standard OG image for non-article pages
  };

  return generateMetadata({ ...defaults, ...overrides });
}

// Helper for page-specific metadata
export const pageMetadata = {
  home: {
    title: 'Transformative Hospitality Growth Partner for Pubs, Bars & Venues',
    description:
      'Orange Jelly accelerates hospitality growth with proactive strategy, AI-enabled delivery, and measurable commercial outcomes. Small team. Big momentum.',
    keywords:
      'transformative hospitality marketing, pub marketing UK, bar marketing, venue marketing, increase bookings, commercial growth',
  },
  services: {
    title: 'Hospitality Growth Services | Orange Jelly',
    description:
      'Outcome-led hospitality growth support built for pubs, bars, restaurants, venues, hotels, and event spaces. Faster execution, clearer priorities, measurable improvement.',
    keywords:
      'hospitality growth programmes, pub marketing services, bar marketing, venue marketing, social media systems',
  },
  results: {
    title: 'Hospitality Marketing Success Stories | Real Results',
    description:
      'See measurable outcomes from The Anchor and partner venues. Action-first systems focused on bookings, footfall, and repeat visits.',
    keywords:
      'hospitality marketing results, pub success stories, restaurant marketing results, bar marketing results',
  },
  about: {
    title: 'About Orange Jelly | Small Team, Transformative Growth Partner',
    description:
      'Meet Peter Pitcher, founder of Orange Jelly and co-owner of The Anchor. Learn how a small, hands-on team helps hospitality partners grow through challenging trading conditions.',
    keywords:
      'Orange Jelly, hospitality growth partner, Peter Pitcher, The Anchor Stanwell Moor, pub marketing, bar marketing',
  },
  contact: {
    title: 'Contact Orange Jelly | Hospitality Marketing Help',
    description:
      'Talk to Orange Jelly about your biggest growth bottleneck and get an action-first plan for bookings, footfall, and repeat visits.',
    keywords:
      'contact hospitality marketing, pub marketing consultation, restaurant marketing help, bar marketing help UK',
  },
};
