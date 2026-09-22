import { z } from 'zod';
import { isSurveyIcon } from './icons';
import type { Survey } from './logic';

/**
 * The authoring format for a survey: one JSON file in content/surveys/.
 *
 * Surveys are served from the database, and database copy escapes every check
 * the build runs on the repo. Drafting them as files first puts the copy through
 * the British English and growth-language checks, and `checkDefinition` catches
 * the mistakes the database constraints cannot see: a show_if naming an option
 * that does not exist, piping from a later question, a contact step with no
 * consent line. `scripts/survey-to-sql.ts` refuses to write SQL for a file that
 * fails either.
 */

const KEY = /^[a-z0-9]+(_[a-z0-9]+)*$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const optionSchema = z.object({
  key: z.string().regex(KEY).max(40),
  label: z.string().trim().min(1).max(80),
  hint: z.string().trim().min(1).max(120).optional(),
  icon: z.string().optional(),
});

const questionSchema = z.object({
  key: z.string().regex(KEY).max(40),
  kind: z.enum(['single', 'multi', 'text', 'contact']),
  prompt: z.string().trim().min(1).max(160),
  hint: z.string().trim().min(1).max(160).optional(),
  required: z.boolean().optional(),
  minChoices: z.number().int().min(0).optional(),
  maxChoices: z.number().int().min(1).optional(),
  maxLength: z.number().int().min(1).max(2000).optional(),
  optionsFrom: z.array(z.string()).optional(),
  showIf: z.array(z.string()).optional(),
  options: z.array(optionSchema).optional(),
});

export const surveyDefinitionSchema = z.object({
  slug: z.string().regex(SLUG).max(60),
  eyebrow: z.string().trim().min(1).max(40),
  title: z.string().trim().min(1).max(90),
  intro: z.string().trim().min(1).max(400),
  minutes: z.number().int().min(1).max(15),
  shareText: z.string().trim().min(1).max(200),
  thankYouHeading: z.string().trim().min(1).max(90),
  thankYouBody: z.string().trim().min(1).max(400),
  results: z
    .object({
      questionKey: z.string(),
      heading: z.string().trim().min(1).max(90),
      minResponses: z.number().int().min(1).optional(),
    })
    .optional(),
  consentText: z.string().trim().min(1).max(200).optional(),
  questions: z.array(questionSchema).min(1),
});

export type SurveyDefinition = z.infer<typeof surveyDefinitionSchema>;

/**
 * Everything wrong with a definition, as sentences a person can act on. Empty
 * means it is safe to turn into SQL.
 */
