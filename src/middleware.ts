import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LEGACY_CATEGORY_REDIRECTS: Record<string, string> = {
  marketing: 'social-media',
  'supplier-relations': 'empty-pub-solutions',
  'financial-management': 'empty-pub-solutions',
  'crisis-management': 'empty-pub-solutions',
  'customer-acquisition': 'empty-pub-solutions',
  'location-challenges': 'empty-pub-solutions',
  'digital-reputation': 'social-media',
  events: 'events-promotions',
  'revenue-growth': 'sales',
};

function normalizePathSegment(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function applySecurityHeaders(response: NextResponse) {
  // Security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Note: FLoC is obsolete; use browsing-topics to opt-out of Topics API (Issue #21)
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  );

  // Strict Transport Security (HSTS) - only on production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Basic Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      // Use next/script and nonces in future to remove 'unsafe-inline'. Kept temporarily for GTM bootstrap.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://scripts.clarity.ms",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://vitals.vercel-insights.com https://www.clarity.ms https://h.clarity.ms https://j.clarity.ms",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      "media-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://wa.me",
      "frame-ancestors 'self'",
      'upgrade-insecure-requests',
    ].join('; ')
  );

  return response;
}

export function middleware(request: NextRequest) {
  const canonicalHostname = 'www.orangejelly.co.uk';
  const url = request.nextUrl.clone();
  const categoryPrefix = '/licensees-guide/category/';

  const hostname = url.hostname;
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const isProductionHost = hostname === 'orangejelly.co.uk' || hostname === canonicalHostname;
  const isGetOrHead = request.method === 'GET' || request.method === 'HEAD';

  if (isGetOrHead && url.pathname.startsWith(categoryPrefix)) {
    const categorySegment = url.pathname.slice(categoryPrefix.length);
    const hasNestedPath = categorySegment.includes('/');

    if (categorySegment && !hasNestedPath) {
      let decodedCategory = categorySegment;
      try {
        decodedCategory = decodeURIComponent(categorySegment);
      } catch {
        decodedCategory = categorySegment;
      }

      const normalizedCategory = normalizePathSegment(decodedCategory);
      const targetCategory = LEGACY_CATEGORY_REDIRECTS[normalizedCategory] || normalizedCategory;

      if (targetCategory && categorySegment !== targetCategory) {
        url.pathname = `${categoryPrefix}${targetCategory}`;
        return applySecurityHeaders(NextResponse.redirect(url, 308));
      }
    }
  }

  if (
    isGetOrHead &&
    isProductionHost &&
    (hostname !== canonicalHostname || forwardedProto === 'http')
  ) {
    url.hostname = canonicalHostname;
    url.protocol = 'https:';
    return applySecurityHeaders(NextResponse.redirect(url, 301));
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
