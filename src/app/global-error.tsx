'use client';

import * as React from 'react';

/**
 * The last resort.
 *
 * `global-error.tsx` replaces the root layout itself, so it renders its own `<html>`
 * and `<body>` and cannot depend on anything the layout sets up: not the `next/font`
 * variables, which are a class on the layout's `<body>` and are therefore absent
 * here, and not reliably the stylesheet either, since the segment that imports
 * `globals.css` is the one that just threw. Reaching for the design system would
 * produce an unstyled page at exactly the moment the page needs to be legible, so
 * every rule below is inline.
 *
 * RESTYLED, 31 August 2026, as far as this file can be. Each colour is written as
 * `var(--oj-token, #hex)`: if `globals.css` did reach this render the page uses the
 * real token and cannot drift from the palette, and if it did not the hex fallback
 * still paints the right thing. Hex literals are banned everywhere else on the site
 * and this is the one file that has no alternative to carrying them.
 *
 * Two things were wrong with the old version beyond the missing tokens. The ground
 * was brand orange carrying dark ink text, and the rule is that an orange fill
 * always carries white, which brand orange cannot do at 2.97:1; the band is the
 * deeper orange, where white is 5.24:1. The button was then brand orange text on
 * ink, which is not a button this system has. On a band ground the secondary button
 * is a cream block with an ink label and a white border, and that is what it is now.
 *
 * The typeface stays as the system stack. Schibsted Grotesk arrives through a
 * `next/font` variable this document has no way to set, so naming `var(--font-oj)`
 * here would resolve to nothing.
 *
 * It only fires when the root layout itself has thrown, which in this app means the
 * fonts, the chrome or the analytics boundary. That is rare and total: everything
 * else is caught by `error.tsx` one level down.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  React.useEffect(() => {
    console.error('[global error]', error.digest ?? '(no digest)', error);
  }, [error]);

  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--oj-surface-band, #b34e08)',
          color: 'var(--oj-text-on-band, #ffffff)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '2rem',
        }}
      >
        <main style={{ maxWidth: '34rem' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 7vw, 3.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              lineHeight: 0.98,
              margin: 0,
              textTransform: 'lowercase',
            }}
          >
            the whole page failed.
          </h1>
          <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginTop: '1.25rem' }}>
            Not a page you asked for, the site itself. Reloading is worth one try. If it happens
            again, email{' '}
            {/*
             * The underline is declared, not left to the browser. This link takes the
             * colour of the paragraph around it, so the underline is the only thing
             * marking it as a link, and if `globals.css` does reach this render then
             * Tailwind's reset gives every `a` `text-decoration: inherit`, which
             * resolves to none. Without it the address reads as ordinary text in one
             * of the two cases and as a link in the other.
             */}
            <a
              href="mailto:peter@orangejelly.co.uk"
              style={{
                color: 'inherit',
                textDecoration: 'underline',
                textDecorationThickness: '1.5px',
                textUnderlineOffset: '3px',
              }}
            >
              peter@orangejelly.co.uk
            </a>
            {error.digest ? ` and quote ${error.digest}` : ''}.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '1.75rem',
              minHeight: '44px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 700,
              // The secondary button on an orange band: cream block, ink label, and a
              // white border so the boundary survives against the orange.
              color: 'var(--oj-ink, #23252e)',
              background: 'var(--oj-cream, #f7f5f1)',
              border: '1.5px solid var(--oj-text-on-band, #ffffff)',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
