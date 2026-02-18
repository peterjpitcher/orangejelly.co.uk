import { type MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/admin/',
        '/private/',
        '/search-index.json',
        '/icon',
        '/apple-icon',
        '/opengraph-image',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
