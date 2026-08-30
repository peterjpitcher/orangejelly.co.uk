'use client';

import * as React from 'react';

/**
 * What colour of surface a component is sitting on.
 *
 * WHY THIS EXISTS. Every button needs to know its ground, because the right border,
 * label and shadow all invert between a light section and a dark one. Before this,
 * each call site was told to pick: `variant="ink"` on a dark band, `variant="primary"`
 * on a light one. That is asking a person to remember a contrast rule at the moment
 * they are thinking about something else, and they did not:
 *
 *   - "How we work in full" on the homepage and "The method in full" on
 *     `/pub-marketing` are ink-filled buttons inside ink sections. Fill against
 *     background 1.00:1, border against background 1.00:1. The button is invisible;
 *     only its label shows, so it reads as a stray line of text.
 *   - Five call-to-action buttons on orange bands were ink blocks at 2.92:1 with a
 *     border that could not be seen either.
 *   - One call site had already been hand-patched with
 *     `className="!text-oj-cream !border-oj-cream"`, which is the same fix applied
 *     once, by hand, in one place, with nothing to stop the next one being missed.
 *
 * So the ground is declared once by whatever paints the background, and every button
 * inside it reads it from context. The colour-naming variants are gone from the type,
 * which means a call site cannot express the broken combination any more.
 *
 * Grounds outside the three named surfaces resolve to the nearest of them: brand
 * orange, peach, orange-soft and the taxonomy tints are all `light`, because an ink
 * outline reads at 5.13:1 or better on every one of them. Ember is `ink`.
 */
export type Ground = 'light' | 'ink' | 'band';

const GroundContext = React.createContext<Ground>('light');

export function GroundProvider({
  value,
  children,
}: {
  value: Ground;
  children: React.ReactNode;
}): JSX.Element {
  return <GroundContext.Provider value={value}>{children}</GroundContext.Provider>;
}

/**
 * The ground the caller is painted on. Defaults to `light`, which is the page
 * background, so a component rendered outside any provider behaves as it did before.
 */
export function useGround(): Ground {
  return React.useContext(GroundContext);
}

export default GroundProvider;
