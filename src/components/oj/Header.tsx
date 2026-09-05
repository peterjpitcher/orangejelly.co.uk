'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { GroundProvider } from './Ground';

import { Anchor } from './Anchor';

import { Button } from './Button';

/**
 * Site header: brand, primary nav, one call to action.
 *
 * Collapses below 880px to a full-screen ink drawer. Mobile is 78% of this site's
 * search clicks and ranks eight positions better than desktop, so the drawer is not
 * a fallback, it is the main event.
 *
 * `tone="orange"` is the campaign header. Only `/start-here` uses it.
 *
 * This docblock used to say it also covered the growth-problems hub and the eight
 * problem pages. It never did, and those pages read better without it: they open on
 * an orange hero band, and an orange bar directly above an orange band removes the
 * edge that makes the hero land. Corrected rather than implemented, because the
 * pages as built are the ones that were reviewed.
 *
 * WHAT THIS PORT ADDS. The reference toggles a boolean and renders a panel. That
 * leaves the drawer open to Escape doing nothing, focus staying behind on the page
 * underneath, and the body scrolling beneath the overlay. All three are keyboard and
 * screen-reader problems rather than cosmetic ones, so they are handled here.
 */
export interface HeaderSubItem {
  label: string;
  href: string;
  current?: boolean;
  /** Styles as a peach "view all" row at the foot of a group. */
  more?: boolean;
}

export interface HeaderItem {
  label: string;
  href?: string;
  current?: boolean;
  /** Rendered as a grouped section in the drawer. Desktop keeps the flat bar. */
  sub?: HeaderSubItem[];
}

export interface HeaderProps {
  items?: HeaderItem[];
  cta?: { label: string; href?: string; onClick?: () => void };
  /** Pass the horizontal logo. Defaults to the type wordmark. */
  logo?: React.ReactNode;
  home?: string;
  sticky?: boolean;
  tone?: 'cream' | 'orange';
}

const MENU_ID = 'oj-primary-mobile-nav';

