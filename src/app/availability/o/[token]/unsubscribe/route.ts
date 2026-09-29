import { NextResponse } from 'next/server';

import { POLL_NOT_FOUND, setDigestOptOut } from '@/lib/db/polls';
import { isWellFormedToken, scrubTokens } from '@/lib/poll-tokens';

/**
 * The address in the digest's and the nudge's `List-Unsubscribe` header.
 *
 * Until 29 September 2026 the header pointed here and nothing answered, so the
 * unsubscribe button in Gmail and Apple Mail led to a 404.
 *
 * POST is RFC 8058 one-click: the mail client's own unsubscribe button, sent
 * with `List-Unsubscribe=One-Click` and no cookies. It turns the emails off and
 * answers with a line of text, because nobody sees a page.
 *
 * GET CHANGES NOTHING. It is what a person gets when their client opens the link
 * in a browser instead, and it is also what a link scanner prefetches. A GET
 * that unsubscribed would let a corporate mail filter switch organisers off
 * unseen, so it sends them to the switch on their poll page, where they can see
 * the state and turn it back on.
 *
 * The token is the only authorisation, as everywhere in the organiser's
 * controls. A dead or malformed token gets the same 404 as any other dead poll
 * link.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: { token: string };
}

function notFound(): Response {
  return new NextResponse('Not found.', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export async function POST(_request: Request, { params }: RouteContext): Promise<Response> {
  if (!isWellFormedToken(params.token)) return notFound();

  const result = await setDigestOptOut(params.token, true);

  if (!result.stored) {
    if (result.error === POLL_NOT_FOUND) return notFound();
    console.error(
      '[polls] Unsubscribe not recorded:',
      scrubTokens(result.error ?? 'Unknown error.')
    );
    return new NextResponse('Something went wrong. Please try again.', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  return new NextResponse('Unsubscribed. We will not send you any more updates about this poll.', {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export function GET(request: Request, { params }: RouteContext): Response {
  if (!isWellFormedToken(params.token)) return notFound();

  // 303 so the browser follows with a GET. Relative to the request, so a local
  // run lands on localhost rather than on production.
  return NextResponse.redirect(new URL(`/availability/o/${params.token}#emails`, request.url), 303);
}
