import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SuccessState } from './create-poll-form';
import { resendVerification } from '@/app/actions/polls';

/**
 * What the organiser sees once createPoll has stored the poll.
 *
 * The case that matters is the verification email NOT going. Until 29 September
 * 2026 this screen said "We've sent your links" whatever happened to the send,
 * so an organiser whose email failed waited for a message that was never coming
 * and their poll never went live. A public write path that fails has to show the
 * person it failed, and offer them a way on.
 */

vi.mock('@/app/actions/polls', () => ({
  createPoll: vi.fn(),
  resendVerification: vi.fn(),
}));

const resend = vi.mocked(resendVerification);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('create poll success screen', () => {
  it('should tell the organiser the email went when it did', () => {
    render(
      <SuccessState email="sam@example.com" resendToken="r-token" links={null} invitation={null} />
    );

    expect(screen.getByRole('heading', { name: 'Check your inbox' })).toBeInTheDocument();
    expect(screen.getByText("We've sent your links")).toBeInTheDocument();
  });

  it('should say the email did not go, and not claim it was sent, when the send failed', () => {
    render(
      <SuccessState
        email="sam@example.com"
        resendToken="r-token"
        mailFailed
        links={null}
        invitation={null}
      />
    );

    expect(screen.getByRole('heading', { name: "Your email didn't go" })).toBeInTheDocument();
    expect(screen.getByText("We couldn't send your confirmation email")).toBeInTheDocument();
    expect(screen.queryByText("We've sent your links")).not.toBeInTheDocument();
    // The way on: resend, and a person to message if that fails too.
    expect(screen.getByRole('button', { name: 'Send it again' })).toBeInTheDocument();
    expect(screen.getByText(/message Peter on WhatsApp/)).toBeInTheDocument();
  });

  it('should switch to the sent message once a resend succeeds', async () => {
    resend.mockResolvedValue({ success: true });
    const user = userEvent.setup();

    render(
      <SuccessState
        email="sam@example.com"
        resendToken="r-token"
        mailFailed
        links={null}
        invitation={null}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Send it again' }));

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Check your inbox' })).toBeInTheDocument()
    );
    expect(resend).toHaveBeenCalledWith('r-token');
    expect(screen.getByText(/Sent again/)).toBeInTheDocument();
  });

  it('should show the resend failure when the second attempt fails too', async () => {
    resend.mockResolvedValue({
      error: 'We could not send that email. Please message Peter on WhatsApp.',
    });
    const user = userEvent.setup();

    render(
      <SuccessState
        email="sam@example.com"
        resendToken="r-token"
        mailFailed
        links={null}
        invitation={null}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Send it again' }));

    expect(await screen.findByText(/We could not send that email/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: "Your email didn't go" })).toBeInTheDocument();
  });

  it('should say how many invitations went when every one did', () => {
    render(
      <SuccessState
        email="peter@orangejelly.co.uk"
        resendToken={null}
        invitations={{ total: 3, sent: 3, failed: 0 }}
        links={{
          participantUrl: 'https://www.orangejelly.co.uk/availability/p/p',
          organiserUrl: 'https://www.orangejelly.co.uk/availability/o/o',
          organiserToken: 'o',
        }}
        invitation={null}
      />
    );

    expect(screen.getByText('Invitations sent')).toBeInTheDocument();
    expect(screen.getByText(/emailed 3 people/)).toBeInTheDocument();
  });

  it('should say which invitations did not send, never fold them into a success', () => {
    render(
      <SuccessState
        email="peter@orangejelly.co.uk"
        resendToken={null}
        invitations={{ total: 3, sent: 2, failed: 1 }}
        links={{
          participantUrl: 'https://www.orangejelly.co.uk/availability/p/p',
          organiserUrl: 'https://www.orangejelly.co.uk/availability/o/o',
          organiserToken: 'o',
        }}
        invitation={null}
      />
    );

    expect(screen.getByText("1 invitation didn't send")).toBeInTheDocument();
    expect(screen.getByText(/We emailed 2 of 3/)).toBeInTheDocument();
    expect(screen.queryByText('Invitations sent')).toBeNull();
  });
});
