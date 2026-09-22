'use client';

import { useEffect, useRef } from 'react';

/**
 * The Cloudflare Turnstile widget, rendered on the poll create form and the
 * enquiry form only.
 *
 * Never site-wide, and never on a token page: the script is a third-party
 * request, and a token page's URL is itself the secret.
 *
 * The token this produces is single-use and short-lived. When it expires or
 * errors, the parent's token state is cleared rather than kept. A stale token
 * fails `siteverify` server-side anyway, and clearing it means the form asks the
 * user to try again instead of failing at submit for no visible reason.
 *
 * Cloudflare also writes the token into a hidden `cf-turnstile-response` input
 * inside the container. A native form that renders this inside itself gets the
 * token in its FormData with no state of its own, which is how the enquiry form
 * reads it, so `onToken` is optional.
 */

interface TurnstileWidgetProps {
  /** Called with a fresh token, or with null when it expires or errors. */
  onToken?: (token: string | null) => void;
  /**
   * Changing this asks Cloudflare for a fresh token. A token is spent the moment
   * the server verifies it, so a form that can fail after that point (the rate
   * limiter, the write) must reset before the person tries again, or the retry
   * carries a used token and is refused for no reason they can see.
   */
  resetKey?: unknown;
  className?: string;
}

interface TurnstileApi {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    }
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onTurnstileLoad?: () => void;
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SCRIPT_ID = 'cf-turnstile-script';

export default function TurnstileWidget({
  onToken,
  resetKey,
  className = 'my-6',
}: TurnstileWidgetProps): JSX.Element | null {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  // The callback changes identity on every parent render. Holding it in a ref
  // keeps it out of the effect's dependencies, so the widget is rendered once
  // rather than torn down and rebuilt on every keystroke in the form.
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;
  const lastResetKeyRef = useRef(resetKey);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;

    let cancelled = false;

    function renderWidget(): void {
      if (cancelled || !containerRef.current || widgetIdRef.current !== null) return;
      if (!window.turnstile) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey as string,
        callback: (token: string) => onTokenRef.current?.(token),
        'expired-callback': () => onTokenRef.current?.(null),
        'error-callback': () => onTokenRef.current?.(null),
      });
    }

    if (window.turnstile) {
      renderWidget();
      return () => {
        cancelled = true;
      };
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script.addEventListener('load', renderWidget);

    return () => {
      cancelled = true;
      script?.removeEventListener('load', renderWidget);
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  // Skips the first render: the widget has only just issued its first token.
  useEffect(() => {
    if (resetKey === lastResetKeyRef.current) return;
    lastResetKeyRef.current = resetKey;
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      onTokenRef.current?.(null);
    }
  }, [resetKey]);

  // Without a site key there is nothing to render. The server still decides
  // whether the form may go through (it fails closed in production), so this is
  // a local-development path, not a way to skip the check.
  if (!siteKey) return null;

  return <div ref={containerRef} className={className} />;
}
