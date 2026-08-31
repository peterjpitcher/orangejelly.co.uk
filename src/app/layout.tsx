import type { Metadata, Viewport } from 'next';
import { Fraunces, Open_Sans, Schibsted_Grotesk } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import MainGate from '@/components/MainGate';
import ErrorBoundary from '@/components/ErrorBoundary';
import { PreloadResources } from '@/components/PerformanceMonitor';
import { GoogleTagManager, GoogleTagManagerNoscript } from '@/components/GoogleTagManager';
import { CONTACT } from '@/lib/constants';
import { getBaseUrl } from '@/lib/site-config';
// Analytics, Speed Insights, the cookie notice and the marketing overlays are all
// rendered by MarketingChrome, which gates them on the pathname. They must NOT be
// imported directly here: poll URLs carry a bearer token in the path, and a
// third-party script on those routes hands the token to Google or Vercel.
// See src/components/engagement/MarketingChrome.tsx and its test.
import { MarketingChrome } from '@/components/engagement';

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

/*
 * The repositioning typeface. Added alongside Fraunces and Open Sans rather than
 * replacing them, so nothing changes until a component asks for --font-oj. The old
 * pair comes out when nothing references it, which is also what keeps /availability
 * and /admin on their current type while the marketing site moves.
 *
 * Loaded through next/font rather than the design bundle's runtime @import: the
 * bundle's `@import url(fonts.googleapis.com)` would add a render-blocking round
 * trip and a third-party request on every page, and next/font self-hosts the files
 * at build time. Weight 900 is the display face and is not optional.
 */
const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-oj',
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

/*
 * The site-wide default title and description.
 *
 * These are the fallback for any route that does not set its own, which makes them
 * the sentence the company is described by wherever nothing more specific exists.
 * They said "Transformative Hospitality Growth Partner" until the repositioning:
 * the sector is now one market Orange Jelly works in, not its definition.
 *
 * The title is deliberately the promise rather than a keyword string. The strongest
 * search term the research found is "hospitality marketing agency", and it lives on
 * the sector hub where it is still accurate, not in the company description.
 */
const SITE_TITLE = 'Orange Jelly | For owners ready to take control of growth.';
const SITE_DESCRIPTION =
  'Growth partner for ambitious small and mid-sized businesses. We get under the skin of a business, work out what is actually blocking growth, and build the thing that fixes it.';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
    url: baseUrl,
    locale: 'en_GB',
    siteName: 'Orange Jelly',
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Orange Jelly: for business owners ready to take control of growth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
  /*
   * Removed, deliberately, rather than repointed at the new filenames.
   *
   * These paths existed because `app/icon.tsx` and `app/apple-icon.tsx` generated
   * the icons at runtime, and a generated route has no extension. Both files are
   * gone: the favicon was white "OJ" letters drawn on the legacy navy, which is the
   * old identity, and it is the brand mark now. The replacements are static
   * `app/icon.png` and `app/apple-icon.png`, which Next finds by convention and
   * declares itself, with a content hash on the URL that a hand-written path cannot
   * carry. Writing the paths out again would 404, because the files now end in .png,
   * which is exactly what happened first time round.
   */
  // Next generates this from src/app/manifest.ts, which is why the path has no
  // extension. The hand-written public/manifest.json it replaced is deleted.
  manifest: '/manifest.webmanifest',
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
      'Growth partner for ambitious small and mid-sized businesses. Orange Jelly works out what is blocking growth and builds the fix, using marketing, commercial change, operations, systems and AI according to what the problem needs.',
    /*
     * The founder stays as a `founder` property and nothing more. D21 makes the
     * brand the company, and the previous entry described Peter as a hospitality
     * growth partner, which is both the old position and a description of the
     * company rather than the person.
     */
    founder: {
      '@type': 'Person',
      '@id': `${baseUrl}/#peter-pitcher`,
      name: 'Peter Pitcher',
      jobTitle: 'Founder',
    },
    foundingDate: '2019-03-05',
    areaServed: 'GB',
    /*
     * priceRange is deliberately absent. D3 took pricing off the site, and "££" is
     * a price signal that would contradict every page saying each engagement is
     * priced to the problem. Google treats it as optional for ProfessionalService.
     */
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `${CONTACT.phoneInternational}`,
      contactType: 'Customer Service',
      email: CONTACT.email,
      availableLanguage: 'English',
      contactOption: ['HearingImpairedSupported'],
      areaServed: 'GB',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'The Anchor, 20 High Street',
      addressLocality: 'Stanwell Moor',
      addressRegion: 'Staines',
      postalCode: 'TW19 6AQ',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.4583,
      longitude: -0.4867,
    },
    sameAs: ['https://www.the-anchor.pub'],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Orange Jelly',
    description: SITE_DESCRIPTION,
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: 'en-GB',
  };

  // No site-wide BreadcrumbList here. It could only ever contain "Home", which
  // carries no information, and emitting it on every page created a second (and on
  // guide pages a third) competing BreadcrumbList alongside the real per-page trail.
  // Breadcrumb schema is now emitted once, by the page that knows its own hierarchy.
  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema, websiteSchema],
  };

  return (
    <html lang="en-GB">
      <head>
        <PreloadResources />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${openSans.variable} ${schibstedGrotesk.variable} font-sans antialiased`}
      >
        <GoogleTagManager />
        <GoogleTagManagerNoscript />
        {/*
          Skip to main content link for keyboard navigation.

          Styled on the new system even though it sits above the route gate, for the
          same reason as the consent panel: it was `bg-orange` with `text-brand-base`,
          which is dark text on brand orange at 2.97:1, and it is the first thing a
          keyboard user ever sees. Deep orange carries white at 5.24:1.

          `font-oj` moved off the focus variant on 31 August 2026. It only applied
          once the link was focused, so the element sat in the old typeface the rest
          of the time. Invisible, and the last piece of the old identity anywhere on
          the site, which made it the one thing a sweep kept reporting.
        */}
        <Link
          href="#main-content"
          className="skip-to-main sr-only font-oj focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-flex focus:items-center focus:justify-center focus:rounded-oj focus:border-1.5 focus:border-oj-ink focus:bg-oj-orange-deep focus:px-6 focus:py-3 focus:font-bold focus:text-oj-on-band focus:shadow-press focus:outline-none focus:ring-2 focus:ring-oj-ink focus:ring-offset-2"
        >
          Skip to main content
        </Link>

        {/*
          No chrome here any more. Every page renders its own header, main and
          footer; `MainGate` is now only the typeface wrapper. See its comment.
        */}
        <ErrorBoundary>
          <MainGate>{children}</MainGate>
        </ErrorBoundary>
        <MarketingChrome />
      </body>
    </html>
  );
}
