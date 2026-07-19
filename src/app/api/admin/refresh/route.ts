import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { getAllowedAdminEmails, isAllowedAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Renews an admin session from its refresh token.
 *
 * This is the other half of fixing "I have to log in again every time". The
 * access token is short-lived by design; without a way to renew it, the only
 * recovery is a fresh password login. Here the client hands back the refresh
 * token it stored and gets a new access token, no password prompt.
 *
 * The allowlist is re-checked on the refreshed user, so revoking admin access
 * (by removing an email from ADMIN_EMAILS) takes effect on the next refresh
 * rather than lasting as long as a stray refresh token survives.
 */
export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json({ error: 'Supabase auth is not configured.' }, { status: 500 });
  }

  let payload: { refresh_token?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }

  const refreshToken = payload.refresh_token;
  if (!refreshToken) {
    return NextResponse.json({ error: 'Missing refresh token.' }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

  if (error || !data.session || !data.user) {
    // Expired or revoked refresh token. 401 tells the client to fall back to the
    // login form rather than loop.
    return NextResponse.json({ error: 'Session expired. Please sign in again.' }, { status: 401 });
  }

  if (!isAllowedAdmin(data.user.email, getAllowedAdminEmails())) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  }

  return NextResponse.json({
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  });
}
