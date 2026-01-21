import { type Metadata } from 'next';
import { getBaseUrl } from '@/lib/site-config';

interface MetaProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    creator?: string;
  };
  noindex?: boolean;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
}

const baseUrl = getBaseUrl();

export function generateMeta({
  title,
  description,
  canonical,
  keywords = [],
  ogImage = '/logo.png',
  ogType = 'website',
  article,
  twitter = {},
  noindex = false,
  alternates,
}: MetaProps): Metadata {
  const fullTitle = title.includes('Orange Jelly') ? title : `${title} | Orange Jelly`;
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : undefined;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      type: ogType,
      url: canonicalUrl,
      siteName: 'Orange Jelly',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_GB',
    },
    twitter: {
      card: twitter.card || 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: twitter.creator || '@orangejelly',
    },
    alternates: alternates || {
      canonical: canonicalUrl,
    },
    authors: [{ name: 'Peter Pitcher' }],
    publisher: 'Orange Jelly Limited',
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
  };

  // Add article-specific metadata
  if (ogType === 'article' && article) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: article.publishedTime,
      modifiedTime: article.modifiedTime,
      authors: article.author ? [article.author] : ['Peter Pitcher'],
      tags: article.tags,
    };
  }

  return metadata;
}

// Helper function for common page patterns
export function generatePageMeta(
  page: 'home' | 'services' | 'about' | 'contact' | 'results' | 'blog',
  overrides: Partial<MetaProps> = {}
): Metadata {
  const pageMeta: Record<string, MetaProps> = {
    home: {
      title: 'Orange Jelly - Hospitality Marketing Specialist for Pubs, Restaurants & Bars',
      description:
        'Hospitality marketing specialist leveraging AI to deliver great results for pubs, restaurants, and bars. Real operator experience, honest pricing at £75/hour. No packages, just results.',
      keywords: [
        'hospitality marketing specialist',
        'pub marketing',
        'restaurant marketing',
        'bar marketing',
        'AI hospitality marketing',
        'fill tables',
      ],
      canonical: '/',
    },
    services: {
      title: 'Hospitality Marketing Services - Fill Tables & Boost Revenue | Orange Jelly',
      description:
        'Proven hospitality marketing services from a real operator. Social media, events, menu design, business analysis. £75/hour plus VAT. No packages, pay for what you need.',
      keywords: [
        'hospitality marketing services',
        'pub marketing',
        'restaurant marketing',
        'bar marketing',
        'social media management',
        'event planning',
        'menu design',
      ],
      canonical: '/services',
    },
    about: {
      title: 'About Orange Jelly - Hospitality Marketing Specialist',
      description:
        'Meet Peter Pitcher, operator of The Anchor pub. Learn how AI-powered hospitality marketing drives results for pubs, restaurants, and bars.',
      keywords: [
        'Peter Pitcher',
        'The Anchor pub',
        'Orange Jelly story',
        'hospitality marketing specialist',
      ],
      canonical: '/about',
    },
    contact: {
      title: 'Contact Orange Jelly - Hospitality Marketing Help',
      description:
        'Contact Peter Pitcher directly. WhatsApp 07990 587315 or visit The Anchor pub. No call centres, just one operator helping another. Available 7 days.',
      keywords: ['contact Orange Jelly', 'Peter Pitcher contact', 'hospitality marketing help'],
      canonical: '/contact',
    },
    results: {
      title: 'Success Stories - Hospitality Marketing Results | Orange Jelly',
      description:
        'Real numbers from The Anchor: 25-30 quiz teams each month, £250/week waste cut, £4,000+ monthly savings. See what we changed and why it worked.',
      keywords: [
        'hospitality marketing results',
        'pub success stories',
        'restaurant marketing results',
        'bar marketing results',
        'increase revenue',
      ],
      canonical: '/results',
    },
    blog: {
      title: "Licensee's Guide - Practical Hospitality Marketing Tips | Orange Jelly",
      description:
        'Free pub marketing guides from a working licensee, with ideas you can adapt for restaurants and bars. Learn how to fill empty tables, compete with chains, and boost revenue.',
      keywords: [
        'pub marketing guide',
        'restaurant marketing',
        'bar marketing',
        'licensee tips',
        'pub business advice',
        'free pub marketing',
      ],
      canonical: '/licensees-guide',
    },
  };

  const baseMeta = pageMeta[page];
  return generateMeta({ ...baseMeta, ...overrides });
}
