import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  OfferCard,
  CompareTable,
  LogoStrip,
  NewsletterBand,
  SeasonalBand,
  PressureMap,
  PressureCheck,
  Scorecard,
  StickyCTA,
  CookieNotice,
  ShareRow,
  SCORECARD_QUESTIONS,
} from '@/components/oj';

describe('oj/marketing', () => {
  it('keeps OfferCard price-free', () => {
    // D3: all work is bespoke and no price appears on the site. There is no price
    // prop to pass, which is the point: the component cannot be misused.
    render(
      <OfferCard
        name="Growth diagnostic"
        blurb="Find what is actually blocking growth."
        includes={['Leadership interviews', 'Growth Pressure Map']}
        footnote="Fixed fee, agreed on the scoping call."
        cta={{ label: "Let's talk", href: '/start-here' }}
      />
    );

    expect(screen.getByText('Growth diagnostic')).toBeInTheDocument();
    expect(screen.getByText('Fixed fee, agreed on the scoping call.')).toBeInTheDocument();
    expect(screen.queryByText(/£/)).not.toBeInTheDocument();
  });

  it('gives comparison ticks a text equivalent', () => {
    render(
      <CompareTable
        columns={['Diagnostic', 'Sprint']}
        rows={[{ label: 'Baseline agreed', values: [true, false] }]}
      />
    );
    // A tick glyph alone carries meaning by shape, which a screen reader will not read.
    expect(screen.getByText('Included')).toBeInTheDocument();
    expect(screen.getByText('Not included')).toBeInTheDocument();
  });

  it('renders type-only marks when no logo file is given', () => {
    render(<LogoStrip items={['Greene King', 'BII']} />);
    expect(screen.getByText('Greene King')).toBeInTheDocument();
    expect(screen.getByText('BII')).toBeInTheDocument();
  });

  it('labels the newsletter email field even though the label is visually hidden', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<NewsletterBand onSubmit={onSubmit} />);

    const input = screen.getByLabelText('Work email');
    await user.type(input, 'sam@company.co.uk');
    await user.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(onSubmit).toHaveBeenCalledWith('sam@company.co.uk');
  });

  it('renders seasonal items as links', () => {
    render(
      <SeasonalBand items={[{ month: 'October', event: 'Oktoberfest', href: '/g/oktoberfest' }]} />
    );
    expect(screen.getByRole('link', { name: /Oktoberfest/ })).toHaveAttribute(
      'href',
      '/g/oktoberfest'
    );
  });
});

