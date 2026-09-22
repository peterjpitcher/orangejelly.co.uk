import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';

import { sweepSurveyContacts } from '@/lib/db/surveys';

/**
 * The daily survey retention cron: deletes volunteers' details a fixed time
 * after their survey closes, as the privacy notice promises.
 *
 * It deletes personal data without a person asking, so it authenticates the
 * same way as /api/cron/polls and fails closed the same way. See that route for
 * why the comparison is constant-time and length-guarded.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function secretMatches(provided: string, expected: string): boolean {
  const providedBytes = Buffer.from(provided);
  const expectedBytes = Buffer.from(expected);
  if (providedBytes.length !== expectedBytes.length) return false;
  return timingSafeEqual(providedBytes, expectedBytes);
}

export async function GET(request: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error('[surveys] Sweep refused: CRON_SECRET is not set.');
    return NextResponse.json({ error: 'Not configured.' }, { status: 503 });
  }

  const authorization = request.headers.get('authorization');
  if (!authorization || !secretMatches(authorization, `Bearer ${secret}`)) {
    return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
  }

  const report = await sweepSurveyContacts();

  // A failed retention run is a 500, never a quiet 200: the non-200 in the Vercel
  // dashboard is the only alert there is.
  if (report.error) {
    console.error('[surveys] Contact sweep failed:', report.error);
    return NextResponse.json(report, { status: 500 });
  }
  return NextResponse.json(report, { status: 200 });
}
