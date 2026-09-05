import { describe, it, expect, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from './middleware';
import {
  generateStaticParams as caseStudyParams,
  dynamicParams as caseStudyDynamicParams,
} from './app/results/[slug]/page';
import {
  generateStaticParams as growthProblemParams,
  dynamicParams as growthProblemDynamicParams,
} from './app/growth-problems/[slug]/page';
import { CASE_STUDIES } from './app/results/case-studies';
import { GROWTH_PROBLEMS } from './app/growth-problems/content';

/**
 * C3: Referrer-Policy on token routes.
 *
 * Poll tokens are capability URLs carried in the path. The site-wide default,
 * `strict-origin-when-cross-origin`, sends the FULL URL on same-origin
 * navigations, so anything that reads Referer would receive the whole capability.
 * These assertions pin the override AND pin the default, because loosening the
 * rest of the site would be just as much of a regression as failing to tighten
 * these routes.
 */

const TOKEN = '0123456789abcdef0123456789abcdef';

// Captured before any test stubs it, so the restore in afterEach puts back the real
// value rather than a previously stubbed one.
const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

function requestFor(pathname: string, method = 'GET'): NextRequest {
  return new NextRequest(new URL(`https://www.orangejelly.co.uk${pathname}`), { method });
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

  it.each([['/'], ['/contact'], ['/guides/some-article'], ['/availability/new']])(
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

/**
 * P5: /dev in production.
 *
 * The component harness answered HTTP 200 in production, carrying the root loading
 * fallback, because src/app/loading.tsx wraps every route in a Suspense boundary and
 * Next 14 flushes that shell with a 200 before the page component runs. The page's own
 * notFound() therefore never sets a status, however correct it is about what to render.
 * Middleware runs before rendering begins, so this is where the status is decided.
 */
describe('/dev guard', () => {
  afterEach(() => {
    vi.stubEnv('NODE_ENV', ORIGINAL_NODE_ENV ?? 'test');
  });

  it.each([['GET'], ['HEAD'], ['POST']])(
    'should return 404 for a %s request to /dev/components in production',
    (method) => {
      vi.stubEnv('NODE_ENV', 'production');

      // Deliberately not gated on GET or HEAD, unlike the retired-content and
      // canonical-host branches: a development-only path serves nothing in production
      // whatever the method.
      expect(middleware(requestFor('/dev/components', method)).status).toBe(404);
    }
  );

  it.each([['/dev'], ['/dev/'], ['/dev/components'], ['/dev/components/anything']])(
    'should return 404 for %s in production',
    (pathname) => {
      vi.stubEnv('NODE_ENV', 'production');

      expect(middleware(requestFor(pathname)).status).toBe(404);
    }
  );

  it('should return the 404 through applySecurityHeaders, not as a bare response', () => {
    vi.stubEnv('NODE_ENV', 'production');

    const response = middleware(requestFor('/dev/components'));

    expect(response.status).toBe(404);
    expect(response.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
  });

  it('should leave /dev/components alone in development', () => {
    // This is the proof that the guard does not cost local access to the harness.
    vi.stubEnv('NODE_ENV', 'development');

    expect(middleware(requestFor('/dev/components')).status).toBe(200);
  });

  it.each([['/development-plan'], ['/devon']])('should not match %s in production', (pathname) => {
    // The match is on a segment boundary. A bare startsWith('/dev') would take both
    // of these down with it.
    vi.stubEnv('NODE_ENV', 'production');

    expect(middleware(requestFor(pathname)).status).toBe(200);
  });
});

/**
 * Guide category legacy slugs.
 *
 * This branch had no test at all until 5 September 2026, and it is the only thing
 * keeping /guides/category/social-media and its sixteen siblings alive. The route
 * itself does not close its params, precisely so this redirect stays reachable, so
 * losing the middleware branch would turn every legacy category URL into a 404.
 */
describe('guide category redirects', () => {
  it.each([
    ['/guides/category/social-media', '/guides/category/marketing'],
    ['/guides/category/menu-pricing', '/guides/category/revenue-growth'],
    ['/guides/category/crisis-management', '/guides/category/turnaround'],
    ['/guides/category/supplier-relations', '/guides/category/property'],
  ])('should 308 %s to %s', (from, to) => {
    const response = middleware(requestFor(from));

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe(`https://www.orangejelly.co.uk${to}`);
  });

  it.each([['/guides/category/marketing'], ['/guides/category/revenue-growth']])(
    'should not redirect the canonical category %s',
    (pathname) => {
      const response = middleware(requestFor(pathname));

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    }
  );
});

/**
 * P4: the two closed-set dynamic routes.
 *
 * A unit test cannot prove a status code that Next assigns at routing time, so this
 * asserts the two things that are testable here: the params are a closed set, and
 * dynamicParams is exported as false so an unknown slug never reaches the renderer.
 * The live 404 is proved by the synthetic check against the deployment.
 *
 * These live in the middleware test file because the two are one fix: middleware
 * handles /dev, dynamicParams handles the slug routes, and both exist because a
 * render-time notFound() cannot set a status on this site.
 */
describe('closed dynamic route params', () => {
  it('should close /results/[slug] to the case studies that exist', () => {
    expect(caseStudyDynamicParams).toBe(false);
    expect(caseStudyParams().map((param) => param.slug)).toEqual(
      CASE_STUDIES.map((study) => study.slug)
    );
    expect(caseStudyParams().length).toBeGreaterThan(0);
  });

  it('should close /growth-problems/[slug] to the problems that exist', () => {
    expect(growthProblemDynamicParams).toBe(false);
    expect(growthProblemParams().map((param) => param.slug)).toEqual(
      GROWTH_PROBLEMS.map((problem) => problem.slug)
    );
    expect(growthProblemParams().length).toBeGreaterThan(0);
  });

  it.each([
    ['/results', 'no-such-case-study'],
    ['/growth-problems', 'no-such-problem'],
  ])('should not include the %s probe slug used by the live check', (base, slug) => {
    // WS4 asserts 404 on these two URLs in production. If somebody ever publishes a
    // case study or a growth problem under one of those slugs, the live check would
    // start failing for a reason that has nothing to do with soft 404s.
    const slugs =
      base === '/results'
        ? caseStudyParams().map((param) => param.slug)
        : growthProblemParams().map((param) => param.slug);

    expect(slugs).not.toContain(slug);
  });
});
