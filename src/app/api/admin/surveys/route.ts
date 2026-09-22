import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/admin-auth';
import { getSurveysForAdmin } from '@/lib/db/surveys';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Live counts, not the Data Cache's copy from whenever the route last ran.
export const fetchCache = 'force-no-store';

/**
 * Every survey, its counts, its free-text answers and its volunteers.
 *
 * Volunteers' names and email addresses are personal data held on consent, so
 * this sits behind the same bearer-token gate as the enquiry list.
 */
export async function GET(request: Request): Promise<Response> {
  const auth = await requireAdmin(request);
  if ('response' in auth) return auth.response;

  try {
    return NextResponse.json({ surveys: await getSurveysForAdmin() });
  } catch (error) {
    console.error('[surveys] admin view failed:', error);
    return NextResponse.json({ error: 'Could not load surveys.' }, { status: 500 });
  }
}
