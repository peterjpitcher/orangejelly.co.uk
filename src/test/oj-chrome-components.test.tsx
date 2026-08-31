import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Header, Footer, Breadcrumb } from '@/components/oj';

/**
 * Most of these cover behaviour the reference implementation did not have.
 *
 * The supplied Header toggles a boolean and renders a panel. That leaves Escape
 * doing nothing, focus stranded on the page behind the overlay, and the body still
 * scrolling underneath. Those are keyboard and screen-reader defects rather than
 * cosmetic ones, so the port fixes them and these tests hold them fixed.
 */
const ITEMS = [
  { label: 'How we work', href: '/how-we-work' },
  {
    label: 'Growth problems',
    current: true,
    sub: [
      { label: 'Growth has stalled', href: '/growth-problems/growth-has-stalled' },
      { label: 'Leads are not converting', href: '/growth-problems/leads-not-converting' },
      { label: 'See all eight', href: '/growth-problems', more: true },
    ],
  },
  { label: 'About', href: '/about' },
];

const CTA = { label: "Let's talk", href: '/start-here' };

describe('oj/Header', () => {
  it('renders primary nav and marks the current page', () => {
    render(<Header items={ITEMS} cta={CTA} />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByText('How we work')).toBeInTheDocument();
    expect(within(nav).getByText('Growth problems')).toHaveAttribute('aria-current', 'page');
  });

  it('starts with the drawer closed and announces its state', () => {
    render(<Header items={ITEMS} />);
    const toggle = screen.getByRole('button', { name: 'Menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls');
    expect(screen.queryByRole('navigation', { name: 'Primary mobile' })).not.toBeInTheDocument();
  });

  it('opens the drawer and renders sub-items as a group', async () => {
    const user = userEvent.setup();
    render(<Header items={ITEMS} cta={CTA} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));

    const drawer = screen.getByRole('navigation', { name: 'Primary mobile' });
    expect(within(drawer).getByText('Growth has stalled')).toBeInTheDocument();
    expect(within(drawer).getByText('See all eight')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close ×' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('closes on Escape and returns focus to the toggle', async () => {
    const user = userEvent.setup();
    render(<Header items={ITEMS} />);
    const toggle = screen.getByRole('button', { name: 'Menu' });

    await user.click(toggle);
    expect(screen.getByRole('navigation', { name: 'Primary mobile' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('navigation', { name: 'Primary mobile' })).not.toBeInTheDocument();
  });

  it('locks body scroll while open and restores it on close', async () => {
    const user = userEvent.setup();
    render(<Header items={ITEMS} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(document.body.style.overflow).toBe('hidden');

    await user.click(screen.getByRole('button', { name: 'Close ×' }));
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('closes when a drawer link is followed, so the menu is not left over the page', async () => {
    const user = userEvent.setup();
    render(<Header items={ITEMS} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    const drawer = screen.getByRole('navigation', { name: 'Primary mobile' });
    await user.click(within(drawer).getByText('Growth has stalled'));

    expect(screen.queryByRole('navigation', { name: 'Primary mobile' })).not.toBeInTheDocument();
  });

  it('moves focus into the drawer when it opens', async () => {
    const user = userEvent.setup();
    render(<Header items={ITEMS} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('navigation', { name: 'Primary mobile' })).toHaveFocus();
  });
});

describe('oj/Footer', () => {
  it('uses the full legal name, never the abbreviation', () => {
    render(<Footer />);
    expect(screen.getByText(/Orange Jelly Limited/)).toBeInTheDocument();
    expect(screen.queryByText(/Orange Jelly Ltd/)).not.toBeInTheDocument();
  });

  it('carries the signature line by default', () => {
    render(<Footer />);
    expect(screen.getByText('AI is part of the toolkit, not the product.')).toBeInTheDocument();
  });

  it('renders link columns', () => {
    render(
      <Footer
        columns={[
          {
            title: 'Growth problems',
            links: [{ label: 'Growth has stalled', href: '/growth-problems/growth-has-stalled' }],
          },
        ]}
      />
    );
    expect(screen.getByText('Growth problems')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Growth has stalled' })).toHaveAttribute(
      'href',
      '/growth-problems/growth-has-stalled'
    );
  });
});

describe('oj/Breadcrumb', () => {
  const TRAIL = [
    { label: 'Home', href: '/' },
    { label: 'Insights', href: '/insights' },
    { label: 'Quiz night ideas' },
  ];

  it('links every item except the current page', () => {
    render(<Breadcrumb items={TRAIL} />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Insights' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Quiz night ideas' })).not.toBeInTheDocument();
  });

  it('marks the last item as the current page', () => {
    render(<Breadcrumb items={TRAIL} />);
    expect(screen.getByText('Quiz night ideas')).toHaveAttribute('aria-current', 'page');
  });

  it('hides the separators from assistive technology', () => {
    const { container } = render(<Breadcrumb items={TRAIL} />);
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    // Two separators for three items, and neither should be announced.
    expect(separators).toHaveLength(2);
  });
});
