import { readFileSync } from 'fs';
import { join } from 'path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The retention promise and the deletion that keeps it.
 *
 * The privacy notice tells volunteers when their details go. This holds the
 * notice's number to the constant the cron uses, and the cron to that constant,
 * so the promise and the behaviour cannot drift apart.
 */

const calls: { lt?: [string, string]; deletedFrom?: string; inIds?: string[] } = {};
let expiredIds: string[] = [];

vi.mock('./supabase-admin', () => ({
  isSupabaseAdminConfigured: () => true,
  getSupabaseAdminClient: () => ({
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          lt: async (column: string, value: string) => {
            calls.lt = [column, value];
            return { data: expiredIds.map((id) => ({ id })), error: null };
          },
        }),
      }),
      delete: () => ({
        in: async (_column: string, ids: string[]) => {
          calls.deletedFrom = table;
          calls.inIds = ids;
          return { count: ids.length, error: null };
        },
      }),
    }),
  }),
}));

import { CONTACT_RETENTION_MONTHS, sweepSurveyContacts } from './surveys';

beforeEach(() => {
  delete calls.lt;
  delete calls.deletedFrom;
  delete calls.inIds;
  expiredIds = [];
});

describe('survey contact retention', () => {
  it('is 24 months, and the privacy notice says the same', () => {
    expect(CONTACT_RETENTION_MONTHS).toBe(24);
    const notice = readFileSync(join(process.cwd(), 'src/app/privacy/page.tsx'), 'utf8');
    expect(notice).toMatch(
      new RegExp(`delete them ${CONTACT_RETENTION_MONTHS} months after that survey closes`)
    );
  });

  it('deletes contacts only from surveys closed more than 24 months ago', async () => {
    expiredIds = ['old-survey'];
    const report = await sweepSurveyContacts(new Date('2026-09-22T03:30:00Z'));

    expect(calls.lt).toEqual(['closed_at', '2024-09-22T03:30:00.000Z']);
    expect(calls.deletedFrom).toBe('survey_contacts');
    expect(calls.inIds).toEqual(['old-survey']);
    expect(report).toEqual({ deleted: 1 });
  });

  it('deletes nothing when no survey is old enough', async () => {
    expect(await sweepSurveyContacts(new Date('2026-09-22T03:30:00Z'))).toEqual({ deleted: 0 });
    expect(calls.deletedFrom).toBeUndefined();
  });
});
