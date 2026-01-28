import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '/';

  draftMode().disable();

  const redirectUrl = new URL(path, request.url);
  return NextResponse.redirect(redirectUrl, 307);
}
