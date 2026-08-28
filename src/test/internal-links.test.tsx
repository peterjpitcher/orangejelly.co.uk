import { render, screen } from '@testing-library/react';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import AboutPage from '@/app/about/page';
import ContactPage from '@/app/contact/page';
import GrowthProblemPage from '@/app/growth-problems/[slug]/page';
import GrowthProblemsHubPage from '@/app/growth-problems/page';
import HomePage from '@/app/page';
import HowWeWorkPage from '@/app/how-we-work/page';
import NotFound from '@/app/not-found';
import PubMarketingPage from '@/app/pub-marketing/page';
import PubRescuePage from '@/app/pub-rescue/page';
import CaseStudyPage from '@/app/results/[slug]/page';
import ResultsPage from '@/app/results/page';
import SolutionsPage from '@/app/solutions/page';
import StartHerePage from '@/app/start-here/page';
import { ROUTES, getRedirects } from '@/lib/route-manifest';
import type * as ReactDom from 'react-dom';

/**
 * Every internal link on the repositioned pages has to go somewhere.
 *
 * The navigation pointed at /growth-problems for a working day before anything was
 * built there, on every page on the site, and nothing caught it. A 404 reached from
 * the primary navigation is the most expensive kind: it is on every page, and the
 * person who hits it was doing exactly what the site asked.
 *
 * This resolves each href against the route manifest and the app directory, so a
 * link to a page that does not exist fails here rather than in front of somebody.
 */
vi.mock('@/lib/tracking', () => ({
  trackClientEvent: vi.fn(),
  hasAnalyticsConsent: () => false,
}));

vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof ReactDom>('react-dom');
  return {
    ...actual,
    useFormStatus: () => ({ pending: false }),
    useFormState: () => [{ step: 1 }, vi.fn()],
  };
});

const PAGES: Array<[string, React.ReactElement]> = [
  ['/', <HomePage key="a" />],
  ['/start-here', <StartHerePage key="b" />],
  ['/how-we-work', <HowWeWorkPage key="c" />],
  ['/results', <ResultsPage key="d" />],
  ['/results/[slug]', <CaseStudyPage key="e" params={{ slug: 'nobody-could-find-us' }} />],
  ['/about', <AboutPage key="f" />],
  ['/solutions', <SolutionsPage key="g" />],
  ['/pub-marketing', <PubMarketingPage key="h" />],
  ['/pub-rescue', <PubRescuePage key="i" />],
  ['/contact', <ContactPage key="j" />],
  ['/404', <NotFound key="k" />],
  ['/growth-problems', <GrowthProblemsHubPage key="l" />],
  [
    '/growth-problems/[slug]',
    <GrowthProblemPage key="m" params={{ slug: 'growth-has-stalled' }} />,
  ],
];

const liveRoutes = new Set(
  ROUTES.filter((route) => route.disposition === 'live').map((route) => route.path)
);
const redirectSources = new Set(getRedirects().map((redirect) => redirect.source));

/** Is there a real page file behind this path, statically or via a dynamic segment? */
function hasPageFile(path: string): boolean {
  const segments = path === '/' ? [] : path.slice(1).split('/');
  if (existsSync(join(process.cwd(), 'src/app', ...segments, 'page.tsx'))) return true;

  // Content routes are not enumerated in the manifest; a dynamic segment covers them.
  for (let depth = segments.length; depth > 0; depth -= 1) {
    const parent = segments.slice(0, depth - 1);
    if (existsSync(join(process.cwd(), 'src/app', ...parent, '[slug]', 'page.tsx'))) return true;
  }
  return false;
}

/**
 * Does a path serve a 200 or a redirect?
 *
 * A redirect source needs no page. Everything else needs a real file, and the
 * manifest saying "live" is deliberately NOT enough on its own: a route can be
 * declared live before it is built, which is exactly how /growth-problems came to
 * be in the navigation while it was still a 404.
 */
function resolves(href: string): boolean {
  const path = href.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
  if (redirectSources.has(path)) return true;
  return hasPageFile(path);
}

function internalHrefs(): string[] {
  return screen
    .getAllByRole('link')
    .map((link) => link.getAttribute('href') ?? '')
    .filter((href) => href.startsWith('/'));
}

describe('internal links resolve', () => {
  it.each(PAGES)('%s links only to pages that exist', (_path, page) => {
    render(page);
    const broken = [...new Set(internalHrefs())].filter((href) => !resolves(href));
    expect(broken).toEqual([]);
  });

  it('checks a meaningful number of links, so a silent no-op cannot pass', () => {
    render(<HomePage />);
    expect(new Set(internalHrefs()).size).toBeGreaterThan(8);
  });

  it('resolves the six problem pages the homepage cards point at', async () => {
    // These were the broken ones. The card titles are areas and the destinations
    // are symptoms, so the mapping is easy to get wrong and worth pinning.
    const { PRESSURE_POINTS } = await import('@/app/home-content');
    expect(PRESSURE_POINTS).toHaveLength(6);
    for (const point of PRESSURE_POINTS) {
      expect(point.href.startsWith('/growth-problems/')).toBe(true);
      expect(resolves(point.href), `${point.title} -> ${point.href}`).toBe(true);
    }
  });

  it('does not accept a route that is declared live but not built', () => {
    // The manifest is a declaration, not evidence. Every path it calls live must
    // have a page behind it, or the declaration is the thing that is wrong.
    const declaredButMissing = [...liveRoutes]
      .filter((path) => !path.includes('['))
      .filter((path) => !hasPageFile(path));
    expect(declaredButMissing).toEqual([]);
  });

  it('resolves every link in the shared header and footer', () => {
    // A broken link here is broken on every page at once.
    render(<HomePage />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const chrome = [
      ...nav.querySelectorAll('a'),
      ...(document.querySelector('footer')?.querySelectorAll('a') ?? []),
    ]
      .map((a) => a.getAttribute('href') ?? '')
      .filter((href) => href.startsWith('/'));

    expect(chrome.length).toBeGreaterThan(5);
    expect(chrome.filter((href) => !resolves(href))).toEqual([]);
  });
});
