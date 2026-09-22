import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import { checkDefinition, definitionToSurvey, surveyDefinitionSchema } from './definition';
import { effectiveAnswers, renderPrompt, validateAnswers, visibleQuestions } from './logic';
import { definitionToSql } from './sql';

const DIR = join(process.cwd(), 'content/surveys');
const FILES = readdirSync(DIR).filter((f) => f.endsWith('.json'));

function load(file: string): unknown {
  return JSON.parse(readFileSync(join(DIR, file), 'utf8'));
}

describe('every survey in content/surveys', () => {
  it('exists', () => {
    expect(FILES.length).toBeGreaterThan(0);
  });

  it.each(FILES)('%s passes every check and is named after its slug', (file) => {
    const raw = load(file);
    expect(checkDefinition(raw)).toEqual([]);
    expect(`${surveyDefinitionSchema.parse(raw).slug}.json`).toBe(file);
  });
});

describe('the pub apps survey', () => {
  const survey = definitionToSurvey(surveyDefinitionSchema.parse(load('pub-apps.json')));
  const shown = (raw: Record<string, readonly string[] | string>) =>
    visibleQuestions(survey, effectiveAnswers(survey, raw)).map((q) => q.key);

  it('skips everything about a top pick for someone who picked nothing', () => {
    expect(shown({ front: [], back: [] })).toEqual([
      'front',
      'back',
      'missing',
      'venue',
      'run',
      'say',
      'test',
    ]);
  });

  it('names a single pick in the price question without asking which is the favourite', () => {
    const answers = effectiveAnswers(survey, { front: ['events'], back: [] });
    expect(shown({ front: ['events'], back: [] })).not.toContain('top_pick');
    const price = survey.questions.find((q) => q.key === 'price')!;
    expect(renderPrompt(survey, price.prompt, answers)).toBe(
      'Your top pick: Event bookings. What would it be worth to you each month?'
    );
  });

  it('asks for a favourite across both screens', () => {
    expect(shown({ front: ['events'], back: ['rotas'] })).toContain('top_pick');
  });

  it('asks for contact details from anyone who wants a say or wants to test, and nobody else', () => {
    expect(shown({ say: ['say_no'], test: ['test_no'] })).not.toContain('contact');
    expect(shown({ say: ['say_email'], test: ['test_no'] })).toContain('contact');
    expect(shown({ say: ['say_no'], test: ['test_ready'] })).toContain('contact');
  });

  it('accepts a full, realistic set of answers', () => {
    const result = validateAnswers(survey, {
      front: ['tables', 'events', 'private_bookings'],
      back: ['rotas'],
      top_pick: ['events'],
      price: ['price_10_30'],
      pay_model: ['pay_per_tool'],
      must_do: 'Take deposits without me chasing people.',
      missing: '',
      venue: ['venue_local'],
      run: ['run_tenant'],
      say: ['say_call'],
      test: ['test_early'],
    });
    expect(result.ok).toBe(true);
    expect(result.ok && result.contactStep?.key).toBe('contact');
  });

  it('survives the trip into SQL with its apostrophes intact', () => {
    const sql = definitionToSql(
      surveyDefinitionSchema.parse(load('pub-apps.json')),
      'x'.repeat(24),
      'content/surveys/pub-apps.json'
    );
    expect(sql).toContain("Mother''s Day");
    expect(sql).not.toMatch(/[^']'s /);
  });
});

describe('checkDefinition', () => {
  const base = {
    slug: 'test-survey',
    eyebrow: 'E',
    title: 'T',
    intro: 'I',
    minutes: 1,
    shareText: 'S',
    thankYouHeading: 'H',
    thankYouBody: 'B',
  };

  it('catches the mistakes the database cannot see', () => {
    const problems = checkDefinition({
      ...base,
      results: { questionKey: 'nowhere', heading: 'R' },
      questions: [
        { key: 'pick', kind: 'single', prompt: 'Which? {{later}}', optionsFrom: ['later'] },
        {
          key: 'later',
          kind: 'multi',
          prompt: 'P',
          minChoices: 0,
          maxChoices: 2,
          options: [
            { key: 'a', label: 'A', icon: 'not-an-icon' },
            { key: 'pick', label: 'B' },
          ],
        },
        { key: 'contact', kind: 'contact', prompt: 'Where?', showIf: ['nope'] },
      ],
    });

    expect(problems).toEqual(
      expect.arrayContaining([
        'question "pick" pipes from "later", which is not an earlier question',
        'question "pick" names "{{later}}", which is not an earlier question',
        'option "a" uses icon "not-an-icon", which is not in src/lib/surveys/icons.ts',
        'option "pick" has the same key as a question',
        'question "contact" is a contact step, so the survey needs consentText',
        'question "contact" shows if "nope", which is not an earlier option or question',
        'results names "nowhere", which is not a question',
      ])
    );
  });

  it('catches the shapes that would strand an honest respondent', () => {
    const problems = checkDefinition({
      ...base,
      consentText: 'Contact me.',
      questions: [
        {
          key: 'apps',
          kind: 'multi',
          prompt: 'P',
          minChoices: 0,
          maxChoices: 4,
          options: [
            { key: 'a', label: 'A', icon: 'constructor' },
            { key: 'b', label: 'B' },
            { key: 'c', label: 'C' },
          ],
        },
        {
          key: 'fav',
          kind: 'multi',
          prompt: 'P',
          minChoices: 3,
          maxChoices: 3,
          optionsFrom: ['apps'],
        },
        { key: 'contact', kind: 'contact', prompt: 'Where?', showIf: ['a'] },
        { key: 'after', kind: 'single', prompt: 'P', options: [{ key: 'x', label: 'X' }] },
      ],
    });
    expect(problems).toEqual(
      expect.arrayContaining([
        'option "a" uses icon "constructor", which is not in src/lib/surveys/icons.ts',
        'question "fav" pipes its options, so minChoices cannot be more than 1',
        'the contact step must be the last question',
      ])
    );
  });

  it('reports a malformed file field by field rather than throwing', () => {
    expect(checkDefinition({ ...base, slug: 'Not A Slug', questions: [] })).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^slug:/),
        expect.stringMatching(/^questions:/),
      ])
    );
  });
});
