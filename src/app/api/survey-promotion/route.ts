import { NextResponse } from 'next/server';

import { getSurveyForVisitor } from '@/lib/db/surveys';
import { PROMOTED_SURVEY } from '@/lib/promoted-survey';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// The database's answer, not the Data Cache's copy from whenever the route last ran.
// The CDN cache below is what keeps this cheap.
export const fetchCache = 'force-no-store';

const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' };

/**
 * Is the promoted survey taking answers right now?
 *
 * The site-wide prompt asks this before it opens, so a survey that has been closed
 * in the database stops being pushed at visitors without a release, even while
 * PROMOTED_SURVEY still names it.
 *
 * It answers one yes or no about one survey and nothing else: no slug parameter, so
 * it cannot be used to probe which drafts exist, and a draft reads the same as a
 * closed or missing survey. Five minutes at the CDN is plenty for a banner and keeps
 * a busy page from reaching the database on every view.
 */
export async function GET(): Promise<Response> {
  if (!PROMOTED_SURVEY) {
    return NextResponse.json({ live: false }, { headers: CACHE_HEADERS });
  }

  try {
    const access = await getSurveyForVisitor(PROMOTED_SURVEY.slug);
    return NextResponse.json({ live: access?.mode === 'live' }, { headers: CACHE_HEADERS });
  } catch (error) {
    // Fails closed: the prompt only opens on an explicit yes. Not cached, so the next
    // visitor asks again rather than inheriting the outage for five minutes.
    console.error('[survey-promotion] status check failed:', error);
    return NextResponse.json(
      { live: false },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
