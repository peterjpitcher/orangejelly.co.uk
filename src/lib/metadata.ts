import { type Metadata } from 'next';
import { getBaseUrl } from './site-config';
import { seoOverrides } from './seo-overrides';

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
          width: 1200,
          height: 630,
          alt: resolvedTitle,
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
      description: resolvedDescription,
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
    ogImage: '/images/og-default.jpg', // Standard OG image for non-article pages
  };

  return generateMetadata({ ...defaults, ...overrides });
}