describe('oj/diagnostic', () => {
  it('states pressure in words, not only in colour', () => {
    // Encoding pressure in fill alone fails 1.4.1 and is unreadable in print.
    render(
      <PressureMap
        areas={[
          { id: 'demand', label: 'Demand', pressure: 3 },
          { id: 'margin', label: 'Margin', pressure: 0 },
        ]}
      />
    );
    expect(screen.getByText('critical')).toBeInTheDocument();
    expect(screen.getByText('steady')).toBeInTheDocument();
  });

  it('never shows a total or a score', () => {
    const { container } = render(<Scorecard />);
    // A number invites a league table, which is the false precision the pack argues
    // against. Progress is a count of answers, never a mark.
    expect(container.textContent).not.toMatch(/out of 10|\/100|score/i);
  });

  it('reveals the connected causes when a symptom is chosen', async () => {
    const user = userEvent.setup();
    render(<PressureCheck />);

    const button = screen.getByRole('button', { name: "Leads aren't converting" });
    expect(button).toHaveAttribute('aria-pressed', 'false');

    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/the fault is usually in the handover/)).toBeInTheDocument();
  });

  it('lets the same symptom be unselected', async () => {
    const user = userEvent.setup();
    render(<PressureCheck />);
    const button = screen.getByRole('button', { name: 'Growth has stalled' });

    await user.click(button);
    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('counts progress through the scorecard', async () => {
    const user = userEvent.setup();
    render(<Scorecard />);

    expect(screen.getByText(`0 of ${SCORECARD_QUESTIONS.length} answered`)).toBeInTheDocument();
    const firstGroup = screen.getByText(SCORECARD_QUESTIONS[0].text).closest('fieldset');
    await user.click(within(firstGroup as HTMLElement).getByText('Often'));
    expect(screen.getByText(`1 of ${SCORECARD_QUESTIONS.length} answered`)).toBeInTheDocument();
  });

  it('reverse-scores the operations statements so straight-lining does not work', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<Scorecard onComplete={onComplete} />);

    // Answer everything "Always". On the positive statements that is healthy; on the
    // two reverse-scored operations statements it is the worst possible answer.
    for (const question of SCORECARD_QUESTIONS) {
      const group = screen.getByText(question.text).closest('fieldset') as HTMLElement;
      await user.click(within(group).getByText('Always'));
    }

    expect(onComplete).toHaveBeenCalled();
    // Operations must not come out steady when both its statements were answered
    // "always" and both are the bad direction.
    expect(screen.getByText(/The heaviest pressure looks like/)).toHaveTextContent('operations');
  });

  it('calls the result a signal rather than a diagnosis', async () => {
    const user = userEvent.setup();
    render(<Scorecard />);
    for (const question of SCORECARD_QUESTIONS) {
      const group = screen.getByText(question.text).closest('fieldset') as HTMLElement;
      await user.click(within(group).getByText('Sometimes'));
    }
    expect(screen.getByText('This is a signal, not a diagnosis.')).toBeInTheDocument();
  });
});

describe('oj/conversion', () => {
  // jsdom in this project does not provide localStorage, and CookieNotice must keep
  // working where storage is missing or blocked (private windows, locked-down
  // browsers). A minimal in-memory stand-in exercises the remembering path; the
  // component's own try/catch covers the absent case.
  beforeEach(() => {
    const store = new Map<string, string>();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, v),
        removeItem: (k: string) => void store.delete(k),
        clear: () => store.clear(),
        key: () => null,
        length: 0,
      },
    });
  });

  it('shows the sticky CTA immediately when showAfter is 0', () => {
    render(<StickyCTA showAfter={0} />);
    expect(screen.getByRole('link', { name: /Let's talk/ })).toBeInTheDocument();
  });

  it('can be dismissed', async () => {
    const user = userEvent.setup();
    render(<StickyCTA showAfter={0} />);
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('link', { name: /Let's talk/ })).not.toBeInTheDocument();
  });

  it('gives accept and decline equal weight', () => {
    window.localStorage.removeItem('oj-cookies');
    render(<CookieNotice />);
    // Same element type and same size. An accept that shouts and a decline that
    // whispers is a dark pattern, not consent.
    const accept = screen.getByRole('button', { name: 'Accept' });
    const decline = screen.getByRole('button', { name: 'Decline' });
    expect(accept.tagName).toBe(decline.tagName);
    expect(accept.className).toContain('text-[13.5px]');
    expect(decline.className).toContain('text-[13.5px]');
  });

  it('remembers the choice and does not ask again', async () => {
    window.localStorage.removeItem('oj-cookies');
    const user = userEvent.setup();
    const onDecline = vi.fn();
    const { unmount } = render(<CookieNotice onDecline={onDecline} />);

    await user.click(screen.getByRole('button', { name: 'Decline' }));
    expect(onDecline).toHaveBeenCalled();
    unmount();

    render(<CookieNotice />);
    expect(screen.queryByRole('button', { name: 'Decline' })).not.toBeInTheDocument();
  });

  it('warns that share links open in a new tab', () => {
    render(<ShareRow url="https://orangejelly.co.uk/insights/ai" title="AI for accountants" />);
    const linkedin = screen.getByRole('link', { name: /LinkedIn/ });
    expect(linkedin).toHaveAttribute('target', '_blank');
    expect(linkedin).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(linkedin).toHaveAccessibleName(/opens in a new tab/);
  });
});
