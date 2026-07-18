import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenRoute } from '@/lib/token-routes';

// Old category slugs → new 8-category taxonomy
const LEGACY_CATEGORY_REDIRECTS: Record<string, string> = {
  'social-media': 'marketing',
  'customer-acquisition': 'marketing',
  'digital-reputation': 'marketing',
  communications: 'marketing',
  competition: 'marketing',
  'financial-management': 'revenue-growth',
  'menu-pricing': 'revenue-growth',
  sales: 'revenue-growth',
  analytics: 'revenue-growth',
  compliance: 'operations',
  'events-promotions': 'events',
  toolkits: 'events',
  'crisis-management': 'turnaround',
  'empty-pub-solutions': 'turnaround',
  community: 'turnaround',
  'supplier-relations': 'property',
  'location-challenges': 'property',
};

const RETIRED_CONTENT_PATHS = new Set([
  '/licensees-guide/README',
  '/licensees-guide/readme',
  // cash-flow-crisis-breaking-cycle now 301-redirects to /fix-my-pub (see next.config.js)
  // instead of returning 410, so it is intentionally no longer listed here.
]);

function normalizePathSegment(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function applySecurityHeaders(response: NextResponse, pathname: string) {
  // Security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Token routes get `no-referrer`; everything else keeps the site-wide default.
  //
  // `strict-origin-when-cross-origin` is fine for the rest of the site but is a
  // leak here, because it sends the FULL URL — path and all — on same-origin
  // navigations, and on these routes the path IS the credential. Anything that
  // reads Referer (an outbound link, an embedded resource, a proxy, an error
  // reporter) would receive the whole capability, and whoever holds
  // /availability/o/<token> is the organiser, permanently.
  response.headers.set(
    'Referrer-Policy',
    isTokenRoute(pathname) ? 'no-referrer' : 'strict-origin-when-cross-origin'
  );
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
      // challenges.cloudflare.com is Turnstile, used by the poll create form only.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://tagmanager.google.com https://www.clarity.ms https://scripts.clarity.ms https://vercel.live https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: https://www.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com",
      "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net https://vitals.vercel-insights.com https://vercel.live https://www.clarity.ms https://h.clarity.ms https://j.clarity.ms",
      // Turnstile renders its challenge in an iframe. Deliberately NOT added to
      // connect-src: the widget's own network calls originate inside that iframe
      // and are governed by Cloudflare's CSP, not ours, and siteverify is a
      // server-to-server call that no CSP applies to. Adding connect-src would
      // widen the policy for nothing.
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://challenges.cloudflare.com",
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

  // Captured before the redirect branches below mutate url.pathname. The
  // Referrer-Policy decision must be made on the path the client actually
  // requested, not on a rewritten target.
  const requestPathname = url.pathname;

  const hostname = url.hostname;
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const isProductionHost = hostname === 'orangejelly.co.uk' || hostname === canonicalHostname;
  const isGetOrHead = request.method === 'GET' || request.method === 'HEAD';

  if (isGetOrHead && RETIRED_CONTENT_PATHS.has(url.pathname)) {
    return applySecurityHeaders(new NextResponse('Gone', { status: 410 }), requestPathname);
  }

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
        return applySecurityHeaders(NextResponse.redirect(url, 308), requestPathname);
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
    return applySecurityHeaders(NextResponse.redirect(url, 301), requestPathname);
  }

  return applySecurityHeaders(NextResponse.next(), requestPathname);
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
