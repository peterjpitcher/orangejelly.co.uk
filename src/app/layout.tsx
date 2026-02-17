import type { Metadata, Viewport } from 'next';
import { Fraunces, Open_Sans } from 'next/font/google';
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

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  display: 'swap',
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
  title: 'Transformative Hospitality Growth Partner | Orange Jelly',
  description:
    'Orange Jelly accelerates hospitality growth with transformative, action-first marketing delivered by a small, hands-on team. Built for measurable gains in bookings, footfall, repeat visits, and revenue.',
  keywords:
    'transformative hospitality marketing, hospitality growth partner, small marketing team hospitality, action-first marketing, pub marketing, bar marketing, venue marketing, Orange Jelly',
  openGraph: {
    title: 'Transformative Hospitality Growth Partner | Orange Jelly',
    description:
      'Transformative, action-first marketing for hospitality partners. Small team support built to accelerate bookings, footfall, and revenue.',
    type: 'website',
    url: baseUrl,
    locale: 'en_GB',
    siteName: 'Orange Jelly',
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Orange Jelly — Hospitality marketing that works',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transformative Hospitality Growth Partner | Orange Jelly',
    description:
      'Transformative, action-first marketing for hospitality partners. Small team support built to accelerate bookings, footfall, and revenue.',
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
      'Transformative marketing partner for hospitality businesses. We combine proactive growth strategy, AI-enabled delivery, and practical systems to create measurable uplift in bookings, visibility, repeat visits, and revenue.',
    founder: {
      '@type': 'Person',
      '@id': `${baseUrl}/#peter-pitcher`,
      name: 'Peter Pitcher',
      jobTitle: 'Founder & Hospitality Growth Partner',
      description:
        'Hospitality growth partner focused on transformative, action-first marketing for pubs, bars, restaurants, venues, hotels, and event spaces. Owner of The Anchor and founder of Orange Jelly.',
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
    sameAs: ['https://www.the-anchor.pub'],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Orange Jelly - Transformative Hospitality Marketing',
    description:
      'Transformative hospitality marketing built to accelerate bookings, footfall, repeat visits, and revenue.',
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
      <body className={`${fraunces.variable} ${openSans.variable} font-sans antialiased`}>
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
            <main id="main-content" className="min-h-screen">
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
