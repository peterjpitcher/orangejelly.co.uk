import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

function isSafeRelativePath(value: string): boolean {
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
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const rawPath = searchParams.get('path');

  const previewSecret = process.env.PREVIEW_SECRET;

  if (!previewSecret) {
    return new NextResponse('Preview secret not configured', { status: 500 });
  }

  if (!secret || secret !== previewSecret) {
    return new NextResponse('Invalid preview secret', { status: 401 });
  }

  draftMode().enable();

  const candidatePath = rawPath ?? (slug ? `/licensees-guide/${slug}` : '/licensees-guide');
  const redirectPath = isSafeRelativePath(candidatePath) ? candidatePath : '/licensees-guide';

  const redirectUrl = new URL(redirectPath, request.url);
  return NextResponse.redirect(redirectUrl, 307);
}
