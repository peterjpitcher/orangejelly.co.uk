import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { getAllowedAdminEmails, isAllowedAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json({ error: 'Supabase auth is not configured.' }, { status: 500 });
  }

  const allowedEmails = getAllowedAdminEmails();
  if (allowedEmails.length === 0) {
    return NextResponse.json(
      { error: 'Admin email allowlist is not configured.' },
      { status: 500 }
    );
  }

  let payload: { email?: string; password?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid login payload.' }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();
  const password = payload.password;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  if (!isAllowedAdmin(email, allowedEmails)) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session || !data.user) {
    return NextResponse.json(
      { error: error?.message || 'Invalid login credentials.' },
      { status: 401 }
    );
  }

  if (!isAllowedAdmin(data.user.email, allowedEmails)) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 403 });
  }

  return NextResponse.json({
    user: {
      email: data.user.email,
    },
    session: {
      access_token: data.session.access_token,
      expires_at: data.session.expires_at,
    },
  });
}
