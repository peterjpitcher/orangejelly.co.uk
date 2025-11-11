import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import FooterWrapper from '@/components/FooterWrapper';
import NavigationWrapper from '@/components/NavigationWrapper';
import ErrorBoundary from '@/components/ErrorBoundary';
import PerformanceMonitor, { PreloadResources } from '@/components/PerformanceMonitor';
import { GoogleTagManager, GoogleTagManagerNoscript } from '@/components/GoogleTagManager';
import { CONTACT } from '@/lib/constants';
import { ROICalculatorProvider } from '@/contexts/ROICalculatorContext';
import { getBaseUrl } from '@/lib/site-config';
import CookieNotice from '@/components/CookieNotice';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'How to Fill Empty Pub Tables | Pub Marketing That Works | Orange Jelly',
  description:
    'How can I fill my empty pub tables? Orange Jelly provides AI-powered marketing tools that help UK licensees attract more customers. Save 5+ hours weekly with proven strategies from The Anchor pub owner. Menu optimization, social media automation, and more.',
  keywords:
    'pub AI tools, save time running pub, pub marketing help, menu writing service, Orange Jelly, Peter Pitcher, how to fill empty pub tables, pub marketing UK, automate pub social media',
  openGraph: {
    title: 'How to Fill Empty Pub Tables | Pub Marketing That Works | Orange Jelly',
    description:
      'Struggling with empty pub tables? We use AI-powered marketing strategies that transformed The Anchor. First pub chain training September 2025.',
    type: 'website',
    url: baseUrl,
    locale: 'en_GB',
    siteName: 'Orange Jelly',
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Orange Jelly — Pub marketing that works',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Fill Empty Pub Tables | Pub Marketing That Works | Orange Jelly',
    description:
      'Struggling with empty pub tables? AI-powered marketing tools for UK pubs. Save 5+ hours weekly.',
    images: [`${baseUrl}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
    shortcut: '/icon',
  },
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Simplified, performance-conscious schema.org structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${baseUrl}/#organization`,
    name: 'Orange Jelly Limited',
    alternateName: 'Orange Jelly',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
      width: 800,
      height: 800,
    },
    image: `${baseUrl}/logo.png`,
    description:
      'Struggling with empty pub tables? We use AI-powered marketing strategies that transformed The Anchor from struggling to thriving. From one licensee to another.',
    founder: {
      '@type': 'Person',
      '@id': `${baseUrl}/#peter-pitcher`,
      name: 'Peter Pitcher',
      jobTitle: 'Founder & AI Consultant',
      description:
        'Former struggling pub owner who discovered how AI could transform pub marketing. Now helps other licensees save time and fill empty tables.',
    },
    foundingDate: '2019',
    areaServed: 'GB',
    priceRange: '££',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `${CONTACT.phoneInternational}`,
      contactType: 'Customer Service',
      email: CONTACT.email,
      availableLanguage: 'English',
      contactOption: ['TollFree'],
      areaServed: 'GB',
    },
    sameAs: ['https://the-anchor.pub'],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Orange Jelly - Pub Marketing That Works',
    description:
      'Struggling with empty pub tables? We use AI-powered marketing strategies that transformed The Anchor from struggling to thriving. From one licensee to another.',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: 'en-GB',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
    ],
  };

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema, websiteSchema, breadcrumbSchema],
  };

  return (
    <html lang="en-GB">
      <head>
        <PreloadResources />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
        />
        <GoogleTagManager />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <GoogleTagManagerNoscript />
        {/* Skip to main content link for keyboard navigation */}
        <Link
          href="#main-content"
          className="skip-to-main sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-orange focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </Link>

        {/* Navigation only - SuperHeader removed for cleaner layout */}
        <NavigationWrapper />
        <ROICalculatorProvider>
          <ErrorBoundary>
            <main id="main-content" className="min-h-screen pt-16">
              {children}
            </main>
          </ErrorBoundary>
        </ROICalculatorProvider>
        <FooterWrapper />
        <PerformanceMonitor />
        <CookieNotice />
      </body>
    </html>
  );
}
