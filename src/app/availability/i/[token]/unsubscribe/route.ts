import { NextResponse } from 'next/server';

import { INVITEE_NOT_FOUND, setInviteeOptOut } from '@/lib/db/poll-invitees';
import { isWellFormedToken, scrubTokens } from '@/lib/poll-tokens';

/**
 * The address in an invitation's `List-Unsubscribe` header.
 *
 * The same shape as the organiser's (`/availability/o/<token>/unsubscribe`):
 * POST is RFC 8058 one-click from the mail client's own button and stops emails
 * about this poll for this person; GET changes nothing, because link scanners
 * prefetch GETs, and sends them to the switch on their own poll page.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: { token: string };
}

const TEXT_HEADERS = { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' };

function notFound(): Response {
  return new NextResponse('Not found.', { status: 404, headers: TEXT_HEADERS });
}

export async function POST(_request: Request, { params }: RouteContext): Promise<Response> {
  if (!isWellFormedToken(params.token)) return notFound();

  const result = await setInviteeOptOut(params.token, true);

  if (!result.stored) {
    if (result.error === INVITEE_NOT_FOUND) return notFound();
    console.error(
      '[polls] Invitee unsubscribe not recorded:',
      scrubTokens(result.error ?? 'Unknown error.')
    );
    return new NextResponse('Something went wrong. Please try again.', {
      status: 500,
      headers: TEXT_HEADERS,
    });
  }

  return new NextResponse('Unsubscribed. We will not email you about this poll again.', {
    status: 200,
    headers: TEXT_HEADERS,
  });
}

export function GET(request: Request, { params }: RouteContext): Response {
  if (!isWellFormedToken(params.token)) return notFound();

  // 303 so the browser follows with a GET. Relative to the request, so a local
  // run lands on localhost rather than on production.
  return NextResponse.redirect(new URL(`/availability/i/${params.token}#emails`, request.url), 303);
}
