'use server';

import { randomUUID } from 'crypto';
import { headers } from 'next/headers';

/*
 * Types only from the schema module. A 'use server' file may export async
 * functions and nothing else; see the note at the top of actions/enquiry.ts for
 * what it cost the last time a plain value was exported from one.
 */
import type { SurveySubmitResult, SurveyResultsView } from '@/lib/schemas/survey';
import { surveyContactSchema, surveySubmissionSchema } from '@/lib/schemas/survey';
import { getSurveyForVisitor, getSurveyResults, submitSurveyResponse } from '@/lib/db/surveys';
import {
  resultBars,
  shouldShowResults,
  validateAnswers,
  volunteeredFor,
  type Survey,
} from '@/lib/surveys/logic';
import { cleanEnquirySource } from '@/lib/enquiry-source';
import { escapeHtml, sendLeadNotification } from '@/lib/email';
import {
  RATE_LIMIT_MESSAGE,
  checkRateLimit,
  getClientIp,
  hashKey,
  isRateLimitConfigured,
} from '@/lib/rate-limit';

export type { SurveySubmitResult };

/**
 * Survey submission.
 *
 * FAILS CLOSED. The answers are the reason the survey exists and a volunteer's
 * details are a promise to follow up, so nothing here tells somebody their
 * answers arrived unless the row is in the database. Every refusal keeps the
 * answers in the browser so "Try again" costs nothing, and names Peter's
 * address as the fallback.
 *
 * @see tasks/survey/PLAN.md
 */

const FALLBACK = 'Please try again in a moment, or email peter@orangejelly.co.uk.';
const NOT_SENT = `We couldn't send your answers. ${FALLBACK}`;
const CLOSED = "This survey has closed, so your answers weren't sent.";
const ADMIN_URL = 'https://www.orangejelly.co.uk/admin';

export async function submitSurvey(input: unknown): Promise<SurveySubmitResult> {
  const parsed = surveySubmissionSchema.safeParse(input);
  if (!parsed.success) return { error: NOT_SENT };
  const data = parsed.data;

  // Honeypot: answer as though it worked. Telling a bot it failed only teaches it.
  if (data.subject) return { success: true, results: null };

  // An unconfigured limiter in production refuses rather than waving everything
  // through. The enquiry form skips the limiter in that case; polls do not, and
  // surveys follow polls, because the counts are only worth what they exclude.
  if (!isRateLimitConfigured() && process.env.NODE_ENV === 'production') {
    console.error('[surveys] rate limiter unavailable; refusing a submission.');
    return { error: NOT_SENT };
  }
  if (isRateLimitConfigured()) {
    const limited = await checkRateLimit('survey_submit_ip', hashKey(getClientIp(headers())));
    // "Too many attempts" would be untrue when the limiter itself is down, and it
    // would send somebody away for no reason. Say what happened instead.
    if (!limited.allowed) {
      return { error: limited.reason === 'unavailable' ? NOT_SENT : RATE_LIMIT_MESSAGE };
    }
  }

  let access: Awaited<ReturnType<typeof getSurveyForVisitor>>;
  try {
    access = await getSurveyForVisitor(data.slug, data.previewToken);
  } catch (error) {
    console.error('[surveys] could not load the survey for a submission:', error);
    return { error: NOT_SENT };
  }
  if (!access) return { error: NOT_SENT };
  if (access.mode === 'closed') return { error: CLOSED };

  const { survey } = access;
  const isPreview = access.mode === 'preview';

  const checked = validateAnswers(survey, data.answers);
  if (!checked.ok) {
    // An honest browser cannot get here: it runs the same rules before sending.
    console.error('[surveys] answers failed validation:', checked.errors);
    return { error: `Some of your answers didn't go through. ${FALLBACK}` };
  }

  // Contact details are stored only when the contact step was actually shown.
  // Anything sent without it is ignored, never kept "in case".
  let contact: Parameters<typeof submitSurveyResponse>[0]['contact'];
  if (checked.contactStep && data.contact !== undefined) {
    const details = surveyContactSchema.safeParse(data.contact);
    if (!details.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of details.error.issues) {
        const field = String(issue.path[0] ?? '');
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      return { error: 'Please check the highlighted fields.', fieldErrors };
    }
    if (!survey.consentText) {
      // The authoring check makes this impossible; refuse rather than store
      // personal data without a record of what was agreed to.
      console.error(`[surveys] "${survey.slug}" has a contact step and no consent text.`);
      return { error: NOT_SENT };
    }
    contact = {
      id: randomUUID(),
      name: details.data.name,
      email: details.data.email,
      businessName: details.data.businessName || undefined,
      volunteeredFor: volunteeredFor(checked.contactStep, checked.answers),
      consentText: survey.consentText,
    };
  }

  const source = cleanEnquirySource(data.leadSource);
  const stored = await submitSurveyResponse({
    responseId: data.responseId,
    surveyId: survey.id,
    answers: checked.answers,
    isPreview,
    referrerHost: source.referrer ? new URL(source.referrer).host : undefined,
    utmSource: source.utmSource,
    utmMedium: source.utmMedium,
    utmCampaign: source.utmCampaign,
    utmTerm: source.utmTerm,
    utmContent: source.utmContent,
    contact,
  });

  if (!stored.stored) {
    return { error: stored.reason === 'not_open' ? CLOSED : NOT_SENT };
  }

  // Nothing below may turn stored answers into an error for the respondent.
  // A repeat of an attempt that was already stored has already emailed Peter.
  if (contact && !isPreview && !stored.duplicate) await notifyVolunteer(survey, contact);

  return { success: true, results: await loadResults(survey) };
}

