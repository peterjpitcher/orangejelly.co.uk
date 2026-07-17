import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resolveAdminIdentity } from './admin-identity';

/**
 * This module decides whether poll creation may skip email verification, so
 * every test here is really asking one question: can somebody who is not a
 * signed-in admin reach the fast path by claiming to be one?
 *
 * The answer must be no for every negative case, and the negatives must be
 * indistinguishable from each other to the caller.
 */

const getUser = vi.fn();

vi.mock('./db/supabase-admin', () => ({
  isSupabaseAdminConfigured: vi.fn(() => true),
  getSupabaseAdminClient: vi.fn(() => ({ auth: { getUser } })),
}));

beforeEach(() => {
  vi.clearAllMocks();
  process.env.ADMIN_EMAILS = 'peter@orangejelly.co.uk';
  getUser.mockResolvedValue({ data: { user: { email: 'peter@orangejelly.co.uk' } }, error: null });
});

describe('resolveAdminIdentity', () => {
  it('should resolve the admin when the token is live and the address is allowlisted', async () => {
    await expect(resolveAdminIdentity('good-token')).resolves.toEqual({
      email: 'peter@orangejelly.co.uk',
    });
  });

  it('should verify the token WITH Supabase rather than decoding it locally', async () => {
    // The whole security of the fast path rests on this call happening. A local
    // decode would trust a token the browser handed us, which is the same as
    // trusting the browser.
    await resolveAdminIdentity('good-token');
    expect(getUser).toHaveBeenCalledWith('good-token');
  });

  it('should refuse when no token is given', async () => {
    await expect(resolveAdminIdentity(undefined)).resolves.toBeNull();
    expect(getUser).not.toHaveBeenCalled();
  });

  it('should refuse when the token is rejected by Supabase', async () => {
    getUser.mockResolvedValueOnce({ data: { user: null }, error: { message: 'bad jwt' } });
    await expect(resolveAdminIdentity('forged-token')).resolves.toBeNull();
  });

  it('should refuse a valid token whose address is not on the allowlist', async () => {
    // A real Supabase account is not the same as an Orange Jelly admin. Anyone
    // can sign up; the allowlist is the actual gate.
    getUser.mockResolvedValueOnce({
      data: { user: { email: 'stranger@example.com' } },
      error: null,
    });
    await expect(resolveAdminIdentity('real-but-not-admin')).resolves.toBeNull();
  });

  it('should refuse everyone when the allowlist is empty', async () => {
    // An unset ADMIN_EMAILS must not mean "everybody is an admin".
    process.env.ADMIN_EMAILS = '';
    await expect(resolveAdminIdentity('good-token')).resolves.toBeNull();
    expect(getUser).not.toHaveBeenCalled();
  });

  it('should refuse rather than throw when Supabase is unreachable', async () => {
    // Fail to "not an admin", never to "trust the client". The cost is one
    // unnecessary verification email; the cost of the other default is an open
    // door.
    getUser.mockRejectedValueOnce(new Error('network down'));
    await expect(resolveAdminIdentity('good-token')).resolves.toBeNull();
  });

  it('should match the allowlist case-insensitively', async () => {
    getUser.mockResolvedValueOnce({
      data: { user: { email: 'Peter@OrangeJelly.co.uk' } },
      error: null,
    });
    await expect(resolveAdminIdentity('good-token')).resolves.toEqual({
      email: 'peter@orangejelly.co.uk',
    });
  });
});
