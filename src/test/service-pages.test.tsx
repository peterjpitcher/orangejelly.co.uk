import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HospitalityPage, {
  metadata as hospitalityMetadata,
} from '@/app/solutions/hospitality-websites/page';
import ApplicationsPage, {
  metadata as applicationsMetadata,
} from '@/app/solutions/bespoke-applications/page';
import BookingPage, { metadata as bookingMetadata } from '@/app/solutions/booking-systems/page';
import { getCaseStudy } from '@/app/results/case-studies';

const pages = [
  {
    Page: HospitalityPage,
    metadata: hospitalityMetadata,
    path: '/solutions/hospitality-websites',
    title: 'Hospitality Website Design | Orange Jelly',
    heading: 'Hospitality websites that make choosing and booking easier.',
    proof: 'nobody-could-find-us',
  },
  {
    Page: ApplicationsPage,
    metadata: applicationsMetadata,
    path: '/solutions/bespoke-applications',
    title: 'Bespoke Web Application Development | Orange Jelly',
    heading: 'Web applications built around the way your business works.',
    proof: 'interest-that-did-not-turn-up',
  },
  {
    Page: BookingPage,
    metadata: bookingMetadata,
    path: '/solutions/booking-systems',
    title: 'Custom Booking Systems | Orange Jelly',
    heading: 'Booking systems that connect the guest and the team.',
    proof: 'interest-that-did-not-turn-up',
  },
];

describe.each(pages)('$path', ({ Page, metadata, path, title, heading, proof }) => {
  it('has its own search identity and matching canonical', () => {
    expect(metadata.title).toBe(title);
    expect(metadata.alternates?.canonical).toBe(`https://www.orangejelly.co.uk${path}`);
    expect(metadata.openGraph?.url).toBe(metadata.alternates?.canonical);
  });

  it('shows a clear offer and sends both project actions to the existing form', () => {
    render(<Page />);
    const main = screen.getByRole('main');
    expect(within(main).getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(within(main).getByRole('heading', { level: 1 })).toHaveTextContent(heading);
    const actions = within(main).getAllByRole('link', { name: 'Discuss your project' });
    expect(actions).toHaveLength(2);
    for (const action of actions) expect(action).toHaveAttribute('href', '/start-here#enquiry');
  });

  it('links published proof with ownership stated and renders native FAQ disclosures', () => {
    render(<Page />);
    const main = screen.getByRole('main');
    expect(main).toHaveTextContent('The Anchor, our own venue');
    expect(getCaseStudy(proof)).toBeDefined();
    expect(main.querySelector(`a[href="/results/${proof}"]`)).toBeInTheDocument();
    expect(main.querySelectorAll('details').length).toBeGreaterThanOrEqual(4);
    expect(main.textContent).not.toMatch(/guarantee|within 24 hours|30-day|£/i);
  });
});

it('distinguishes possible application scope from public project evidence and AI functionality', () => {
  render(<ApplicationsPage />);
  const main = screen.getByRole('main');
  expect(main).toHaveTextContent('What we can build for you');
  expect(main).toHaveTextContent('published booking case study');
  expect(main).toHaveTextContent(
    'Using AI during development is different from adding AI functionality'
  );
  expect(main).toHaveTextContent('Native app-store applications are outside the offer');
});
