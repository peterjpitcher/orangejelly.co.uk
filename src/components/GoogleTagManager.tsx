'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const STORAGE_KEY = 'oj-cookie-consent';

interface ConsentPreferences {
  analytics: boolean;
  timestamp: string;
}

function getConsentFromStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    const parsed: ConsentPreferences | string = JSON.parse(stored);
    if (typeof parsed === 'string') {
      return parsed === 'accepted';
    }
    return parsed.analytics === true;
  } catch {
    return false;
  }
}

export function GoogleTagManager() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check consent on mount
    setHasConsent(getConsentFromStorage());

    // Listen for consent changes from CookieNotice via storage events
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setHasConsent(getConsentFromStorage());
      }
    };

    // Also listen for a custom event dispatched by CookieNotice in the same tab
    const handleConsentChange = () => {
      setHasConsent(getConsentFromStorage());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('oj-consent-changed', handleConsentChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('oj-consent-changed', handleConsentChange);
    };
  }, []);

  if (!GTM_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[GTM] NEXT_PUBLIC_GTM_ID is not defined. Skipping GTM script.');
    }
    return null;
  }

  // Only inject GTM after user has given analytics consent
  if (!hasConsent) {
    return null;
  }

  return (
    <Script
      id="gtm-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `,
      }}
    />
  );
}

export function GoogleTagManagerNoscript() {
  // The noscript fallback is only meaningful when JS is disabled,
  // and in that case no consent interaction is possible anyway.
  // For GDPR compliance, we skip it entirely — GTM only loads after consent.
  return null;
}
