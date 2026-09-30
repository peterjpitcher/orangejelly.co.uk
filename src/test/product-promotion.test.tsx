import { render, screen, within } from '@testing-library/react';
import type * as ReactDom from 'react-dom';
import { describe, expect, it, vi } from 'vitest';

import HomePage from '@/app/page';
import PubMarketingPage from '@/app/pub-marketing/page';
import ProductBand from '@/components/product/ProductBand';
import { PROMOTED_PRODUCT } from '@/lib/promoted-product';

// The same offline setup survey-promotion.test.tsx uses to render these pages for real.
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

const HREF = 'https://cheers.orangejelly.co.uk/';
const TITLE = 'Meet Cheers, the social media tool we built for venues.';

describe('the promoted product', () => {
  it('is Cheers, so every promotion below is switched on', () => {
    expect(PROMOTED_PRODUCT).toMatchObject({ name: 'Cheers', href: HREF });
  });

  it('never quotes a price or describes the company by sector', () => {
    // Cheers is priced on its own site. The only price on this site is the hourly
    // rate, and the homepage test rejects any £ sign at all.
    const copy = Object.values(PROMOTED_PRODUCT ?? {}).join(' ');
    expect(copy).not.toMatch(/£|\d+%|per month|a month/i);
    expect(copy).not.toMatch(/for (pubs|hospitality)|hospitality (marketing|agency)/i);
    expect(copy).not.toMatch(/\bsav(e|es|ed|ing|ings)\b/i);
  });

  it('promises no launch date until Meta approves the App Review', () => {
    // Peter, 30 September 2026: "coming soon" only. Cheers cannot open to everyone
    // before Meta's review, so a month here would be a promise the site cannot keep.
    // Change this test deliberately when the review is approved.
    const copy = Object.values(PROMOTED_PRODUCT ?? {}).join(' ');
    expect(PROMOTED_PRODUCT?.eyebrow).toBe('Coming soon');
    expect(copy).not.toMatch(
      /\b(January|February|March|April|May|June|July|August|September|October|November|December|20\d\d)\b/
    );
  });

  it.each([
    ['the homepage', () => <HomePage />],
    ['the Pubs page', () => <PubMarketingPage />],
  ])('has a band on %s that opens Cheers in a new tab', (_name, page) => {
    render(page());
    const band = screen.getByRole('region', { name: TITLE });
    expect(within(band).getByText(/coming soon/i)).toBeInTheDocument();
    const link = within(band).getByRole('link', { name: /See Cheers \(opens in a new tab\)/ });
    expect(link).toHaveAttribute('href', HREF);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('puts the homepage band after what we build and before the case studies', () => {
    render(<HomePage />);
    const text = screen.getByRole('main').textContent ?? '';
    const band = text.indexOf(TITLE);
    expect(band).toBeGreaterThan(text.indexOf('what we build.'));
    expect(band).toBeLessThan(text.indexOf('see the work behind the results.'));
  });

  it('is in the footer, beside what we build', () => {
    render(<HomePage />);
    const footer = document.querySelector('footer') as HTMLElement;
    const link = within(footer).getByRole('link', { name: 'Cheers (coming soon)' });
    expect(link).toHaveAttribute('href', HREF);

    const labels = within(footer)
      .getAllByRole('link')
      .map((a) => a.textContent);
    expect(labels.indexOf('Cheers (coming soon)')).toBe(labels.indexOf('What we build') + 1);
  });

  it('renders the band in either tone', () => {
    const { container, rerender } = render(<ProductBand tone="ink" />);
    expect(container.querySelector('section')?.className).toContain('bg-oj-ink');
    rerender(<ProductBand tone="orange" />);
    expect(container.querySelector('section')?.className).toContain('bg-oj-band');
  });
});
