import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import CaseStudySelector from './CaseStudySelector';

const mockResults = [
  {
    id: 'food-gp-improvement',
    title: 'Food Waste Reduction',
    subtitle: '£250/week cut in Sunday waste',
    problem: ['Problem A'],
    failed: ['Failed A'],
    solution: ['Solution A'],
    results: [{ metric: 'Metric A', value: 'Value A' }],
    timeInvestment: ['Time A'],
    learnings: ['Learning A'],
  },
  {
    id: 'quiz-night-transformation',
    title: 'Quiz Night Transformation',
    subtitle: 'From 20 to 35 regulars',
    problem: ['Problem B'],
    failed: ['Failed B'],
    solution: ['Solution B'],
    results: [{ metric: 'Metric B', value: 'Value B' }],
    timeInvestment: ['Time B'],
    learnings: ['Learning B'],
  },
];

describe('CaseStudySelector', () => {
  it('honours a matching default study', () => {
    render(<CaseStudySelector results={mockResults} defaultStudy="quiz-night-transformation" />);

    expect(screen.getByRole('heading', { name: 'Quiz Night Transformation' })).toBeInTheDocument();
  });

  it('falls back to the first study when default is unknown', () => {
    render(<CaseStudySelector results={mockResults} defaultStudy="unknown-id" />);

    expect(screen.getByRole('heading', { name: 'Food Waste Reduction' })).toBeInTheDocument();
  });

  it('updates selection when the default study prop changes', async () => {
    const { rerender } = render(
      <CaseStudySelector results={mockResults} defaultStudy="food-gp-improvement" />
    );

    expect(screen.getByRole('heading', { name: 'Food Waste Reduction' })).toBeInTheDocument();

    rerender(<CaseStudySelector results={mockResults} defaultStudy="quiz-night-transformation" />);

    expect(screen.getByRole('heading', { name: 'Quiz Night Transformation' })).toBeInTheDocument();
  });

  it('allows manual selection regardless of default study', async () => {
    render(<CaseStudySelector results={mockResults} defaultStudy="food-gp-improvement" />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Quiz Night Transformation' }));

    expect(screen.getByRole('heading', { name: 'Quiz Night Transformation' })).toBeInTheDocument();
  });
});
