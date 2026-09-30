import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  TOO_MANY_INVITEES,
  addInvitees,
  claimInvitees,
  releaseInvitees,
  findInviteesDueForReminder,
  getInviteByToken,
  getInviteeConfirmationAudience,
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
  for (const method of ['eq', 'is', 'not', 'order', 'lt', 'limit', 'in']) {
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
      upsert: (values: unknown, options: unknown) => {
        writes.push({ table, op: 'upsert', values, filters: [['options', '', options]] });
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
    const inserted = writes.find((write) => write.op === 'upsert')?.values as Row[];
    expect(inserted).toHaveLength(1);
    expect(inserted[0]).toMatchObject({ poll_id: 'poll-1', email: 'alex@example.com' });
    expect(String(inserted[0].invite_token)).toMatch(/^[A-Za-z0-9_-]{22}$/);
  });

  it('should mark someone who already answered through the shared link as answered', async () => {
    rows.poll_participants = [{ id: 'participant-1', email: 'Alex@Example.com' }];

    await addInvitees('poll-1', ['alex@example.com']);

    const inserted = writes.find((write) => write.op === 'upsert')?.values as Row[];
    expect(inserted[0].participant_id).toBe('participant-1');
    // Matched by address, which anyone could type: it never unlocks editing.
    expect(inserted[0].answered_via).toBe('email');
  });

  it('should skip an address added twice at once rather than fail the whole list', async () => {
    await addInvitees('poll-1', ['alex@example.com']);

    const upsert = writes.find((write) => write.op === 'upsert');
    expect(upsert?.filters[0][2]).toEqual({ onConflict: 'poll_id,email', ignoreDuplicates: true });
  });

  it('should refuse a list that takes the poll past the cap, writing nothing', async () => {
    rows.poll_invitees = Array.from({ length: MAX_INVITEES_PER_POLL }, (_, i) => ({
      email: `p${i}@example.com`,
    }));

    const result = await addInvitees('poll-1', ['new@example.com']);

    expect(result).toEqual({ stored: false, error: TOO_MANY_INVITEES });
    expect(writes.some((write) => write.op === 'upsert')).toBe(false);
  });

  it('should treat a list of people already invited as nothing to do', async () => {
    rows.poll_invitees = [{ email: 'sam@example.com' }];

    const result = await addInvitees('poll-1', ['sam@example.com']);

    expect(result).toEqual({ stored: true, data: { added: [], alreadyInvited: 1 } });
    expect(writes.some((write) => write.op === 'upsert')).toBe(false);
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
    expect(writes[0].values).toEqual({ participant_id: 'participant-1', answered_via: 'link' });
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

  it('should hand back the edit token once they have answered through their link', async () => {
    single = {
      poll_invitees: { ...invitee, participant_id: 'participant-1', answered_via: 'link' },
      polls: livePoll,
      poll_participants: { edit_token: 'etok' },
    };

    expect((await getInviteByToken('itok'))?.editToken).toBe('etok');
  });

  it('should never hand out the edit token for an answer matched only by address', async () => {
    // Someone on the shared link typed this person's address. Their invite link
    // must not open that stranger's answer, nor stop them giving their own.
    single = {
      poll_invitees: { ...invitee, participant_id: 'participant-1', answered_via: 'email' },
      polls: livePoll,
      poll_participants: { edit_token: 'etok' },
    };

    expect((await getInviteByToken('itok'))?.editToken).toBeNull();
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

describe('findInviteesDueForReminder', () => {
  const NOW = new Date('2026-10-05T02:00:00.000Z');
  const hoursFromNow = (hours: number) =>
    new Date(NOW.getTime() + hours * 60 * 60 * 1000).toISOString();

  function candidate(id: string, invitedHoursAgo: number, deadline: string | null): Row {
    return {
      id,
      poll_id: 'poll-1',
      email: `${id}@example.com`,
      invite_token: `${id}-token`,
      participant_id: null,
      invited_at: hoursFromNow(-invitedHoursAgo),
      reminded_at: null,
      opted_out_at: null,
      created_at: hoursFromNow(-invitedHoursAgo),
      polls: { status: 'open', entries_close_at: deadline },
    };
  }

  it('should remind when the deadline is within two days', async () => {
    rows.poll_invitees = [candidate('soon', 30, hoursFromNow(40))];

    const due = await findInviteesDueForReminder(40, NOW);

    expect(due.map((row) => row.id)).toEqual(['soon']);
    // The embedded poll is the query's business, not the caller's.
    expect(due[0]).not.toHaveProperty('polls');
  });

  it('should wait while the deadline is more than two days off', async () => {
    rows.poll_invitees = [candidate('later', 30, hoursFromNow(60))];

    expect(await findInviteesDueForReminder(40, NOW)).toEqual([]);
  });

  it('should not remind about a deadline that has passed', async () => {
    rows.poll_invitees = [candidate('late', 72, hoursFromNow(-1))];

    expect(await findInviteesDueForReminder(40, NOW)).toEqual([]);
  });

  it('should remind three days after the invitation when there is no deadline', async () => {
    rows.poll_invitees = [candidate('old', 73, null), candidate('recent', 48, null)];

    const due = await findInviteesDueForReminder(40, NOW);

    expect(due.map((row) => row.id)).toEqual(['old']);
  });

  it('should send the nearest deadlines first when more are due than the limit', async () => {
    rows.poll_invitees = [
      candidate('no-deadline', 80, null),
      candidate('far', 30, hoursFromNow(47)),
      candidate('near', 30, hoursFromNow(5)),
    ];

    const due = await findInviteesDueForReminder(2, NOW);

    expect(due.map((row) => row.id)).toEqual(['near', 'far']);
  });
});

describe('getInviteeConfirmationAudience', () => {
  it('should list invitees who were sent an invitation and never answered or stopped', async () => {
    rows.poll_invitees = [
      { email: 'waiting@example.com', participant_id: null, invited_at: 'x', opted_out_at: null },
      { email: 'answered@example.com', participant_id: 'p1', invited_at: 'x', opted_out_at: null },
      { email: 'unsent@example.com', participant_id: null, invited_at: null, opted_out_at: null },
      { email: 'stopped@example.com', participant_id: null, invited_at: 'x', opted_out_at: 'y' },
    ];

    const audience = await getInviteeConfirmationAudience('poll-1');

    expect(audience.unanswered).toEqual(['waiting@example.com']);
    expect([...audience.stopped]).toEqual(['stopped@example.com']);
  });

  it('should also stop the address an opted-out invitee answered under', async () => {
    rows.poll_invitees = [
      { email: 'invited@example.com', participant_id: 'p1', invited_at: 'x', opted_out_at: 'y' },
    ];
    rows.poll_participants = [{ email: 'Other@Example.com' }];

    const audience = await getInviteeConfirmationAudience('poll-1');

    expect(audience.stopped.has('invited@example.com')).toBe(true);
    expect(audience.stopped.has('other@example.com')).toBe(true);
  });
});

describe('claimInvitees and releaseInvitees', () => {
  it('should claim only rows still unsent, unanswered and not opted out', async () => {
    rows.poll_invitees = [{ id: 'a' }];

    const won = await claimInvitees(['a', 'b'], '2026-09-30T12:00:00.000Z');

    expect([...won]).toEqual(['a']);
    expect(writes[0].values).toEqual({ invited_at: '2026-09-30T12:00:00.000Z' });
    expect(writes[0].filters).toEqual([
      ['in', 'id', ['a', 'b']],
      ['is', 'invited_at', null],
      ['is', 'participant_id', null],
      ['is', 'opted_out_at', null],
    ]);
  });

  it('should release only its own claim, never a later one', async () => {
    await releaseInvitees(['a'], '2026-09-30T12:00:00.000Z');

    expect(writes[0].values).toEqual({ invited_at: null });
    expect(writes[0].filters).toEqual([
      ['in', 'id', ['a']],
      ['eq', 'invited_at', '2026-09-30T12:00:00.000Z'],
    ]);
  });

  it('should do nothing for an empty list', async () => {
    expect(await claimInvitees([], 'x')).toEqual(new Set());
    await releaseInvitees([], 'x');
    expect(writes).toEqual([]);
  });
});
