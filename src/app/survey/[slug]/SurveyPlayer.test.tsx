import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SurveyPlayer from './SurveyPlayer';
import { submitSurvey } from '@/app/actions/surveys';
import type { Survey } from '@/lib/surveys/logic';

vi.mock('@/app/actions/surveys', () => ({ submitSurvey: vi.fn() }));
vi.mock('@/lib/tracking', () => ({ trackClientEvent: vi.fn() }));
vi.mock('@/lib/lead-source', () => ({ getBrowserLeadSource: () => ({}) }));

function question(key: string, kind: 'single' | 'multi', options: string[], extra = {}) {
  return {
    key,
    kind,
    prompt: `${key}?`,
    hint: null,
    required: true,
    minChoices: kind === 'multi' ? 0 : null,
    maxChoices: kind === 'multi' ? options.length : null,
    maxLength: null,
    optionsFrom: [],
    showIf: [],
    options: options.map((label) => ({ key: label.toLowerCase(), label, hint: null, icon: null })),
    ...extra,
  };
}

const SURVEY: Survey = {
  id: 'survey-1',
  slug: 'pub-apps',
  status: 'live',
  eyebrow: 'Pub survey',
  title: 'Which tools?',
  intro: 'Intro',
  minutes: 2,
  shareText: 'Which tools?',
  thankYouHeading: 'Thank you',
  thankYouBody: 'Body',
  resultsQuestionKey: 'apps',
  resultsHeading: 'What the trade picked',
  resultsMinResponses: 20,
  consentText: 'Contact me.',
  questions: [
    question('apps', 'multi', ['Rotas', 'Stock', 'Events', 'Parking']),
    question('venue', 'single', ['Local', 'Food']),
  ],
};

beforeEach(() => {
  vi.mocked(submitSurvey).mockReset();
});

async function answerEverything(user: ReturnType<typeof userEvent.setup>): Promise<void> {
  // "As many as you like": all four, with no limit reached and none disabled.
  for (const label of ['Rotas', 'Stock', 'Events', 'Parking']) {
    await user.click(screen.getByRole('button', { name: new RegExp(`^${label}`) }));
  }
  expect(screen.getByText('4 picked')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /Next/ }));
  await user.click(await screen.findByRole('button', { name: /^Food/ }));
}

describe('SurveyPlayer', () => {
  it('shows the respondent a failed save, keeps their answers, and sends again on "Try again"', async () => {
    const user = userEvent.setup();
    vi.mocked(submitSurvey)
      .mockResolvedValueOnce({
        error:
          "We couldn't send your answers. Please try again in a moment, or email peter@orangejelly.co.uk.",
      })
      .mockResolvedValueOnce({ success: true, results: null });

    render(
      <SurveyPlayer survey={SURVEY} shareUrl="https://www.orangejelly.co.uk/survey/pub-apps" />
    );
    await answerEverything(user);

    // The failure is on screen, in words, with the fallback address.
    expect(await screen.findByText('Not sent yet')).toBeInTheDocument();
    expect(screen.getByText(/peter@orangejelly\.co\.uk/)).toBeInTheDocument();
    expect(screen.queryByText('Thank you')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('heading', { name: 'Thank you' })).toBeInTheDocument();

    // Both attempts carried the same answers: nothing was lost to the failure.
    const [first, second] = vi.mocked(submitSurvey).mock.calls.map(([input]) => input);
    expect(first).toEqual(second);
    expect(first).toMatchObject({
      slug: 'pub-apps',
      answers: { apps: ['rotas', 'stock', 'events', 'parking'], venue: ['food'] },
    });
  });

  it('tells the respondent when the server cannot be reached at all', async () => {
    const user = userEvent.setup();
    vi.mocked(submitSurvey).mockRejectedValue(new TypeError('Failed to fetch'));

    render(
      <SurveyPlayer survey={SURVEY} shareUrl="https://www.orangejelly.co.uk/survey/pub-apps" />
    );
    await answerEverything(user);

    expect(await screen.findByText(/couldn't reach our server/)).toBeInTheDocument();
  });

  it('shows the results once the threshold is met', async () => {
    const user = userEvent.setup();
    vi.mocked(submitSurvey).mockResolvedValue({
      success: true,
      results: {
        responses: 40,
        minResponses: 20,
        heading: 'What the trade picked',
        bars: [{ key: 'rotas', label: 'Rotas', picks: 30, percent: 75 }],
      },
    });

    render(
      <SurveyPlayer survey={SURVEY} shareUrl="https://www.orangejelly.co.uk/survey/pub-apps" />
    );
    await answerEverything(user);

    await waitFor(() => expect(screen.getByText('What the trade picked')).toBeInTheDocument());
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Based on 40 responses so far.')).toBeInTheDocument();
  });
});
