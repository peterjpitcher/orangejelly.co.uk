import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Button from '@/components/Button';

/**
 * Pins the fix for labels sitting off-centre in buttons.
 *
 * The cause was one word. The button's base class list is
 * `inline-flex items-center justify-center`, and that `items-center` is the only
 * thing centring the label vertically. `fullWidth` used to add `block`, which
 * switched the element away from being a flex container — at which point
 * `align-items` does nothing whatsoever. It is not ignored loudly; it simply has
 * no meaning on a block box. The label then landed wherever line-height put it
 * inside a box padded out to min-h-[44px], which is why full-width buttons sat a
 * few pixels low while inline ones looked fine.
 *
 * Measured before the fix: "Call 07990 587315" and "Visit The Anchor" sat 3.5px
 * low; "Chat on WhatsApp" sat 4px high. Nav links, being inline-flex, were exact.
 *
 * jsdom computes no layout, so these assert the CLASS CONTRACT rather than
 * pixels: the display mode must stay a flex one. That is the property the
 * centring depends on, and it is the one a future edit would break.
 */

describe('button label centring', () => {
  it('should stay a flex container when fullWidth is set', () => {
    render(<Button fullWidth>Send me my links</Button>);
    const cls = screen.getByRole('button').className;

    // The regression, exactly: `block` is not a flex display, so items-center
    // silently stops applying.
    expect(cls).not.toMatch(/(^|\s)block(\s|$)/);
    expect(cls).toMatch(/(^|\s)flex(\s|$)/);
  });

  it('should still span the full width when fullWidth is set', () => {
    // The point of the original `block` was full width. `flex` is block-level
    // too, so this must not have been traded away for the centring.
    render(<Button fullWidth>Send me my links</Button>);
    expect(screen.getByRole('button').className).toMatch(/w-full/);
  });

  it('should centre its label when fullWidth is not set', () => {
    render(<Button>Confirm this time</Button>);
    const cls = screen.getByRole('button').className;

    expect(cls).toMatch(/items-center/);
    expect(cls).toMatch(/justify-center/);
  });

  it('should keep the 44px minimum tap target at every size', () => {
    // Centring and tap size are the same concern here: min-h-[44px] is what
    // creates the box the label has to be centred in, and it is also the repo's
    // own accessibility floor.
    for (const size of ['small', 'medium', 'large'] as const) {
      const { unmount } = render(<Button size={size}>Vote</Button>);
      expect(screen.getByRole('button').className).toMatch(/min-h-\[4[48]px\]/);
      unmount();
    }
  });
});
