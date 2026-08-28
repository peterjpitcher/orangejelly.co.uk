import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AboutPage from '@/app/about/page';
import HomePage from '@/app/page';
import HowWeWorkPage from '@/app/how-we-work/page';
import CaseStudyPage from '@/app/results/[slug]/page';
import ResultsPage from '@/app/results/page';
import ContactPage from '@/app/contact/page';
import GrowthProblemPage from '@/app/growth-problems/[slug]/page';
import GrowthProblemsHubPage from '@/app/growth-problems/page';
import AiReadinessPage from '@/app/tools/ai-readiness/page';
import FractionalCmoPage from '@/app/fractional-cmo/page';
import ProfessionalServicesPage from '@/app/sectors/professional-services/page';
import PubMarketingPage from '@/app/pub-marketing/page';
import SmallBusinessRescuePage from '@/app/small-business-rescue/page';
import SolutionsPage from '@/app/solutions/page';
import StartHerePage from '@/app/start-here/page';
import MainGate from '@/components/MainGate';
import { OJ_ROUTES } from '@/lib/oj-routes';
import type * as ReactDom from 'react-dom';

/**
 * Who owns the `<main>` landmark.
 *
 * The root layout wraps its children in one, which is right for the legacy
 * templates and wrong for the repositioned pages: those render their own header and
 * footer, so their content cannot sit inside a main opened before the header.
 *
 * Nesting the two is a WCAG 1.3.1 failure and an invisible one. The page-level axe
 * sweep scans a page component and never the layout around it, so nothing else in
 * this suite can see it.
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

// The global setup mocks next/navigation with a fixed pathname, so this file
// overrides it with one the tests can move.
const pathname = vi.fn(() => '/');
vi.mock('next/navigation', () => ({
  usePathname: () => pathname(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const OJ_PAGES: Array<[string, React.ReactElement]> = [
  ['/', <HomePage key="home" />],
  ['/start-here', <StartHerePage key="start" />],
  ['/how-we-work', <HowWeWorkPage key="how" />],
  ['/results', <ResultsPage key="results" />],
  [
    '/results/nobody-could-find-us',
    <CaseStudyPage key="case" params={{ slug: 'nobody-could-find-us' }} />,
  ],
  ['/about', <AboutPage key="about" />],
  ['/solutions', <SolutionsPage key="solutions" />],
  ['/pub-marketing', <PubMarketingPage key="pm" />],
  ['/small-business-rescue', <SmallBusinessRescuePage key="pr" />],
  ['/contact', <ContactPage key="contact" />],
  ['/growth-problems', <GrowthProblemsHubPage key="gph" />],
  ['/tools/ai-readiness', <AiReadinessPage key="air" />],
  ['/fractional-cmo', <FractionalCmoPage key="fcmo" />],
  ['/sectors/professional-services', <ProfessionalServicesPage key="ps" />],
  ['/growth-problems/weak-demand', <GrowthProblemPage key="gp" params={{ slug: 'weak-demand' }} />],
];

describe('MainGate', () => {
  it('opens a main for the legacy templates, which render page content only', () => {
    pathname.mockReturnValue('/licensees-guide/karaoke-night-101');
    render(
      <MainGate>
        <p>content</p>
      </MainGate>
    );
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it('opens none for a repositioned page, which brings its own', () => {
    for (const route of OJ_ROUTES) {
      pathname.mockReturnValue(route);
      const { container, unmount } = render(
        <MainGate>
          <p>content</p>
        </MainGate>
      );
      expect(container.querySelector('main')).toBeNull();
      unmount();
    }
  });
});

describe('the repositioned pages', () => {
  it('each declare exactly one main', () => {
    for (const [, page] of OJ_PAGES) {
      const { container, unmount } = render(page);
      expect(container.querySelectorAll('main')).toHaveLength(1);
      unmount();
    }
  });

  it('each carry the skip link target, or the skip link silently stops working', () => {
    for (const [, page] of OJ_PAGES) {
      const { container, unmount } = render(page);
      expect(container.querySelector('main')).toHaveAttribute('id', 'main-content');
      unmount();
    }
  });

  it('are all listed as routes the gate knows about', () => {
    // A page that brings its own main and is not in OJ_ROUTES gets two of them.
    for (const [route] of OJ_PAGES) {
      const covered = OJ_ROUTES.some((known) =>
        known === '/' ? route === '/' : route === known || route.startsWith(`${known}/`)
      );
      expect(covered).toBe(true);
    }
  });
});
