import { describe, expect, it } from 'vitest';
import {
  effectiveAnswers,
  renderPrompt,
  resultBars,
  shouldShowResults,
  validateAnswers,
  visibleQuestions,
  volunteeredFor,
  type Survey,
  type SurveyQuestion,
} from './logic';

function question(
  overrides: Partial<SurveyQuestion> & Pick<SurveyQuestion, 'key' | 'kind'>
): SurveyQuestion {
  return {
    prompt: overrides.key,
    hint: null,
    required: true,
    minChoices: null,
    maxChoices: null,
    maxLength: null,
    optionsFrom: [],
    showIf: [],
    options: [],
    ...overrides,
  };
}

function option(key: string, label = key) {
  return { key, label, hint: null, icon: null };
}

/** The shape of the first real survey, cut down: two pick-three screens, a piped pick-one, and so on. */
const SURVEY: Survey = {
  id: '00000000-0000-0000-0000-000000000001',
  slug: 'pub-apps',
  status: 'live',
  eyebrow: 'Pub survey',
  title: 'Which app would your pub use?',
  intro: 'Intro',
  minutes: 2,
  shareText: 'Share',
  thankYouHeading: 'Thanks',
  thankYouBody: 'Body',
  resultsQuestionKey: 'top_pick',
  resultsHeading: 'What the trade picked',
  resultsMinResponses: 20,
  consentText: 'Contact me about this app.',
  questions: [
    question({
      key: 'front',
      kind: 'multi',
      minChoices: 0,
      maxChoices: 3,
      options: [
        option('bookings', 'Table bookings'),
        option('events', 'Events'),
        option('loyalty', 'Loyalty'),
      ],
    }),
    question({
      key: 'back',
      kind: 'multi',
      minChoices: 0,
      maxChoices: 3,
      options: [option('rotas', 'Staff rotas'), option('stock', 'Stock')],
    }),
    question({ key: 'top_pick', kind: 'single', optionsFrom: ['front', 'back'] }),
    question({
      key: 'price',
      kind: 'single',
      prompt: 'Your top pick: {{top_pick}}. What is it worth?',
      showIf: ['top_pick'],
      options: [option('free'), option('up_to_10')],
    }),
    question({ key: 'must_do', kind: 'text', required: false, maxLength: 20 }),
    question({
      key: 'say',
      kind: 'single',
      options: [option('say_call'), option('say_email'), option('say_no')],
    }),
    question({ key: 'contact', kind: 'contact', showIf: ['say_call', 'say_email'] }),
  ],
};

const keys = (qs: readonly SurveyQuestion[]) => qs.map((q) => q.key);

describe('visibleQuestions', () => {
  it('hides the piped question and everything hanging off it until something is picked', () => {
    expect(keys(visibleQuestions(SURVEY, {}))).toEqual(['front', 'back', 'must_do', 'say']);
  });

  it('asks for a top pick only when there is more than one to choose between', () => {
    const one = effectiveAnswers(SURVEY, { front: ['events'], back: [] });
    expect(keys(visibleQuestions(SURVEY, one))).toEqual([
      'front',
      'back',
      'price',
      'must_do',
      'say',
    ]);
    expect(one.top_pick).toEqual(['events']);

    const two = effectiveAnswers(SURVEY, { front: ['events'], back: ['rotas'] });
    expect(keys(visibleQuestions(SURVEY, two))).toContain('top_pick');
    expect(two.top_pick).toBeUndefined();
  });

  it('shows the contact step only to people who asked for a say', () => {
    expect(keys(visibleQuestions(SURVEY, { say: ['say_no'] }))).not.toContain('contact');
    expect(keys(visibleQuestions(SURVEY, { say: ['say_email'] }))).toContain('contact');
  });
});

describe('effectiveAnswers', () => {
  it('drops a top pick that was unpicked on an earlier screen, so it is asked again', () => {
    const answers = effectiveAnswers(SURVEY, {
      front: ['bookings', 'loyalty'],
      back: ['stock'],
      top_pick: ['rotas'],
    });
    expect(answers.top_pick).toBeUndefined();
  });

  it('offers piped options in the order the earlier screens listed them', () => {
    const answers = effectiveAnswers(SURVEY, { front: ['loyalty', 'bookings'], back: ['stock'] });
    const topPick = visibleQuestions(SURVEY, answers).find((q) => q.key === 'top_pick');
    expect(topPick).toBeDefined();
  });
});

