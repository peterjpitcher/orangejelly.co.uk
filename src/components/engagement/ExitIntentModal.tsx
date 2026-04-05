'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PROBLEM_OPTIONS, EXIT_INTENT_EXCLUDED_PATHS } from './engagement-config';
import type { ProblemOption } from './engagement-config';

const SESSION_KEY = 'oj-exit-shown';

export default function ExitIntentModal(): React.ReactElement | null {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);

  const dismiss = useCallback(() => {
    setOpen(false);
  }, []);

  // Listen for Escape key
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        dismiss();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, dismiss]);

  // Focus trap — focus modal when it opens
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  // Exit-intent detection (desktop only — mouseleave at top of viewport)
  useEffect(() => {
    // Check excluded paths
    const isExcluded = EXIT_INTENT_EXCLUDED_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + '/')
    );
    if (isExcluded) return;

    // Check if already shown this session
    if (sessionStorage.getItem(SESSION_KEY) === 'true') return;

    // 2-second activation delay
    const activationTimer = setTimeout(() => {
      activeRef.current = true;
    }, 2000);

    function handleMouseLeave(e: MouseEvent): void {
      if (!activeRef.current) return;
      if (e.clientY < 0) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setOpen(true);
        // Remove listener after firing once
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(activationTimer);
      activeRef.current = false;
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [pathname]);

  function handleOptionClick(option: ProblemOption): void {
    setOpen(false);
    router.push(option.href);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="How can we help?"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl outline-none sm:p-8"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-4 top-4 text-charcoal/40 transition-colors hover:text-charcoal"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
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

        {/* Heading */}
        <h2 className="mb-6 font-heading text-2xl font-bold text-charcoal sm:text-3xl">
          Sound familiar?
        </h2>

        {/* Option cards */}
        <div className="space-y-3">
          {PROBLEM_OPTIONS.map((option) => (
            <button
              key={option.href + option.text}
              type="button"
              onClick={() => handleOptionClick(option)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg border border-charcoal/10 px-4 py-3 text-left transition-all',
                'hover:border-orange hover:bg-orange/5'
              )}
            >
              <span className="pr-3 text-sm text-charcoal sm:text-base">{option.text}</span>
              <span className="shrink-0 text-charcoal/40" aria-hidden="true">
                &rarr;
              </span>
            </button>
          ))}
        </div>

        {/* Dismiss text */}
        <p className="mt-5 text-center text-sm text-charcoal/50">
          Just having a look?{' '}
          <button
            type="button"
            onClick={dismiss}
            className="underline transition-colors hover:text-charcoal"
          >
            No problem.
          </button>
        </p>
      </div>
    </div>
  );
}
