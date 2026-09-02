import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ENQUIRY_INITIAL_STATE, type EnquiryFormState } from '@/lib/schemas/enquiry';
import { EnquiryForm } from '@/components/oj/EnquiryForm';
import type * as ReactDom from 'react-dom';

/**
 * `useFormState` belongs to Next's own React build, which resolves at build time
 * and does not exist under jsdom. It is stood in for here so each state the action
 * can return is rendered and asserted directly.
 *
 * That split is deliberate. This file tests what the person sees for a given state;
 * `enquiry-action.test.ts` tests which state the action returns. Between them the
 * whole machine is covered, and neither depends on canary form semantics.
 */
let currentState: EnquiryFormState = ENQUIRY_INITIAL_STATE;
const dispatch = vi.fn();

vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof ReactDom>('react-dom');
  return {
    ...actual,
    useFormStatus: () => ({ pending: false }),
    useFormState: () => [currentState, dispatch],
  };
});

const track = vi.fn();
vi.mock('@/lib/tracking', () => ({
  trackClientEvent: (...args: unknown[]) => track(...args),
  hasAnalyticsConsent: () => false,
}));

function renderAt(state: EnquiryFormState) {
  currentState = state;
  return render(<EnquiryForm />);
}

describe('EnquiryForm, step one', () => {
  beforeEach(() => {
    currentState = ENQUIRY_INITIAL_STATE;
    track.mockReset();
  });

  it('posts through a real form element, so it works without JavaScript', () => {
    const { container } = render(<EnquiryForm />);
    // If step one were driven by an onClick handler it would be JavaScript-only, and
    // step one is the half that writes the lead.
    expect(container.querySelector('form')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Let's talk/ })).toHaveAttribute('type', 'submit');
  });

  it('labels every field and marks the required ones for a screen reader', () => {
    render(<EnquiryForm />);
    expect(screen.getByLabelText(/Your name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Business or venue/)).toBeInTheDocument();
    expect(screen.getByLabelText(/What's going on/)).toBeInTheDocument();
    // Four required fields, each announcing it in words rather than by an asterisk.
    expect(screen.getAllByText('(required)')).toHaveLength(4);
  });

  it('gives the browser the right autocomplete hints', () => {
    render(<EnquiryForm />);
    expect(screen.getByLabelText(/Your name/)).toHaveAttribute('autocomplete', 'name');
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText(/^Business or venue/)).toHaveAttribute(
      'autocomplete',
      'organization'
    );
  });

  it('names its fields the way the action reads them', () => {
    const { container } = render(<EnquiryForm />);
    for (const name of ['name', 'email', 'company', 'situation', 'leadSource', 'subject']) {
      expect(container.querySelector(`[name="${name}"]`)).toBeInTheDocument();
    }
  });

  it('carries a honeypot that is hidden from people and from screen readers', () => {
    const { container } = render(<EnquiryForm />);
    const honeypot = container.querySelector('input[name="subject"]');
    expect(honeypot?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(honeypot).toHaveAttribute('tabindex', '-1');
  });

  it('records that the enquiry was started, once, on the first keystroke', async () => {
    const user = userEvent.setup();
    render(<EnquiryForm entryPoint="sticky" />);

    await user.type(screen.getByLabelText(/Your name/), 'Sam');
    await user.type(screen.getByLabelText(/^Business or venue/), 'Barton Reed');

    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith('enquiry_started', {
      properties: { entry_point: 'sticky' },
      dedupeKey: 'sticky',
    });
  });

  it('does not record anything before someone starts typing', () => {
    render(<EnquiryForm />);
    expect(track).not.toHaveBeenCalled();
  });
});

describe('EnquiryForm, when step one is rejected', () => {
  const REJECTED: EnquiryFormState = {
    step: 1,
    error: 'Please check the highlighted fields.',
    fieldErrors: {
      email: 'That does not look like an email address',
      situation: 'A sentence or two, so we know what we are looking at',
    },
    values: {
      name: 'Sam Whitfield',
      company: 'Barton Reed',
      email: 'sam@',
      situation: 'help',
    },
  };

  it('summarises the errors at the top and links to each field', () => {
    renderAt(REJECTED);

    const summary = screen.getByRole('alert');
    expect(summary).toHaveTextContent('There are 2 things to fix');

    const link = within(summary).getByRole('link', {
      name: 'That does not look like an email address',
    });
    expect(link).toHaveAttribute('href', '#enquiry-email');
    expect(document.getElementById('enquiry-email')).toBeInTheDocument();
  });

  it('takes focus, because the page does not move on a failed submit', () => {
    renderAt(REJECTED);
    expect(screen.getByRole('alert')).toHaveFocus();
  });

  it('counts one error in the singular', () => {
    renderAt({ ...REJECTED, fieldErrors: { email: 'That does not look like an email address' } });
    expect(screen.getByRole('alert')).toHaveTextContent('There is 1 thing to fix');
  });

  it('shows a whole-form failure when no single field is at fault', () => {
    renderAt({ step: 1, error: 'Too many enquiries from this address. Please try later.' });
    const summary = screen.getByRole('alert');
    expect(summary).toHaveTextContent('We could not send that');
    expect(summary).toHaveTextContent('Too many enquiries');
  });

  it('does not wipe what was typed', () => {
    renderAt(REJECTED);
    // Without JavaScript the page is re-rendered from scratch, and a form that
    // clears itself on a validation error is the fastest way to lose an enquiry.
    expect(screen.getByLabelText(/Your name/)).toHaveValue('Sam Whitfield');
    expect(screen.getByLabelText(/^Business or venue/)).toHaveValue('Barton Reed');
    expect(screen.getByLabelText(/What's going on/)).toHaveValue('help');
  });

  it('marks the failing fields invalid and leaves the others alone', () => {
    renderAt(REJECTED);
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/Your name/)).not.toHaveAttribute('aria-invalid');
  });
});

/*
 * REPLACED 31 August 2026, when the second screen was removed on the owner's
 * instruction. Four tests described a screen of six optional questions that no
 * longer exists. What replaces them is the guarantee that matters: the form cannot
 * render that screen again, whatever state it is handed.
 */
describe('EnquiryForm, after the second step was removed', () => {
  it('shows the confirmation, not a second screen, once the enquiry is stored', () => {
    renderAt({ step: 'done', leadId: 'lead-1' });
    const banner = screen.getByRole('status');
    expect(banner).toHaveTextContent(/that has arrived/);
    expect(banner).toHaveFocus();
    expect(screen.queryByLabelText('Your role')).not.toBeInTheDocument();
  });

  it('renders the contact fields, not the old questions, if handed a stale step two', () => {
    // A tab left open across the deploy posts `step: 2`. It must fall back to the
    // form somebody can actually use rather than to a screen that no longer exists.
    renderAt({ step: 2, leadId: 'lead-1' } as never);
    expect(screen.queryByLabelText('Your role')).not.toBeInTheDocument();
    expect(screen.queryByText('Skip this')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Your name/)).toBeInTheDocument();
  });
});

describe('EnquiryForm, confirmation', () => {
  it('confirms a person will read it, and promises no timescale', () => {
    renderAt({ step: 'done', leadId: 'lead-1' });

    const panel = screen.getByText(/that has arrived/).parentElement as HTMLElement;
    expect(panel).toHaveFocus();
    expect(panel.textContent).toMatch(/A person will read it/);
    // D23: no response time is promised anywhere on the site.
    expect(panel.textContent).not.toMatch(/within \d|24 hours|working days|shortly/i);
  });

  it('gives a way to add something afterwards', () => {
    renderAt({ step: 'done' });
    expect(screen.getByRole('link', { name: 'peter@orangejelly.co.uk' })).toHaveAttribute(
      'href',
      'mailto:peter@orangejelly.co.uk'
    );
  });
});
