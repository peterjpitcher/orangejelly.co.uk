import { type Metadata } from 'next';
import { getBaseUrl } from './site-config';
import { seoOverrides } from './seo-overrides';
import { DEFAULT_SHARE_IMAGE, SHARE_CARD_SIZE } from './share-card/constants';

interface GenerateMetadataProps {
  title: string;
  description: string;
  path: string;
  /** A share card route. Declared as 1200 by 1200, so it has to be one of the square cards. */
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
  ogImage = DEFAULT_SHARE_IMAGE.url,
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

  // App pages can be centrally overridden via seo-overrides.ts (same source the
  // blog route uses). When an override exists, its title is used as-is (no brand
  // suffix) to match the blog and avoid double-branding.
  const override = seoOverrides[cleanPath];
  const resolvedTitle = override?.title || title;
  const resolvedDescription = override?.description || description;
  const canonicalUrl = override?.canonical || `${baseUrl}${cleanPath}`;
  const fullTitle = override?.title ? override.title : `${title} | Orange Jelly`;

  return {
    title: fullTitle,
    description: resolvedDescription,
    openGraph: {
      title: fullTitle,
      description: resolvedDescription,
      url: canonicalUrl,
      siteName: 'Orange Jelly',
      type: ogType,
      locale: 'en_GB',
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
          ...SHARE_CARD_SIZE,
          type: 'image/png',
          alt: resolvedTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && {
        authors: [author],
      }),
    },
    // No `images`: Next.js fills twitter:image from og:image when the twitter block has none.
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: resolvedDescription,
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
  };

  return generateMetadata({ ...defaults, ...overrides });
}

// Helper for page-specific metadata
export const pageMetadata = {
  home: {
    title: 'Hospitality Marketing That Fills Seats | From a Real Publican',
    description:
      'Hospitality marketing proven at a real pub. We grew table bookings 403% and food revenue 98% at The Anchor. Packages from £375 + VAT.',
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
    title: 'Hospitality Consultant: Meet the Team Behind Orange Jelly',
    description:
      'Meet Peter Pitcher, hospitality consultant and founder, who runs The Anchor in Stanwell Moor. Hands-on, action-first marketing help for UK pubs and venues.',
  },
  contact: {
    title: 'Contact Us - Speak Directly with Peter',
    description:
      'Speak directly with Peter Pitcher about action-first marketing for your hospitality business. Small team, direct support. WhatsApp or call 07990 587315.',
  },
};
