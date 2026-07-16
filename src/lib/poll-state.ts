import type { PollStatus } from './db/polls';

/**
 * The poll lifecycle, as edges rather than as a set of states.
 *
 * The database CHECK constraint on `polls.status` enforces which statuses may
 * exist; nothing in Postgres enforces which moves between them are permitted.
 * That gap is the whole reason this module exists.
 *
 * Pure by design: no I/O, no framework. Callers are server actions that return
 * `{ error }` to a user, so every refusal here is a value, never an exception.
 */

const KNOWN_STATUSES: readonly PollStatus[] = ['draft', 'open', 'closed', 'confirmed'];

/**
 * The complete legal edge set. Anything absent is refused.
 *
 * `confirmed` appears only as a destination: it is terminal. There is no route
 * back because twenty people already hold the date, and quietly unwinding that
 * is worse than the problem re-opening would solve. A second `confirmed` is
 * illegal rather than idempotent — it would refire the fan-out and mail
 * everyone twice.
 *
 * `draft` appears only as a source: an unverified poll must not reach `closed`
 * or `confirmed` without first proving the organiser's address.
 */
const LEGAL_TRANSITIONS: ReadonlyArray<readonly [PollStatus, PollStatus]> = [
  ['draft', 'open'],
  ['open', 'closed'],
  ['closed', 'open'],
  ['open', 'confirmed'],
  ['closed', 'confirmed'],
];

const LEGAL_EDGES: ReadonlySet<string> = new Set(
  LEGAL_TRANSITIONS.map(([from, to]) => `${from}>${to}`)
);

/** The outcome of a transition check. A refusal carries a reason to surface. */
export type TransitionResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: string };

/**
 * Guards the boundary where a status arrives from outside TypeScript's reach —
 * a database row, a form field, a JSON body. The static type is a promise, not
 * a runtime fact.
 */
export function isKnownStatus(value: unknown): value is PollStatus {
  return typeof value === 'string' && (KNOWN_STATUSES as readonly string[]).includes(value);
}

/** True only for the five legal edges. Unknown statuses are refused, not thrown on. */
export function canTransition(from: PollStatus, to: PollStatus): boolean {
  if (!isKnownStatus(from) || !isKnownStatus(to)) {
    return false;
  }

  return LEGAL_EDGES.has(`${from}>${to}`);
}

/**
 * The same rule as `canTransition`, but with a reason attached.
 *
 * Server actions return `{ error }` rather than catching, so an illegal move
 * has to come back as a value they can hand straight to the caller.
 */
export function checkTransition(from: PollStatus, to: PollStatus): TransitionResult {
  if (!isKnownStatus(from)) {
    return { ok: false, reason: `Unknown poll status: ${String(from)}.` };
  }

  if (!isKnownStatus(to)) {
    return { ok: false, reason: `Unknown poll status: ${String(to)}.` };
  }

  if (!canTransition(from, to)) {
    return { ok: false, reason: `A poll cannot move from ${from} to ${to}.` };
  }

  return { ok: true };
}

/**
 * Voting is live only while the poll is open.
 *
 * `draft` has not verified the organiser, `closed` has stopped replies, and
 * `confirmed` has a decision. Hiding the form is not enough — the actions
 * re-check this server-side, because a request can arrive from anywhere.
 */
export function canVote(status: PollStatus): boolean {
  return status === 'open';
}

/** Editing an existing answer is voting by another name, so it follows the same rule. */
export function canEditResponse(status: PollStatus): boolean {
  return status === 'open';
}

/**
 * An organiser may pick a time from an open poll or a closed one.
 *
 * Closed still permits it because closing only stops replies; it does not make
 * the decision. This stays true even when every answer is a no — the organiser
 * may need a time regardless, and the tool does not overrule them.
 */
export function canConfirm(status: PollStatus): boolean {
  return status === 'open' || status === 'closed';
}

/** Only an open poll can be closed. Closing a closed poll is a no-op the action absorbs, not an edge. */
export function canClose(status: PollStatus): boolean {
  return status === 'open';
}
