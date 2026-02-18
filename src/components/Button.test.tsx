import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import Button from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    await vi.waitFor(() => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  it('renders as a link when href provided', () => {
    render(<Button href="/test">Link Button</Button>);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button').className).toContain('bg-orange');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button').className).toContain('bg-teal');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button').className).toContain('text-orange');
    expect(screen.getByRole('button').className).toContain('hover:bg-orange/10');

    rerender(<Button variant="base">Base</Button>);
    expect(screen.getByRole('button').className).toContain('bg-charcoal');

    rerender(<Button variant="support">Support</Button>);
    expect(screen.getByRole('button').className).toContain('bg-teal');

    rerender(<Button variant="accent">Accent</Button>);
    expect(screen.getByRole('button').className).toContain('bg-orange');
  });

  it('applies correct size styles', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button').className).toContain('px-4');
    expect(screen.getByRole('button').className).toContain('py-2.5');

    rerender(<Button size="medium">Medium</Button>);
    expect(screen.getByRole('button').className).toContain('px-6');
    expect(screen.getByRole('button').className).toContain('py-3');

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button').className).toContain('px-8');
    expect(screen.getByRole('button').className).toContain('py-4');
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('opens external links in new tab', () => {
    render(
      <Button href="https://example.com" external>
        External Link
      </Button>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders whatsapp button with correct link and aria attributes', () => {
    render(
      <Button href="https://wa.me/12345" whatsapp aria-label="Chat on WhatsApp">
        WhatsApp
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Chat on WhatsApp' });
    expect(link).toHaveAttribute('href', 'https://wa.me/12345');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button').className).toContain('custom-class');
  });

  it('renders with aria-label when provided', () => {
    render(<Button aria-label="Custom label">Icon</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom label');
  });

  it('handles async onClick', async () => {
    const asyncClick = vi.fn().mockResolvedValue(undefined);
    render(<Button onClick={asyncClick}>Async</Button>);

    fireEvent.click(screen.getByRole('button'));

    await vi.waitFor(() => {
      expect(asyncClick).toHaveBeenCalledTimes(1);
    });
  });

  it('shows fullWidth style when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button').className).toContain('w-full');
    expect(screen.getByRole('button').className).toContain('block');
  });

  it('forwards aria-busy to links when loading', () => {
    render(
      <Button href="https://example.com" external loading aria-label="Loading link">
        Loading
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Loading link' });
    expect(link).toHaveAttribute('aria-busy', 'true');
  });
});
