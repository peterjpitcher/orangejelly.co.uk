import { beforeEach, describe, expect, it, vi } from 'vitest';

import { submitSurvey } from './surveys';
import { getSurveyForVisitor, getSurveyResults, submitSurveyResponse } from '@/lib/db/surveys';
import { sendLeadNotification } from '@/lib/email';
import { checkRateLimit, isRateLimitConfigured } from '@/lib/rate-limit';
import { definitionToSurvey, surveyDefinitionSchema } from '@/lib/surveys/definition';
import type * as RateLimit from '@/lib/rate-limit';
import pubApps from '../../../content/surveys/pub-apps.json';

/**
 * The survey action fails closed: nobody is told their answers arrived unless the
 * row is in the database, and every refusal names a way through.
 */

vi.mock('@/lib/db/surveys', () => ({
  getSurveyForVisitor: vi.fn(),
  submitSurveyResponse: vi.fn(),
  getSurveyResults: vi.fn(),
}));

vi.mock('@/lib/email', () => ({
  sendLeadNotification: vi.fn(),
  escapeHtml: (value: string) => value,
}));

vi.mock('next/headers', () => ({
  headers: () => new Headers({ 'x-forwarded-for': '203.0.113.9' }),
}));

vi.mock('@/lib/rate-limit', async () => {
  const actual = await vi.importActual<typeof RateLimit>('@/lib/rate-limit');
  return {
    ...actual,
    isRateLimitConfigured: vi.fn(() => true),
    checkRateLimit: vi.fn(),
    hashKey: (value: string) => `hashed:${value}`,
  };
});

const SURVEY = {
  ...definitionToSurvey(surveyDefinitionSchema.parse(pubApps)),
  id: 'survey-1',
  status: 'live' as const,
};

const ANSWERS = {
  front: ['events'],
  back: [],
  price: ['price_10_30'],
  pay_model: ['pay_per_tool'],
  venue: ['venue_local'],
  run: ['run_tenant'],
  say: ['say_email'],
  test: ['test_no'],
};

const CONTACT = {
  name: 'Sam Whitfield',
  email: 'sam@testarms.example',
  businessName: 'The Test Arms',
  consent: true,
};

const RID = '3f0c9a52-6d1e-4b8a-9c2d-7e5f1a0b4c6d';

const NOT_SENT =
  "We couldn't send your answers. Please try again in a moment, or email peter@orangejelly.co.uk.";

beforeEach(() => {
  vi.mocked(getSurveyForVisitor).mockReset().mockResolvedValue({ survey: SURVEY, mode: 'live' });
  vi.mocked(submitSurveyResponse).mockReset().mockResolvedValue({ stored: true });
  vi.mocked(getSurveyResults).mockReset().mockResolvedValue({ responses: 3, tallies: [] });
  vi.mocked(sendLeadNotification).mockReset().mockResolvedValue({ success: true });
  vi.mocked(isRateLimitConfigured).mockReset().mockReturnValue(true);
  vi.mocked(checkRateLimit)
    .mockReset()
    .mockResolvedValue({ allowed: true, retryAfterSeconds: 0, reason: 'ok' });
});

