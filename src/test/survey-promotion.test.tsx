import { render, screen, within } from '@testing-library/react';
import type * as ReactDom from 'react-dom';
import { describe, expect, it, vi } from 'vitest';

import HomePage from '@/app/page';
import GuidesPage from '@/app/guides/page';
import PubMarketingPage from '@/app/pub-marketing/page';
import SurveyBand from '@/components/survey/SurveyBand';
import { PROMOTED_SURVEY } from '@/lib/promoted-survey';

/*
 * The same offline setup the orphan-page gate uses to render these pages for real.
 * `/guides` awaits `draftMode()`, which needs a request store jsdom does not have.
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
vi.mock('next/headers', () => ({ draftMode: () => ({ isEnabled: false }) }));

const HREF = '/survey/pub-apps';

describe('the promoted survey', () => {
  it('is configured, so every promotion below is switched on', () => {
    expect(PROMOTED_SURVEY).toMatchObject({ slug: 'pub-apps', href: HREF });
  });

  it('is in the primary navigation, marked with the orange dot', () => {
    render(<HomePage />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const link = within(nav).getByRole('link', { name: 'Pub survey' });
    expect(link).toHaveAttribute('href', HREF);
    // The dot is decoration: the accessible name is the label alone.
    expect(link.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('is in the footer beside the other things a visitor does', () => {
    render(<HomePage />);
    const footer = document.querySelector('footer');
    expect(footer).not.toBeNull();
    expect(within(footer as HTMLElement).getByRole('link', { name: 'Pub survey' })).toHaveAttribute(
      'href',
      HREF
    );
  });

  it.each([
    ['the homepage', () => <HomePage />],
    ['the Pubs page', () => <PubMarketingPage />],
  ])('has a band on %s', (_name, page) => {
    render(page());
    const band = screen.getByRole('region', {
      name: 'Which tools would make running your pub easier?',
    });
    expect(within(band).getByRole('link', { name: /Take the survey/ })).toHaveAttribute(
      'href',
      HREF
    );
  });

  it('has a band on the guides library', async () => {
    render(await GuidesPage());
    const band = screen.getByRole('region', {
      name: 'Which tools would make running your pub easier?',
    });
    expect(within(band).getByRole('link', { name: /Take the survey/ })).toHaveAttribute(
      'href',
      HREF
    );
  });

  it('puts the band straight under the homepage hero, ahead of what we build', () => {
    render(<HomePage />);
    const text = screen.getByRole('main').textContent ?? '';
    // The heading is lowercased by CSS; the text itself keeps the survey's own case.
    const band = text.indexOf('Which tools would make running your pub easier?');
    expect(band).toBeGreaterThan(-1);
    expect(band).toBeLessThan(text.indexOf('what we build.'));
  });

  it('renders the band in either tone', () => {
    const { container, rerender } = render(<SurveyBand tone="ink" />);
    expect(container.querySelector('section')?.className).toContain('bg-oj-ink');
    rerender(<SurveyBand tone="orange" />);
    expect(container.querySelector('section')?.className).toContain('bg-oj-band');
  });
});
