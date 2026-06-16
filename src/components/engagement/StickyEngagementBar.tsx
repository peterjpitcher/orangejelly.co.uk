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
        'fixed bottom-0 left-0 right-0 z-40 bg-orange text-white transition-transform duration-300',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
      role="complementary"
      aria-label="Engagement bar"
    >
      <div className="relative mx-auto flex max-w-5xl items-center justify-center gap-3 px-4 py-2 pr-12">
        {/* Rotating problem statement */}
        <p
          className={cn(
            'text-sm text-white/90 transition-opacity duration-300 text-center',
            fading ? 'opacity-0' : 'opacity-100'
          )}
        >
          {PROBLEM_STATEMENTS[currentIndex]}
        </p>

        {/* CTA buttons */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/ways-to-work"
            className="rounded-full bg-charcoal px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-charcoal/90 whitespace-nowrap min-h-0"
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
            className="rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 whitespace-nowrap min-h-0"
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
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 transition-colors hover:text-white min-h-0 min-w-0"
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
