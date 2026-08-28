import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';

import HomePage from '@/app/page';
import AboutPage from '@/app/about/page';
import CaseStudyPage from '@/app/results/[slug]/page';
import HowWeWorkPage from '@/app/how-we-work/page';
import ResultsPage from '@/app/results/page';
import SolutionsPage from '@/app/solutions/page';
import ContactPage from '@/app/contact/page';
import GrowthProblemPage from '@/app/growth-problems/[slug]/page';
import GrowthProblemsHubPage from '@/app/growth-problems/page';
import NotFound from '@/app/not-found';
import PubMarketingPage from '@/app/pub-marketing/page';
import PubRescuePage from '@/app/pub-rescue/page';
import StartHerePage from '@/app/start-here/page';
import type * as ReactDom from 'react-dom';

/**
 * The axe sweep applied to whole pages rather than single components.
 *
 * Components pass in isolation and pages still fail: duplicate landmarks, two h1s,
 * heading levels skipped between sections, a nav with no name once there are two of
 * them. None of that is visible until the parts are assembled.
 *
 * @see src/test/oj-accessibility.test.tsx for the component-level sweep
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

async function scan(ui: React.ReactElement): Promise<string[]> {
  const { container } = render(ui);
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    // Contrast needs real rendering, which jsdom does not do. It is asserted
    // against the token values in design-tokens.contrast.test.ts instead.
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`);
}

describe('page-level accessibility', () => {
  it('finds nothing on the homepage', async () => {
    expect(await scan(<HomePage />)).toEqual([]);
  });

  it('finds nothing on /start-here', async () => {
    expect(await scan(<StartHerePage />)).toEqual([]);
  });

  it('finds nothing on /how-we-work', async () => {
    expect(await scan(<HowWeWorkPage />)).toEqual([]);
  });

  it('finds nothing on /about', async () => {
    expect(await scan(<AboutPage />)).toEqual([]);
  });

  it('finds nothing on /results', async () => {
    expect(await scan(<ResultsPage />)).toEqual([]);
  });

  it('finds nothing on /solutions', async () => {
    expect(await scan(<SolutionsPage />)).toEqual([]);
  });

  it('finds nothing on the two hospitality sector pages', async () => {
    expect(await scan(<PubMarketingPage />)).toEqual([]);
    expect(await scan(<PubRescuePage />)).toEqual([]);
  });

  it('finds nothing on /contact or the 404', async () => {
    expect(await scan(<ContactPage />)).toEqual([]);
    expect(await scan(<NotFound />)).toEqual([]);
  });

  it('finds nothing on the growth problems hub or a problem page', async () => {
    expect(await scan(<GrowthProblemsHubPage />)).toEqual([]);
    expect(await scan(<GrowthProblemPage params={{ slug: 'growth-has-stalled' }} />)).toEqual([]);
  });

  it('finds nothing on a case study', async () => {
    expect(await scan(<CaseStudyPage params={{ slug: 'nobody-could-find-us' }} />)).toEqual([]);
  });

  it('gives each page exactly one h1', async () => {
    for (const page of [
      <HomePage key="home" />,
      <StartHerePage key="start" />,
      <HowWeWorkPage key="how" />,
    ]) {
      const { container } = render(page);
      expect(container.querySelectorAll('h1')).toHaveLength(1);
    }
  });

  it('never skips a heading level', () => {
    for (const page of [
      <HomePage key="home" />,
      <StartHerePage key="start" />,
      <HowWeWorkPage key="how" />,
    ]) {
      const { container } = render(page);
      const levels = [...container.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) =>
        Number(h.tagName[1])
      );
      for (let i = 1; i < levels.length; i += 1) {
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
      }
    }
  });
});
