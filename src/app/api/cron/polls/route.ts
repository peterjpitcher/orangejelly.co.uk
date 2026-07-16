import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';

import { runPollSweep } from '@/lib/poll-sweep';

/**
 * The daily poll cron. See SPEC §3.8.
 *
 * A route handler rather than a server action: Vercel Cron issues a plain GET
 * and cannot invoke a server action.
 *
 * This is the only endpoint in the feature that deletes without a human asking
 * it to, and the only authentication here that is not a capability token — hence
 * the fail-closed secret check below. Compare src/app/api/events/route.ts, which
 * is an unauthenticated public POST: that is the pattern this route must NOT
 * follow.
 *
 * No CSP applies and none is needed — nothing renders.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The mail passes pace their sends to stay inside Resend's rate limit, so the
 * job is measured in tens of seconds rather than hundreds of milliseconds. The
 * default function timeout would cut the fan-out off mid-flight.
 */
export const maxDuration = 60;

/**
 * Constant-time comparison of the bearer header.
 *
 * `===` on a secret is a timing oracle: it returns on the first differing byte,
 * so the time it takes leaks how much of a guess was right, and an attacker can
 * walk the secret out one byte at a time. timingSafeEqual does not short-circuit.
 *
 * The length guard is required, not incidental — timingSafeEqual THROWS on
 * buffers of different lengths, so an unguarded call would turn a wrong-length
 * guess into a 500 and confirm the route exists. Length is the one thing this
 * does leak, which is not a useful fact about a random secret.
 */
function secretMatches(provided: string, expected: string): boolean {
  const providedBytes = Buffer.from(provided);
  const expectedBytes = Buffer.from(expected);

  if (providedBytes.length !== expectedBytes.length) return false;

  return timingSafeEqual(providedBytes, expectedBytes);
}

export async function GET(request: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;

  // Fail closed. An unset secret must never mean an open delete endpoint — this
  // route removes other people's data and answers to nobody.
  if (!secret) {
    console.error('[polls] Sweep refused — CRON_SECRET is not set.');
    return NextResponse.json({ error: 'Not configured.' }, { status: 503 });
  }

  const authorization = request.headers.get('authorization');
  if (!authorization || !secretMatches(authorization, `Bearer ${secret}`)) {
    return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
  }

  const report = await runPollSweep();

  // 500 when ANY pass failed, and a real body either way.
  //
  // A silent 200 on a failed retention run is worse than a 500: it means the
  // deletion promise quietly stopped being kept and nobody knew. Vercel does not
  // retry a failed cron, so the work waits for tomorrow — and the non-200 in the
  // dashboard is the whole of our alerting. A cron that always returns 200 is a
  // cron nobody ever looks at.
  //
  // A backlog is NOT an error: it means a pass hit its bound and more rows
  // remain, which is the bound working as designed. It is reported so it is
  // visible rather than silently accruing.
  if (report.errors.length > 0) {
    console.error(`[polls] Sweep finished with ${report.errors.length} failed pass(es).`);
  }

  return NextResponse.json(report, { status: report.errors.length > 0 ? 500 : 200 });
}
