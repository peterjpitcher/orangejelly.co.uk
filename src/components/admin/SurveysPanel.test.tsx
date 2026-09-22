import { render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import SurveysPanel from './SurveysPanel';
import type { AdminSurvey } from '@/lib/db/surveys';
import { definitionToSurvey, surveyDefinitionSchema } from '@/lib/surveys/definition';
import pubApps from '../../../content/surveys/pub-apps.json';

vi.mock('@/lib/admin-session', () => ({ getValidAccessToken: async () => 'token' }));

const survey = {
  ...definitionToSurvey(surveyDefinitionSchema.parse(pubApps)),
  id: 's1',
  status: 'live' as const,
};

const DATA: AdminSurvey = {
  survey,
  previewToken: 'p'.repeat(24),
  openedAt: '2026-09-22T09:00:00Z',
  closedAt: null,
  responses: 40,
  previewResponses: 3,
  tallies: [
    { questionKey: 'top_pick', optionKey: 'events', picks: 18 },
    { questionKey: 'top_pick', optionKey: 'rotas', picks: 6 },
    { questionKey: 'price', optionKey: 'price_10_30', picks: 12 },
  ],
  texts: {
    must_do: [
      { text: 'Take deposits without me chasing people.', createdAt: '2026-09-22T11:00:00Z' },
    ],
    missing: [],
  },
  sources: [
    { source: 'facebook', responses: 25 },
    { source: 'direct', responses: 15 },
  ],
  volunteers: [
    {
      name: 'Sam Whitfield',
      email: 'sam@testarms.example',
      businessName: 'The Test Arms',
      volunteeredFor: ['say_call', 'test_early'],
      createdAt: '2026-09-22T11:00:00Z',
      answers: { top_pick: ['events'] },
    },
  ],
  truncated: false,
};

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify({ surveys: [DATA] }), { status: 200 }))
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SurveysPanel', () => {
  it('shows counts, labelled tallies, written answers, sources and volunteers', async () => {
    render(<SurveysPanel />);

    expect(
      await screen.findByText('Which tools would make running your pub easier?')
    ).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('responses (+3 preview)')).toBeInTheDocument();

    // Tallies use labels, not keys, and the price prompt loses its placeholder.
    expect(screen.getByText('18 (45%)')).toBeInTheDocument();
    expect(
      screen.getByText('Your top pick: …. What would it be worth to you each month?')
    ).toBeInTheDocument();
    expect(screen.getByText('£10 to £30')).toBeInTheDocument();

    expect(screen.getByText('Take deposits without me chasing people.')).toBeInTheDocument();
    expect(screen.getByText('facebook: 25 · direct: 15')).toBeInTheDocument();

    const row = screen.getByText('Sam Whitfield').closest('tr');
    expect(row).not.toBeNull();
    const cells = within(row as HTMLElement);
    expect(cells.getByText('The Test Arms')).toBeInTheDocument();
    expect(
      cells.getByText("Yes, I'd happily have a short call; Yes, I'd test it early")
    ).toBeInTheDocument();
    expect(cells.getByText('Event bookings')).toBeInTheDocument();
    // London time, not the machine's zone: 11:00 UTC is 12:00 in BST.
    expect(cells.getByText(/12:00pm/)).toBeInTheDocument();
  });

  it('says so when the surveys cannot be loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ error: 'Could not load surveys.' }), { status: 500 })
      )
    );
    render(<SurveysPanel />);
    expect(await screen.findByText('Could not load surveys.')).toBeInTheDocument();
  });
});
