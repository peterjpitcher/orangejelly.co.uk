import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SiteSearch } from '@/components/oj';

const RESULTS = [
  {
    id: '1',
    title: 'Quiz night ideas',
    url: '/guides/quiz-night-ideas',
    category: 'Events',
  },
];

describe('oj/SiteSearch', () => {
  it('labels the field even though the label is visually hidden', () => {
    render(<SiteSearch />);
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('reports the query on each keystroke', async () => {
    const onQuery = vi.fn();
    const user = userEvent.setup();
    render(<SiteSearch onQuery={onQuery} />);

    await user.type(screen.getByLabelText('Search'), 'quiz');
    expect(onQuery).toHaveBeenLastCalledWith('quiz');
  });

  it('announces the result count rather than letting a list appear silently', async () => {
    const user = userEvent.setup();
    render(<SiteSearch results={RESULTS} />);

    await user.type(screen.getByLabelText('Search'), 'quiz');
    expect(screen.getByText('1 result for quiz')).toBeInTheDocument();
  });

  it('offers a route out when nothing matches', async () => {
    const user = userEvent.setup();
    render(<SiteSearch results={[]} />);

    await user.type(screen.getByLabelText('Search'), 'nonsense');
    // A search that finds nothing is a dead end unless it offers somewhere to go.
    expect(screen.getByRole('link', { name: 'See the growth problems' })).toHaveAttribute(
      'href',
      '/growth-problems'
    );
  });

  it('shows nothing until the query is worth searching', async () => {
    const user = userEvent.setup();
    render(<SiteSearch results={[]} />);

    await user.type(screen.getByLabelText('Search'), 'q');
    expect(screen.queryByText('Nothing matched that')).not.toBeInTheDocument();
  });

  it('renders results as links', async () => {
    const user = userEvent.setup();
    render(<SiteSearch results={RESULTS} />);

    await user.type(screen.getByLabelText('Search'), 'quiz');
    expect(screen.getByRole('link', { name: /Quiz night ideas/ })).toHaveAttribute(
      'href',
      '/guides/quiz-night-ideas'
    );
  });
});
