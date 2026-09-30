import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  TOO_MANY_INVITEES,
  addInvitees,
  getInviteByToken,
  linkInviteeToParticipant,
} from './poll-invitees';
import { MAX_INVITEES_PER_POLL } from '@/lib/validation/poll-invitees';

/**
 * The invite list's data layer, against a mocked Supabase that records every
 * filter and write, so the queries' intent is what is asserted.
 */

type Row = Record<string, unknown>;

let rows: Record<string, Row[]> = {};
let single: Record<string, Row | null> = {};
let writes: Array<{
  table: string;
  op: string;
  values?: unknown;
  filters: Array<[string, string, unknown]>;
}> = [];

function query(table: string, op: string, values?: unknown): Record<string, unknown> {
  const filters: Array<[string, string, unknown]> = [];
  const self: Record<string, unknown> = {};
  for (const method of ['eq', 'is', 'not', 'order']) {
    self[method] = (column: string, value: unknown) => {
      filters.push([method, column, value]);
      return self;
    };
  }
  self.select = () => {
    if (op === 'insert') {
      return Promise.resolve({ data: values, error: null });
    }
    return self;
  };
  self.maybeSingle = () => {
    if (op !== 'select') writes.push({ table, op, values, filters });
    return Promise.resolve({ data: single[table] ?? null, error: null });
  };
  self.then = (resolve: (value: unknown) => unknown) => {
    if (op !== 'select') writes.push({ table, op, values, filters });
    return Promise.resolve({ data: rows[table] ?? [], error: null }).then(resolve);
  };
  return self;
}

vi.mock('./supabase-admin', () => ({
  isSupabaseAdminConfigured: () => true,
  getSupabaseAdminClient: () => ({
    from: (table: string) => ({
      select: () => query(table, 'select'),
      insert: (values: unknown) => {
        writes.push({ table, op: 'insert', values, filters: [] });
        return query(table, 'insert', values);
      },
      update: (values: unknown) => query(table, 'update', values),
      delete: () => query(table, 'delete'),
    }),
  }),
}));

beforeEach(() => {
  rows = {};
  single = {};
  writes = [];
});

describe('addInvitees', () => {
  it('should add new people with their own tokens and skip anyone already on the list', async () => {
    rows.poll_invitees = [{ email: 'sam@example.com' }];

    const result = await addInvitees('poll-1', ['Sam@Example.com', 'alex@example.com']);

    expect(result.stored).toBe(true);
    expect(result.data?.alreadyInvited).toBe(1);
    const inserted = writes.find((write) => write.op === 'insert')?.values as Row[];
    expect(inserted).toHaveLength(1);
    expect(inserted[0]).toMatchObject({ poll_id: 'poll-1', email: 'alex@example.com' });
    expect(String(inserted[0].invite_token)).toMatch(/^[A-Za-z0-9_-]{22}$/);
  });

  it('should mark someone who already answered through the shared link as answered', async () => {
    rows.poll_participants = [{ id: 'participant-1', email: 'Alex@Example.com' }];

    await addInvitees('poll-1', ['alex@example.com']);

    const inserted = writes.find((write) => write.op === 'insert')?.values as Row[];
    expect(inserted[0].participant_id).toBe('participant-1');
  });

  it('should refuse a list that takes the poll past the cap, writing nothing', async () => {
    rows.poll_invitees = Array.from({ length: MAX_INVITEES_PER_POLL }, (_, i) => ({
      email: `p${i}@example.com`,
    }));

    const result = await addInvitees('poll-1', ['new@example.com']);

    expect(result).toEqual({ stored: false, error: TOO_MANY_INVITEES });
    expect(writes.some((write) => write.op === 'insert')).toBe(false);
  });

  it('should treat a list of people already invited as nothing to do', async () => {
    rows.poll_invitees = [{ email: 'sam@example.com' }];

    const result = await addInvitees('poll-1', ['sam@example.com']);

    expect(result).toEqual({ stored: true, data: { added: [], alreadyInvited: 1 } });
    expect(writes.some((write) => write.op === 'insert')).toBe(false);
  });
});

describe('linkInviteeToParticipant', () => {
  it('should link by invite token within the poll when there is one', async () => {
    await linkInviteeToParticipant({
      pollId: 'poll-1',
      participantId: 'participant-1',
      inviteToken: 'itok',
      email: 'sam@example.com',
    });

    expect(writes).toHaveLength(1);
    expect(writes[0].values).toEqual({ participant_id: 'participant-1' });
    expect(writes[0].filters).toEqual([
      ['eq', 'poll_id', 'poll-1'],
      ['eq', 'invite_token', 'itok'],
    ]);
  });

  it('should otherwise link by address, and only someone not already linked', async () => {
    await linkInviteeToParticipant({
      pollId: 'poll-1',
      participantId: 'participant-1',
      email: ' Sam@Example.com ',
    });

    expect(writes[0].filters).toEqual([
      ['eq', 'poll_id', 'poll-1'],
      ['eq', 'email', 'sam@example.com'],
      ['is', 'participant_id', null],
    ]);
  });

  it('should do nothing with neither a token nor an address', async () => {
    await linkInviteeToParticipant({ pollId: 'poll-1', participantId: 'participant-1' });

    expect(writes).toEqual([]);
  });
});

describe('getInviteByToken', () => {
  const invitee = {
    id: 'invitee-1',
    poll_id: 'poll-1',
    email: 'sam@example.com',
    invite_token: 'itok',
    participant_id: null,
    invited_at: null,
    reminded_at: null,
    opted_out_at: null,
    created_at: '2026-09-30T10:00:00.000Z',
  };
  const livePoll = {
    id: 'poll-1',
    title: 'Quiz',
    status: 'open',
    option_kind: 'dates',
    participant_token: 'ptok',
    closes_at: null,
    expires_at: new Date(Date.now() + 86_400_000).toISOString(),
  };

  it('should resolve a live poll', async () => {
    single = { poll_invitees: invitee, polls: livePoll };

    const view = await getInviteByToken('itok');

    expect(view?.poll.participant_token).toBe('ptok');
    expect(view?.editToken).toBeNull();
  });

  it('should hand back the edit token once they have answered', async () => {
    single = {
      poll_invitees: { ...invitee, participant_id: 'participant-1' },
      polls: livePoll,
      poll_participants: { edit_token: 'etok' },
    };

    expect((await getInviteByToken('itok'))?.editToken).toBe('etok');
  });

  it('should treat a draft or an expired poll exactly like an unknown link', async () => {
    single = { poll_invitees: invitee, polls: { ...livePoll, status: 'draft' } };
    expect(await getInviteByToken('itok')).toBeNull();

    single = {
      poll_invitees: invitee,
      polls: { ...livePoll, expires_at: new Date(Date.now() - 1000).toISOString() },
    };
    expect(await getInviteByToken('itok')).toBeNull();

    single = {};
    expect(await getInviteByToken('itok')).toBeNull();
  });
});
