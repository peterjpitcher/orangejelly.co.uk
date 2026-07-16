import { describe, expect, it } from 'vitest';

import type { PollStatus } from './db/polls';
import {
  canClose,
  canConfirm,
  canEditResponse,
  canTransition,
  canVote,
  checkTransition,
  isKnownStatus,
} from './poll-state';

/**
 * Every one of the 16 ordered pairs over the 4 statuses is asserted by name:
 * 5 legal, 11 illegal. Deliberately verbose — a reviewer must be able to read
 * the legal edge set off this file without opening the module. A loop over a
 * matrix derived from the implementation would only prove the code agrees with
 * itself.
 */

/** Declared here, independently of the module, so the test is a spec and not an echo. */
const LEGAL: ReadonlyArray<[PollStatus, PollStatus]> = [
  ['draft', 'open'],
  ['open', 'closed'],
  ['closed', 'open'],
  ['open', 'confirmed'],
  ['closed', 'confirmed'],
];

describe('canTransition', () => {
  it('should allow the move when a draft poll is opened', () => {
    expect(canTransition('draft', 'open')).toBe(true);
  });

  it('should allow the move when an open poll is closed', () => {
    expect(canTransition('open', 'closed')).toBe(true);
  });

  it('should allow the move when a closed poll is reopened', () => {
    expect(canTransition('closed', 'open')).toBe(true);
  });

  it('should allow the move when an open poll is confirmed', () => {
    expect(canTransition('open', 'confirmed')).toBe(true);
  });

  it('should allow the move when a closed poll is confirmed', () => {
    expect(canTransition('closed', 'confirmed')).toBe(true);
  });

  it('should refuse the move when a draft poll is closed', () => {
    expect(canTransition('draft', 'closed')).toBe(false);
  });

  it('should refuse the move when a draft poll is confirmed', () => {
    expect(canTransition('draft', 'confirmed')).toBe(false);
  });

  it('should refuse the move when an open poll is returned to draft', () => {
    expect(canTransition('open', 'draft')).toBe(false);
  });

  it('should refuse the move when a closed poll is returned to draft', () => {
    expect(canTransition('closed', 'draft')).toBe(false);
  });

  it('should refuse the move when a confirmed poll is returned to draft', () => {
    expect(canTransition('confirmed', 'draft')).toBe(false);
  });

  it('should refuse the move when a confirmed poll is reopened', () => {
    expect(canTransition('confirmed', 'open')).toBe(false);
  });

  it('should refuse the move when a confirmed poll is closed', () => {
    expect(canTransition('confirmed', 'closed')).toBe(false);
  });

  it('should refuse the move when a confirmed poll is confirmed again', () => {
    // Not idempotent on purpose: a second confirm refires the fan-out.
    expect(canTransition('confirmed', 'confirmed')).toBe(false);
  });

  it('should refuse the move when a draft poll transitions to draft', () => {
    expect(canTransition('draft', 'draft')).toBe(false);
  });

  it('should refuse the move when an open poll transitions to open', () => {
    expect(canTransition('open', 'open')).toBe(false);
  });

  it('should refuse the move when a closed poll transitions to closed', () => {
    expect(canTransition('closed', 'closed')).toBe(false);
  });

  it('should refuse the move when the source status is not a known status', () => {
    // Cast because the value models a row or payload that escaped the type system.
    expect(canTransition('archived' as PollStatus, 'open')).toBe(false);
  });

  it('should refuse the move when the target status is not a known status', () => {
    expect(canTransition('open', 'archived' as PollStatus)).toBe(false);
  });

  it('should permit exactly the five declared edges and no others', () => {
    const permitted = (['draft', 'open', 'closed', 'confirmed'] as const).flatMap((from) =>
      (['draft', 'open', 'closed', 'confirmed'] as const)
        .filter((to) => canTransition(from, to))
        .map((to) => `${from}>${to}`)
    );

    expect(permitted.sort()).toEqual(LEGAL.map(([from, to]) => `${from}>${to}`).sort());
  });
});

