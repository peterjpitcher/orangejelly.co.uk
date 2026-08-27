import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Text from '@/components/Text';

/**
 * Pins two fixes that between them stopped text disappearing entirely.
 *
 * 1. CardAdapter used to apply `background` only when variant was 'colored', but
 *    applied `text-white` based on `background` alone. Ask for a dark background
 *    without also saying variant="colored" and you got the white text with no
 *    background behind it: white on white, 1:1. The "30-Day Momentum Sprint" card
 *    on /pub-rescue was rendering completely invisible copy that way.
 *
 * 2. Heading and Text defaulted to an explicit navy, which overrode any container
 *    that had set a light colour. Inside the blue panel on the same page that
 *    produced navy-on-blue at 1.65:1. They inherit now, which resolves to the same
 *    navy on the page background because body carries text-foreground.
 *
 * jsdom computes no cascade for Tailwind classes, so these assert the class
 * contract: the pairing that has to hold, and the colour that must not be forced.
 */

const DARK_BACKGROUNDS = ['brand-base', 'base', 'blue-support', 'orange', 'grounded'] as const;

describe('CardAdapter background and text colour', () => {
  it.each(DARK_BACKGROUNDS)(
    'should apply a background whenever it applies white text (%s)',
    (background) => {
      const { container } = render(
        <Card background={background}>
          <span>Momentum</span>
        </Card>
      );
      const html = container.innerHTML;

      // The invariant: if the card decided the content needs white text, it must
      // also have painted something dark for that text to sit on.
      expect(html).toMatch(/\btext-white\b/);
      expect(html).toMatch(/\bbg-(brand-base|blue-support|primary|brand-grounded)\b/);
    }
  );

  it('should honour background without requiring variant="colored"', () => {
    // The gate that caused the bug. `variant` describes border and shadow; it was
    // never meant to decide whether `background` is honoured at all.
    const { container } = render(
      <Card background="surface">
        <span>Anything</span>
      </Card>
    );
    expect(container.innerHTML).toMatch(/\bbg-surface\b/);
  });

  it('should not force white text on a light background', () => {
    const { container } = render(
      <Card background="white">
        <span>Anything</span>
      </Card>
    );
    expect(container.innerHTML).not.toMatch(/\btext-white\b/);
  });
});

describe('Heading and Text colour inheritance', () => {
  it('should let a Heading inherit its container colour by default', () => {
    render(<Heading level={3}>We have been where you are</Heading>);
    // No colour class at all: whatever the container set wins. Forcing navy here
    // is what produced 1.65:1 inside the blue panel.
    expect(screen.getByRole('heading').className).not.toMatch(/\btext-brand-base\b/);
  });

  it('should let Text inherit its container colour by default', () => {
    render(<Text>Were: sparse attendance, losing money</Text>);
    const el = screen.getByText(/sparse attendance/);
    expect(el.className).not.toMatch(/\btext-brand-base\b/);
  });

  it('should still allow an explicit colour when a design calls for one', () => {
    render(
      <Heading level={3} color="white">
        On a dark band
      </Heading>
    );
    expect(screen.getByRole('heading').className).toMatch(/\btext-white\b/);
  });
});
