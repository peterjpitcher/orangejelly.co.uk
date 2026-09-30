import { NextResponse } from 'next/server';

import { CLIENT_CREDIT_SITES, getClientCredit } from '@/lib/client-credits';

/*
 * One static JSON file per site, written at build time, so the footer of every site we
 * build reads from the CDN and never from a function. A release here is what changes
 * them; each site picks the change up within a day. The wording and destinations live in
 * src/lib/client-credits.ts, and docs/credit/README.md describes the contract.
 *
 * An unknown id is a 404 rather than the default line. A consumer with a typo then
 * shows its own built-in fallback, which is visibly the same line, instead of quietly
 * borrowing another site's destination.
 */
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams(): Array<{ site: string }> {
  return CLIENT_CREDIT_SITES.map((site) => ({ site }));
}

export function GET(_request: Request, { params }: { params: { site: string } }): Response {
  const credit = getClientCredit(params.site);
  if (!credit) {
    return NextResponse.json({ error: 'Unknown site' }, { status: 404 });
  }

  return NextResponse.json(credit, {
    headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
  });
}