describe('submitSurvey', () => {
  it('stores the answers and a volunteer, tells Peter, and returns the results', async () => {
    const result = await submitSurvey({
      slug: 'pub-apps',
      responseId: RID,
      answers: ANSWERS,
      contact: CONTACT,
    });

    expect(result).toEqual({
      success: true,
      results: {
        responses: 3,
        bars: [],
        minResponses: 20,
        heading: 'What the trade has picked so far',
      },
    });
    const stored = vi.mocked(submitSurveyResponse).mock.calls[0][0];
    expect(stored.isPreview).toBe(false);
    expect(stored.answers.top_pick).toEqual(['events']);
    expect(stored.contact).toMatchObject({
      name: 'Sam Whitfield',
      businessName: 'The Test Arms',
      volunteeredFor: ['say_email'],
      consentText: SURVEY.consentText,
    });
    expect(sendLeadNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Survey volunteer: The Test Arms',
        replyTo: 'sam@testarms.example',
      })
    );
    // Rendered with fixture data and checked for the values that have reached
    // real inboxes before.
    const mail = vi.mocked(sendLeadNotification).mock.calls[0][0];
    expect(mail.text).toContain('Said yes to: Yes, email me the odd question');
    expect(mail.text).toContain('Survey: Which tools would make running your pub easier?');
    expect(`${mail.subject}${mail.html}${mail.text}`).not.toMatch(
      /undefined|NaN|Invalid Date|null/
    );
  });

  it('stores the id the browser sent, so a retry is recognised', async () => {
    await submitSurvey({ slug: 'pub-apps', responseId: RID, answers: ANSWERS });
    expect(vi.mocked(submitSurveyResponse).mock.calls[0][0].responseId).toBe(RID);
  });

  it('treats a retry of an already stored attempt as success, without emailing Peter again', async () => {
    vi.mocked(submitSurveyResponse).mockResolvedValue({ stored: true, duplicate: true });
    const result = await submitSurvey({
      slug: 'pub-apps',
      responseId: RID,
      answers: ANSWERS,
      contact: CONTACT,
    });
    expect(result.success).toBe(true);
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it('refuses a submission without a proper response id', async () => {
    expect(
      await submitSurvey({ slug: 'pub-apps', responseId: 'not-a-uuid', answers: ANSWERS })
    ).toEqual({
      error: NOT_SENT,
    });
    expect(submitSurveyResponse).not.toHaveBeenCalled();
  });

  it('FAILS CLOSED: a failed database write is reported to the respondent, never as success', async () => {
    vi.mocked(submitSurveyResponse).mockResolvedValue({ stored: false, reason: 'failed' });
    const result = await submitSurvey({
      slug: 'pub-apps',
      responseId: RID,
      answers: ANSWERS,
      contact: CONTACT,
    });
    expect(result).toEqual({ error: NOT_SENT });
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it('FAILS CLOSED: a database that cannot even load the survey is reported, not swallowed', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(getSurveyForVisitor).mockRejectedValue(new Error('connection refused'));
    expect(await submitSurvey({ slug: 'pub-apps', responseId: RID, answers: ANSWERS })).toEqual({
      error: NOT_SENT,
    });
    expect(submitSurveyResponse).not.toHaveBeenCalled();
    log.mockRestore();
  });

  it('says the limiter is down as a send failure, not as "too many attempts"', async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: false,
      retryAfterSeconds: 0,
      reason: 'unavailable',
    });
    expect(await submitSurvey({ slug: 'pub-apps', responseId: RID, answers: ANSWERS })).toEqual({
      error: NOT_SENT,
    });

    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: false,
      retryAfterSeconds: 60,
      reason: 'limited',
    });
    expect(
      (await submitSurvey({ slug: 'pub-apps', responseId: RID, answers: ANSWERS })).error
    ).toMatch(/Too many attempts/);
    expect(submitSurveyResponse).not.toHaveBeenCalled();
  });

  it('refuses in production when the limiter is not configured at all', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.stubEnv('NODE_ENV', 'production');
    vi.mocked(isRateLimitConfigured).mockReturnValue(false);
    expect(await submitSurvey({ slug: 'pub-apps', responseId: RID, answers: ANSWERS })).toEqual({
      error: NOT_SENT,
    });
    vi.unstubAllEnvs();
    log.mockRestore();
  });

  it('tells a late respondent the survey has closed', async () => {
    vi.mocked(getSurveyForVisitor).mockResolvedValue({
      survey: { ...SURVEY, status: 'closed' },
      mode: 'closed',
    });
    expect(
      (await submitSurvey({ slug: 'pub-apps', responseId: RID, answers: ANSWERS })).error
    ).toMatch(/closed/);

    vi.mocked(getSurveyForVisitor).mockResolvedValue({ survey: SURVEY, mode: 'live' });
    vi.mocked(submitSurveyResponse).mockResolvedValue({ stored: false, reason: 'not_open' });
    expect(
      (await submitSurvey({ slug: 'pub-apps', responseId: RID, answers: ANSWERS })).error
    ).toMatch(/closed/);
  });

  it('keeps contact details only when the contact step was shown', async () => {
    await submitSurvey({
      slug: 'pub-apps',
      responseId: RID,
      answers: { ...ANSWERS, say: ['say_no'], test: ['test_no'] },
      contact: CONTACT,
    });
    expect(vi.mocked(submitSurveyResponse).mock.calls[0][0].contact).toBeUndefined();
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it('asks for the consent tick rather than storing details without it', async () => {
    const result = await submitSurvey({
      slug: 'pub-apps',
      responseId: RID,
      answers: ANSWERS,
      contact: { ...CONTACT, consent: false },
    });
    expect(result.fieldErrors).toEqual({
      consent: 'Tick the box so we can contact you, or skip this step',
    });
    expect(submitSurveyResponse).not.toHaveBeenCalled();
  });

  it('refuses answers the survey never offered', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const result = await submitSurvey({
      slug: 'pub-apps',
      responseId: RID,
      answers: { ...ANSWERS, front: ['free_beer'] },
    });
    expect(result.error).toMatch(/didn't go through/);
    expect(submitSurveyResponse).not.toHaveBeenCalled();
    log.mockRestore();
  });

  it('stores a preview answer flagged, and does not email Peter about his own test', async () => {
    vi.mocked(getSurveyForVisitor).mockResolvedValue({ survey: SURVEY, mode: 'preview' });
    await submitSurvey({
      slug: 'pub-apps',
      responseId: RID,
      previewToken: 'x'.repeat(24),
      answers: ANSWERS,
      contact: CONTACT,
    });
    expect(vi.mocked(submitSurveyResponse).mock.calls[0][0].isPreview).toBe(true);
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it('never turns stored answers into an error: a failed email or results load still succeeds', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(sendLeadNotification).mockResolvedValue({ error: 'Resend is down' });
    vi.mocked(getSurveyResults).mockRejectedValue(new Error('timeout'));
    expect(
      await submitSurvey({ slug: 'pub-apps', responseId: RID, answers: ANSWERS, contact: CONTACT })
    ).toEqual({
      success: true,
      results: null,
    });
    expect(log).toHaveBeenCalledTimes(2);
    log.mockRestore();
  });

  it('answers a honeypot as though it worked, and stores nothing', async () => {
    expect(
      await submitSurvey({
        slug: 'pub-apps',
        responseId: RID,
        answers: ANSWERS,
        subject: 'buy now',
      })
    ).toEqual({
      success: true,
      results: null,
    });
    expect(submitSurveyResponse).not.toHaveBeenCalled();
    expect(checkRateLimit).not.toHaveBeenCalled();
  });

  it('keeps the referrer to a host and drops UTM values that are not labels', async () => {
    await submitSurvey({
      slug: 'pub-apps',
      responseId: RID,
      answers: ANSWERS,
      leadSource: {
        referrer: 'https://m.facebook.com/groups/licensees/posts/123?fbclid=abc',
        utmSource: 'facebook',
        utmCampaign: '<script>',
      },
    });
    const stored = vi.mocked(submitSurveyResponse).mock.calls[0][0];
    expect(stored.referrerHost).toBe('m.facebook.com');
    expect(stored.utmSource).toBe('facebook');
    expect(stored.utmCampaign).toBeUndefined();
  });
});
