import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import type * as ReactDom from 'react-dom';
import { describe, expect, it, vi } from 'vitest';

import StartHerePage from '@/app/start-here/page';
import ContactPage from '@/app/contact/page';
import { getGuideConversion } from '@/lib/guide-conversion';

vi.mock('@/lib/tracking', () => ({
  trackClientEvent: vi.fn(),
  hasAnalyticsConsent: () => false,
}));
vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof ReactDom>('react-dom');
  return {
    ...actual,
    useFormStatus: () => ({ pending: false }),
    useFormState: () => [{ step: 1 }, '/test-enquiry'],
  };
});

const guide = 'autumn-pub-event-ideas';
const config = getGuideConversion(guide, 'events');

for (const [path, Page] of [
  ['/start-here', StartHerePage],
  ['/contact', ContactPage],
] as const) {
  describe(`${path} context`, () => {
    it('shows the selected published topic and relevant proof without prefilled input', () => {
      const { container } = render(<Page searchParams={{ guide, placement: 'early' }} />);
      expect(screen.getByRole('heading', { name: config.heading })).toBeInTheDocument();
      expect(screen.getByLabelText(/What's going on/)).toHaveValue('');
      expect(screen.getByText(/table bookings at The Anchor, our own venue/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Message Peter on WhatsApp' })).toHaveAttribute(
        'href',
        expect.stringContaining(encodeURIComponent(config.whatsappMessage))
      );
      const source = container.querySelector<HTMLInputElement>('input[name="leadSource"]')!;
      expect(JSON.parse(source.value).sourcePage).toBe(`${path}?guide=${guide}&placement=early`);
    });

    it.each([
      { guide: 'unknown-guide', placement: 'early' },
      { guide: [guide, 'private-value'], placement: 'early' },
      { guide, placement: ['early', 'end'] },
      { guide, placement: 'private-value' },
      { guide: '<script>private-value</script>', placement: 'early' },
      { guide: 'a'.repeat(300), placement: 'early' },
    ])('falls back to the generic journey for malformed context %#', (searchParams) => {
      const { container } = render(<Page searchParams={searchParams} />);
      expect(screen.queryByRole('heading', { name: config.heading })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send my enquiry' })).toBeInTheDocument();
      expect(container.textContent).not.toContain('private-value');
      const source = container.querySelector<HTMLInputElement>('input[name="leadSource"]')!;
      expect(JSON.parse(source.value).sourcePage).toBe(path);
    });

    it('includes guide attribution in server markup before JavaScript can run', () => {
      const html = renderToStaticMarkup(<Page searchParams={{ guide, placement: 'early' }} />);
      const document = new DOMParser().parseFromString(html, 'text/html');
      const source = document.querySelector<HTMLInputElement>('input[name="leadSource"]')!;
      expect(JSON.parse(source.value).sourcePage).toBe(`${path}?guide=${guide}&placement=early`);
      expect(document.querySelectorAll('form')).toHaveLength(1);
      expect(document.querySelectorAll('#enquiry')).toHaveLength(1);
      expect(document.querySelector('a[href^="https://wa.me/"]')).not.toBeNull();
    });
  });
}
