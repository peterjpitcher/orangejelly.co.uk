'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { isScriptFreeRoute } from '@/lib/token-routes';
import { hasAnalyticsConsent } from '@/lib/tracking';

/** Fired on window by updateGtagConsent, so the loader hears an Accept click. */
const ANALYTICS_CONSENT_EVENT = 'oj:analytics-consent';

/**
 * GTM must not load on poll routes: those URLs carry a bearer token in the path,
 * and GTM reports the raw path to Google. Loading it there would hand a poll's own
 * access token to a third party, letting anyone with analytics access act as that
 * poll's organiser. Referrer-Policy does not help: GTM reads window.location
 * directly.
 *
 * Gated here rather than in MarketingChrome because GTM has to stay at the top of
 * <body> for its beforeInteractive consent defaults to run before anything else.
 *
 * LOADS ONLY AFTER CONSENT, since 22 September 2026, on the owner's instruction.
 * GTM used to load on every page with Consent Mode defaults set to denied, so
 * Google Analytics sent cookieless page views before anyone had answered the
 * banner, and kept sending them after "Reject analytics". The privacy notice says
 * that if you decline or ignore the banner these tools never load, and now they
 * do not: gtm.js is injected only when a stored choice or an Accept click says
 * analytics is allowed. The consent defaults still run first, so GTM starts from
 * denied and reads the granted update already waiting in the dataLayer.
 *
 * The container also carried three Microsoft Clarity tags, which recorded visits
 * without consent. Clarity is removed: its hosts are gone from the CSP in
 * src/middleware.ts, so it cannot run even from a stale container.
 */
export function GoogleTagManager() {
  const pathname = usePathname();
  const [consented, setConsented] = useState(false);
  // Read at render, not at module load. Next inlines it at build time either way,
  // and reading it here lets a test set it before the component renders.
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  useEffect(() => {
    // A choice stored on an earlier visit. The update is pushed here as well as by
    // CookieNotice, so GTM never starts on a page where the notice did not mount
    // with nothing but the denied defaults to read.
    if (hasAnalyticsConsent()) {
      pushConsentUpdate(true);
      setConsented(true);
    }

    const onConsent = (event: Event): void => {
      if ((event as CustomEvent<boolean>).detail === true) setConsented(true);
    };
    window.addEventListener(ANALYTICS_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, onConsent);
  }, []);

  if (!gtmId || isScriptFreeRoute(pathname)) {
    return null;
  }

  return (
    <>
      {/* Consent Mode v2 defaults, must run before GTM loads */}
      <Script
        id="gtm-consent-defaults"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />
      {consented && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
          }}
        />
      )}
    </>
  );
}

/*
 * There is deliberately no <noscript> GTM iframe. It was here, and it loaded
 * Google's tag frame for every visitor with JavaScript switched off, who never
 * sees the consent banner and so can never have agreed to it.
 */

function pushConsentUpdate(analyticsGranted: boolean): void {
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

  // Ensure gtag function exists (set up by consent-defaults script)
  if (!w.gtag) {
    w.dataLayer = w.dataLayer || [];
    w.gtag = (...args: unknown[]) => {
      w.dataLayer!.push(args);
    };
  }

  w.gtag('consent', 'update', {
    analytics_storage: analyticsGranted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

/**
 * Update Google Consent Mode after user interaction, and tell the loader.
 * Call from CookieNotice when the user accepts or rejects analytics.
 *
 * Accepting loads GTM on the spot. Rejecting never loads it. There is no unload:
 * a script already running cannot be taken back out, which is why the update to
 * denied is still pushed for GTM to act on.
 */
export function updateGtagConsent(analyticsGranted: boolean): void {
  if (typeof window === 'undefined') return;

  pushConsentUpdate(analyticsGranted);
  window.dispatchEvent(
    new CustomEvent<boolean>(ANALYTICS_CONSENT_EVENT, { detail: analyticsGranted })
  );
}
