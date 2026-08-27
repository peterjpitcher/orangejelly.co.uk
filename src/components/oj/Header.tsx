'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from './Button';

/**
 * Site header: brand, primary nav, one call to action.
 *
 * Collapses below 880px to a full-screen ink drawer. Mobile is 78% of this site's
 * search clicks and ranks eight positions better than desktop, so the drawer is not
 * a fallback, it is the main event.
 *
 * `tone="orange"` is the campaign header, for conversion pages only: Start Here,
 * the growth-problems hub and the eight problem pages. Everything else stays cream,
 * About included.
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

  // Escape closes, focus returns to the control that opened it, and the page behind
  // stops scrolling. Without the scroll lock the drawer floats over a moving page,
  // which on iOS is disorientating rather than merely untidy.
  React.useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    drawerRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const close = React.useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  const brand = logo ?? (
    <span
      className={cn(
        'font-oj text-[21px] font-black tracking-[-0.02em]',
        orange ? 'text-white' : 'text-oj-ink'
      )}
    >
      orange <span className={orange ? 'text-oj-ink' : 'text-oj-orange'}>jelly</span>
    </span>
  );

  return (
    <>
      <header
        className={cn(
          'z-[60] border-b-1.5 border-oj-ink',
          sticky && 'sticky top-0',
          orange ? 'bg-oj-orange' : 'bg-oj-cream'
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1160px] items-center gap-6 px-8">
          <a href={home} aria-label="Home" className="flex items-center no-underline">
            {brand}
          </a>

          <nav className="ml-auto hidden gap-0.5 min-[881px]:flex" aria-label="Primary">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={cn(
                  'rounded-oj px-[11px] py-[7px] text-[15px] font-semibold no-underline',
                  orange
                    ? 'text-white hover:text-oj-ink aria-[current]:shadow-[inset_0_-3px_0_#fff]'
                    : 'text-oj-ink hover:text-oj-orange-deep aria-[current]:shadow-[inset_0_-3px_0_var(--oj-orange)]'
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {cta ? (
            <span className="hidden flex-none min-[881px]:inline-flex">
              <Button
                size="sm"
                variant={orange ? 'ink' : 'primary'}
                href={cta.href}
                onClick={cta.onClick}
              >
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
              orange ? 'border-white text-white' : 'border-oj-ink text-oj-ink'
            )}
          >
            {open ? 'Close ×' : 'Menu'}
          </button>
        </div>
      </header>

      {open ? (
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
                  <a
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
                  </a>
                ))}
              </div>
            ) : (
              <a
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
              </a>
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
      ) : null}
    </>
  );
}

export default Header;
