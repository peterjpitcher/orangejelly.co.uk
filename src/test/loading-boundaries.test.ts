import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * No `loading.tsx` may sit above a route that sets its own status.
 *
 * A `loading.tsx` is a Suspense boundary around everything below its folder, and
 * Next 14 sends the response headers as soon as everything outside a Suspense
 * boundary is ready. `notFound()`, `redirect()` or `permanentRedirect()` thrown
 * inside one can only change what the browser draws, never the status: the
 * response has already gone out as a 200.
 *
 * That is not hypothetical. `src/app/loading.tsx` sat at the app root until
 * 22 September 2026, and every dead poll link, unknown survey and unknown insight
 * answered 200 while the code beside each `notFound()` promised a 404.
 *
 * The HTTP status itself is asserted against the live site by
 * `scripts/synthetic-check.mjs`. This is the part a unit test can see: the file
 * layout that decides it.
 */

const APP_DIR = path.join(process.cwd(), 'src', 'app');

/** Imports one of the calls that only sets a status outside a Suspense boundary. */
const STATUS_CALL =
  /import\s*\{[^}]*\b(notFound|redirect|permanentRedirect)\b[^}]*\}\s*from\s*['"]next\/navigation['"]/;

/**
 * Callers that sit under a boundary on purpose, each with the layout that answers
 * the status first. A layout is outside its own folder's `loading.tsx`, so it can
 * 404 before the skeleton streams; the page's own call only covers a record
 * deleted between the two reads.
 */
const GATED: Record<string, { boundary: string; gate: string }> = {
  'availability/o/[token]/page.tsx': {
    boundary: 'availability/o/[token]/loading.tsx',
    gate: 'availability/o/[token]/layout.tsx',
  },
};

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx)$/.test(entry.name) && !/\.test\./.test(entry.name) ? [full] : [];
  });
}

const relative = (file: string): string => path.relative(APP_DIR, file).split(path.sep).join('/');

/**
 * Every `loading.tsx` whose boundary wraps this file. A page is wrapped by the one
 * in its own folder; a layout is not, because a folder's `loading.tsx` sits inside
 * that folder's layout.
 */
function boundariesAbove(file: string): string[] {
  const isLayout = /^layout\.tsx?$/.test(path.basename(file));
  let dir = isLayout ? path.dirname(path.dirname(file)) : path.dirname(file);
  const found: string[] = [];

  while (dir.startsWith(APP_DIR)) {
    for (const name of ['loading.tsx', 'loading.ts', 'loading.jsx', 'loading.js']) {
      if (existsSync(path.join(dir, name))) found.push(relative(path.join(dir, name)));
    }
    if (dir === APP_DIR) break;
    dir = path.dirname(dir);
  }

  return found;
}

const callers = sourceFiles(APP_DIR).filter((file) => STATUS_CALL.test(readFileSync(file, 'utf8')));

describe('loading boundaries', () => {
  it('finds the routes that set their own status', () => {
    // Guards the guard: a regex that matched nothing would pass everything below.
    expect(callers.map(relative)).toEqual(
      expect.arrayContaining([
        'availability/p/[token]/page.tsx',
        'availability/p/[token]/edit/[editToken]/page.tsx',
        'availability/o/[token]/layout.tsx',
        'survey/[slug]/page.tsx',
        'insights/[slug]/page.tsx',
      ])
    );
  });

  it('has no loading.tsx at the app root', () => {
    expect(existsSync(path.join(APP_DIR, 'loading.tsx'))).toBe(false);
  });

  it('puts no loading boundary above a notFound(), redirect() or permanentRedirect()', () => {
    const wrapped = callers.flatMap((file) =>
      boundariesAbove(file)
        .filter((boundary) => GATED[relative(file)]?.boundary !== boundary)
        .map((boundary) => `${relative(file)} is inside ${boundary}`)
    );

    expect(
      wrapped,
      `these would answer 200 instead of their real status:\n${wrapped.join('\n')}`
    ).toEqual([]);
  });

  it('gives every allowed exception a gate that answers first', () => {
    for (const [file, { boundary, gate }] of Object.entries(GATED)) {
      expect(existsSync(path.join(APP_DIR, file)), file).toBe(true);
      expect(existsSync(path.join(APP_DIR, boundary)), boundary).toBe(true);
      expect(callers.map(relative), `${gate} must call notFound()`).toContain(gate);
    }
  });
});
