import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { readFileSync } from 'fs';
import path from 'path';

/**
 * C4 — proof that no third-party request fires on a token route.
 *
 * Poll URLs carry a bearer token in the path. Vercel Analytics and GTM both report
 * the raw path, so an ungated third-party script on those routes hands the poll's
 * own access token to Google or Vercel, and anyone with analytics access could
 * then act as that poll's organiser. Referrer-Policy does not help — this
 * JavaScript reads window.location directly.
 *
 * Two assertions, because they fail in different ways:
 *   1. BEHAVIOURAL — render the chrome on a token route and assert nothing
 *      third-party reaches the DOM, while proving the same components DO render on
 *      a marketing route (so a gate that simply disabled everything would fail).
 *   2. STRUCTURAL — assert the root layout never imports a third-party script
 *      directly. This is the regression that would otherwise reappear silently:
 *      someone adds `<Analytics />` back to layout.tsx and every behavioural test
 *      here still passes, because they test a component the layout stopped using.
 */

/** Every third-party host the layout is capable of reaching. */
const THIRD_PARTY_HOSTS = [
  'googletagmanager.com',
  'google-analytics.com',
  'clarity.ms',
  'vercel-insights.com',
  'vercel-scripts.com',
  'vitals.vercel-insights.com',
  'doubleclick.net',
  'gstatic.com',
];

const TOKEN_ROUTE = '/availability/o/0123456789abcdef0123456789abcdef';
const PARTICIPANT_ROUTE = '/availability/p/0123456789abcdef0123456789abcdef';
const VERIFY_ROUTE = '/availability/verify/0123456789abcdef0123456789abcdef';
const MARKETING_ROUTE = '/licensees-guide/some-article';

const pathnameMock = vi.fn<[], string>(() => MARKETING_ROUTE);

vi.mock('next/navigation', () => ({
  usePathname: () => pathnameMock(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// next/script is what GTM uses; render it as a real script tag so the assertion
// sees what the browser would. `async` mirrors how these actually load and keeps
// Next's no-sync-scripts rule satisfied.
vi.mock('next/script', () => ({
  default: ({ src, id }: { src?: string; id?: string }) =>
    src ? <script data-testid={id} src={src} async /> : <script data-testid={id} />,
}));

// The real Vercel components are inert in jsdom, so stand them up as the network
// calls they actually make. Without this the test would pass for the wrong reason.
vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => (
    <script data-testid="vercel-analytics" src="https://va.vercel-scripts.com/v1/script.js" async />
  ),
}));
vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => (
    <script
      data-testid="vercel-speed-insights"
      src="https://vitals.vercel-insights.com/v1/vitals.js"
      async
    />
  ),
}));

import MarketingChrome from './MarketingChrome';
import { GoogleTagManager, GoogleTagManagerNoscript } from '@/components/GoogleTagManager';
import { PreloadResources } from '@/components/PerformanceMonitor';

/** Every URL the rendered markup would cause the browser to contact. */
function externalUrlsIn(html: string): string[] {
  return Array.from(html.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)).map((match) => match[1]);
}

function renderAllLayoutChrome(): string {
  // Everything the root layout renders that is capable of a third-party request.
  const { container } = render(
    <>
      <PreloadResources />
      <GoogleTagManager />
      <GoogleTagManagerNoscript />
      <MarketingChrome />
    </>
  );
  return container.innerHTML;
}

/**
 * This jsdom build has no localStorage, which CookieNotice reads on mount. Only
 * the marketing-route cases reach it — on a token route the gate stops it mounting
 * at all, which is itself a small confirmation the gate works.
 */
function stubLocalStorage(): void {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
  });
}

describe('third-party scripts on token routes', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_GTM_ID', 'GTM-TEST123');
    pathnameMock.mockReturnValue(MARKETING_ROUTE);
    stubLocalStorage();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it.each([
    ['organiser', TOKEN_ROUTE],
    ['participant', PARTICIPANT_ROUTE],
    ['verify', VERIFY_ROUTE],
    ['create form', '/availability/new'],
  ])('should fire no third-party request when rendering the %s route', (_label, route) => {
    pathnameMock.mockReturnValue(route);

    const html = renderAllLayoutChrome();
    const externalUrls = externalUrlsIn(html);

    expect(externalUrls).toEqual([]);
    for (const host of THIRD_PARTY_HOSTS) {
      expect(html).not.toContain(host);
    }
  });

  it('should never embed the token in the rendered chrome when on a token route', () => {
    pathnameMock.mockReturnValue(TOKEN_ROUTE);

    expect(renderAllLayoutChrome()).not.toContain('0123456789abcdef');
  });

  it('should still load Google Tag Manager when on a marketing route', () => {
    // The inverse assertion. Without it, a gate that disabled analytics site-wide
    // would pass every test above while silently breaking the business.
    pathnameMock.mockReturnValue(MARKETING_ROUTE);

    const html = renderAllLayoutChrome();

    expect(html).toContain('googletagmanager.com');
  });

  it('should still load Vercel analytics and preconnects when on a marketing route', () => {
    pathnameMock.mockReturnValue(MARKETING_ROUTE);

    const html = renderAllLayoutChrome();

    expect(html).toContain('vercel-scripts.com');
    expect(html).toContain('vitals.vercel-insights.com');
    expect(html).toContain('google-analytics.com');
  });
});

describe('root layout third-party imports', () => {
  it('should not import any third-party script directly, so the gate cannot be bypassed', () => {
    // Structural, not behavioural. If someone re-adds `<Analytics />` to the root
    // layout, every behavioural test above still passes — they would be testing a
    // component the layout no longer uses. This is the assertion that catches it.
    const layoutSource = readFileSync(path.resolve(__dirname, '../../app/layout.tsx'), 'utf8');

    const forbiddenImports = [
      '@vercel/analytics',
      '@vercel/speed-insights',
      // PerformanceMonitor's default export pushes web vitals into GTM's dataLayer.
      // Only PreloadResources may be imported here, and it self-gates.
      'import PerformanceMonitor',
    ];

    for (const forbidden of forbiddenImports) {
      expect(layoutSource).not.toContain(forbidden);
    }

    // The chrome must reach the layout only through the gated component.
    expect(layoutSource).toContain('MarketingChrome');
  });
});
