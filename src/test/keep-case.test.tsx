import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import GrowthProblemPage from '@/app/growth-problems/[slug]/page';
import GrowthProblemsHubPage from '@/app/growth-problems/page';
import { KeepCase } from '@/components/oj/KeepCase';

/**
 * Proper nouns inside a lowercase display heading.
 *
 * `.oj-display` sets text-transform: lowercase, which is the brand treatment and is
 * right for ordinary words. It is wrong for everything that is not one: "You want
 * AI that earns its place" rendered as "you want ai that earns its place", which
 * reads as a typo rather than a style. CSS cannot tell the difference.
 */
describe('KeepCase', () => {
  function marked(text: string): string[] {
    const { container } = render(
      <span>
        <KeepCase>{text}</KeepCase>
      </span>
    );
    return [...container.querySelectorAll('.oj-keep-case')].map((el) => el.textContent ?? '');
  }

  it('protects an initialism', () => {
    expect(marked('You want AI that earns its place')).toEqual(['AI']);
  });

  it('leaves ordinary words to lowercase, which is the whole point of the style', () => {
    expect(marked('Growth has stalled')).toEqual([]);
  });

  it('does not match an initialism inside a longer word', () => {
    // Without a word boundary "AI" matches inside "said", "captain" and "email".
    expect(marked('The team said it in an email to the captain')).toEqual([]);
  });

  it('protects a multi-word name before a shorter token inside it', () => {
    expect(marked('Proven at The Anchor')).toEqual(['The Anchor']);
  });

  it('keeps the surrounding text intact', () => {
    render(
      <span data-testid="h">
        <KeepCase>You want AI that earns its place</KeepCase>
      </span>
    );
    expect(screen.getByTestId('h').textContent).toBe('You want AI that earns its place');
  });

  it('handles several in one line', () => {
    expect(marked('Google, VAT and AI')).toEqual(['Google', 'VAT', 'AI']);
  });
});

describe('the pages that need it', () => {
  it('keeps AI upper case in the problem page heading', () => {
    const { container } = render(<GrowthProblemPage params={{ slug: 'using-ai-intelligently' }} />);
    const heading = container.querySelector('h1');
    expect(heading?.textContent).toContain('AI');
    expect(heading?.querySelector('.oj-keep-case')?.textContent).toBe('AI');
  });

  it('keeps AI upper case on the hub card', () => {
    const { container } = render(<GrowthProblemsHubPage />);
    const marks = [...container.querySelectorAll('.oj-keep-case')].map((el) => el.textContent);
    expect(marks).toContain('AI');
  });

  it('keeps AI upper case on an insight article and its index card', async () => {
    // The same bug, one collection along: "AI for accountants" rendered as "ai for
    // accountants", which reads as a typo rather than a style.
    const InsightsPage = (await import('@/app/insights/page')).default;
    const { container } = render(<InsightsPage searchParams={{}} />);
    const marks = [...container.querySelectorAll('.oj-keep-case')].map((el) => el.textContent);
    expect(marks).toContain('AI');
  });

  it('does not mark up the seven headings that need no protection', () => {
    const { container } = render(<GrowthProblemPage params={{ slug: 'growth-has-stalled' }} />);
    expect(container.querySelector('h1')?.querySelector('.oj-keep-case')).toBeNull();
  });
});