export function Header({
  items = [],
  cta,
  logo,
  home = '/',
  sticky = true,
  tone = 'cream',
}: HeaderProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const orange = tone === 'orange';
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const drawerRef = React.useRef<HTMLElement>(null);

  /**
   * Closing has two halves and they are equally important: the drawer goes away,
   * and focus goes back to the button that opened it. Dropping the second half
   * sends a keyboard user to the top of the document with no idea why.
   */
  const close = React.useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Escape closes, focus returns to the control that opened it, and the page behind
  // stops scrolling. Without the scroll lock the drawer floats over a moving page,
  // which on iOS is disorientating rather than merely untidy.
  React.useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      // `close`, not `setOpen(false)`. Escape used to skip the focus return, so the
      // one path a keyboard user is most likely to take was the one path that left
      // them stranded.
      if (event.key === 'Escape') close();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    drawerRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  const brand = logo ?? (
    <span
      className={cn(
        'font-oj text-[21px] font-black tracking-[-0.02em]',
        orange ? 'text-oj-on-band' : 'text-oj-ink'
      )}
    >
      orange <span className={orange ? 'text-oj-on-band' : 'text-oj-orange-deep'}>jelly</span>
    </span>
  );

  return (
    <>
      {/*
        The bar and the drawer are different grounds and always have been. The bar is
        cream or, on a campaign page, the orange band. The drawer is ink on every
        page, whatever the bar above it is doing, which is exactly the sort of detail
        a call site should not have to hold in its head.
      */}
      <GroundProvider value={orange ? 'band' : 'light'}>
        <header
          className={cn(
            'z-[60] border-b-1.5 border-oj-ink',
            sticky && 'sticky top-0',
            /*
             * The band surface, not the brand orange. White nav links on the brand
             * orange measured 2.97:1, which failed before this change as well as
             * after it. The deeper band ground takes them to 5.24:1 and matches the
             * hero the campaign header always sits above.
             */
            orange ? 'bg-oj-band' : 'bg-oj-cream'
          )}
        >
          <div className="mx-auto flex h-16 max-w-[1160px] items-center gap-4 px-4 sm:gap-6 sm:px-8">
            {/*
              `flex-none`, or the mark gets squeezed rather than the bar wrapping.
              
              The logo sits in a flex row with the nav, and a flex item shrinks by
              default. Below about 1024px the nav needed room and took it out of the
              image: `w-auto` loses to the shrink, `object-fit` defaults to `fill`,
              and the artwork distorts rather than the layout giving way. Measured at
              881px it rendered 146x36 against a natural 166x36, so the wordmark was
              about 12% narrow on every laptop between the mobile breakpoint and
              1024, and worse the larger the logo is set.
            */}
            <Anchor
              href={home}
              aria-label="Home"
              className="flex flex-none items-center no-underline"
            >
              {brand}
            </Anchor>

            <nav className="ml-auto hidden gap-0.5 min-[881px]:flex" aria-label="Primary">
              {items.map((item) => (
                <Anchor
                  key={item.label}
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  className={cn(
                    'rounded-oj px-[11px] py-[7px] text-[15px] font-semibold no-underline',
                    orange
                      ? 'text-oj-on-band hover:text-oj-cream aria-[current]:shadow-[inset_0_-3px_0_currentColor]'
                      : 'text-oj-ink hover:text-oj-orange-deep aria-[current]:shadow-[inset_0_-3px_0_var(--oj-orange)]'
                  )}
                >
                  {item.label}
                </Anchor>
              ))}
            </nav>

            {cta ? (
              <span className="hidden flex-none min-[881px]:inline-flex">
                <Button size="sm" href={cta.href} onClick={cta.onClick}>
                  {cta.label}
                </Button>
              </span>
            ) : null}

            <button
              ref={toggleRef}
              type="button"
              onClick={() => (open ? close() : setOpen(true))}
              aria-expanded={open}
              aria-controls={MENU_ID}
              className={cn(
                'ml-auto min-h-tap rounded-oj border-1.5 px-[13px] py-1.5 font-oj text-[14.5px] font-bold min-[881px]:hidden',
                orange ? 'border-oj-on-band text-oj-on-band' : 'border-oj-ink text-oj-ink'
              )}
            >
              {open ? 'Close ×' : 'Menu'}
            </button>
          </div>
        </header>
      </GroundProvider>

      {open ? (
        <GroundProvider value="ink">
          <nav
            id={MENU_ID}
            ref={drawerRef}
            tabIndex={-1}
            aria-label="Primary mobile"
            className="fixed inset-x-0 bottom-0 top-16 z-[59] flex flex-col overflow-auto bg-oj-ink px-8 pb-11 pt-[30px] outline-none"
          >
            {items.map((item) =>
              item.sub?.length ? (
                <div key={item.label} className="border-b border-oj-cream/15 pb-1.5 pt-3.5">
                  <span
                    className={cn(
                      'block pb-2 font-oj text-[31px] font-black tracking-[-0.02em]',
                      item.current ? 'text-oj-orange' : 'text-oj-cream'
                    )}
                  >
                    {item.label}
                  </span>
                  {item.sub.map((sub) => (
                    <Anchor
                      key={sub.href}
                      href={sub.href}
                      aria-current={sub.current ? 'page' : undefined}
                      onClick={close}
                      className={cn(
                        'block py-[7px] pl-0.5 text-[16.5px] font-semibold no-underline hover:text-oj-orange',
                        sub.more
                          ? 'font-bold text-oj-peach'
                          : sub.current
                            ? 'text-oj-orange'
                            : 'text-oj-cream/75'
                      )}
                    >
                      {sub.label}
                    </Anchor>
                  ))}
                </div>
              ) : (
                <Anchor
                  key={item.label}
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  onClick={close}
                  className={cn(
                    'block border-b border-oj-cream/15 py-3 font-oj text-[31px] font-black tracking-[-0.02em] no-underline',
                    item.current ? 'text-oj-orange' : 'text-oj-cream'
                  )}
                >
                  {item.label}
                </Anchor>
              )
            )}

            {cta ? (
              <div className="mt-[26px]">
                <Button size="lg" arrow href={cta.href} onClick={cta.onClick}>
                  {cta.label}
                </Button>
              </div>
            ) : null}
          </nav>
        </GroundProvider>
      ) : null}
    </>
  );
}

export default Header;