async function loadResults(survey: Survey): Promise<SurveyResultsView | null> {
  try {
    const { responses, tallies } = await getSurveyResults(survey.id);
    return {
      responses,
      bars:
        shouldShowResults(survey, responses) && survey.resultsQuestionKey
          ? resultBars(survey, survey.resultsQuestionKey, tallies, responses)
          : [],
      minResponses: survey.resultsMinResponses,
      heading: survey.resultsHeading,
    };
  } catch (error) {
    console.error('[surveys] stored, but the results could not be loaded:', error);
    return null;
  }
}

/**
 * Tells Peter someone volunteered. Awaited for the reason given in
 * actions/enquiry.ts (Vercel can freeze the function once the response is
 * sent), and contained, so a failed email is logged and never reported to the
 * respondent as a failed submission.
 */
async function notifyVolunteer(
  survey: Survey,
  contact: NonNullable<Parameters<typeof submitSurveyResponse>[0]['contact']>
): Promise<void> {
  const labels = new Map(
    survey.questions.flatMap((q) => q.options.map((o) => [o.key, o.label] as const))
  );
  const rows: Array<[string, string]> = [
    ['Survey', survey.title],
    ['Name', contact.name],
    ['Business', contact.businessName ?? 'Not given'],
    ['Email', contact.email],
    ['Said yes to', contact.volunteeredFor.map((key) => labels.get(key) ?? key).join('; ')],
  ];
  const tail = 'Their answers are in the admin view.';

  try {
    const result = await sendLeadNotification({
      subject: `Survey volunteer: ${(contact.businessName ?? contact.name).replace(/[\r\n]+/g, ' ').trim()}`,
      html: [
        ...rows.map(
          ([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
        ),
        `<p>${escapeHtml(tail)}</p>`,
        `<p><a href="${ADMIN_URL}">${ADMIN_URL}</a></p>`,
      ].join('\n'),
      text: [...rows.map(([label, value]) => `${label}: ${value}`), '', tail, ADMIN_URL].join('\n'),
      replyTo: contact.email,
    });
    if (result.error)
      console.error('[surveys] stored, but the notification was not sent:', result.error);
  } catch (error) {
    console.error('[surveys] stored, but the notification threw:', error);
  }
}
