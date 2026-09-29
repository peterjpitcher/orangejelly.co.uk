import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import UpdateEmailsControl from './update-emails-control';
import { setUpdateEmails } from '@/app/actions/poll-organiser';

/**
 * The switch the emails' unsubscribe link lands on (`#emails`). It has to show
 * the current state, offer the opposite, and say so when the change fails.
 */

vi.mock('@/app/actions/poll-organiser', () => ({ setUpdateEmails: vi.fn() }));

const TOKEN = 'aaaaaaaaaaaaaaaaaaaaaa';

beforeEach(() => {
  vi.mocked(setUpdateEmails).mockReset().mockResolvedValue({ success: true });
});

describe('UpdateEmailsControl', () => {
  it('should sit at #emails, where the unsubscribe link lands', () => {
    const { container } = render(<UpdateEmailsControl organiserToken={TOKEN} emailsOn />);

    expect(container.querySelector('#emails')).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'Update emails' })).toBeInTheDocument();
  });

  it('should say the emails are on and offer to turn them off', async () => {
    const user = userEvent.setup();
    render(<UpdateEmailsControl organiserToken={TOKEN} emailsOn />);

    expect(screen.getByText(/^On\./)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Turn them off' }));

    await waitFor(() => expect(setUpdateEmails).toHaveBeenCalledWith(TOKEN, false));
  });

  it('should say the emails are off and offer to turn them back on', async () => {
    const user = userEvent.setup();
    render(<UpdateEmailsControl organiserToken={TOKEN} emailsOn={false} />);

    expect(screen.getByText(/^Off\./)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Turn them back on' }));

    await waitFor(() => expect(setUpdateEmails).toHaveBeenCalledWith(TOKEN, true));
  });

  it('should show the failure rather than pretend it switched', async () => {
    vi.mocked(setUpdateEmails).mockResolvedValue({
      error: 'The poll was not updated. Please try again.',
    });
    const user = userEvent.setup();
    render(<UpdateEmailsControl organiserToken={TOKEN} emailsOn />);

    await user.click(screen.getByRole('button', { name: 'Turn them off' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('The poll was not updated');
  });
});
