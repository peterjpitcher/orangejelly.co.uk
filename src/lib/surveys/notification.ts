import { escapeHtml } from '@/lib/email';
import { renderPrompt, type Answers, type Survey } from './logic';

/**
 * The email Peter gets each time somebody answers a survey (his request, 22
 * September 2026). Every answer in survey order, the volunteer's details when
 * there are any, where the respondent came from, and the running count.
 *
 * Pure, so it can be rendered with fixture data in a test before it ships: the
 * workspace rule after `undefined`, `NaN` and `Invalid Date` reached real inboxes.
 */

export interface SurveyResponseEmailInput {
  survey: Survey;
  /** The validated answers, as stored. */
  answers: Answers;
  contact?: {
    name: string;
    email: string;
    businessName?: string;
    volunteeredFor: readonly string[];
  };
  /** utm_source, else the referring host. Absent means they came direct. */
  source?: string;
  isPreview: boolean;
  /** Real responses so far, this one included. Null when the count could not be read. */
  responses: number | null;
}

export interface SurveyResponseEmail {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

const ADMIN_URL = 'https://www.orangejelly.co.uk/admin';

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export function surveyResponseEmail(input: SurveyResponseEmailInput): SurveyResponseEmail {
  const { survey, answers, contact, isPreview } = input;
  const labels = new Map(
    survey.questions.flatMap((q) => q.options.map((o) => [o.key, o.label] as const))
  );

  const volunteer: Array<[string, string]> = contact
    ? [
        ['Name', contact.name],
        ['Business', contact.businessName || 'Not given'],
        ['Email', contact.email],
        ['Said yes to', contact.volunteeredFor.map((key) => labels.get(key) ?? key).join('; ')],
      ]
    : [];

  const answered: Array<[string, string]> = [];
  for (const question of survey.questions) {
    if (question.kind === 'contact') continue;
    const answer = answers[question.key];
    if (answer === undefined) continue;
    const value =
      typeof answer === 'string' ? answer : answer.map((key) => labels.get(key) ?? key).join(', ');
    if (!value) continue;
    answered.push([renderPrompt(survey, question.prompt, answers), value]);
  }

  const context: string[] = [
    `Came from: ${input.source ?? 'direct'}`,
    isPreview
      ? 'This was a preview answer. It is stored apart and never counted.'
      : input.responses !== null
        ? `Real responses so far: ${input.responses}`
        : 'The running count could not be read just now; the admin view has it.',
  ];

  const who = contact ? oneLine(contact.businessName || contact.name) : null;
  const subject =
    (isPreview ? '[Preview] ' : '') +
    (who ? `Survey volunteer: ${who}` : `Survey response: ${oneLine(survey.title)}`);

  const block = (rows: Array<[string, string]>): string[] =>
    rows.map(
      ([label, value]) =>
        `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(value).replace(/\n/g, '<br>')}</p>`
    );

  const html = [
    `<p>${escapeHtml(isPreview ? 'Preview answer to' : 'New answer to')}: <strong>${escapeHtml(survey.title)}</strong></p>`,
    ...(contact ? ['<h3>Volunteer</h3>', ...block(volunteer)] : []),
    '<h3>Answers</h3>',
    ...block(answered),
    ...context.map((line) => `<p>${escapeHtml(line)}</p>`),
    `<p><a href="${ADMIN_URL}">${ADMIN_URL}</a></p>`,
  ].join('\n');

  const text = [
    `${isPreview ? 'Preview answer to' : 'New answer to'}: ${survey.title}`,
    '',
    ...(contact ? ['VOLUNTEER', ...volunteer.map(([l, v]) => `${l}: ${v}`), ''] : []),
    'ANSWERS',
    ...answered.flatMap(([prompt, value]) => [prompt, `  ${value}`]),
    '',
    ...context,
    ADMIN_URL,
  ].join('\n');

  return { subject, html, text, replyTo: contact?.email };
}
