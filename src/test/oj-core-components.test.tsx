import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button, Stat, Tag, Mark } from '@/components/oj';

/**
 * Behaviour tests for the ported core components.
 *
 * These assert the parts of each contract that a type signature cannot: that the
 * arrow is hidden from assistive technology, that a Button with href is a link and
 * without one is a button, that the dot is decorative, and that a stat's
 * qualifying sentence survives.
 *
 * Visual fidelity is checked in the harness at /dev/components, not here. A test
 * asserting Tailwind class strings would pass while the component looked wrong,
 * which is worse than no test.
 */
describe('oj/Button', () => {
  it('renders a button by default and a link when given href', () => {
    const { rerender } = render(<Button>Bring us the problem</Button>);
    expect(screen.getByRole('button', { name: 'Bring us the problem' })).toBeInTheDocument();

    rerender(<Button href="/start-here">Bring us the problem</Button>);
    expect(screen.getByRole('link', { name: 'Bring us the problem' })).toHaveAttribute(
      'href',
      '/start-here'
    );
  });

  it('defaults to type="button" so it cannot submit a form by accident', () => {
    render(<Button>Plain action</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('lets an explicit type win, so it can still be a submit button', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('hides the arrow from assistive technology', () => {
    render(<Button arrow>Book a growth diagnostic</Button>);
    // The accessible name must be the instruction alone. A screen reader announcing
    // "right arrow" adds nothing to "Book a growth diagnostic".
    expect(screen.getByRole('button')).toHaveAccessibleName('Book a growth diagnostic');
    expect(screen.getByText('→')).toHaveAttribute('aria-hidden', 'true');
  });

  it('fires onClick and respects disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={onClick} disabled>
        Go
      </Button>
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('meets the 44px tap target floor', () => {
    render(<Button size="sm">Small</Button>);
    // The smallest size is the one that would fail, so it is the one worth asserting.
    expect(screen.getByRole('button').className).toContain('min-h-tap');
  });
});

describe('oj/Stat', () => {
  it('renders value, label and the qualifying sentence', () => {
    render(
      <Stat
        value="403%"
        label="Table bookings"
        sub="Against the 2024 baseline, measured at The Anchor"
      />
    );

    expect(screen.getByText('403%')).toBeInTheDocument();
    expect(screen.getByText('Table bookings')).toBeInTheDocument();
    expect(
      screen.getByText('Against the 2024 baseline, measured at The Anchor')
    ).toBeInTheDocument();
  });

  it('omits the qualifying sentence when there is none', () => {
    const { container } = render(<Stat value="98%" label="Food revenue" />);
    expect(container.querySelectorAll('span')).toHaveLength(2);
  });
});

describe('oj/Tag', () => {
  it('renders its label', () => {
    render(<Tag>Protect margin</Tag>);
    expect(screen.getByText('Protect margin')).toBeInTheDocument();
  });

  it('keeps the dot decorative and out of the accessible name', () => {
    const { container } = render(<Tag dot="ok">Taking work</Tag>);
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toBeTruthy();
    expect(screen.getByText('Taking work').closest('span')).toHaveTextContent('Taking work');
  });

  it('can be rendered without a dot', () => {
    const { container } = render(<Tag dot={false}>Demand</Tag>);
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});

describe('oj/Mark', () => {
  it('forces readable text on the peach block', () => {
    const { container } = render(<Mark>the problem</Mark>);
    // Peach sets both ground and foreground so it cannot inherit an unreadable pair.
    expect(container.firstElementChild?.className).toContain('text-oj-ink');
  });

  it('uses a lower-half gradient for the orange sweep', () => {
    const { container } = render(<Mark tone="orange">the problem</Mark>);
    const cls = container.firstElementChild?.className ?? '';
    // Starting at 55% is what keeps ascenders clear of the band.
    expect(cls).toContain('linear-gradient');
    expect(cls).toContain('55%');
    expect(cls).not.toContain('text-oj-ink');
  });
});
