/**
 * The rules of a survey, shared by the player in the browser and the server action.
 *
 * Pure functions only. The browser uses them to decide what to show next; the
 * server runs the same functions again on submit and trusts nothing the browser
 * says about what was visible or valid. One implementation, so the two can never
 * disagree about whether an answer was allowed.
 *
 * @see tasks/survey/PLAN.md
 */

export type SurveyStatus = 'draft' | 'live' | 'closed';
export type QuestionKind = 'single' | 'multi' | 'text' | 'contact';

export interface SurveyOption {
  key: string;
  label: string;
  hint: string | null;
  icon: string | null;
}

export interface SurveyQuestion {
  key: string;
  kind: QuestionKind;
  prompt: string;
  hint: string | null;
  required: boolean;
  minChoices: number | null;
  maxChoices: number | null;
  maxLength: number | null;
  /** Keys of earlier questions whose picks become this question's options. */
  optionsFrom: readonly string[];
  /**
   * Shown only when any of these was picked or answered earlier: an option key
   * (that option was picked) or a question key (that question has an answer).
   * Empty means always. Keys are checked for collisions by scripts/survey-to-sql.mjs.
   */
  showIf: readonly string[];
  options: readonly SurveyOption[];
}

export interface Survey {
  id: string;
  slug: string;
  status: SurveyStatus;
  eyebrow: string;
  title: string;
  intro: string;
  minutes: number;
  shareText: string;
  thankYouHeading: string;
  thankYouBody: string;
  resultsQuestionKey: string | null;
  resultsHeading: string | null;
  resultsMinResponses: number;
  consentText: string | null;
  questions: readonly SurveyQuestion[];
}

/** Option keys for a choice question, or the words typed into a text question. */
export type Answer = readonly string[] | string;
export type Answers = Readonly<Record<string, Answer>>;

function picksOf(answer: Answer | undefined): readonly string[] {
  return Array.isArray(answer) ? answer : [];
}

/** Every option key picked so far, across all choice questions. */
export function pickedOptionKeys(answers: Answers): Set<string> {
  const picked = new Set<string>();
  for (const answer of Object.values(answers)) {
    for (const key of picksOf(answer)) picked.add(key);
  }
  return picked;
}

function hasAnswer(answer: Answer | undefined): boolean {
  return Array.isArray(answer)
    ? answer.length > 0
    : typeof answer === 'string' && answer.trim() !== '';
}

/** Whether a question's show_if condition is met by the answers so far. */
function conditionMet(question: SurveyQuestion, answers: Answers): boolean {
  if (question.showIf.length === 0) return true;
  const picked = pickedOptionKeys(answers);
  return question.showIf.some((key) => picked.has(key) || hasAnswer(answers[key]));
}

/** Every option in the survey by key. Keys are unique per survey (a database constraint). */
function optionIndex(survey: Survey): Map<string, SurveyOption> {
  const index = new Map<string, SurveyOption>();
  for (const question of survey.questions) {
    for (const option of question.options) index.set(option.key, option);
  }
  return index;
}

/**
 * The options a question offers, given the answers so far.
 *
 * A piped question offers what was picked in its source questions, in the order
 * the source questions list them, so the screen reads the same way the earlier
 * ones did rather than in the order somebody happened to tap.
 */
export function resolveOptions(
  survey: Survey,
  question: SurveyQuestion,
  answers: Answers
): readonly SurveyOption[] {
  if (question.optionsFrom.length === 0) return question.options;

  const index = optionIndex(survey);
  const resolved: SurveyOption[] = [];
  for (const sourceKey of question.optionsFrom) {
    const source = survey.questions.find((q) => q.key === sourceKey);
    if (!source) continue;
    const picked = new Set(picksOf(answers[sourceKey]));
    for (const option of resolveOptions(survey, source, answers)) {
      if (picked.has(option.key) && index.has(option.key)) resolved.push(option);
    }
  }
  return resolved;
}

