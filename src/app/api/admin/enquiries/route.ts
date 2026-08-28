import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/admin-auth';
import { listEnquiries, setEnquiryStatus } from '@/lib/db/enquiries';
import { isLeadState } from '@/lib/schemas/enquiry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Keep it live. supabase-js reads land in Next's Data Cache otherwise, and an
// admin looking at leads would be shown yesterday's.
export const fetchCache = 'force-no-store';

/**
 * The enquiry list and the lead pipeline.
 *
 * This returns every answer someone gave: what they think is blocking growth, what
 * success looks like, why now. That is the most commercially sensitive data the
 * site holds, and it is why it lives here behind auth rather than in a
 * notification email.
 *
 * @see tasks/repositioning/SUB-SPECS.md part 1.7 and 1.9
 */
export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if ('response' in auth) return auth.response;

  const url = new URL(request.url);
  const statusParam = url.searchParams.get('status');
  const limitParam = Number(url.searchParams.get('limit'));

  if (statusParam && !isLeadState(statusParam)) {
    return NextResponse.json({ error: 'Unknown lead state.' }, { status: 400 });
  }

  const { enquiries, error } = await listEnquiries({
    status: statusParam && isLeadState(statusParam) ? statusParam : undefined,
    limit: Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ enquiries });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request);
  if ('response' in auth) return auth.response;

  let payload: { id?: string; status?: string };
  try {
    payload = (await request.json()) as { id?: string; status?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
  }

  if (!payload.id) {
    return NextResponse.json({ error: 'Which enquiry?' }, { status: 400 });
  }
  if (!isLeadState(payload.status)) {
    return NextResponse.json({ error: 'Unknown lead state.' }, { status: 400 });
  }

  const result = await setEnquiryStatus(payload.id, payload.status);
  if (!result.stored) {
    return NextResponse.json({ error: result.error ?? 'Could not update.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
