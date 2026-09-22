import { timingSafeEqual } from 'crypto';
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from './supabase-admin';
import type {
  Answer,
  QuestionKind,
  Survey,
  SurveyQuestion,
  SurveyStatus,
  TallyRow,
} from '@/lib/surveys/logic';

/**
 * Data access for surveys.
 *
 * Supabase-only, like polls, and for the same reason: the dual Supabase and raw
 * Postgres path in `leads.ts` has never run. Every function uses the
 * service-role client; the survey tables have RLS on with no policies.
 *
 * @see supabase/migrations/20260922120000_surveys.sql
 */

interface OptionRow {
  key: string;
  position: number;
  label: string;
  hint: string | null;
  icon: string | null;
}

interface QuestionRow {
  key: string;
  position: number;
  kind: QuestionKind;
  prompt: string;
  hint: string | null;
  required: boolean;
  min_choices: number | null;
  max_choices: number | null;
  max_length: number | null;
  options_from: string[] | null;
  show_if: string[] | null;
  survey_options: OptionRow[] | null;
}

interface SurveyRow {
  id: string;
  slug: string;
  status: SurveyStatus;
  eyebrow: string;
  title: string;
  intro: string;
  minutes: number;
  share_text: string;
  thank_you_heading: string;
  thank_you_body: string;
  results_question_key: string | null;
  results_heading: string | null;
  results_min_responses: number;
  consent_text: string | null;
  preview_token: string;
  survey_questions: QuestionRow[] | null;
}

const SURVEY_SELECT = `
  id, slug, status, eyebrow, title, intro, minutes, share_text,
  thank_you_heading, thank_you_body, results_question_key, results_heading,
  results_min_responses, consent_text, preview_token,
  survey_questions (
    key, position, kind, prompt, hint, required, min_choices, max_choices,
    max_length, options_from, show_if,
    survey_options ( key, position, label, hint, icon )
  )
`;

const byPosition = (a: { position: number }, b: { position: number }): number =>
  a.position - b.position;

/** Row to domain type. The preview token never leaves this module. */
export function mapSurveyRow(row: SurveyRow): Survey {
  const questions: SurveyQuestion[] = [...(row.survey_questions ?? [])]
    .sort(byPosition)
    .map((q) => ({
      key: q.key,
      kind: q.kind,
      prompt: q.prompt,
      hint: q.hint,
      required: q.required,
      minChoices: q.min_choices,
      maxChoices: q.max_choices,
      maxLength: q.max_length,
      optionsFrom: q.options_from ?? [],
      showIf: q.show_if ?? [],
      options: [...(q.survey_options ?? [])].sort(byPosition).map((o) => ({
        key: o.key,
        label: o.label,
        hint: o.hint,
        icon: o.icon,
      })),
    }));

  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    eyebrow: row.eyebrow,
    title: row.title,
    intro: row.intro,
    minutes: row.minutes,
    shareText: row.share_text,
    thankYouHeading: row.thank_you_heading,
    thankYouBody: row.thank_you_body,
    resultsQuestionKey: row.results_question_key,
    resultsHeading: row.results_heading,
    resultsMinResponses: row.results_min_responses,
    consentText: row.consent_text,
    questions,
  };
}

