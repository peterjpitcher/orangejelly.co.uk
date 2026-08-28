import NextLink from 'next/link';
import * as React from 'react';

/**
 * One link element for the whole library.
 *
 * Every component here was ported with a plain `<a>`, which is correct for a static
 * design reference and wrong in this app: an internal `<a>` is a full page load, so
 * the site chrome would throw away the router on every click. Next's own lint rule
 * catches it in pages and cannot see it inside a component, which is exactly the
 * kind of gap that stays open for a year.
 *
 * Internal paths go through `next/link` and get client navigation and prefetch.
 * Anything that is not an internal path stays a plain anchor, because `next/link`
 * is meaningless for a `mailto:`, a `tel:`, an in-page `#` target or another origin.
 */
function isInternalPath(href?: string): boolean {
  return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//');
}

export type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string;
};

export const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(function Anchor(
  { href, children, ...rest },
  ref
) {
  if (isInternalPath(href)) {
    return (
      <NextLink ref={ref} href={href as string} {...rest}>
        {children}
      </NextLink>
    );
  }

  return (
    <a ref={ref} href={href} {...rest}>
      {children}
    </a>
  );
});

export default Anchor;
