'use client';

import * as React from 'react';

/**
 * The last resort.
 *
 * `global-error.tsx` replaces the root layout itself, so it renders its own `<html>`
 * and `<body>` and cannot use anything from the layout: no fonts, no stylesheet, no
 * components. That constraint is the reason the styles here are inline. Reaching
 * for the design system would produce an unstyled page at exactly the moment the
 * page needs to be legible.
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
          background: '#f76b0c',
          color: '#23252e',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '2rem',
        }}
      >
        <main style={{ maxWidth: '34rem' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 7vw, 3.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              margin: 0,
              textTransform: 'lowercase',
            }}
          >
            the whole page failed.
          </h1>
          <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginTop: '1rem' }}>
            Not a page you asked for, the site itself. Reloading is worth one try. If it happens
            again, email{' '}
            <a href="mailto:peter@orangejelly.co.uk" style={{ color: 'inherit' }}>
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
              color: '#f76b0c',
              background: '#23252e',
              border: '1.5px solid #23252e',
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