function tokensMatch(expected: string, given: string): boolean {
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

export type SurveyAccess =
  /** Answering for real. */
  | { survey: Survey; mode: 'live' }
  /** Answering through the preview link: answers are stored flagged and never counted. */
  | { survey: Survey; mode: 'preview' }
  /** A shared link that outlived the survey. Shown a closed message, not a 404. */
  | { survey: Survey; mode: 'closed' };

/**
 * The survey a visitor may see at /survey/<slug>, or null for a 404.
 *
 * A draft is visible only with its preview token, and a draft without one is
 * indistinguishable from a slug that does not exist. The preview token also
 * works on a live survey, so Peter can test the real thing without his answers
 * landing in the counts.
 *
 * Throws when the database cannot be reached, so the page shows the error
 * boundary rather than a 404 that would tell a respondent the survey is gone.
 */
export async function getSurveyForVisitor(
  slug: string,
  previewToken?: string
): Promise<SurveyAccess | null> {
  if (!isSupabaseAdminConfigured()) {
    throw new Error('Surveys need Supabase, and it is not configured.');
  }

  const { data, error } = await getSupabaseAdminClient()
    .from('surveys')
    .select(SURVEY_SELECT)
    .eq('slug', slug)
    .maybeSingle<SurveyRow>();

  if (error) throw new Error(`Could not load survey "${slug}": ${error.message}`);
  if (!data) return null;

  const survey = mapSurveyRow(data);
  if (previewToken && tokensMatch(data.preview_token, previewToken)) {
    return { survey, mode: 'preview' };
  }
  if (data.status === 'live') return { survey, mode: 'live' };
  if (data.status === 'closed') return { survey, mode: 'closed' };
  return null;
}

export interface SubmissionInput {
  responseId: string;
  surveyId: string;
  answers: Record<string, Answer>;
  isPreview: boolean;
  referrerHost?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  contact?: {
    id: string;
    name: string;
    email: string;
    businessName?: string;
    volunteeredFor: string[];
    consentText: string;
  };
}

export type SubmissionResult =
  | { stored: true }
  | { stored: false; reason: 'not_open' | 'unavailable' | 'failed' };

/**
 * Stores one response and, when given, the volunteer's details, in one
 * transaction (`submit_survey_response`). Never throws: the caller turns the
 * result into what the respondent sees, and every failure is logged here.
 */
export async function submitSurveyResponse(input: SubmissionInput): Promise<SubmissionResult> {
  if (!isSupabaseAdminConfigured()) {
    console.error('[surveys] a response arrived and Supabase is not configured.');
    return { stored: false, reason: 'unavailable' };
  }

  try {
    const { error } = await getSupabaseAdminClient().rpc('submit_survey_response', {
      p_response_id: input.responseId,
      p_survey_id: input.surveyId,
      p_answers: input.answers,
      p_is_preview: input.isPreview,
      p_referrer_host: input.referrerHost ?? null,
      p_utm_source: input.utmSource ?? null,
      p_utm_medium: input.utmMedium ?? null,
      p_utm_campaign: input.utmCampaign ?? null,
      p_utm_term: input.utmTerm ?? null,
      p_utm_content: input.utmContent ?? null,
      p_contact: input.contact
        ? {
            id: input.contact.id,
            name: input.contact.name,
            email: input.contact.email,
            email_normalized: input.contact.email.trim().toLowerCase(),
            business_name: input.contact.businessName ?? null,
            volunteered_for: input.contact.volunteeredFor,
            consent_text: input.contact.consentText,
          }
        : null,
    });

    if (!error) return { stored: true };
    if (error.message.includes('survey_not_open')) return { stored: false, reason: 'not_open' };
    console.error('[surveys] the response was not stored:', error.message);
    return { stored: false, reason: 'failed' };
  } catch (error) {
    console.error('[surveys] the response write threw:', error);
    return { stored: false, reason: 'failed' };
  }
}

export interface SurveyResults {
  responses: number;
  tallies: TallyRow[];
}

/**
 * Real responses and every tally for one survey. Preview answers are excluded
 * by the database function and by the count, so the two always agree.
 */
export async function getSurveyResults(surveyId: string): Promise<SurveyResults> {
  const client = getSupabaseAdminClient();
  const [count, tallies] = await Promise.all([
    client
      .from('survey_responses')
      .select('id', { count: 'exact', head: true })
      .eq('survey_id', surveyId)
      .eq('is_preview', false),
    client.rpc('survey_tallies', { p_survey_id: surveyId }),
  ]);

  if (count.error) throw new Error(`Could not count responses: ${count.error.message}`);
  if (tallies.error) throw new Error(`Could not tally responses: ${tallies.error.message}`);

  const rows = (tallies.data ?? []) as Array<{
    question_key: string;
    option_key: string;
    picks: number | string;
  }>;

  return {
    responses: count.count ?? 0,
    tallies: rows.map((row) => ({
      questionKey: row.question_key,
      optionKey: row.option_key,
      // bigint arrives as a number from PostgREST today; Number() keeps it one if that changes.
      picks: Number(row.picks),
    })),
  };
}
