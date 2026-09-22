import { z } from 'zod';
import type { ResultBar } from '@/lib/surveys/logic';

/**
 * The survey submission, shared by the player and the server action.
 *
 * Only the shape is checked here. Whether each answer was allowed depends on the
 * survey itself and is decided by `validateAnswers` on the server.
 */

export const surveyContactSchema = z.object({
  name: z.string().trim().min(2, 'Tell us your name').max(120, 'That is longer than we can store'),
  email: z
    .string()
    .trim()
    .min(1, 'We need an email address to reach you')
    .max(254, 'That is longer than an email address can be')
    .email('That does not look like an email address'),
  businessName: z.string().trim().max(120, 'That is longer than we can store').optional(),
  consent: z.literal(true, { error: 'Tick the box so we can contact you, or skip this step' }),
});

export type SurveyContactInput = z.input<typeof surveyContactSchema>;

export const surveySubmissionSchema = z.object({
  slug: z.string().max(60),
  previewToken: z.string().max(64).optional(),
  /**
   * Made once in the browser and sent with every attempt, so a retry after a
   * reply that never arrived is recognised rather than stored twice.
   */
  responseId: z.uuid(),
  answers: z.record(
    z.string().max(40),
    z.union([z.array(z.string().max(40)).max(40), z.string().max(2000)])
  ),
  /** Absent when the respondent was not asked, or chose to skip the contact step. */
  contact: z.unknown().optional(),
  /**
   * Honeypot, named `subject` for the reason given in schemas/enquiry.ts: an
   * autofiller never fills it, and a bot that fills every input does.
   */
  subject: z.string().max(200).optional(),
  leadSource: z.unknown().optional(),
});

export type SurveySubmission = z.input<typeof surveySubmissionSchema>;

export interface SurveyResultsView {
  /** Real responses so far, this one included. */
  responses: number;
  /** Empty until the survey's threshold is reached. */
  bars: ResultBar[];
  /** The threshold, so the screen can say how many more are needed. */
  minResponses: number;
  heading: string | null;
}

export interface SurveySubmitResult {
  success?: true;
  error?: string;
  /** Contact field errors, keyed by field name. */
  fieldErrors?: Record<string, string>;
  /** Null when results could not be loaded; the thank-you screen still shows. */
  results?: SurveyResultsView | null;
}
