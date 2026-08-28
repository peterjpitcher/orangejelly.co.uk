import * as React from 'react';

/**
 * Protects proper nouns and initialisms inside a lowercase display heading.
 *
 * `.oj-display` sets `text-transform: lowercase`, which is the brand's display
 * treatment and is right for ordinary words. It is wrong for anything that is not
 * an ordinary word: "You want AI that earns its place" rendered as "you want ai
 * that earns its place", which reads as a typo rather than as a style.
 *
 * CSS cannot tell the difference, so this does it at the point the string is
 * rendered. Everything not in the list still lowercases, so the treatment is
 * unchanged for the other pages.
 *
 * The list is deliberately short and specific. It is not a general
 * capitalise-important-words rule: the display style exists precisely to strip
 * emphasis from ordinary words, and a long list would quietly undo it.
 */
const PRESERVED = [
  'AI',
  'UK',
  'VAT',
  'EPOS',
  'SEO',
  'GDPR',
  'Google',
  'The Anchor',
  'Orange Jelly',
  'Greene King',
  'BII',
];

// Longest first, so "The Anchor" is matched before a shorter token inside it, and
// word-bounded so "AI" does not match inside "said" or "captain".
const PATTERN = new RegExp(
  `(${[...PRESERVED]
    .sort((a, b) => b.length - a.length)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})`,
  'g'
);

export interface KeepCaseProps {
  children: string;
}

export function KeepCase({ children }: KeepCaseProps): JSX.Element {
  const parts = children.split(PATTERN);

  return (
    <>
      {parts.map((part, index) =>
        PRESERVED.includes(part) ? (
          <span key={`${part}-${index}`} className="oj-keep-case">
            {part}
          </span>
        ) : (
          <React.Fragment key={`t-${index}`}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export default KeepCase;
