'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CONTACT } from '@/lib/constants';
import { trackClientEvent } from '@/lib/tracking';
import { STICKY_BAR_HIDDEN_PATHS } from './engagement-config';

const DISMISS_KEY = 'oj-sticky-dismissed';

const PROBLEM_STATEMENTS = [
  'Empty tables midweek? We can fix that.',
  'Margins disappearing? Let\u2019s find the leaks.',
  'No time for marketing? We\u2019ll handle it.',
  'Staff keep leaving? We\u2019ve been there.',
  'Competing with chains? You have advantages they don\u2019t.',
  'Don\u2019t know where to start? We\u2019ll show you.',
];

export default function StickyEngagementBar(): React.ReactElement | null {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fading, setFading] = useState(false);

  // Check sessionStorage on mount and start delay timer
  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(DISMISS_KEY) === 'true';
    if (wasDismissed) {
      setDismissed(true);
      return;
    }
    setDismissed(false);

    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Rotate problem statements every 5 seconds
  useEffect(() => {
    if (!visible || dismissed) return;

    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % PROBLEM_STATEMENTS.length);
        setFading(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [visible, dismissed]);

  // Hide on excluded paths
  const isHiddenPath = STICKY_BAR_HIDDEN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
  if (isHiddenPath || dismissed) return null;

  function handleDismiss(): void {
    sessionStorage.setItem(DISMISS_KEY, 'true');
    setDismissed(true);
  }

  const whatsappUrl = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent("Hi Peter, I'd like to find out about your packages.")}`;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-orange text-brand-base transition-transform duration-300',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
      role="complementary"
      aria-label="Engagement bar"
    >
      {/*
       * The dismiss button is a flex child, not absolutely positioned.
       *
       * It used to be `absolute right-3` against this container, with `pr-12` here
       * reserving the space. That only lines up while the container is about as
       * wide as the viewport. Once the viewport passes max-w-5xl the container edge
       * becomes an invisible line, and at 1920px the button sat 237px right of the
       * buttons and still 460px short of the bar's own edge: floating in the gap,
       * attached to neither.
       *
       * In the flow it stays with the cluster it belongs to at every width.
       */}
      <div className="page-shell flex items-center justify-center gap-3 py-2">
        {/* Rotating problem statement */}
        <p
          className={cn(
            // Navy, not white. This bar is filled with the brand orange, where
            // white is 2.98:1 and navy is 4.55:1.
            'text-sm text-brand-base transition-opacity duration-300 text-center',
            /*
             * Hidden below md, and never allowed to wrap above it.
             *
             * The two CTAs are a fixed 241px and the dismiss button another 16px,
             * so at 375px this paragraph was left with 75px to work in. The longest
             * statement wrapped to six lines and pushed the bar to 136px tall,
             * covering a sixth of the screen. It is a nice-to-have message, so it
             * waits until there is room to read it on one line.
             */
            'hidden min-w-0 truncate md:block',
            fading ? 'opacity-0' : 'opacity-100'
          )}
        >
          {PROBLEM_STATEMENTS[currentIndex]}
        </p>

        {/* CTA buttons */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/ways-to-work"
            className="rounded-full bg-brand-base px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-base/90 whitespace-nowrap min-h-0"
            onClick={() =>
              trackClientEvent('package_cta_click', {
                properties: {
                  cta: 'sticky_engagement_packages',
                  source: 'sticky_engagement_bar',
                },
              })
            }
          >
            See Packages
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            // green-700, not green-600: white on green-600 is 3.30:1, and this
            // label is 12px, so it needs 4.5:1. green-700 gives 5.02:1 and the
            // hover moves to green-800 at 7.13:1.
            className="whitespace-nowrap rounded-full bg-green-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-800 min-h-0"
            onClick={() =>
              trackClientEvent('whatsapp_click', {
                properties: {
                  cta: 'sticky_engagement_whatsapp',
                  source: 'sticky_engagement_bar',
                },
              })
            }
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="ml-1 flex shrink-0 items-center justify-center text-brand-base/80 transition-colors hover:text-brand-base-dark min-h-0 min-w-0"
          aria-label="Dismiss"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
