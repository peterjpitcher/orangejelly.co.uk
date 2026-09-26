import { type Metadata } from 'next';
import { getBaseUrl } from './site-config';
import { seoOverrides } from './seo-overrides';
import { DEFAULT_SHARE_IMAGE, SHARE_CARD_SIZE } from './share-card/constants';

interface GenerateMetadataProps {
  title: string;
  description: string;
  path: string;
  /**
   * A share card route, declared as 1200 by 1200, so it has to be one of the square cards.
   * Leave it out for the default card, which carries the version that busts caches.
   */
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
  ogImage,
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
        ogImage
          ? {
              url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
              ...SHARE_CARD_SIZE,
              type: 'image/png',
              alt: resolvedTitle,
            }
          : DEFAULT_SHARE_IMAGE,
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

// Static metadata generator with sensible defaults. The description has no default:
// every page says what it is, so a missing one fails the type check rather than
// falling back to generic copy.
export function generateStaticMetadata(
  overrides: Partial<GenerateMetadataProps> & Pick<GenerateMetadataProps, 'description'>
): Metadata {
  const defaults: Omit<GenerateMetadataProps, 'description'> = {
    title: 'Orange Jelly',
    path: '/',
    ogType: 'website',
  };

  return generateMetadata({ ...defaults, ...overrides });
}
