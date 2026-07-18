import { getSupabaseAdminClient, isSupabaseAdminConfigured } from '@/lib/db/supabase-admin';
import { getAllowedAdminEmails, isAllowedAdmin } from '@/lib/admin-auth';

/**
 * Resolves a signed-in admin from a Supabase access token, server-side.
 *
 * This exists so poll creation can skip email verification for the one person
 * who has already proved who they are. The verification step is not ceremony:
 * `/availability/new` is public, and without it a script could use our sending
 * domain to mail strangers, which damages deliverability for real client mail.
 * But that gate is aimed at strangers. Making the organiser prove an address
 * they already authenticated with, on a page reached from a dashboard they had
 * to sign in to see, is friction with nothing on the other side of it.
 *
 * The trust rule: the token is verified WITH SUPABASE, exactly as
 * `/api/admin/stats` does. Nothing here believes a claim the browser makes about
 * itself. A forged or expired token resolves to null and the caller falls back
 * to the ordinary verify-by-email path, so the failure mode of this whole module
 * is "you get the email you would have got anyway".
 */
export interface AdminIdentity {
  /** The address Supabase confirmed, NOT one the client claimed. */
  email: string;
}

/**
 * Returns the admin's verified email, or null for anyone else.
 *
 * Null covers every negative case deliberately: no token, a rubbish token, an
 * expired token, a valid token for somebody not on the allowlist, or Supabase
 * being unreachable. The caller cannot tell them apart and must not. Every one
 * of them means "treat this as a member of the public".
 */
export async function resolveAdminIdentity(
  accessToken: string | undefined | null
): Promise<AdminIdentity | null> {
  if (!accessToken || !isSupabaseAdminConfigured()) return null;

  const allowedEmails = getAllowedAdminEmails();
  if (allowedEmails.length === 0) return null;

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user?.email) return null;
    if (!isAllowedAdmin(data.user.email, allowedEmails)) return null;

    return { email: data.user.email.toLowerCase() };
  } catch {
    // Supabase unreachable. Fail to "not an admin", never to "trust the client".
    // The cost is one unnecessary verification email. The cost of the other
    // default is an open door.
    return null;
  }
}
