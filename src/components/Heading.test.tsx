import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import Heading from './Heading';

describe('Heading Component', () => {
  it('renders children correctly', () => {
    render(<Heading level={1}>Test Heading</Heading>);
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('renders correct heading level', () => {
    const { container } = render(<Heading level={2}>H2 Heading</Heading>);
    const h2 = container.querySelector('h2');
    expect(h2).toBeInTheDocument();
    expect(h2?.textContent).toBe('H2 Heading');
  });

  it('applies correct color classes', () => {
    const { container } = render(
      <Heading level={1} color="orange">
        Orange Heading
      </Heading>
    );
    const heading = container.querySelector('h1');
    expect(heading).toHaveClass('text-primary');
  });

  it('applies correct alignment', () => {
    const { container } = render(
      <Heading level={1} align="center">
        Centered Heading
      </Heading>
    );
    const heading = container.querySelector('h1');
    expect(heading).toHaveClass('text-center');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Heading level={1} className="custom-class">
        Custom Class Heading
      </Heading>
    );
    const heading = container.querySelector('h1');
    expect(heading).toHaveClass('custom-class');
  });

  it('renders all heading levels correctly', () => {
    const levels = [1, 2, 3, 4, 5, 6] as const;

    levels.forEach((level) => {
      const { container } = render(<Heading level={level}>Level {level}</Heading>);
      const heading = container.querySelector(`h${level}`);
      expect(heading).toBeInTheDocument();
      expect(heading?.textContent).toBe(`Level ${level}`);
    });
  });

  it('applies SEO-friendly font sizes', () => {
    const { container: h1Container } = render(<Heading level={1}>H1</Heading>);
    const { container: h2Container } = render(<Heading level={2}>H2</Heading>);

    const h1 = h1Container.querySelector('h1');
    const h2 = h2Container.querySelector('h2');

    // H1 should have larger text classes
    expect(h1?.className).toMatch(/text-(3xl|4xl|5xl)/);
    // H2 should have smaller text classes than H1
    expect(h2?.className).toMatch(/text-(2xl|3xl)/);
  });
});
