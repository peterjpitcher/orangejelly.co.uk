import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Card,
  PressureCard,
  ProofCard,
  MethodStep,
  Quote,
  Alert,
  Modal,
  EmptyState,
  Skeleton,
  FAQ,
  Toc,
  CategoryTag,
  ArticleCard,
  Pagination,
  Tabs,
  NextStep,
} from '@/components/oj';

describe('oj/content', () => {
  it('makes the whole PressureCard the link, not a bare arrow', () => {
    // The reference puts onClick on the card and a link inside it, which is
    // clickable by mouse and reachable by keyboard only as an unlabelled arrow.
    render(<PressureCard title="Protect margin" desc="Where value leaks" href="/p/margin" />);
    const link = screen.getByRole('link', { name: /Protect margin/ });
    expect(link).toHaveAttribute('href', '/p/margin');
    expect(within(link).getByText('Protect margin')).toBeInTheDocument();
  });

  it('keeps the PressureCard arrow out of the accessible name', () => {
    render(<PressureCard title="Convert more" />);
    expect(screen.getByRole('link')).toHaveAccessibleName('Convert more');
  });

  it('renders a ProofCard with its context and area', () => {
    render(
      <ProofCard value="403%" label="Table bookings" context="At The Anchor" area="Create demand" />
    );
    expect(screen.getByText('403%')).toBeInTheDocument();
    expect(screen.getByText('At The Anchor')).toBeInTheDocument();
    expect(screen.getByText('Create demand')).toBeInTheDocument();
  });

  it('zero-pads the method step index', () => {
    render(<MethodStep index={2} word="CHALLENGE." text="Find the pressure points." />);
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('CHALLENGE.')).toBeInTheDocument();
  });

  it('renders a Quote as a figure with attribution', () => {
    render(
      <Quote name="Sam Whitfield" role="Managing director">
        They challenged us.
      </Quote>
    );
    expect(screen.getByText('They challenged us.')).toBeInTheDocument();
    expect(screen.getByText(/Sam Whitfield/)).toBeInTheDocument();
  });

  it('renders a plain Card', () => {
    render(<Card tone="ink">Body</Card>);
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});

describe('oj/feedback', () => {
  it('announces a danger alert but does not interrupt for info', () => {
    const { rerender } = render(<Alert tone="danger" title="Could not send" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Could not send');

    rerender(<Alert tone="info" title="Heads up" />);
    expect(screen.getByRole('status')).toHaveTextContent('Heads up');
  });

  it('gives the alert dismiss control a real name', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Alert title="Sent" onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders the modal as a labelled dialog and closes on Escape', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open onClose={onClose} title="Before you go">
        Body
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Before you go');

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('renders nothing when the modal is closed', () => {
    render(<Modal open={false} title="Hidden" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('always offers a way out of an empty state', () => {
    render(
      <EmptyState
        title="Nothing here"
        body="No articles match that filter."
        action={{ label: 'Clear filters', href: '/insights' }}
      />
    );
    expect(screen.getByRole('link', { name: 'Clear filters' })).toHaveAttribute(
      'href',
      '/insights'
    );
  });

  it('announces loading once rather than reading placeholder boxes', () => {
    render(<Skeleton variant="article" lines={4} />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });
});

describe('oj/editorial', () => {
  const FAQS = [
    { q: 'What does it cost?', a: 'Every engagement is scoped to the problem.' },
    { q: 'How long does it take?', a: 'A diagnostic is two to three weeks.' },
  ];

  it('builds the FAQ from real disclosure elements so it works without JavaScript', async () => {
    const user = userEvent.setup();
    const { container } = render(<FAQ items={FAQS} />);

    expect(container.querySelectorAll('details')).toHaveLength(2);
    const first = screen.getByText('What does it cost?');
    expect(first.closest('details')).not.toHaveAttribute('open');

    await user.click(first);
    expect(first.closest('details')).toHaveAttribute('open');
  });

  it('can open the first FAQ row initially', () => {
    render(<FAQ items={FAQS} openFirst />);
    expect(screen.getByText('What does it cost?').closest('details')).toHaveAttribute('open');
  });

  it('marks the current section in the table of contents', () => {
    render(
      <Toc
        items={[
          { label: 'The problem', href: '#problem' },
          { label: 'What we built', href: '#built' },
        ]}
        current="#built"
      />
    );
    expect(screen.getByRole('link', { name: 'What we built' })).toHaveAttribute(
      'aria-current',
      'location'
    );
  });

  it('never renders a category in orange', () => {
    // Orange is the action signal. A category wearing it competes with every CTA.
    const { container } = render(<CategoryTag category="margin" filled />);
    expect(container.firstElementChild?.className).not.toMatch(/oj-orange/);
    expect(container.firstElementChild?.className).toContain('cat-margin');
  });

  it('makes the whole ArticleCard the link', () => {
    render(<ArticleCard title="Where AI helps an accountancy practice" href="/insights/ai" />);
    expect(screen.getByRole('link', { name: /accountancy practice/ })).toHaveAttribute(
      'href',
      '/insights/ai'
    );
  });

  it('collapses pagination past seven pages and keeps links crawlable', () => {
    render(<Pagination page={5} total={12} hrefFor={(n) => `/insights?page=${n}`} />);

    expect(screen.getByRole('link', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Page 12' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Page 5' })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'Page 8' })).not.toBeInTheDocument();
  });

  it('does not collapse when there are seven pages or fewer', () => {
    render(<Pagination page={1} total={7} hrefFor={(n) => `?p=${n}`} />);
    expect(screen.getAllByRole('link')).toHaveLength(7);
  });

  it('moves between tabs with arrow keys', async () => {
    const user = userEvent.setup();
    render(
      <Tabs
        items={[
          { label: 'Demand', content: 'Demand panel' },
          { label: 'Margin', content: 'Margin panel' },
        ]}
      />
    );

    expect(screen.getByText('Demand panel')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Demand' }));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Margin' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Margin panel')).toBeInTheDocument();
  });

  it('caps the next-step chain at two links', () => {
    render(
      <NextStep
        from="article"
        links={[
          { stage: 'The problem', title: 'A', href: '/a' },
          { stage: 'The proof', title: 'B', href: '/b' },
          { stage: 'Next step', title: 'C', href: '/c' },
        ]}
      />
    );
    // More than two dilutes the chain, so the third is dropped rather than rendered.
    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.queryByText('C')).not.toBeInTheDocument();
  });
});
