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
      // Retired guide previously served 410; 301 to the closest live page (rescue/turnaround)
      // to preserve any link equity for the struggling-pub intent.
      {
        source: '/licensees-guide/cash-flow-crisis-breaking-cycle',
        destination: '/fix-my-pub',
        permanent: true,
      },
      // Service sub-pages are reinstated (D1): content-creation, paid-social and
      // social-media-marketing serve their own pages. instagram/facebook are folded
      // into the social-media hub here at the config level — the previous page-level
      // permanentRedirect() no-ops on the statically-rendered route, so both URLs were
      // served as 200s that canonicalised to the homepage while still ranking pos 6-7.
      {
        source: '/services/instagram-services-for-pubs',
        destination: '/services/social-media-marketing-for-pubs',
        permanent: true,
      },
      {
        source: '/services/facebook-services-for-pubs',
        destination: '/services/social-media-marketing-for-pubs',
        permanent: true,
      },
      // Slug rename never got a redirect: the -uk variant 404s while the -guide slug is live.
      {
        source: '/licensees-guide/pub-wages-labour-costs-uk',
        destination: '/licensees-guide/pub-wages-labour-costs-guide',
        permanent: true,
      },
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
      // Greene King Christmas toolkit QR → tracked Christmas hub (temporary so it can be repointed each year).
      {
        source: '/christmas',
        destination:
          '/licensees-guide/christmas-pub-event-ideas?utm_source=greene-king&utm_medium=print-toolkit&utm_campaign=christmas-2026',
        permanent: false,
      },
      // BII (British Institute of Innkeeping) summer feature QR → tracked summer hub (temporary so it can be repointed each year).
      {
        source: '/summer',
        destination:
          '/licensees-guide/summer-pub-marketing?utm_source=bii&utm_medium=print-magazine&utm_campaign=summer-2026',
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
