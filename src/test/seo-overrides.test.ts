import { describe, expect, it } from 'vitest';

import { getRedirects, pathMatches } from '@/lib/route-manifest';
import { seoOverrides } from '@/lib/seo-overrides';

/**
 * No override is left behind for an address that redirects.
 *
 * WHY. Phase 4 retired the old pages on 31 August 2026, and ten of their overrides
 * stayed in `seo-overrides.ts` until 14 October. Next answers a redirected address
 * before any page renders, so those entries could never reach anybody, and nothing
 * failed. Four of them still quoted a package price the site no longer publishes,
 * one refactor away from shipping it again.
 *
 * Checked against `getRedirects()`, the table next.config.js actually emits, rather
 * than every declared redirect: a source in a phase that is not live yet still serves
 * its page, so its override is still doing its job.
 *
 * Wildcard-aware, because `/services/:slug` is the rule that retired three of the ten,
 * and a plain string comparison against it never matches.
 */
const REDIRECT_SOURCES = getRedirects().map((r) => r.source);

describe('seo overrides', () => {
  it.each(Object.keys(seoOverrides))('%s is not an address that redirects', (key) => {
    const redirectedBy = REDIRECT_SOURCES.filter((source) => pathMatches(source, key));
    expect(redirectedBy).toEqual([]);
  });
});
