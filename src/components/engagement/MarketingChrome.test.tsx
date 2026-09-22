import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render } from '@testing-library/react';
import { readFileSync } from 'fs';
import path from 'path';

/**
 * C4: proof that no third-party request fires on a token route.
 *
 * Poll URLs carry a bearer token in the path. Vercel Analytics and GTM both report
 * the raw path, so an ungated third-party script on those routes hands the poll's
 * own access token to Google or Vercel, and anyone with analytics access could
 * then act as that poll's organiser. Referrer-Policy does not help, because this
 * JavaScript reads window.location directly.
 *
 * Two assertions, because they fail in different ways:
 *   1. BEHAVIOURAL: render the chrome on a token route and assert nothing
 *      third-party reaches the DOM, while proving the same components DO render on
 *      a marketing route (so a gate that simply disabled everything would fail).
 *   2. STRUCTURAL: assert the root layout never imports a third-party script
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

/** CookieNotice's storage key and the value an Accept click writes. */
const CONSENT_KEY = 'oj-cookie-consent';
const ACCEPTED = JSON.stringify({ analytics: true, timestamp: '2026-09-22T12:00:00.000Z' });

const TOKEN_ROUTE = '/availability/o/0123456789abcdef0123456789abcdef';
const PARTICIPANT_ROUTE = '/availability/p/0123456789abcdef0123456789abcdef';
const VERIFY_ROUTE = '/availability/verify/0123456789abcdef0123456789abcdef';
/*
 * A route the repositioning has genuinely not reached.
 *
 * This was '/guides/some-article' until the guides adopted the new chrome
 * on 30 August 2026, at which point the fixture quietly became a repositioned route
 * and the assertion below stopped testing what its name says. '/ways-to-work' is
 * still on the legacy templates and still carries the overlays.
 */
const MARKETING_ROUTE = '/ways-to-work';

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
import { GoogleTagManager, updateGtagConsent } from '@/components/GoogleTagManager';
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
      <MarketingChrome />
    </>
  );
  return container.innerHTML;
}

/**
 * This jsdom build has no localStorage, which CookieNotice reads on mount. Only
 * the marketing-route cases reach it. On a token route the gate stops it mounting
 * at all, which is itself a small confirmation the gate works.
 */
function stubLocalStorage(initial: Record<string, string> = {}): void {
  const store = new Map<string, string>(Object.entries(initial));
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

  it('should fire no third-party request on a token route even after analytics is accepted', () => {
    stubLocalStorage({ [CONSENT_KEY]: ACCEPTED });
    pathnameMock.mockReturnValue(TOKEN_ROUTE);

    const html = renderAllLayoutChrome();

    expect(externalUrlsIn(html)).toEqual([]);
    expect(html).not.toContain('gtm-script');
  });

  it('should never embed the token in the rendered chrome when on a token route', () => {
    pathnameMock.mockReturnValue(TOKEN_ROUTE);

    expect(renderAllLayoutChrome()).not.toContain('0123456789abcdef');
  });

  /*
   * GTM loads only after consent, since 22 September 2026. The privacy notice says
   * Google's tools never load if someone declines or ignores the banner, and these
   * four assertions are what hold it to that. The inverse ones matter as much: a
   * gate that disabled analytics site-wide would pass the first and silently break
   * the business.
   */
  it('should load nothing from Google on a marketing route before anyone has chosen', () => {
    pathnameMock.mockReturnValue(MARKETING_ROUTE);

    const html = renderAllLayoutChrome();

    expect(html).not.toContain('gtm-script');
    expect(html).not.toContain('googletagmanager.com');
    expect(html).not.toContain('google-analytics.com');
  });

  it('should load Google Tag Manager on a marketing route when analytics was accepted before', () => {
    stubLocalStorage({ [CONSENT_KEY]: ACCEPTED });
    pathnameMock.mockReturnValue(MARKETING_ROUTE);

    const { container } = render(<GoogleTagManager />);

    expect(container.querySelector('[data-testid="gtm-script"]')).not.toBeNull();
  });

  it('should load Google Tag Manager the moment Accept is clicked, without a reload', () => {
    pathnameMock.mockReturnValue(MARKETING_ROUTE);
    const { container } = render(<GoogleTagManager />);
    expect(container.querySelector('[data-testid="gtm-script"]')).toBeNull();

    act(() => updateGtagConsent(true));

    expect(container.querySelector('[data-testid="gtm-script"]')).not.toBeNull();
  });

  it('should never load Google Tag Manager when analytics is rejected', () => {
    stubLocalStorage({ [CONSENT_KEY]: JSON.stringify({ analytics: false }) });
    pathnameMock.mockReturnValue(MARKETING_ROUTE);
    const { container } = render(<GoogleTagManager />);

    act(() => updateGtagConsent(false));

    expect(container.querySelector('[data-testid="gtm-script"]')).toBeNull();
  });

  it('should still load Vercel analytics when on a marketing route', () => {
    pathnameMock.mockReturnValue(MARKETING_ROUTE);

    const html = renderAllLayoutChrome();

    expect(html).toContain('vercel-scripts.com');
    expect(html).toContain('vitals.vercel-insights.com');
  });
});

describe('root layout third-party imports', () => {
  it('should not import any third-party script directly, so the gate cannot be bypassed', () => {
    // Structural, not behavioural. If someone re-adds `<Analytics />` to the root
    // layout, every behavioural test above still passes; they would be testing a
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

describe('MarketingChrome on repositioned routes', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_GTM_ID', 'GTM-TEST123');
    stubLocalStorage();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('keeps measurement and consent but drops the legacy overlays', () => {
    // Those overlays sell packages at published prices and open with hospitality
    // staffing lines, both of which the repositioning removed. A page arguing that
    // every engagement is priced to the problem cannot carry a bar offering "See
    // Packages".
    pathnameMock.mockReturnValue('/start-here');
    const { container } = render(<MarketingChrome />);
    const html = container.innerHTML;

    expect(container.querySelector('[data-testid="vercel-analytics"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="vercel-speed-insights"]')).not.toBeNull();
    expect(html).not.toMatch(/See Packages|Chat on WhatsApp/);
  });

  /*
   * INVERTED 31 August 2026. This asserted the opposite until the legacy pages were
   * given the repositioned header and footer: a bar across the bottom offering "See
   * Packages", under a footer that no longer mentions packages, was the last thing on
   * those pages still arguing the old position. The overlays are gone site-wide now,
   * so the assertion that used to protect them protects their absence instead.
   */
  it('drops the legacy overlays on the old pages too, not just the repositioned ones', () => {
    pathnameMock.mockReturnValue(MARKETING_ROUTE);
    const { container } = render(<MarketingChrome />);
    expect(container.innerHTML).not.toMatch(/See Packages|Chat on WhatsApp/);
  });
});