describe('validateAnswers', () => {
  it('accepts a complete, honest set of answers and fills in the automatic top pick', () => {
    const result = validateAnswers(SURVEY, {
      front: ['bookings'],
      back: [],
      price: ['up_to_10'],
      must_do: '  Be quick  ',
      say: ['say_call'],
    });
    expect(result).toEqual({
      ok: true,
      answers: {
        front: ['bookings'],
        top_pick: ['bookings'],
        price: ['up_to_10'],
        must_do: 'Be quick',
        say: ['say_call'],
      },
      contactStep: expect.objectContaining({ key: 'contact' }),
    });
  });

  it('refuses more picks than the screen allows, counting a repeated pick once', () => {
    const pickTwo: Survey = {
      ...SURVEY,
      questions: SURVEY.questions.map((q) => (q.key === 'front' ? { ...q, maxChoices: 2 } : q)),
    };
    const answers = { back: [], price: ['free'], say: ['say_no'] };
    expect(
      validateAnswers(pickTwo, { ...answers, front: ['bookings', 'events', 'loyalty'] })
    ).toEqual({ ok: false, errors: { front: 'too_many' } });
    expect(validateAnswers(pickTwo, { ...answers, front: ['bookings', 'bookings'] }).ok).toBe(true);
  });

  it('refuses an option that was never offered, including a top pick nobody picked earlier', () => {
    const result = validateAnswers(SURVEY, {
      front: ['bookings', 'events'],
      back: [],
      top_pick: ['rotas'],
      say: ['say_no'],
    });
    expect(result).toEqual({ ok: false, errors: { top_pick: 'unknown_option' } });
  });

  it('requires an answer to a required single choice', () => {
    expect(validateAnswers(SURVEY, { front: [], back: [] })).toEqual({
      ok: false,
      errors: { say: 'required' },
    });
  });

  it('refuses free text over the limit and ignores it when blank', () => {
    expect(validateAnswers(SURVEY, { must_do: 'x'.repeat(21), say: ['say_no'] })).toEqual({
      ok: false,
      errors: { must_do: 'too_long' },
    });
    const blank = validateAnswers(SURVEY, { must_do: '   ', say: ['say_no'] });
    expect(blank.ok).toBe(true);
    expect(blank.ok ? blank.answers.must_do : 'failed').toBeUndefined();
  });

  it('drops answers to questions that were never shown, and ignores unknown keys', () => {
    const result = validateAnswers(SURVEY, {
      price: ['free'],
      nonsense: ['x'],
      say: ['say_no'],
    });
    expect(result).toEqual({ ok: true, answers: { say: ['say_no'] }, contactStep: null });
  });

  it('never accepts a string where picks are expected', () => {
    expect(validateAnswers(SURVEY, { say: 'say_call' })).toEqual({
      ok: false,
      errors: { say: 'required' },
    });
  });
});

describe('volunteeredFor', () => {
  it('records which yes brought someone to the contact step', () => {
    const contact = SURVEY.questions.find((q) => q.key === 'contact')!;
    expect(volunteeredFor(contact, { say: ['say_email'] })).toEqual(['say_email']);
  });
});

describe('renderPrompt', () => {
  it('names the top pick in the price question', () => {
    const answers = effectiveAnswers(SURVEY, { front: [], back: ['rotas'] });
    expect(renderPrompt(SURVEY, 'Your top pick: {{top_pick}}. What is it worth?', answers)).toBe(
      'Your top pick: Staff rotas. What is it worth?'
    );
  });

  it('still reads as a sentence when the placeholder has no answer', () => {
    expect(renderPrompt(SURVEY, 'What is {{top_pick}} worth?', {})).toBe('What is that worth?');
  });
});

describe('results', () => {
  const tallies = [
    { questionKey: 'top_pick', optionKey: 'rotas', picks: 9 },
    { questionKey: 'top_pick', optionKey: 'bookings', picks: 12 },
    { questionKey: 'top_pick', optionKey: 'stock', picks: 9 },
    { questionKey: 'front', optionKey: 'events', picks: 30 },
    { questionKey: 'top_pick', optionKey: 'retired_option', picks: 50 },
  ];

  it('ranks by picks, as a share of respondents, and ignores options no longer in the survey', () => {
    expect(resultBars(SURVEY, 'top_pick', tallies, 40, 2)).toEqual([
      { key: 'bookings', label: 'Table bookings', picks: 12, percent: 30 },
      { key: 'rotas', label: 'Staff rotas', picks: 9, percent: 23 },
    ]);
  });

  it('shows nothing with no responses rather than dividing by zero', () => {
    expect(resultBars(SURVEY, 'top_pick', tallies, 0)).toEqual([]);
  });

  it('keeps results hidden until the threshold', () => {
    expect(shouldShowResults(SURVEY, 19)).toBe(false);
    expect(shouldShowResults(SURVEY, 20)).toBe(true);
    expect(shouldShowResults({ ...SURVEY, resultsQuestionKey: null }, 500)).toBe(false);
  });
});
