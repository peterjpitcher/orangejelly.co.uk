/**
 * Every colour the share cards use, as literals.
 *
 * next/og draws the cards without the stylesheet, so there are no CSS variables to read.
 * Each value is the `--oj-*` token of the same name in src/app/globals.css, and
 * src/test/design-tokens.contrast.test.ts fails if one drifts from it.
 */
export const SHARE_CARD_COLOURS = {
  /** --oj-orange: the header band, and the Mark behind the default card's last word. */
  orange: '#f76b0c',
  /** --oj-ink: display type, the running head, and the footer band. */
  ink: '#23252e',
  /** --oj-cream: the page the title sits on, and the footer's supporting line. */
  cream: '#f7f5f1',
  /** --oj-peach: the address in the footer. */
  peach: '#ffd3ad',
} as const;
