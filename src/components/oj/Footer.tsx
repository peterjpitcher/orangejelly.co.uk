import * as React from 'react';

import { cn } from '@/lib/utils';

import { Anchor } from './Anchor';

/**
 * Ink site footer: brand and tagline, link columns, legal bar.
 *
 * "Orange Jelly Limited", never "Ltd". The signature line on the right is part of
 * the positioning rather than decoration: it is the last thing a reader sees and it
 * says what the company is not.
 */
export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface FooterProps {
  /** Pass the white reversed mark. Defaults to the type wordmark. */
  logo?: React.ReactNode;
  tagline?: React.ReactNode;
  columns?: FooterColumn[];
  legal?: React.ReactNode;
  note?: React.ReactNode;
  /** Extra brand-block content, for example an availability Tag. */
  children?: React.ReactNode;
  className?: string;
}

export function Footer({
  logo,
  tagline = 'Your business is capable of more. Our job is finding what is stopping it.',
  columns = [],
  legal,
  note = 'AI is part of the toolkit, not the product.',
  children,
  className,
}: FooterProps): JSX.Element {
  const brand = logo ?? (
    <span className="font-oj text-[22px] font-black tracking-[-0.02em]">
      orange <span className="text-oj-orange">jelly</span>
    </span>
  );

  /*
   * The hairline is what lets the padding be small.
   *
   * With no edge at all, the closing ink band and the ink footer were one 834px
   * slab and the footer's own 64px of top padding was just more of it. Every
   * design-system template whose closing section is ink gives the footer a 1px top
   * border, and every template whose closing section is not ink omits one, which is
   * the whole rule: the line exists to say where the band stops. With it, 40px
   * reads as a gap rather than as a mistake.
   */
  return (
    <footer
      className={cn('border-t border-oj-cream/20 bg-oj-ink pb-7 pt-10 text-oj-cream', className)}
    >
      <div className="mx-auto max-w-[1160px] px-8">
        {/*
          A grid, not `justify-between` with a fixed-width brand block.

          The old layout pinned the brand to 300px on the left and pushed the three
          link groups to the right edge, which on a 1160px shell left roughly 300px of
          nothing down the middle. The brand column is also much shorter than the link
          columns, 101px against 234px, so the bottom left was empty too. Together
          that read as a mostly empty footer rather than a deliberate one.

          Four grid tracks spread the same content across the full width. The brand
          gets a wider track because its line wraps; the three link groups share the
          rest evenly.
        */}
        {/*
          Two columns on a phone, not four stacked blocks.

          Below 640px this collapsed to a single column, so the footer ran to 1,191px
          on a 390px screen: about one and a third screens of footer, and by far the
          worst version of the "footer is too big" problem. The three link groups sit
          two-up instead, with the brand spanning both, which takes 244px off it and
          costs nothing legible.

          `sm:col-span-1` rather than `lg:`, deliberately. With `lg:` the brand block
          would stay full width from 640 to 1023px and the footer would grow by about
          178px on a tablet, trading a phone win for a tablet regression.
        */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,1fr))]">
          <div className="col-span-2 flex flex-col gap-3.5 sm:col-span-1">
            {/*
              `self-start` on the brand, and not `items-start` on the column.

              A column flex container stretches its children across the cross axis,
              which here is the width. An `<img className="h-10 w-auto">` cannot
              resist that: `w-auto` loses to the stretch, the image is forced to the
              container's 300px, and `object-fit` defaults to `fill`, so the mark is
              squashed. The footer icon is 640x667, near square, and was rendering
              300x40. It looked like a flattened ellipse.

              Fixing it with `items-start` on the parent would work for the image and
              break the tagline, which needs the full 300px to wrap where it is meant
              to. Constraining just the brand leaves the text alone.

              It sits here rather than on the logo passed in, because the next person
              to pass a logo would hit exactly the same thing.
            */}
            <div className="self-start">{brand}</div>
            {tagline ? (
              <p className="m-0 max-w-[30ch] text-[15.5px] font-bold leading-normal text-oj-cream/85">
                {tagline}
              </p>
            ) : null}
            {/*
              The category line and a way to reach a person.

              The brand column carried a logo and one line, 101px against the 234px of
              the link columns beside it, so the bottom left of the footer was empty on
              every page. The link columns are tall because each row is a 44px touch
              target, which is deliberate and stays, so the fix is to give this column
              something worth reading rather than to shrink the others.

              Both additions earn their place. The category line is what section 27 of
              the positioning overview asks to be preserved, and the footer is on every
              page. The address is the only mailbox Orange Jelly has, and a footer with
              no way to contact anybody is a gap rather than a clean design.
            */}
            <p className="m-0 max-w-[32ch] text-[14px] leading-relaxed text-oj-cream/60">
              We find what is stopping a business growing, then fix it. Any sector, any size, if you
              are open to change.
            </p>
            <Anchor
              href="mailto:peter@orangejelly.co.uk"
              className="text-[14.5px] font-medium text-oj-cream/75 no-underline hover:text-oj-orange"
            >
              peter@orangejelly.co.uk
            </Anchor>
            {children}
          </div>

          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-2.5">
              <span className="mb-0.5 text-xs font-bold uppercase tracking-[0.14em] text-oj-peach">
                {column.title}
              </span>
              {column.links.map((link) => (
                <Anchor
                  key={link.href}
                  href={link.href}
                  className="text-[14.5px] font-medium text-oj-cream/75 no-underline hover:text-oj-orange"
                >
                  {link.label}
                </Anchor>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-oj-cream/20 pt-5 text-[13px] text-oj-cream/55">
          <span>{legal ?? `© ${new Date().getFullYear()} Orange Jelly Limited`}</span>
          <span>{note}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
