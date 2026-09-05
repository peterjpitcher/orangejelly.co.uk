import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GuideEnquiryCallout } from '@/components/oj/GuideEnquiryCallout';
import { EnquiryActions } from '@/components/oj/EnquiryActions';
import { CONTACT, SUCCESS_METRICS } from '@/lib/constants';
import { trackClientEvent } from '@/lib/tracking';
import { type GuideConversionContext } from '@/lib/guide-conversion';
vi.mock('@/lib/tracking', () => ({ trackClientEvent: vi.fn() }));
const context: GuideConversionContext = {
  guideSlug: 'autumn-pub-event-ideas',
  category: 'events',
  title: 'Autumn pub event ideas',
  placement: 'early',
};
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
describe('guide enquiry callouts', () => {
  it('has native topic-specific links and no full proof in the early callout', () => {
    render(<GuideEnquiryCallout context={context} placement="early" />);
    expect(screen.getByRole('link', { name: 'Talk about my autumn plans' })).toHaveAttribute(
      'href',
      '/start-here?guide=autumn-pub-event-ideas&placement=early#enquiry'
    );
    const whatsapp = screen.getByRole('link', { name: 'Message Peter on WhatsApp' });
    expect(new URL(whatsapp.getAttribute('href')!).pathname).toBe(`/${CONTACT.whatsappNumber}`);
    expect(new URL(whatsapp.getAttribute('href')!).searchParams.get('text')).toContain(
      'my autumn plans'
    );
    expect(screen.queryByText(/forecast/)).not.toBeInTheDocument();
    whatsapp.addEventListener('click', (event) => event.preventDefault());
    fireEvent.click(whatsapp);
    expect(trackClientEvent).toHaveBeenCalledWith('whatsapp_click', {
      properties: {
        guide_slug: context.guideSlug,
        placement: 'early',
        channel: 'whatsapp',
        version: 'guide-enquiry-v1',
      },
    });
  });
  it('renders approved proof and provenance at the end', () => {
    render(<GuideEnquiryCallout context={context} placement="end" />);
    expect(
      screen.getByText(
        `${SUCCESS_METRICS.tableBookings.value} table bookings at The Anchor, our own venue.`
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See what changed at The Anchor' })).toHaveAttribute(
      'href',
      '/results/interest-that-did-not-turn-up'
    );
  });
  it('keeps generic contact alternatives usable when analytics throws', () => {
    vi.mocked(trackClientEvent).mockImplementationOnce(() => {
      throw new Error('unavailable');
    });
    render(<EnquiryActions placement="contact" showPrimary={false} />);
    const whatsapp = screen.getByRole('link', { name: 'Message Peter on WhatsApp' });
    whatsapp.addEventListener('click', (event) => event.preventDefault());
    expect(() => fireEvent.click(whatsapp)).not.toThrow();
    expect(screen.getByRole('link', { name: 'Email Peter' })).toHaveAttribute(
      'href',
      `mailto:${CONTACT.email}`
    );
    expect(screen.queryByRole('link', { name: 'Send an enquiry' })).not.toBeInTheDocument();
  });
});
