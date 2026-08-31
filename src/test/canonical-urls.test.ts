import { describe, expect, it } from 'vitest';

import { getRedirectsForPhases, pathMatches, ROUTES } from '@/lib/route-manifest';

/**
 * Every canonical points at a URL that actually serves a page.
 *
 * WHY. `/why-revenue-is-falling` shipped with `canonical` still set to
 * `/small-business-rescue`, a name the page carried for two days and which never
 * went live, so nothing redirects it. The tag told Google the real version of the
 * page was at an address that returns a 404.
 *
 * It survived review because it is one interpolated string in a file whose every
 * other mention of the page was already correct, and because no test read it. It
 * was found by accident, during a rename that turned out to have already happened.
 *
 * This is a rename-shaped bug: it will recur every time a route moves, because the
 * canonical is the one reference that does not break anything visible when it goes
 * stale. So it gets a guard rather than a fix.
 *
 * The assertion is deliberately stricter than "does not 404". A canonical pointing
 * at a redirect is also wrong, just less loudly: it makes every page a hop away
 * from its own declared address.
 */
const LIVE = new Set(ROUTES.filter((r) => r.disposition === 'live').map((r) => r.path));
const REDIRECT_SOURCES = getRedirectsForPhases(['active', 'phase4']).map((r) => r.source);

/**
 * Read from source rather than by rendering.
 *
 * Rendering every page to inspect its metadata means booting the whole App Router
 * for a one-line string, and `generateMetadata` on the dynamic routes needs params
 * this test has no business inventing. The literal is what a reviewer reads and the
 * literal is what went wrong, so the literal is what is checked.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const APP = path.resolve(__dirname, '../app');

function pageFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return pageFiles(full);
    return entry === 'page.tsx' ? [full] : [];
  });
}

/** Pulls `${getBaseUrl()}/some/path` out of a canonical declaration. */
function declaredCanonicals(source: string): string[] {
  const found: string[] = [];

  // The direct form: `canonical: ${getBaseUrl()}/path`
  for (const match of source.matchAll(/canonical:\s*`\$\{getBaseUrl\(\)\}([^`]*)`/g)) {
    found.push(match[1] || '/');
  }

  // The indirect form, one constant used by the metadata block:
  //   const CANONICAL = `${getBaseUrl()}/path`;
  if (/canonical:\s*CANONICAL\b/.test(source)) {
    const constant = source.match(/const CANONICAL\s*=\s*`\$\{getBaseUrl\(\)\}([^`]*)`/);
    if (constant) found.push(constant[1] || '/');
  }

  return found;
}

describe('canonical URLs', () => {
  const declarations = pageFiles(APP)
    .filter((file) => !file.includes('[')) // dynamic routes build theirs from the slug
    .flatMap((file) =>
      declaredCanonicals(readFileSync(file, 'utf8')).map((canonical) => ({
        file: path.relative(APP, file),
        canonical,
      }))
    );

  it('finds the canonicals, so a parser change cannot make this test vacuous', () => {
    // A regex that quietly stops matching turns every assertion below into a pass
    // over an empty array, which is the failure mode of source-scanning tests.
    expect(declarations.length).toBeGreaterThanOrEqual(12);
  });

  it.each(declarations.map((d) => [d.file, d.canonical]))(
    '%s points at a live route (%s)',
    (_file, canonical) => {
      expect(LIVE.has(canonical)).toBe(true);
    }
  );

  it.each(declarations.map((d) => [d.file, d.canonical]))(
    '%s does not point at a redirect (%s)',
    (_file, canonical) => {
      /*
       * Wildcard-aware, for the same reason as the sitemap assertion in
       * `route-manifest.test.ts`: a canonical of `/ways-to-work/growth-fix` compared
       * against the literal `/ways-to-work/:slug` never matches, so the check was
       * blind to exactly the rules most likely to catch something.
       */
      const redirected = REDIRECT_SOURCES.some((source) => pathMatches(source, canonical));
      expect(redirected).toBe(false);
    }
  );

  it('gives each page its own canonical, never another page’s', () => {
    // Two pages sharing one canonical is the other half of this bug class: it tells
    // Google one of them should not be indexed at all.
    const counts = new Map<string, string[]>();
    for (const { file, canonical } of declarations) {
      counts.set(canonical, [...(counts.get(canonical) ?? []), file]);
    }
    const shared = [...counts.entries()]
      .filter(([, files]) => files.length > 1)
      .map(([canonical, files]) => `${canonical} declared by ${files.join(' and ')}`);
    expect(shared).toEqual([]);
  });
});
