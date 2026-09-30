import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import InviteesSection from './invitees-section';
import { inviteByEmail, retryInvitations } from '@/app/actions/poll-invitees';
import { inviteeStatus } from '@/app/availability/o/organiser-data';
import type * as OrganiserData from '@/app/availability/o/organiser-data';

/**
 * The organiser's invite list. The list shows to whoever holds the organiser
 * link; the controls only to a signed-in admin, and a failed send is said out
 * loud rather than folded into a success message.
 */

vi.mock('@/app/actions/poll-invitees', () => ({
  inviteByEmail: vi.fn(),
  retryInvitations: vi.fn(),
  removeInvitation: vi.fn(),
}));

vi.mock('@/app/availability/o/organiser-data', async (importOriginal) => {
  // Only the pure status helper is used here; the module's data reads never run.
  const actual = await importOriginal<typeof OrganiserData>();
  return { inviteeStatus: actual.inviteeStatus };
});

vi.mock('@/lib/admin-session', () => ({
  readSession: vi.fn(() => (signedIn ? { access_token: 'admin-jwt' } : null)),
  getValidAccessToken: vi.fn(async () => (signedIn ? 'admin-jwt' : null)),
}));

let signedIn = false;
const TOKEN = 'aaaaaaaaaaaaaaaaaaaaaa';

const invitees = [
  { id: 'i1', email: 'sam@example.com', status: 'answered' as const },
  { id: 'i2', email: 'alex@example.com', status: 'waiting' as const },
  { id: 'i3', email: 'jo@example.com', status: 'unsent' as const },
];

beforeEach(() => {
  vi.clearAllMocks();
  signedIn = false;
});

describe('InviteesSection', () => {
  it('should render nothing for a poll with no list and nobody signed in', () => {
    const { container } = render(<InviteesSection organiserToken={TOKEN} pollOpen invitees={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should show who has answered, without controls, to a guest holding the link', () => {
    render(<InviteesSection organiserToken={TOKEN} pollOpen invitees={invitees} />);

    expect(screen.getByText('1 of 3 have answered.', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('✓ Answered')).toBeInTheDocument();
    expect(screen.getByText('Email didn’t send')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Remove/ })).toBeNull();
  });

  it('should give a signed-in admin the controls', async () => {
    signedIn = true;
    render(<InviteesSection organiserToken={TOKEN} pollOpen invitees={invitees} />);

    expect(
      await screen.findByRole('button', { name: 'Try the unsent ones again' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Invite more people')).toBeInTheDocument();
  });

  it('should send the new list with the admin token', async () => {
    signedIn = true;
    vi.mocked(inviteByEmail).mockResolvedValue({
      success: true,
      invited: { added: 1, alreadyInvited: 0, sent: 1, failed: 0 },
    });
    const user = userEvent.setup();
    render(<InviteesSection organiserToken={TOKEN} pollOpen invitees={[]} />);

    await user.type(await screen.findByLabelText('Invite people by email'), 'kim@example.com');
    await user.click(screen.getByRole('button', { name: 'Email the invitation' }));

    await waitFor(() =>
      expect(inviteByEmail).toHaveBeenCalledWith(TOKEN, 'admin-jwt', 'kim@example.com')
    );
    expect(await screen.findByText('Sent to 1 person.')).toBeInTheDocument();
  });

  it('should say out loud when an invitation did not send', async () => {
    signedIn = true;
    vi.mocked(retryInvitations).mockResolvedValue({
      success: true,
      invited: { added: 0, alreadyInvited: 0, sent: 0, failed: 1 },
    });
    const user = userEvent.setup();
    render(<InviteesSection organiserToken={TOKEN} pollOpen invitees={invitees} />);

    await user.click(await screen.findByRole('button', { name: 'Try the unsent ones again' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('1 invitation didn’t send');
  });
});

describe('inviteeStatus', () => {
  it('should put answered ahead of everything', () => {
    expect(inviteeStatus({ participant_id: 'p', opted_out_at: 'x', invited_at: null })).toBe(
      'answered'
    );
  });

  it('should tell stopped, unsent and waiting apart', () => {
    expect(inviteeStatus({ participant_id: null, opted_out_at: 'x', invited_at: 'y' })).toBe(
      'stopped'
    );
    expect(inviteeStatus({ participant_id: null, opted_out_at: null, invited_at: null })).toBe(
      'unsent'
    );
    expect(inviteeStatus({ participant_id: null, opted_out_at: null, invited_at: 'y' })).toBe(
      'waiting'
    );
  });
});
