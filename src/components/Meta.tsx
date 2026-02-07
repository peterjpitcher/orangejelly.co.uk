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
      title: 'Orange Jelly - Transformative Hospitality Growth Partner',
      description:
        'Transformative, action-first marketing for hospitality partners. Practical systems that accelerate bookings, footfall, repeat visits, and revenue.',
      keywords: [
        'transformative hospitality marketing',
        'pub marketing',
        'bar marketing',
        'venue marketing',
        'AI-enabled marketing',
        'increase bookings',
      ],
      canonical: '/',
    },
    services: {
      title: 'Hospitality Growth Services | Orange Jelly',
      description:
        'Outcome-led hospitality growth support built for pubs, bars, restaurants, venues, hotels, and event spaces. Faster execution, smarter decisions, measurable outcomes.',
      keywords: [
        'hospitality growth programmes',
        'pub marketing',
        'bar marketing',
        'social media management',
        'event planning',
        'menu design',
      ],
      canonical: '/services',
    },
    about: {
      title: 'About Orange Jelly - Small Team, Transformative Growth Partner',
      description:
        'Meet Peter Pitcher, founder of Orange Jelly and co-owner of The Anchor. Learn how a small, hands-on team creates measurable hospitality growth.',
      keywords: [
        'Peter Pitcher',
        'The Anchor pub',
        'Orange Jelly story',
        'hospitality growth partner',
      ],
      canonical: '/about',
    },
    contact: {
      title: 'Contact Orange Jelly - Hospitality Marketing Help',
      description:
        'Contact Peter Pitcher directly for action-first hospitality growth support. WhatsApp 07990 587315 or visit The Anchor.',
      keywords: ['contact Orange Jelly', 'Peter Pitcher contact', 'hospitality marketing help'],
      canonical: '/contact',
    },
    results: {
      title: 'Success Stories - Hospitality Marketing Results | Orange Jelly',
      description:
        'Real numbers from The Anchor: 25-30 quiz teams each month, £250/week waste cut, £4,000+ monthly savings. See what changed and why it worked.',
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
