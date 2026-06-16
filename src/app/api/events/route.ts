import { NextResponse } from 'next/server';

import { trackConversionEvent } from '@/app/actions/tracking';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await trackConversionEvent({
      eventName: payload?.eventName,
      leadSource: payload?.leadSource,
      properties: payload?.properties,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid event payload.' }, { status: 400 });
  }
}
