import { beforeEach, describe, expect, it, vi } from 'vitest';

import { submitContactForm } from './contact';
import { storeContactLead } from '@/lib/db/leads';
import { sendLeadNotification } from '@/lib/email';

vi.mock('@/lib/db/leads', () => ({
  storeContactLead: vi.fn(),
}));

vi.mock('@/lib/email', () => ({
  sendLeadNotification: vi.fn().mockResolvedValue({ success: true }),
  escapeHtml: (value: string) => value,
}));

const validContact = {
  name: 'Jane Landlord',
  email: 'jane@example.com',
  phone: '07700 900000',
  pubName: 'The Test Arms',
  package: 'growth-fix',
  message: 'Please help me fill our quiet midweek nights.',
  leadSource: {
    sourcePage: '/contact?utm_source=test',
    landingPage: '/',
    utmSource: 'test',
  },
};

describe('submitContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects invalid input without storing a lead', async () => {
    const result = await submitContactForm({ ...validContact, name: 'J' });

    expect(result.error).toBeDefined();
    expect(storeContactLead).not.toHaveBeenCalled();
  });

  it('stores valid contact leads and sends a notification', async () => {
    vi.mocked(storeContactLead).mockResolvedValue({ stored: true, id: 'lead-1' });

    const result = await submitContactForm(validContact);

    expect(result.success).toBe(true);
    expect(storeContactLead).toHaveBeenCalledWith(validContact);
    expect(sendLeadNotification).toHaveBeenCalledOnce();
    expect(vi.mocked(sendLeadNotification).mock.calls[0][0]).toMatchObject({
      replyTo: validContact.email,
    });
  });

  it('still reports success when the notification fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(storeContactLead).mockResolvedValue({ stored: true, id: 'lead-2' });
    vi.mocked(sendLeadNotification).mockRejectedValueOnce(new Error('Resend down'));

    const result = await submitContactForm(validContact);

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
    errorSpy.mockRestore();
  });

  it('does not send a notification when storage fails', async () => {
    vi.mocked(storeContactLead).mockResolvedValue({ stored: false, error: 'Database unavailable' });

    await submitContactForm(validContact);

    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it('does not report success when lead storage fails', async () => {
    vi.mocked(storeContactLead).mockResolvedValue({ stored: false, error: 'Database unavailable' });

    const result = await submitContactForm(validContact);

    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
  });

  it('silently accepts honeypot submissions without storing', async () => {
    const result = await submitContactForm({ ...validContact, website: 'https://spam.test' });

    expect(result.success).toBe(true);
    expect(storeContactLead).not.toHaveBeenCalled();
  });
});
