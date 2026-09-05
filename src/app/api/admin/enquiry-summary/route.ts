import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getEnquirySummary } from '@/lib/db/enquiry-summary';
import { parseSummaryPeriod } from '@/lib/enquiry-summary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: Request): Promise<Response> {
  const auth = await requireAdmin(request);
  if ('response' in auth) return auth.response;
  let period;
  try {
    period = parseSummaryPeriod(new URL(request.url).searchParams);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid report period.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }
  try {
    return NextResponse.json(await getEnquirySummary(period), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json(
      { error: 'Could not load a complete report. Refresh or choose a shorter period.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