describe('checkTransition', () => {
  it('should return a refusal naming both statuses when the transition is illegal', () => {
    const result = checkTransition('confirmed', 'open');

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.reason).toContain('confirmed');
    expect(result.ok === false && result.reason).toContain('open');
  });

  it('should return a refusal rather than throwing when the transition is illegal', () => {
    // The contract callers depend on: server actions return { error }, they do not catch.
    expect(() => checkTransition('draft', 'confirmed')).not.toThrow();
    expect(checkTransition('draft', 'confirmed').ok).toBe(false);
  });

  it('should return a refusal for every illegal transition without throwing', () => {
    const statuses: readonly PollStatus[] = ['draft', 'open', 'closed', 'confirmed'];
    const legal = new Set(LEGAL.map(([from, to]) => `${from}>${to}`));

    for (const from of statuses) {
      for (const to of statuses) {
        if (legal.has(`${from}>${to}`)) {
          continue;
        }
        expect(() => checkTransition(from, to)).not.toThrow();
        expect(checkTransition(from, to).ok).toBe(false);
      }
    }
  });

  it('should return a refusal when the source status is not a known status', () => {
    const result = checkTransition('archived' as PollStatus, 'open');

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.reason).toContain('archived');
  });

  it('should return a refusal when the target status is not a known status', () => {
    const result = checkTransition('open', 'archived' as PollStatus);

    expect(result.ok).toBe(false);
    expect(result.ok === false && result.reason).toContain('archived');
  });

  it('should return success when the transition is legal', () => {
    expect(checkTransition('draft', 'open')).toEqual({ ok: true });
  });

  it('should not throw when the transition is legal', () => {
    for (const [from, to] of LEGAL) {
      expect(() => checkTransition(from, to)).not.toThrow();
      expect(checkTransition(from, to).ok).toBe(true);
    }
  });
});

describe('isKnownStatus', () => {
  it('should accept the value when it is one of the four statuses', () => {
    expect(isKnownStatus('draft')).toBe(true);
    expect(isKnownStatus('open')).toBe(true);
    expect(isKnownStatus('closed')).toBe(true);
    expect(isKnownStatus('confirmed')).toBe(true);
  });

  it('should reject the value when it is not a status string', () => {
    expect(isKnownStatus('archived')).toBe(false);
    expect(isKnownStatus('')).toBe(false);
    expect(isKnownStatus(null)).toBe(false);
    expect(isKnownStatus(undefined)).toBe(false);
    expect(isKnownStatus(3)).toBe(false);
  });
});

describe('canVote', () => {
  it('should allow voting when the poll is open', () => {
    expect(canVote('open')).toBe(true);
  });

  it('should refuse voting when the poll is a draft', () => {
    expect(canVote('draft')).toBe(false);
  });

  it('should refuse voting when the poll is closed', () => {
    expect(canVote('closed')).toBe(false);
  });

  it('should refuse voting when the poll is confirmed', () => {
    expect(canVote('confirmed')).toBe(false);
  });
});

describe('canEditResponse', () => {
  it('should allow an edit when the poll is open', () => {
    expect(canEditResponse('open')).toBe(true);
  });

  it('should refuse an edit when the poll is a draft', () => {
    expect(canEditResponse('draft')).toBe(false);
  });

  it('should refuse an edit when the poll is closed', () => {
    expect(canEditResponse('closed')).toBe(false);
  });

  it('should refuse an edit when the poll is confirmed', () => {
    expect(canEditResponse('confirmed')).toBe(false);
  });
});

describe('canConfirm', () => {
  it('should allow a confirm when the poll is open', () => {
    expect(canConfirm('open')).toBe(true);
  });

  it('should allow a confirm when the poll is closed', () => {
    // Closing stops replies; it does not make the decision.
    expect(canConfirm('closed')).toBe(true);
  });

  it('should refuse a confirm when the poll is a draft', () => {
    expect(canConfirm('draft')).toBe(false);
  });

  it('should refuse a confirm when the poll is already confirmed', () => {
    expect(canConfirm('confirmed')).toBe(false);
  });
});

describe('canClose', () => {
  it('should allow a close when the poll is open', () => {
    expect(canClose('open')).toBe(true);
  });

  it('should refuse a close when the poll is a draft', () => {
    expect(canClose('draft')).toBe(false);
  });

  it('should refuse a close when the poll is already closed', () => {
    expect(canClose('closed')).toBe(false);
  });

  it('should refuse a close when the poll is confirmed', () => {
    expect(canClose('confirmed')).toBe(false);
  });
});
