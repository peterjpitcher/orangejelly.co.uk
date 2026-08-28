import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorBoundaryPage from '@/app/error';
import { metadata as notFoundMetadata } from '@/app/not-found';
import GlobalError from '@/app/global-error';
import NotFound from '@/app/not-found';
import { PRESSURE_POINTS } from '@/app/home-content';

/**
 * The three surfaces a person sees when something has gone wrong.
 *
 * Only one of them existed before. An uncaught render error fell through to Next's
 * default, which in production is a blank screen with no navigation and nothing
 * telling the person whether the problem was theirs or ours.
 */
describe('404', () => {
  it('treats an old link as the likely cause, because it usually is', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('that page is not here.');
    // Phase 4 retires nine URLs, so most arrivals here followed a link that used to
    // work rather than mistyped something.
    expect(document.body.textContent).toMatch(/the link is probably older than the page/);
  });

  it('offers the problems rather than a search box and a shrug', () => {
    render(<NotFound />);
    for (const point of PRESSURE_POINTS) {
      expect(screen.getByRole('link', { name: new RegExp(`^${point.title}`) })).toBeInTheDocument();
    }
  });

  it('is not indexed but is still crawled, because the links out are the point', () => {
    expect(notFoundMetadata.robots).toEqual({ index: false, follow: true });
  });

  it('always offers a way to ask a person', () => {
    render(<NotFound />);
    expect(screen.getAllByRole('link', { name: /Bring us the problem/ }).length).toBeGreaterThan(0);
  });
});

describe('the route error boundary', () => {
  const error = Object.assign(new Error('boom'), { digest: 'abc123' });

  // Silenced so the suite output stays readable, and spied on because the logging
  // is the behaviour: an error nobody hears about is one nobody fixes.
  let logged: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    logged = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    logged.mockRestore();
  });

  it('reports the error with its digest, so it can be found in the log', () => {
    render(<ErrorBoundaryPage error={error} reset={vi.fn()} />);
    expect(logged).toHaveBeenCalledWith('[error boundary]', 'abc123', error);
  });

  it('says whose fault it is', () => {
    render(<ErrorBoundaryPage error={error} reset={vi.fn()} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'that is our fault, not yours.'
    );
  });

  it('offers a retry first, because most of these are momentary', async () => {
    const reset = vi.fn();
    const user = userEvent.setup();
    render(<ErrorBoundaryPage error={error} reset={reset} />);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalled();
  });

  it('shows the digest, which is what ties a report to the log entry', () => {
    render(<ErrorBoundaryPage error={error} reset={vi.fn()} />);
    expect(screen.getByText('abc123')).toBeInTheDocument();
  });

  it('says nothing about a reference when there is not one', () => {
    render(<ErrorBoundaryPage error={new Error('boom')} reset={vi.fn()} />);
    expect(screen.queryByText(/Quote reference/)).not.toBeInTheDocument();
  });

  it('keeps the navigation, so the person is not trapped', () => {
    render(<ErrorBoundaryPage error={error} reset={vi.fn()} />);
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to the homepage' })).toHaveAttribute('href', '/');
  });
});

describe('the last resort', () => {
  /*
   * global-error.tsx owns <html> and <body>, so it is rendered to a string rather
   * than mounted into jsdom's own body. Mounting it works but nests one document
   * inside another, and React is right to complain about that.
   */
  function markup(error: Error & { digest?: string }): string {
    return renderToStaticMarkup(<GlobalError error={error} reset={() => {}} />);
  }

  it('renders without anything from the layout', () => {
    // It replaces the root layout, so it has no stylesheet, no fonts and no
    // components. Reaching for the design system here would produce an unstyled
    // page at exactly the moment it has to be legible.
    const html = markup(Object.assign(new Error('boom'), { digest: 'xyz' }));
    expect(html).not.toMatch(/class="/);
    expect(html).toMatch(/<html lang="en-GB">/);
  });

  it('gives a reload and a human to email', () => {
    const html = markup(new Error('boom'));
    expect(html).toMatch(/>Reload</);
    expect(html).toMatch(/href="mailto:peter@orangejelly\.co\.uk"/);
  });

  it('quotes the digest when there is one, and says nothing when there is not', () => {
    expect(markup(Object.assign(new Error('boom'), { digest: 'xyz' }))).toMatch(/quote xyz/);
    expect(markup(new Error('boom'))).not.toMatch(/quote /);
  });

  it('gives the reload a 44px target, because it is the only control on the page', () => {
    expect(markup(new Error('boom'))).toMatch(/min-height:44px/);
  });
});
