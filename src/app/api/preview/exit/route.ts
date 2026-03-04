import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

function isSafeRelativePath(value: string): boolean {
  // Must start with / and not contain protocol-relative or authority patterns
  if (!value.startsWith('/') || value.startsWith('//')) return false;
  try {
    const parsed = new URL(value, 'http://localhost');
    return parsed.hostname === 'localhost';
  } catch {
    return false;
  }
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawPath = searchParams.get('path') || '/';
  const safePath = isSafeRelativePath(rawPath) ? rawPath : '/';

  draftMode().disable();

  const redirectUrl = new URL(safePath, request.url);
  return NextResponse.redirect(redirectUrl, 307);
}
