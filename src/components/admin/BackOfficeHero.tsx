import * as React from 'react';

import { GroundProvider } from '@/components/oj';
import { cn } from '@/lib/utils';

/**
 * The top of every back-office screen: an ink band with a peach eyebrow, a display
 * heading and an optional standfirst, which is how the public reading pages open
 * (see /about). The admin dashboard, the polls tool and its guest screens all use
 * it, so they open the way the rest of the site does and cannot drift apart.
 *
 * `keepCase` is for a heading that is somebody's own words, such as a poll title.
 * The display face lowercases, which is right for a line we wrote and wrong for
 * "Quiz night with Dave", so a kept-case heading keeps the face and the weight and
 * drops only the transform. The caller also leaves off the full stop.
 *
 * The band declares the ink ground, so a Button in `actions` or `children` picks
 * its dark-ground treatment without being told.
 */
export interface BackOfficeHeroProps {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  intro?: React.ReactNode;
  /** Buttons beside the heading on a wide screen, under it on a phone. */
  actions?: React.ReactNode;
  keepCase?: boolean;
  /** Anything else that belongs in the band, such as the poll's details under its title. */
  children?: React.ReactNode;
}

export default function BackOfficeHero({
  eyebrow,
  title,
  intro,
  actions,
  keepCase = false,
  children,
}: BackOfficeHeroProps): JSX.Element {
  return (
    <GroundProvider value="ink">
      <section className="border-b-1.5 border-oj-ink bg-oj-ink py-10 text-oj-cream sm:py-14">
        <div className="page-shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="font-oj text-[14px] font-bold uppercase tracking-[0.14em] text-oj-peach">
                {eyebrow}
              </p>
              <h1
                className={cn(
                  'oj-display mt-2.5 break-words text-[clamp(38px,7vw,64px)] leading-[0.95] text-oj-cream',
                  keepCase && 'oj-keep-case'
                )}
              >
                {title}
              </h1>
              {intro ? (
                <p className="mt-4 max-w-[62ch] text-[17px] leading-relaxed text-oj-cream/85">
                  {intro}
                </p>
              ) : null}
            </div>
            {actions ? <div className="flex flex-none flex-wrap gap-3">{actions}</div> : null}
          </div>
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
      </section>
    </GroundProvider>
  );
}
