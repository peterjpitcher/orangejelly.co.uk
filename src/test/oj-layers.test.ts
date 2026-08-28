import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { LAYERS } from '@/components/oj/layers';

/**
 * The stacking order is only useful if the components actually follow it, so this
 * reads the z-index out of each component's classes rather than trusting the
 * constant. A comment that drifts from the code is worse than no comment.
 */
function zIndexIn(file: string): number[] {
  const source = readFileSync(path.join(process.cwd(), 'src', 'components', 'oj', file), 'utf8');
  return [...source.matchAll(/z-\[(\d+)\]/g)].map((match) => Number(match[1]));
}

describe('fixed surface stacking', () => {
  it('keeps the drawer below the header so Close stays reachable', () => {
    expect(LAYERS.MOBILE_DRAWER).toBeLessThan(LAYERS.HEADER);
    expect(zIndexIn('Header.tsx')).toEqual(
      expect.arrayContaining([LAYERS.HEADER, LAYERS.MOBILE_DRAWER])
    );
  });

  it('keeps the consent choice above anything trying to sell', () => {
    expect(LAYERS.COOKIE_NOTICE).toBeGreaterThan(LAYERS.STICKY_CTA);
    const conversion = zIndexIn('conversion.tsx');
    expect(conversion).toEqual(expect.arrayContaining([LAYERS.STICKY_CTA, LAYERS.COOKIE_NOTICE]));
  });

  it('puts the modal above everything, since it takes over the page', () => {
    expect(LAYERS.MODAL).toBeGreaterThan(
      Math.max(...Object.values(LAYERS).filter((v) => v !== LAYERS.MODAL))
    );
    expect(zIndexIn('feedback.tsx')).toContain(LAYERS.MODAL);
  });

  it('pads both bottom-pinned surfaces for the iOS home indicator', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src', 'components', 'oj', 'conversion.tsx'),
      'utf8'
    );
    // Two surfaces pin to the bottom edge; both must clear the home indicator.
    expect(source.match(/safe-area-inset-bottom/g)?.length).toBeGreaterThanOrEqual(2);
  });
});
