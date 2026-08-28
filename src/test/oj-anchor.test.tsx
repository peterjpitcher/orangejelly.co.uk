import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Anchor } from '@/components/oj/Anchor';

/**
 * The library's link element.
 *
 * The setup file mocks next/link as a plain anchor, so this cannot assert the
 * rendered element type. What it can assert, and what actually matters, is the
 * decision: which hrefs are handed to the router and which are left alone. Handing
 * a mailto: or a # to next/link is a bug that only shows up at runtime.
 */
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children?: React.ReactNode }) => (
    <a data-router="true" href={href}>
      {children}
    </a>
  ),
}));

function routed(href: string): boolean {
  const { container, unmount } = render(<Anchor href={href}>link</Anchor>);
  const isRouted = container.querySelector('[data-router="true"]') !== null;
  unmount();
  return isRouted;
}

describe('oj/Anchor', () => {
  it('routes internal paths through the router', () => {
    // An internal <a> is a full page load, so the site chrome would throw away the
    // router on every click. Next's own lint rule catches this in pages and cannot
    // see it inside a component.
    expect(routed('/start-here')).toBe(true);
    expect(routed('/results/nobody-could-find-us')).toBe(true);
  });

  it('leaves everything the router cannot help with alone', () => {
    expect(routed('mailto:peter@orangejelly.co.uk')).toBe(false);
    expect(routed('tel:07990587315')).toBe(false);
    expect(routed('#enquiry')).toBe(false);
    expect(routed('https://www.bii.org/')).toBe(false);
    // Protocol-relative. It looks internal and is not.
    expect(routed('//evil.example/start-here')).toBe(false);
  });

  it('passes attributes through either way', () => {
    render(
      <Anchor href="https://example.com" target="_blank" rel="noopener" aria-label="Example">
        go
      </Anchor>
    );
    const link = screen.getByRole('link', { name: 'Example' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });

  it('renders an anchor when no href is given at all', () => {
    render(<Anchor>no destination</Anchor>);
    expect(screen.getByText('no destination').tagName).toBe('A');
  });
});
