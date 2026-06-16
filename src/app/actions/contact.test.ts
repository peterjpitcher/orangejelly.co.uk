import { beforeEach, describe, expect, it, vi } from 'vitest';

import { submitContactForm } from './contact';
import { storeContactLead } from '@/lib/db/leads';

vi.mock('@/lib/db/leads', () => ({
  storeContactLead: vi.fn(),
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

  it('stores valid contact leads', async () => {
    vi.mocked(storeContactLead).mockResolvedValue({ stored: true, id: 'lead-1' });

    const result = await submitContactForm(validContact);

    expect(result.success).toBe(true);
    expect(storeContactLead).toHaveBeenCalledWith(validContact);
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