/**
 * Whether a question is shown, given the answers so far.
 *
 * Hidden when its show_if condition is not met, and hidden when it is piped and
 * there is nothing to choose between: one option is answered automatically (see
 * `effectiveAnswers`), and none means the question does not apply.
 */
export function isQuestionVisible(
  survey: Survey,
  question: SurveyQuestion,
  answers: Answers
): boolean {
  if (!conditionMet(question, answers)) return false;
  if (question.optionsFrom.length > 0) {
    return resolveOptions(survey, question, answers).length > 1;
  }
  return true;
}

/** The answer a question gets without being asked: a piped question left with one option. */
function automaticAnswer(
  survey: Survey,
  question: SurveyQuestion,
  answers: Answers
): Answer | undefined {
  if (question.optionsFrom.length === 0) return undefined;
  if (!conditionMet(question, answers)) return undefined;
  const options = resolveOptions(survey, question, answers);
  return options.length === 1 ? [options[0].key] : undefined;
}

export type AnswerError = 'required' | 'too_few' | 'too_many' | 'unknown_option' | 'too_long';

export type ValidationResult =
  | { ok: true; answers: Record<string, Answer>; contactStep: SurveyQuestion | null }
  | { ok: false; errors: Record<string, AnswerError> };

/**
 * Validates raw answers against the survey and returns only what counts.
 *
 * Walks the questions in order, because visibility and piping depend only on
 * earlier answers. Answers to hidden questions, unknown keys and duplicate picks
 * are dropped, not reported: someone who picked an app, went back and unpicked
 * it, has a stale answer further on that is nobody's error. Piped questions left
 * with a single option are filled in, so the stored answers say which one thing
 * mattered most even when the respondent was never asked to choose.
 *
 * `contactStep` is the contact question when it is visible, so the caller knows
 * whether contact details are expected.
 */
export function validateAnswers(
  survey: Survey,
  raw: Readonly<Record<string, unknown>>
): ValidationResult {
  const answers: Record<string, Answer> = {};
  const errors: Record<string, AnswerError> = {};
  let contactStep: SurveyQuestion | null = null;

  for (const question of survey.questions) {
    const automatic = automaticAnswer(survey, question, answers);
    if (automatic !== undefined) {
      answers[question.key] = automatic;
      continue;
    }
    if (!isQuestionVisible(survey, question, answers)) continue;

    const value = raw[question.key];

    if (question.kind === 'contact') {
      contactStep = question;
      continue;
    }

    if (question.kind === 'text') {
      const text = typeof value === 'string' ? value.trim() : '';
      if (!text) {
        if (question.required) errors[question.key] = 'required';
        continue;
      }
      if (question.maxLength !== null && text.length > question.maxLength) {
        errors[question.key] = 'too_long';
        continue;
      }
      answers[question.key] = text;
      continue;
    }

    const allowed = new Set(resolveOptions(survey, question, answers).map((o) => o.key));
    const picks = Array.isArray(value)
      ? Array.from(new Set(value.filter((v): v is string => typeof v === 'string')))
      : [];
    if (picks.some((key) => !allowed.has(key))) {
      errors[question.key] = 'unknown_option';
      continue;
    }

    if (question.kind === 'single') {
      if (picks.length > 1) {
        errors[question.key] = 'too_many';
        continue;
      }
      if (picks.length === 0) {
        if (question.required) errors[question.key] = 'required';
        continue;
      }
      answers[question.key] = picks;
      continue;
    }

    // multi
    const min = question.minChoices ?? 0;
    const max = question.maxChoices ?? allowed.size;
    if (picks.length < min) {
      errors[question.key] = picks.length === 0 ? 'required' : 'too_few';
      continue;
    }
    if (picks.length > max) {
      errors[question.key] = 'too_many';
      continue;
    }
    if (picks.length > 0) answers[question.key] = picks;
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, answers, contactStep };
}

