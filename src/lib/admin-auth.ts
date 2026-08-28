export function getAllowedAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdmin(
  email: string | undefined | null,
  allowedEmails = getAllowedAdminEmails()
): boolean {
  return Boolean(email && allowedEmails.includes(email.toLowerCase()));
}

/**
 * The bearer-token gate every /api/admin route sits behind.
 *
 * This block was copy-pasted into three routes before this existed, which is how a
 * fourth ends up subtly weaker than the other three. Auth is the one place where a
 * near-copy is worse than no copy: the failure is silent and the consequence is an
 * open endpoint over someone's personal data.
 *
 * Returns a Response to send back when the caller is not an admin, or the verified
 * email when they are.
 */
export async function requireAdmin(
  request: Request
): Promise<{ email: string } | { response: Response }> {
  const { NextResponse } = await import('next/server');
  const { getSupabaseAdminClient, isSupabaseAdminConfigured } =
    await import('@/lib/db/supabase-admin');

  if (!isSupabaseAdminConfigured()) {
    return {
      response: NextResponse.json({ error: 'Supabase is not configured.' }, { status: 500 }),
    };
  }

  const allowedEmails = getAllowedAdminEmails();
  if (allowedEmails.length === 0) {
    return {
      response: NextResponse.json(
        { error: 'Admin email allowlist is not configured.' },
        { status: 500 }
      ),
    };
  }

  const token = request.headers
    .get('authorization')
    ?.replace(/^Bearer\s+/i, '')
    .trim();
  if (!token) {
    return { response: NextResponse.json({ error: 'Not authenticated.' }, { status: 401 }) };
  }

  // Verified WITH Supabase rather than decoded here. A JWT this route decoded
  // itself would still look valid after the account was disabled.
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return { response: NextResponse.json({ error: 'Not authenticated.' }, { status: 401 }) };
  }

  if (!isAllowedAdmin(data.user.email, allowedEmails)) {
    return { response: NextResponse.json({ error: 'Not authorised.' }, { status: 403 }) };
  }

  return { email: data.user.email as string };
}