export function checkDefinition(input: unknown): string[] {
  const parsed = surveyDefinitionSchema.safeParse(input);
  if (!parsed.success) {
    return parsed.error.issues.map(
      (issue) => `${issue.path.join('.') || 'survey'}: ${issue.message}`
    );
  }
  const def = parsed.data;
  const problems: string[] = [];

  const questionKeys = new Set<string>();
  const optionOwner = new Map<string, string>();
  const optionsFromEarlier = new Set<string>();
  const questionsSoFar = new Map<string, SurveyDefinition['questions'][number]>();

  for (const question of def.questions) {
    const where = `question "${question.key}"`;

    if (questionKeys.has(question.key)) problems.push(`${where} is defined twice`);
    if (optionOwner.has(question.key)) problems.push(`${where} has the same key as an option`);

    const hasOptions = (question.options?.length ?? 0) > 0;
    const piped = (question.optionsFrom?.length ?? 0) > 0;

    if (question.kind === 'single' || question.kind === 'multi') {
      if (!hasOptions && !piped) problems.push(`${where} is a choice with nothing to choose`);
      if (hasOptions && piped) problems.push(`${where} both lists options and pipes them`);
    } else if (hasOptions || piped) {
      problems.push(`${where} is ${question.kind} and cannot have options`);
    }

    // A piped screen appears once there are two things to choose between, so it
    // can never promise more than that: a higher minimum would leave Next
    // disabled for good for anyone who picked exactly two.
    if (question.kind === 'multi' && piped && (question.minChoices ?? 0) > 1) {
      problems.push(`${where} pipes its options, so minChoices cannot be more than 1`);
    }

    if (question.kind === 'multi') {
      if (question.minChoices === undefined || question.maxChoices === undefined) {
        problems.push(`${where} is multi and needs minChoices and maxChoices`);
      } else if (question.maxChoices < Math.max(question.minChoices, 1)) {
        problems.push(`${where} allows fewer picks than it requires`);
      }
    } else if (question.minChoices !== undefined || question.maxChoices !== undefined) {
      problems.push(`${where} is ${question.kind} and cannot set minChoices or maxChoices`);
    }

    if ((question.kind === 'text') !== (question.maxLength !== undefined)) {
      problems.push(`${where}: maxLength is required for text and only for text`);
    }

    if (question.kind === 'contact' && !def.consentText) {
      problems.push(`${where} is a contact step, so the survey needs consentText`);
    }
    if (question.kind === 'contact' && (question.showIf?.length ?? 0) === 0) {
      problems.push(`${where} must be shown only to people who volunteered (set showIf)`);
    }

    for (const source of question.optionsFrom ?? []) {
      const earlier = questionsSoFar.get(source);
      if (!earlier)
        problems.push(`${where} pipes from "${source}", which is not an earlier question`);
      else if (earlier.kind !== 'single' && earlier.kind !== 'multi') {
        problems.push(`${where} pipes from "${source}", which is not a choice question`);
      }
    }

    for (const key of question.showIf ?? []) {
      if (!optionsFromEarlier.has(key) && !questionKeys.has(key)) {
        problems.push(`${where} shows if "${key}", which is not an earlier option or question`);
      }
    }

    for (const option of question.options ?? []) {
      const owner = optionOwner.get(option.key);
      if (owner)
        problems.push(`option "${option.key}" is used by "${owner}" and "${question.key}"`);
      if (questionKeys.has(option.key) || option.key === question.key) {
        problems.push(`option "${option.key}" has the same key as a question`);
      }
      if (option.icon !== undefined && !isSurveyIcon(option.icon)) {
        problems.push(
          `option "${option.key}" uses icon "${option.icon}", which is not in src/lib/surveys/icons.ts`
        );
      }
      optionOwner.set(option.key, question.key);
    }

    for (const match of question.prompt.matchAll(/\{\{([a-z0-9_]+)\}\}/g)) {
      if (!questionsSoFar.has(match[1])) {
        problems.push(`${where} names "{{${match[1]}}}", which is not an earlier question`);
      }
    }

    questionKeys.add(question.key);
    questionsSoFar.set(question.key, question);
    for (const option of question.options ?? []) optionsFromEarlier.add(option.key);
  }

  const contactSteps = def.questions.filter((q) => q.kind === 'contact');
  if (contactSteps.length > 1) problems.push('a survey can have one contact step at most');
  // The contact step sends the answers, so anything after it would never be asked
  // and a required question there would fail every honest submission.
  if (contactSteps.length === 1 && def.questions[def.questions.length - 1].kind !== 'contact') {
    problems.push('the contact step must be the last question');
  }

  if (def.results) {
    const target = def.questions.find((q) => q.key === def.results?.questionKey);
    if (!target)
      problems.push(`results names "${def.results.questionKey}", which is not a question`);
    else if (target.kind !== 'single' && target.kind !== 'multi') {
      problems.push(`results names "${def.results.questionKey}", which is not a choice question`);
    }
  }

  return problems;
}

/**
 * The survey a definition describes, as the site would serve it. Used by tests
 * to walk the real survey through the player's rules before it goes anywhere
 * near the database.
 */
export function definitionToSurvey(def: SurveyDefinition): Survey {
  return {
    id: '00000000-0000-0000-0000-000000000000',
    slug: def.slug,
    status: 'draft',
    eyebrow: def.eyebrow,
    title: def.title,
    intro: def.intro,
    minutes: def.minutes,
    shareText: def.shareText,
    thankYouHeading: def.thankYouHeading,
    thankYouBody: def.thankYouBody,
    resultsQuestionKey: def.results?.questionKey ?? null,
    resultsHeading: def.results?.heading ?? null,
    resultsMinResponses: def.results?.minResponses ?? 20,
    consentText: def.consentText ?? null,
    questions: def.questions.map((q) => ({
      key: q.key,
      kind: q.kind,
      prompt: q.prompt,
      hint: q.hint ?? null,
      required: q.required ?? true,
      minChoices: q.minChoices ?? null,
      maxChoices: q.maxChoices ?? null,
      maxLength: q.maxLength ?? null,
      optionsFrom: q.optionsFrom ?? [],
      showIf: q.showIf ?? [],
      options: (q.options ?? []).map((o) => ({
        key: o.key,
        label: o.label,
        hint: o.hint ?? null,
        icon: o.icon ?? null,
      })),
    })),
  };
}
