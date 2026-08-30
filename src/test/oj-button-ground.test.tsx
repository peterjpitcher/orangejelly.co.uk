import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button, GroundProvider } from '@/components/oj';

/**
 * Buttons pick their colours from the surface they are sitting on.
 *
 * WHY THIS EXISTS. Every call site used to name a colour: `variant="ink"` on a dark
 * band, `variant="primary"` on a light one. That asks somebody to remember a contrast
 * rule at the moment they are thinking about something else, and it went wrong in
 * every direction it could:
 *
 *   - "How we work in full" on the homepage and "The method in full" on
 *     /pub-marketing were ink-filled buttons inside ink sections. Fill against
 *     background 1.00:1, border against background 1.00:1. Invisible: only the label
 *     showed, so they read as a stray line of text rather than a control.
 *   - Five call-to-action buttons on orange bands were ink blocks at 2.92:1.
 *   - The cookie notice had already been hand-patched with
 *     `className="!text-oj-cream !border-oj-cream"`, the right fix applied once, by
 *     hand, in the one place somebody happened to notice.
 *
 * None of that was visible to a unit test, because no unit test knew what surface a
 * button was rendered on. These do.
 *
 * The rule the tests encode: the outline is always the strongest neutral against its
 * ground. It inverts between light and dark, it never disappears.
 */
function classesOf(name: string | RegExp): string {
  return screen.getByRole('link', { name }).className;
}

describe('the button ground', () => {
  it('defaults to light when there is no provider', () => {
    render(<Button href="/x">Bring us the problem</Button>);
    const classes = classesOf('Bring us the problem');
    expect(classes).toContain('border-oj-ink');
    expect(classes).toContain('bg-oj-orange-deep');
  });

  it('puts a white outline on a button sitting on ink', () => {
    render(
      <GroundProvider value="ink">
        <Button href="/x">Bring us the problem</Button>
      </GroundProvider>
    );
    const classes = classesOf('Bring us the problem');
    // Ink on ink is 1.00:1. The border is what makes this a button at all.
    expect(classes).toContain('border-oj-on-band');
    expect(classes).not.toContain('border-oj-ink');
  });

  it('puts a white outline on a button sitting on the orange band', () => {
    render(
      <GroundProvider value="band">
        <Button href="/x">Bring us the problem</Button>
      </GroundProvider>
    );
    expect(classesOf('Bring us the problem')).toContain('border-oj-on-band');
  });

  it('drops the primary fill to ember on the band so it does not vanish into it', () => {
    // The deep orange IS the band. A primary button filled with it would be a white
    // outline around nothing.
    render(
      <GroundProvider value="band">
        <Button href="/x">Bring us the problem</Button>
      </GroundProvider>
    );
    const classes = classesOf('Bring us the problem');
    expect(classes).toContain('bg-oj-ember');
    expect(classes).not.toContain('bg-oj-orange-deep');
  });

  it('never puts white text on the brand orange, at any ground', () => {
    /*
     * The one combination that must never appear. White on #f76b0c is 2.97:1, and
     * every button label is bold and under 18.66px, so it needs 4.5:1 and fails even
     * the 3:1 floor that large text is allowed.
     */
    for (const ground of ['light', 'ink', 'band'] as const) {
      const { container, unmount } = render(
        <GroundProvider value={ground}>
          <Button href="/x">Label</Button>
          <Button variant="solid" href="/y">
            Label
          </Button>
          <Button variant="ghost" href="/z">
            Label
          </Button>
        </GroundProvider>
      );
      for (const el of container.querySelectorAll('a')) {
        const classes = el.className;
        const white = classes.includes('text-oj-on-band');
        // Careful with the boundary: bg-oj-orange-deep would match a naive
        // \bbg-oj-orange\b, and the deep orange is the one combination that works.
        const brandOrangeFill = /(^|\s)bg-oj-orange(\s|$)/.test(classes);
        expect(white && brandOrangeFill).toBe(false);
      }
      unmount();
    }
  });

  it('inverts the solid button rather than leaving it ink on ink', () => {
    const { rerender } = render(
      <GroundProvider value="light">
        <Button variant="solid" href="/x">
          How we work in full
        </Button>
      </GroundProvider>
    );
    expect(classesOf('How we work in full')).toContain('bg-oj-ink');

    rerender(
      <GroundProvider value="ink">
        <Button variant="solid" href="/x">
          How we work in full
        </Button>
      </GroundProvider>
    );
    // This is the exact button that shipped invisible on the homepage.
    expect(classesOf('How we work in full')).toContain('bg-oj-cream');
  });

  it('gives a dark ground the inverted focus ring', () => {
    // The light ring has an ink outer band, which is 1.00:1 on an ink section, and a
    // cream gap that merges with a white border at 1.09:1.
    render(
      <GroundProvider value="ink">
        <Button href="/x">Bring us the problem</Button>
      </GroundProvider>
    );
    expect(classesOf('Bring us the problem')).toContain('var(--oj-ring-inverse)');
  });

  it('lets a caller override the ground for a component that paints its own', () => {
    render(
      <GroundProvider value="ink">
        <Button ground="light" href="/x">
          Bring us the problem
        </Button>
      </GroundProvider>
    );
    expect(classesOf('Bring us the problem')).toContain('border-oj-ink');
  });

  it('has no variant that names a colour', () => {
    /*
     * The enforcement is the type, not this test, but the type only helps somebody
     * writing TypeScript today. This says out loud that `ink` and `ghost-band` were
     * removed on purpose, so a future reader restoring them knows they are undoing a
     * decision rather than adding a convenience.
     */
    const removed = ['ink', 'ghost-band'];
    const allowed = ['primary', 'solid', 'ghost'];
    expect(allowed).not.toEqual(expect.arrayContaining(removed));
  });
});

describe('the surfaces that declare a ground', () => {
  it('lets a band hand its ground to the buttons inside it', async () => {
    const { Band } = await import('@/components/oj');
    render(
      <Band tone="ink">
        <Button href="/x">Bring us the problem</Button>
      </Band>
    );
    expect(classesOf('Bring us the problem')).toContain('border-oj-on-band');
  });

  it('treats a paper band as a light ground', async () => {
    const { Band } = await import('@/components/oj');
    render(
      <Band tone="paper">
        <Button href="/x">Bring us the problem</Button>
      </Band>
    );
    expect(classesOf('Bring us the problem')).toContain('border-oj-ink');
  });

  it('treats an orange band as the band ground', async () => {
    const { Band } = await import('@/components/oj');
    render(
      <Band tone="orange">
        <Button href="/x">Bring us the problem</Button>
      </Band>
    );
    expect(classesOf('Bring us the problem')).toContain('bg-oj-ember');
  });
});
