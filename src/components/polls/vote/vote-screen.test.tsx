import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import VoteScreen from './vote-screen';

/**
 * The vote screen as the two ways in see it: the shared link, and an invited
 * person's own link. What differs for the invited person is pinned here: their
 * address is filled in, a second visit offers to change the answer rather than
 * take another, the stop-emails switch is there, and the privacy notice says the
 * organiser gave us their address.
 */

vi.mock('@/app/actions/poll-responses', () => ({ submitResponse: vi.fn() }));
vi.mock('@/app/actions/poll-invitees', () => ({ setInvitationEmails: vi.fn() }));

const FAR_FUTURE = new Date(Date.now() + 30 * 86_400_000).toISOString();

const view = {
  poll: {
    id: 'poll-1',
    status: 'open',
    title: 'Quiz night planning',
    description: null,
    location: null,
    agenda: null,
    organiser_name: 'Peter Pitcher',
    option_kind: 'dates',
    confirmed_option_id: null,
    closes_at: null,
    expires_at: FAR_FUTURE,
  },
  options: [{ id: 'option-1', option_date: '2026-10-08', starts_at: null, ends_at: null }],
  tallies: [{ option_id: 'option-1', yes: 0, if_need_be: 0, no: 0 }],
  responderCount: 0,
} as unknown as Parameters<typeof VoteScreen>[0]['view'];

const invite = {
  inviteToken: 'cccccccccccccccccccccc',
  email: 'sam@example.com',
  answeredEditUrl: null,
  emailsOn: true,
};

describe('VoteScreen', () => {
  it('should leave the shared link as it was: blank email, no stop switch', () => {
    render(<VoteScreen view={view} participantToken="p-token" />);

    expect((screen.getByLabelText(/Your email/) as HTMLInputElement).value).toBe('');
    expect(screen.queryByRole('heading', { name: 'Emails about this poll' })).toBeNull();
    expect(screen.getByText(/You give us these details yourself/)).toBeInTheDocument();
  });

  it("should fill in an invited person's address and offer the stop switch", () => {
    render(<VoteScreen view={view} participantToken="p-token" invite={invite} />);

    expect((screen.getByLabelText(/Your email/) as HTMLInputElement).value).toBe('sam@example.com');
    expect(screen.getByRole('heading', { name: 'Emails about this poll' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stop these emails' })).toBeInTheDocument();
  });

  it('should tell an invited person the organiser gave us their address', () => {
    render(<VoteScreen view={view} participantToken="p-token" invite={invite} />);

    expect(screen.getByText(/Peter Pitcher gave us your email address/)).toBeInTheDocument();
    expect(screen.queryByText(/You give us these details yourself/)).toBeNull();
  });

  it('should offer to change an answer rather than take a second one', () => {
    render(
      <VoteScreen
        view={view}
        participantToken="p-token"
        invite={{ ...invite, answeredEditUrl: '/availability/p/p-token/edit/e-token' }}
      />
    );

    expect(screen.getByRole('heading', { name: 'You’ve answered' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change your answers' })).toHaveAttribute(
      'href',
      '/availability/p/p-token/edit/e-token'
    );
    expect(screen.queryByLabelText(/Your email/)).toBeNull();
  });

  it('should show the switch as off once they have asked us to stop', () => {
    render(
      <VoteScreen view={view} participantToken="p-token" invite={{ ...invite, emailsOn: false }} />
    );

    expect(screen.getByRole('button', { name: 'Turn them back on' })).toBeInTheDocument();
  });
});
