'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { updateGtagConsent } from '@/components/GoogleTagManager';

const STORAGE_KEY = 'oj-cookie-consent';

interface ConsentPreferences {
  analytics: boolean;
  timestamp: string;
}

/** Fired on window by the footer's Cookie settings button. */
const OPEN_SETTINGS_EVENT = 'oj:open-cookie-settings';

/**
 * Reopens the consent panel so a stored choice can be changed.
 *
 * The privacy notice says you can change your mind at any time. Until 22 September
 * 2026 the panel only ever appeared to someone who had not chosen yet, so once a
 * choice was stored there was no way back to it short of clearing browser storage.
 */
export function openCookieSettings(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

/**
 * Removes Google Analytics' own cookies when analytics is switched off.
 *
 * GA sets `_ga` and `_ga_<id>` on the widest domain it can, so each name is
 * cleared on the bare host and on the registrable domain. Clearing one that is
 * not there does nothing.
 */
function clearGoogleAnalyticsCookies(): void {
  const names = document.cookie
    .split(';')
    .map((cookie) => cookie.trim().split('=')[0])
    .filter((name) => name === '_ga' || name.startsWith('_ga_'));
  const host = window.location.hostname;
  const domains = ['', host, `.${host.replace(/^www\./, '')}`];

  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
    }
  }
}

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  // True when the panel was opened from Cookie settings rather than shown to
  // somebody who has not chosen yet.
  const [reopened, setReopened] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
      return;
    }

    try {
      const parsed: ConsentPreferences | string = JSON.parse(stored);
      if (typeof parsed === 'string') {
        // Legacy string storage (accepted / rejected)
        const legacyPrefs: ConsentPreferences = {
          analytics: parsed === 'accepted',
          timestamp: new Date().toISOString(),
        };
        setPreferences(legacyPrefs);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(legacyPrefs));
        updateGtagConsent(legacyPrefs.analytics);
        return;
      }
      setPreferences(parsed);
      updateGtagConsent(parsed.analytics);
    } catch {
      // Handle legacy string value
      const analyticsAllowed = stored === 'accepted';
      const payload: ConsentPreferences = {
        analytics: analyticsAllowed,
        timestamp: new Date().toISOString(),
      };
      setPreferences(payload);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      updateGtagConsent(analyticsAllowed);
    }
  }, []);

  useEffect(() => {
    const onOpen = (): void => {
      setShowDetails(false);
      setReopened(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  }, []);

  // Opened from the footer, the panel appears at the bottom of the screen, well
  // away from the button that opened it. Focus goes with it so a keyboard or
  // screen-reader user lands on the choice they asked for.
  useEffect(() => {
    if (visible && reopened) panelRef.current?.focus();
  }, [visible, reopened]);

  const savePreferences = (analytics: boolean) => {
    // Switching analytics off after it was on. GTM is already running on this page
    // and a loaded script cannot be taken back out, so the page reloads without it:
    // that is what makes "withdrawing stops the collection straight away" true.
    const withdrawing = preferences?.analytics === true && !analytics;

    if (typeof window !== 'undefined') {
      const payload: ConsentPreferences = {
        analytics,
        timestamp: new Date().toISOString(),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setPreferences(payload);
      // Update Google Consent Mode so GTM tags respond immediately
      updateGtagConsent(analytics);
    }
    setVisible(false);
    setReopened(false);

    if (withdrawing) {
      clearGoogleAnalyticsCookies();
      window.location.reload();
    }
  };

  const handleAccept = () => savePreferences(true);
  const handleReject = () => savePreferences(false);

  if (!visible) {
    return null;
  }

  /*
   * The consent panel is on every page, so it was the one piece of old design the
   * repositioning could not hide from and the one nobody looked at. It carried the
   * legacy palette (`bg-brand-base`, `rounded-lg`, soft shadows) beside pages built
   * on ink, 1.5px borders and the press shadow, and its accept button was
   * `bg-orange` with `text-brand-base`, which is dark text on brand orange: exactly
   * the pairing that came off every other button on the site.
   *
   * Restyled here rather than gated behind a route check, because the button rule
   * is not a redesign preference. Dark text on brand orange measures 2.97:1 and
   * fails at any size, on the legacy pages as much as the new ones.
   *
   * Colours follow the same table as `oj/Button`: deep orange fill carries white,
   * and on a dark ground the outline is white so it stays a visible boundary.
   */
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:max-w-md">
      <div
        ref={panelRef}
        tabIndex={-1}
        className="font-oj space-y-3 rounded-oj border-1.5 border-oj-cream bg-oj-ink px-4 py-4 text-oj-cream shadow-press outline-none"
        role="dialog"
        aria-modal="false"
        aria-label="Cookie preferences"
      >
        {reopened && preferences ? (
          <p className="text-xs font-bold sm:text-sm">
            Analytics is currently switched {preferences.analytics ? 'on' : 'off'}.
          </p>
        ) : null}
        <p className="text-xs leading-relaxed sm:text-sm">
          We use essential cookies to keep the site running and optional analytics to understand how
          people find and use Orange Jelly. You can accept or reject analytics below. Questions?{' '}
          <Link href="/contact" className="font-semibold underline underline-offset-2">
            Contact us
          </Link>
          .
        </p>

        <div
          id="cookie-details-panel"
          className={`space-y-2 rounded-oj border-1.5 border-oj-cream/35 p-3 text-xs ${showDetails ? 'block' : 'hidden'}`}
        >
          <div>
            <p className="font-bold">Essential (always on)</p>
            <p className="text-oj-cream/80">
              Keeps navigation, forms, and security working. Served directly by Next.js, no third
              parties.
            </p>
          </div>
          <div>
            <p className="font-bold">Analytics (optional)</p>
            <p className="text-oj-cream/80">
              Google Tag Manager and Google Analytics. Nothing from Google loads unless you accept.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="oj-focus inline-flex items-center justify-center rounded-oj px-1 py-2 text-xs font-bold text-oj-cream underline underline-offset-4 transition-colors hover:text-oj-peach sm:mr-auto"
            aria-expanded={showDetails}
            aria-controls="cookie-details-panel"
          >
            {showDetails ? 'Hide details' : 'Manage settings'}
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="oj-focus inline-flex items-center justify-center rounded-oj border-1.5 border-oj-on-band px-3 py-2 text-xs font-bold text-oj-cream transition-colors hover:bg-oj-cream/10"
          >
            Reject analytics
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="oj-focus inline-flex items-center justify-center rounded-oj border-1.5 border-oj-on-band bg-oj-orange-deep px-3 py-2 text-xs font-bold text-oj-on-band transition-colors hover:bg-oj-ember"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
