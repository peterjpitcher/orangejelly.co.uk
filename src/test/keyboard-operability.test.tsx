import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SCORECARD_QUESTIONS } from '@/components/oj/scorecard-questions';
import { Header, Modal, Scorecard, Tabs } from '@/components/oj';
import { EnquiryForm } from '@/components/oj/EnquiryForm';
import type * as ReactDom from 'react-dom';

/**
 * Keyboard operability, for the interactions where it is easy to claim and hard to
 * verify.
 *
 * Every one of these components has a comment saying it handles focus properly.
 * These are the assertions behind those comments. The failure mode is specific and
 * nasty: a drawer or dialog that opens, moves nothing, and leaves a keyboard user
 * tabbing through the page underneath it with no idea anything happened.
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

describe('the mobile drawer', () => {
  const ITEMS = [
    { label: 'Growth problems', href: '/growth-problems' },
    { label: 'How we work', href: '/how-we-work' },
  ];

  it('moves focus into the drawer when it opens', async () => {
    const user = userEvent.setup();
    render(<Header items={ITEMS} cta={{ label: 'Bring us the problem', href: '/start-here' }} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    // Without this a keyboard user opens the menu and is still in the page behind
    // it, tabbing through links they cannot see.
    expect(screen.getByRole('navigation', { name: 'Primary mobile' })).toHaveFocus();
  });

  it('closes on Escape and returns focus to the control that opened it', async () => {
    const user = userEvent.setup();
    render(<Header items={ITEMS} />);

    const toggle = screen.getByRole('button', { name: 'Menu' });
    await user.click(toggle);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('navigation', { name: 'Primary mobile' })).not.toBeInTheDocument();
    // Returning focus matters as much as taking it. Dropping it sends the user
    // back to the top of the document.
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus();
  });

  it('stops the page behind it scrolling while it is open', async () => {
    const user = userEvent.setup();
    render(<Header items={ITEMS} />);

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});

describe('the modal', () => {
  it('is reachable, labelled and dismissible from the keyboard alone', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal open onClose={onClose} title="Before you go">
        <button type="button">Inside</button>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Before you go');

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});

describe('the enquiry form', () => {
  it('can be completed in tab order without touching a mouse', async () => {
    const user = userEvent.setup();
    render(<EnquiryForm />);

    await user.tab();
    // Walk forward until the first real field has focus, then check the rest
    // follow in the order they are read.
    const order = ['Your name', 'Work email', 'Company', 'What is happening in the business'];
    for (const label of order) {
      const field = screen.getByLabelText(new RegExp(label));
      // Focus by tabbing rather than by calling focus(), so this fails if a
      // tabindex or a hidden element breaks the sequence.
      let guard = 0;
      while (document.activeElement !== field && guard < 30) {
        await user.tab();
        guard += 1;
      }
      expect(document.activeElement, label).toBe(field);
    }
  });

  it('never puts the honeypot in the tab order', async () => {
    const { container } = render(<EnquiryForm />);
    const honeypot = container.querySelector('input[name="subject"]');
    // A honeypot a keyboard user can tab into is a honeypot a keyboard user will
    // eventually fill in, and their enquiry is then silently discarded.
    expect(honeypot).toHaveAttribute('tabindex', '-1');
  });

  it('associates every field with its label, which is what a screen reader reads', () => {
    render(<EnquiryForm />);
    for (const label of ['Your name', 'Work email', 'Company', 'What is happening']) {
      expect(screen.getByLabelText(new RegExp(label))).toBeInTheDocument();
    }
  });
});

describe('the scorecard', () => {
  it('groups each statement so a screen reader reads the question with the options', () => {
    const { container } = render(<Scorecard />);
    const fieldsets = container.querySelectorAll('fieldset');
    expect(fieldsets).toHaveLength(SCORECARD_QUESTIONS.length);
    for (const fieldset of fieldsets) {
      expect(fieldset.querySelector('legend')).not.toBeNull();
    }
  });

  it('announces progress as it changes rather than silently', async () => {
    const user = userEvent.setup();
    render(<Scorecard />);

    const progress = screen.getByText(`0 of ${SCORECARD_QUESTIONS.length} answered`);
    expect(progress).toHaveAttribute('aria-live', 'polite');

    const first = screen.getByText(SCORECARD_QUESTIONS[0].text).closest('fieldset') as HTMLElement;
    await user.click(within(first).getByText('Often'));
    expect(screen.getByText(`1 of ${SCORECARD_QUESTIONS.length} answered`)).toBeInTheDocument();
  });

  it('can be answered with the keyboard', async () => {
    const user = userEvent.setup();
    render(<Scorecard />);

    const first = screen.getByText(SCORECARD_QUESTIONS[0].text).closest('fieldset') as HTMLElement;
    const radios = within(first).getAllByRole('radio');
    radios[0].focus();
    await user.keyboard('{ArrowRight}');
    expect(radios[1]).toBeChecked();
  });
});

describe('tabs', () => {
  it('follows the arrow-key pattern a screen reader user expects', async () => {
    const user = userEvent.setup();
    render(
      <Tabs
        items={[
          { label: 'Demand', content: 'Demand panel' },
          { label: 'Margin', content: 'Margin panel' },
        ]}
      />
    );

    await user.click(screen.getByRole('tab', { name: 'Demand' }));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Margin' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Demand' })).toHaveAttribute('aria-selected', 'true');
  });
});
