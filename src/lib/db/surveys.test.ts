import { beforeEach, describe, expect, it, vi } from 'vitest';

const state: {
  configured: boolean;
  row: unknown;
  selectError: { message: string } | null;
  rpc: ReturnType<typeof vi.fn>;
} = { configured: true, row: null, selectError: null, rpc: vi.fn() };

vi.mock('./supabase-admin', () => ({
  isSupabaseAdminConfigured: () => state.configured,
  getSupabaseAdminClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: state.row, error: state.selectError }),
        }),
      }),
    }),
    rpc: state.rpc,
  }),
}));

import { getSurveyForVisitor, submitSurveyResponse, type SubmissionInput } from './surveys';

const PREVIEW = 'p'.repeat(24);

function row(status: 'draft' | 'live' | 'closed') {
  return {
    id: 'survey-1',
    slug: 'pub-apps',
    status,
    eyebrow: 'E',
    title: 'T',
    intro: 'I',
    minutes: 3,
    share_text: 'S',
    thank_you_heading: 'H',
    thank_you_body: 'B',
    results_question_key: null,
    results_heading: null,
    results_min_responses: 20,
    consent_text: null,
    preview_token: PREVIEW,
    // Deliberately out of order: the database does not promise an order for embeds.
    survey_questions: [
      {
        key: 'second',
        position: 1,
        kind: 'single',
        prompt: 'Second',
        hint: null,
        required: true,
        min_choices: null,
        max_choices: null,
        max_length: null,
        options_from: null,
        show_if: null,
        survey_options: [
          { key: 'b', position: 1, label: 'B', hint: null, icon: null },
          { key: 'a', position: 0, label: 'A', hint: null, icon: null },
        ],
      },
      {
        key: 'first',
        position: 0,
        kind: 'text',
        prompt: 'First',
        hint: null,
        required: false,
        min_choices: null,
        max_choices: null,
        max_length: 100,
        options_from: [],
        show_if: [],
        survey_options: [],
      },
    ],
  };
}

beforeEach(() => {
  state.configured = true;
  state.row = null;
  state.selectError = null;
  state.rpc = vi.fn();
});

describe('getSurveyForVisitor', () => {
  it('serves a live survey, in question and option order, without its preview token', async () => {
    state.row = row('live');
    const access = await getSurveyForVisitor('pub-apps');
    expect(access?.mode).toBe('live');
    expect(access?.survey.questions.map((q) => q.key)).toEqual(['first', 'second']);
    expect(access?.survey.questions[1].options.map((o) => o.key)).toEqual(['a', 'b']);
    expect(JSON.stringify(access)).not.toContain(PREVIEW);
  });

  it('hides a draft unless the preview token matches', async () => {
    state.row = row('draft');
    expect(await getSurveyForVisitor('pub-apps')).toBeNull();
    expect(await getSurveyForVisitor('pub-apps', 'wrong')).toBeNull();
    expect(await getSurveyForVisitor('pub-apps', 'q'.repeat(24))).toBeNull();
    expect((await getSurveyForVisitor('pub-apps', PREVIEW))?.mode).toBe('preview');
  });

  it('treats the preview link on a live survey as a preview, so test answers are never counted', async () => {
    state.row = row('live');
    expect((await getSurveyForVisitor('pub-apps', PREVIEW))?.mode).toBe('preview');
  });

  it('tells a late visitor the survey has closed rather than pretending it never existed', async () => {
    state.row = row('closed');
    expect((await getSurveyForVisitor('pub-apps'))?.mode).toBe('closed');
  });

  it('returns null for a slug that does not exist', async () => {
    expect(await getSurveyForVisitor('nope')).toBeNull();
  });

  it('throws when the database fails, so the page errors instead of claiming a 404', async () => {
    state.selectError = { message: 'connection refused' };
    await expect(getSurveyForVisitor('pub-apps')).rejects.toThrow('connection refused');
    state.configured = false;
    await expect(getSurveyForVisitor('pub-apps')).rejects.toThrow('not configured');
  });
});

describe('submitSurveyResponse', () => {
  const input: SubmissionInput = {
    responseId: 'r-1',
    surveyId: 'survey-1',
    answers: { say: ['say_call'] },
    isPreview: false,
    utmSource: 'whatsapp',
    contact: {
      id: 'c-1',
      name: 'Sam',
      email: ' Sam@Example.PUB ',
      businessName: 'The Test Arms',
      volunteeredFor: ['say_call'],
      consentText: 'Contact me.',
    },
  };

  it('writes the response and the contact through the one transactional function', async () => {
    state.rpc.mockResolvedValue({ error: null });
    expect(await submitSurveyResponse(input)).toEqual({ stored: true });
    expect(state.rpc).toHaveBeenCalledWith(
      'submit_survey_response',
      expect.objectContaining({
        p_response_id: 'r-1',
        p_is_preview: false,
        p_utm_source: 'whatsapp',
        p_utm_medium: null,
        p_contact: expect.objectContaining({
          email_normalized: 'sam@example.pub',
          volunteered_for: ['say_call'],
        }),
      })
    );
  });

  it('sends a null contact when nobody volunteered', async () => {
    state.rpc.mockResolvedValue({ error: null });
    await submitSurveyResponse({ ...input, contact: undefined });
    expect(state.rpc.mock.calls[0][1].p_contact).toBeNull();
  });

  it('reports a survey that closed mid-answer as not open', async () => {
    state.rpc.mockResolvedValue({ error: { message: 'survey_not_open' } });
    expect(await submitSurveyResponse(input)).toEqual({ stored: false, reason: 'not_open' });
  });

  it('reports a failed or thrown write as failed, never as stored', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    state.rpc.mockResolvedValue({ error: { message: 'deadlock' } });
    expect(await submitSurveyResponse(input)).toEqual({ stored: false, reason: 'failed' });
    state.rpc.mockRejectedValue(new Error('network'));
    expect(await submitSurveyResponse(input)).toEqual({ stored: false, reason: 'failed' });
    expect(log).toHaveBeenCalledTimes(2);
    log.mockRestore();
  });

  it('refuses when Supabase is not configured', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    state.configured = false;
    expect(await submitSurveyResponse(input)).toEqual({ stored: false, reason: 'unavailable' });
    expect(state.rpc).not.toHaveBeenCalled();
    log.mockRestore();
  });
});
