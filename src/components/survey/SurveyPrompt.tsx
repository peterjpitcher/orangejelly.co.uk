'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button, Modal } from '@/components/oj';
import { PROMOTED_SURVEY } from '@/lib/promoted-survey';
import { isToolRoute } from '@/lib/tool-routes';

/**
 * The site-wide prompt to take the promoted survey.
 *
 * Peter asked for it on every page (22 September 2026) to get the trade's answers
 * in. What it does, and why each rule is there:
 *
 * - **It waits for the cookie choice.** Opening on top of the consent panel would
 *   bury one decision under another. It listens for the consent event CookieNotice
 *   fires, so a first-time visitor sees the panel, chooses, then gets the prompt.
 * - **It opens after eight seconds**, so it arrives once somebody has started
 *   reading rather than as the page loads.
 * - **It asks the server first** (`/api/survey-promotion`) and opens only on an
 *   explicit yes. A survey closed in the database stops being pushed without a
 *   release, and an outage means no prompt, never a prompt for a dead survey.
 * - **Once seen, it stays away for 14 days**, and for good after "Take the survey"
 *   or a visit to the survey page. A prompt on every page view would be a reason to
 *   leave. The record is a single flag in localStorage holding no personal data; if
 *   storage is unavailable it does not open at all, rather than opening on every page.
 * - **A lightbox on a wide screen, a small card on a phone.** Google demotes pages
 *   whose popups cover the content on a phone, and most search visits to this site
 *   are on phones, so the phone version sits at the bottom and leaves the page
 *   readable. The wide version is the design system's Modal: focus trap, Escape,
 *   click outside.
 * - **Not everywhere, quite.** Not on the survey itself, not on the back office,
 *   and not on /start-here, where it would interrupt somebody writing an enquiry.
 *   MarketingChrome already keeps it off the poll tool and every token route.
 */

export const PROMPT_STORAGE_KEY = 'oj-survey-prompt';
export const PROMPT_DELAY_MS = 8000;
export const PROMPT_SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;

/** Set by CookieNotice; present once the visitor has made a choice either way. */
const CONSENT_STORAGE_KEY = 'oj-cookie-consent';
/** Fired by `updateGtagConsent` whenever the visitor chooses. */
const CONSENT_EVENT = 'oj:analytics-consent';
const WIDE_QUERY = '(min-width: 640px)';

interface PromptRecord {
  slug: string;
  /** Epoch milliseconds the prompt last opened. */
  shownAt?: number;
  /** They took the survey or visited it. Never prompt again for this slug. */
  done?: boolean;
}

const UNAVAILABLE = Symbol('storage unavailable');

function readRecord(): PromptRecord | null | typeof UNAVAILABLE {
  try {
    const raw = window.localStorage.getItem(PROMPT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PromptRecord;
    return typeof parsed?.slug === 'string' ? parsed : null;
  } catch {
    return UNAVAILABLE;
  }
}

function writeRecord(record: PromptRecord): void {
  try {
    window.localStorage.setItem(PROMPT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Nothing to do: without storage the prompt never opens, so it cannot nag.
  }
}

/** Would opening now be welcome? A record for a different survey does not count. */
function mayOffer(slug: string, now: number): boolean {
  const record = readRecord();
  if (record === UNAVAILABLE) return false;
  if (!record || record.slug !== slug) return true;
  if (record.done) return false;
  return !record.shownAt || now - record.shownAt >= PROMPT_SNOOZE_MS;
}

function consentChosen(): boolean {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function isPromptExcluded(pathname: string): boolean {
  return pathname.startsWith('/survey/') || isToolRoute(pathname) || pathname === '/start-here';
}

export default function SurveyPrompt(): JSX.Element | null {
  const pathname = usePathname() ?? '';
  const [open, setOpen] = useState(false);
  const [wide, setWide] = useState(true);

  useEffect(() => {
    // A prompt left open does not follow the visitor to the next page.
    setOpen(false);
    if (!PROMOTED_SURVEY) return undefined;
    const { slug, href } = PROMOTED_SURVEY;

    // Reaching the survey any way at all, the nav included, counts as taking it up.
    if (pathname === href || pathname.startsWith(`${href}/`)) {
      writeRecord({ slug, done: true });
      return undefined;
    }
    if (isPromptExcluded(pathname) || !mayOffer(slug, Date.now())) return undefined;

    let cancelled = false;
    let timer: number | undefined;

    const offer = async (): Promise<void> => {
      try {
        const response = await fetch('/api/survey-promotion');
        if (!response.ok) return;
        const body = (await response.json()) as { live?: unknown };
        // Checked again after the wait: another tab may have shown it meanwhile.
        if (cancelled || body.live !== true || !mayOffer(slug, Date.now())) return;
        writeRecord({ slug, shownAt: Date.now() });
        setWide(window.matchMedia(WIDE_QUERY).matches);
        setOpen(true);
      } catch {
        // Fails closed: no answer, no prompt.
      }
    };

    const start = (): void => {
      window.removeEventListener(CONSENT_EVENT, start);
      timer = window.setTimeout(() => void offer(), PROMPT_DELAY_MS);
    };

    if (consentChosen()) start();
    else window.addEventListener(CONSENT_EVENT, start);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener(CONSENT_EVENT, start);
    };
  }, [pathname]);

  // Stable, because Modal re-runs its focus handling whenever onClose changes.
  const dismiss = useCallback(() => setOpen(false), []);

  const takeIt = useCallback(() => {
    if (PROMOTED_SURVEY) writeRecord({ slug: PROMOTED_SURVEY.slug, done: true });
    setOpen(false);
  }, []);

  // Escape closes the phone card too. The Modal handles its own.
  useEffect(() => {
    if (!open || wide) return undefined;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, wide, dismiss]);

  if (!open || !PROMOTED_SURVEY) return null;
  const survey = PROMOTED_SURVEY;

  if (wide) {
    return (
      <Modal
        open
        onClose={dismiss}
        eyebrow={survey.eyebrow}
        title={survey.title}
        actions={
          <>
            <Button href={survey.href} arrow onClick={takeIt}>
              {survey.cta}
            </Button>
            <Button variant="ghost" type="button" onClick={dismiss}>
              Not now
            </Button>
          </>
        }
      >
        <p className="m-0">{survey.blurb}</p>
      </Modal>
    );
  }

  return (
    /*
     * The phone card. Non-modal: it does not take focus or block the page, which is
     * the point of it, so it is a labelled dialog rather than a trapped one. It sits
     * above the page (z 90) and below any real modal (z 100).
     */
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="survey-prompt-title"
      className="fixed inset-x-3 bottom-3 z-[90] rounded-oj border-1.5 border-oj-ink bg-oj-paper p-4 shadow-press"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="oj-eyebrow m-0">{survey.eyebrow}</p>
        <button
          type="button"
          onClick={dismiss}
          className="oj-focus -mr-1 -mt-1 min-h-tap min-w-tap rounded-oj text-xl leading-none text-oj-ink-2 hover:text-oj-ink"
        >
          <span aria-hidden="true">×</span>
          <span className="sr-only">Close</span>
        </button>
      </div>
      <p
        id="survey-prompt-title"
        className="-mt-2 font-oj text-[19px] font-black leading-snug tracking-[-0.02em] text-oj-ink"
      >
        {survey.title}
      </p>
      <p className="mt-1 text-sm text-oj-ink-2">{survey.teaser}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button href={survey.href} size="sm" arrow onClick={takeIt}>
          {survey.cta}
        </Button>
        <Button variant="ghost" size="sm" type="button" onClick={dismiss}>
          Not now
        </Button>
      </div>
    </section>
  );
}
