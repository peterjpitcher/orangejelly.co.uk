import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
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

  const hostname = url.hostname;
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const isProductionHost = hostname === 'orangejelly.co.uk' || hostname === canonicalHostname;
  const isGetOrHead = request.method === 'GET' || request.method === 'HEAD';

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
