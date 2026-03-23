import { type Metadata } from 'next';
import { getBaseUrl } from './site-config';

interface GenerateMetadataProps {
  title: string;
  description: string;
  path: string;
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
  },
  services: {
    title: 'Hospitality Growth Services for Pubs & Venues',
    description:
      'Action-first growth services for hospitality partners: event innovation, marketing systems, simplified tools, and clarity that unlocks momentum.',
  },
  results: {
    title: 'Hospitality Marketing Results for Pubs & Venues',
    description:
      'See hospitality marketing results proven at The Anchor, then adapted for partners. Real numbers, real strategies, measurable growth.',
  },
  about: {
    title: 'About Us - Small Team, Transformative Growth',
    description:
      'Meet Peter Pitcher, founder of Orange Jelly and co-owner of The Anchor. A small, hands-on team helping hospitality partners grow through tough trading conditions.',
  },
  contact: {
    title: 'Contact Us - Speak Directly with Peter',
    description:
      'Speak directly with Peter Pitcher about action-first marketing for your hospitality business. Small team, direct support. WhatsApp or call 07990 587315.',
  },
};
