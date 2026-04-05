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
      // All service sub-pages → /capabilities
      {
        source: '/services/instagram-services-for-pubs',
        destination: '/capabilities',
        permanent: true,
      },
      {
        source: '/services/facebook-services-for-pubs',
        destination: '/capabilities',
        permanent: true,
      },
      {
        source: '/services/paid-social-for-pubs',
        destination: '/capabilities',
        permanent: true,
      },
      {
        source: '/services/content-creation-for-pubs',
        destination: '/capabilities',
        permanent: true,
      },
      {
        source: '/services/social-media-marketing-for-pubs',
        destination: '/capabilities',
        permanent: true,
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
