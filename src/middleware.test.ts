import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from './middleware';

/**
 * C3 — Referrer-Policy on token routes.
 *
 * Poll tokens are capability URLs carried in the path. The site-wide default,
 * `strict-origin-when-cross-origin`, sends the FULL URL on same-origin
 * navigations, so anything that reads Referer would receive the whole capability.
 * These assertions pin the override AND pin the default, because loosening the
 * rest of the site would be just as much of a regression as failing to tighten
 * these routes.
 */

const TOKEN = '0123456789abcdef0123456789abcdef';

function requestFor(pathname: string): NextRequest {
  return new NextRequest(new URL(`https://www.orangejelly.co.uk${pathname}`), { method: 'GET' });
}

describe('Referrer-Policy', () => {
  it.each([
    ['organiser', `/availability/o/${TOKEN}`],
    ['participant', `/availability/p/${TOKEN}`],
    ['verify', `/availability/verify/${TOKEN}`],
  ])('should be no-referrer on the %s token route', (_label, pathname) => {
    const response = middleware(requestFor(pathname));
    expect(response.headers.get('Referrer-Policy')).toBe('no-referrer');
  });

  it.each([['/'], ['/contact'], ['/licensees-guide/some-article'], ['/availability/new']])(
    'should keep the site-wide default on %s',
    (pathname) => {
      const response = middleware(requestFor(pathname));
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    }
  );

  it('should be no-referrer on a token route that also redirects', () => {
    // The redirect branches mutate url.pathname, so the policy must be decided on
    // the path the client actually asked for, not the rewritten target.
    const request = new NextRequest(new URL(`http://orangejelly.co.uk/availability/o/${TOKEN}`), {
      method: 'GET',
    });
    const response = middleware(request);
    expect(response.status).toBe(301);
    expect(response.headers.get('Referrer-Policy')).toBe('no-referrer');
  });
});

describe('Content-Security-Policy', () => {
  it('should allow Turnstile in script-src and frame-src', () => {
    const csp = middleware(requestFor('/availability/new')).headers.get('Content-Security-Policy');
    const directives = Object.fromEntries(
      (csp ?? '').split('; ').map((directive) => {
        const [name, ...values] = directive.split(' ');
        return [name, values];
      })
    );

    expect(directives['script-src']).toContain('https://challenges.cloudflare.com');
    expect(directives['frame-src']).toContain('https://challenges.cloudflare.com');
  });

  it('should not add Turnstile to connect-src', () => {
    // The widget's own calls originate inside its iframe, governed by
    // Cloudflare's CSP, and siteverify is server-to-server. Adding connect-src
    // would widen the policy for nothing.
    const csp = middleware(requestFor('/availability/new')).headers.get('Content-Security-Policy');
    const connectSrc = (csp ?? '').split('; ').find((d) => d.startsWith('connect-src'));

    expect(connectSrc).toBeDefined();
    expect(connectSrc).not.toContain('challenges.cloudflare.com');
  });

  it('should keep the existing security headers unweakened', () => {
    const headers = middleware(requestFor('/')).headers;

    expect(headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(headers.get('Content-Security-Policy')).toContain("default-src 'self'");
    expect(headers.get('Content-Security-Policy')).toContain("object-src 'none'");
    expect(headers.get('Content-Security-Policy')).toContain("frame-ancestors 'self'");
  });
});
