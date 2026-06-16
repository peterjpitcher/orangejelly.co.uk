import { beforeEach, describe, expect, it, vi } from 'vitest';

import { subscribeToNewsletter } from './newsletter';
import { storeNewsletterSignup } from '@/lib/db/leads';

vi.mock('@/lib/db/leads', () => ({
  storeNewsletterSignup: vi.fn(),
}));

describe('subscribeToNewsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects invalid email addresses without storing', async () => {
    const result = await subscribeToNewsletter({ email: 'not-an-email' });

    expect(result.error).toBeDefined();
    expect(storeNewsletterSignup).not.toHaveBeenCalled();
  });

  it('stores valid newsletter signups with attribution', async () => {
    vi.mocked(storeNewsletterSignup).mockResolvedValue({ stored: true, id: 'subscriber-1' });

    const result = await subscribeToNewsletter({
      email: 'reader@example.com',
      leadSource: {
        sourcePage: '/licensees-guide?utm_source=test',
        landingPage: '/',
        utmSource: 'test',
      },
    });

    expect(result.success).toBe(true);
    expect(storeNewsletterSignup).toHaveBeenCalledWith({
      email: 'reader@example.com',
      leadSource: {
        sourcePage: '/licensees-guide?utm_source=test',
        landingPage: '/',
        utmSource: 'test',
      },
    });
  });

  it('does not report success when subscriber storage fails', async () => {
    vi.mocked(storeNewsletterSignup).mockResolvedValue({
      stored: false,
      error: 'DATABASE_URL is not configured.',
    });

    const result = await subscribeToNewsletter({ email: 'reader@example.com' });

    expect(result.success).toBeUndefined();
    expect(result.error).toBeDefined();
  });

  it('silently accepts honeypot submissions without storing', async () => {
    const result = await subscribeToNewsletter({
      email: 'reader@example.com',
      website: 'https://spam.test',
    });

    expect(result.success).toBe(true);
    expect(storeNewsletterSignup).not.toHaveBeenCalled();
  });
});