/**
 * The option keys that brought someone to the contact step: what they agreed
 * to be contacted about. Stored with their details as the record of consent.
 */
export function volunteeredFor(contactStep: SurveyQuestion, answers: Answers): string[] {
  const picked = pickedOptionKeys(answers);
  return contactStep.showIf.filter((key) => picked.has(key));
}

/**
 * The answers that still stand, for the player to decide what comes next.
 *
 * The same walk as `validateAnswers` without the judgement: automatic answers are
 * filled in, answers to questions that are now hidden are dropped, and picks that
 * are no longer on offer (someone went back and unpicked an app) are removed, so
 * the question that offered them is asked again rather than silently kept.
 */
export function effectiveAnswers(survey: Survey, raw: Answers): Record<string, Answer> {
  const answers: Record<string, Answer> = {};
  for (const question of survey.questions) {
    const automatic = automaticAnswer(survey, question, answers);
    if (automatic !== undefined) {
      answers[question.key] = automatic;
      continue;
    }
    if (!isQuestionVisible(survey, question, answers)) continue;
    const value = raw[question.key];
    if (value === undefined) continue;
    if (typeof value === 'string') {
      answers[question.key] = value;
      continue;
    }
    const allowed = new Set(resolveOptions(survey, question, answers).map((o) => o.key));
    const kept = value.filter((key) => allowed.has(key));
    if (kept.length > 0) answers[question.key] = kept;
  }
  return answers;
}

/**
 * The prompt with `{{question_key}}` replaced by the label of what was picked
 * there: "Your top pick: {{top_pick}}." reads "Your top pick: Staff rotas."
 * An unanswered placeholder becomes "that", which still reads as a sentence.
 */
export function renderPrompt(survey: Survey, prompt: string, answers: Answers): string {
  const labels = optionIndex(survey);
  return prompt.replace(/\{\{([a-z0-9_]+)\}\}/g, (_match, key: string) => {
    const labelled = picksOf(answers[key])
      .map((pick) => labels.get(pick)?.label)
      .filter((label): label is string => Boolean(label));
    return labelled.length > 0 ? labelled.join(', ') : 'that';
  });
}

/** The questions a respondent will see, in order, given the answers so far. */
export function visibleQuestions(survey: Survey, answers: Answers): SurveyQuestion[] {
  return survey.questions.filter((question) => isQuestionVisible(survey, question, answers));
}

export interface TallyRow {
  questionKey: string;
  optionKey: string;
  picks: number;
}

export interface ResultBar {
  key: string;
  label: string;
  picks: number;
  /** Share of all responses that picked this option, rounded to a whole number. */
  percent: number;
}

/**
 * The bars for the thank-you screen: the most-picked options for one question.
 *
 * Percentages are of respondents, not of picks. On a pick-three question the
 * bars add up to more than 100%, which is the honest reading: "41% of pubs chose
 * rotas" rather than "rotas got 14% of the votes".
 */
export function resultBars(
  survey: Survey,
  questionKey: string,
  tallies: readonly TallyRow[],
  responses: number,
  limit = 5
): ResultBar[] {
  if (responses <= 0) return [];
  const labels = optionIndex(survey);
  return tallies
    .filter((row) => row.questionKey === questionKey && labels.has(row.optionKey))
    .sort((a, b) => b.picks - a.picks || a.optionKey.localeCompare(b.optionKey))
    .slice(0, limit)
    .map((row) => ({
      key: row.optionKey,
      label: labels.get(row.optionKey)?.label ?? row.optionKey,
      picks: row.picks,
      percent: Math.round((row.picks / responses) * 100),
    }));
}

/**
 * Whether the thank-you screen shows results. Hidden until the threshold, so an
 * early respondent never reads a single vote as a verdict from the trade.
 */
export function shouldShowResults(survey: Survey, responses: number): boolean {
  return survey.resultsQuestionKey !== null && responses >= survey.resultsMinResponses;
}
