const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      // Old /services hub → new /ways-to-work
      {
        source: '/services',
        destination: '/ways-to-work',
        permanent: true,
      },
      // Service sub-pages are reinstated (D1): content-creation, paid-social and
      // social-media-marketing serve their own pages; instagram/facebook resolve
      // via their page-level redirect to /services/social-media-marketing-for-pubs.
      // Cannibalisation merges (D2): thin/duplicate posts 301'd to the stronger page.
      {
        source: '/licensees-guide/beat-chain-pubs',
        destination: '/licensees-guide/compete-with-wetherspoons',
        permanent: true,
      },
      {
        source: '/licensees-guide/local-pub-marketing',
        destination: '/pub-marketing',
        permanent: true,
      },
      {
        source: '/licensees-guide/fill-empty-seats-midweek-offers',
        destination: '/licensees-guide/fill-empty-pub-tables',
        permanent: true,
      },
      {
        source: '/licensees-guide/crisis-pr-landlords-bad-reviews',
        destination: '/licensees-guide/terrible-online-reviews-damage-control',
        permanent: true,
      },
      // Slug rename: narrow Friday-fizz post broadened into the pop-up pillar.
      {
        source: '/licensees-guide/fizz-street-food-pop-up',
        destination: '/licensees-guide/pop-up-events-for-pubs',
        permanent: true,
      },
      // Greene King autumn toolkit QR → tracked autumn hub (temporary so it can be repointed each year).
      {
        source: '/autumn',
        destination:
          '/licensees-guide/autumn-pub-event-ideas?utm_source=greene-king&utm_medium=print-toolkit&utm_campaign=autumn-2026',
        permanent: false,
      },
    ];
  },
  // Page-level security headers are in src/middleware.ts.
  // API routes are excluded from middleware, so apply key headers here.
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
