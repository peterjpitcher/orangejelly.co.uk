import { describe, it, expect } from 'vitest';
import { isTokenRoute, isPollRoute } from './token-routes';

const TOKEN = '0123456789abcdef0123456789abcdef';

describe('isTokenRoute', () => {
  it.each([
    [`/availability/o/${TOKEN}`, 'organiser'],
    [`/availability/p/${TOKEN}`, 'participant'],
    [`/availability/verify/${TOKEN}`, 'verify'],
  ])('should be true for %s when the path carries a %s token', (pathname) => {
    expect(isTokenRoute(pathname)).toBe(true);
  });

  it.each([
    ['/availability/new'],
    ['/availability'],
    ['/licensees-guide/some-article'],
    ['/'],
    ['/contact'],
  ])('should be false for %s when the path carries no token', (pathname) => {
    expect(isTokenRoute(pathname)).toBe(false);
  });

  it('should be false when the token segment is a prefix of another site path', () => {
    // Anchored at the start so an attacker cannot smuggle the pattern into a
    // path we do not control, e.g. a blog slug.
    expect(isTokenRoute(`/licensees-guide/availability/o/${TOKEN}`)).toBe(false);
  });

  it('should be false when the token itself is missing', () => {
    expect(isTokenRoute('/availability/o/')).toBe(true);
    expect(isTokenRoute('/availability/o')).toBe(false);
  });
});

describe('isPollRoute', () => {
  it.each([
    ['/availability'],
    ['/availability/'],
    ['/availability/new'],
    [`/availability/o/${TOKEN}`],
    [`/availability/p/${TOKEN}`],
    [`/availability/verify/${TOKEN}`],
  ])('should be true for %s when the path is anywhere in the poll feature', (pathname) => {
    expect(isPollRoute(pathname)).toBe(true);
  });

  it.each([['/licensees-guide/some-article'], ['/'], ['/contact'], ['/availability-guide']])(
    'should be false for %s when the path is outside the poll feature',
    (pathname) => {
      expect(isPollRoute(pathname)).toBe(false);
    }
  );

  it('should be true for every path that isTokenRoute accepts', () => {
    // The script gate must be a superset of the referrer gate. If it were not, a
    // route could be referrer-protected but still load GTM — which is the failure
    // that actually leaks the token.
    for (const pathname of [
      `/availability/o/${TOKEN}`,
      `/availability/p/${TOKEN}`,
      `/availability/verify/${TOKEN}`,
    ]) {
      expect(isTokenRoute(pathname)).toBe(true);
      expect(isPollRoute(pathname)).toBe(true);
    }
  });
});
