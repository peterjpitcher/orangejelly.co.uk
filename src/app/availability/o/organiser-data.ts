import { getSupabaseAdminClient, isSupabaseAdminConfigured } from '@/lib/db/supabase-admin';
import {
  type AttendanceMode,
  getOrganiserView,
  type Availability,
  type PollOptionRow,
  type PollRow,
} from '@/lib/db/polls';
import { aggregateByOption, countResponders, type OptionTally } from '@/lib/poll-aggregate';
import { listInvitees, type InviteeRow } from '@/lib/db/poll-invitees';

/**
 * Server-side reads for the organiser results screen.
 *
 * These live here rather than in `src/lib/db/polls.ts` for the same reason
 * `../p/poll-data.ts` does: the columns below are needed by one screen, and
 * `PollRow` does not declare them even though `select('*')` returns them.
 * Widening `PollRow` would ripple through every stream's fixtures for no gain.
 *
 * WHY THIS FILE EXISTS: `getOrganiserView` returns the matrix, but not three
 * things this screen needs:
 *   - `participant_token`, for the share block
 *   - `confirm_notify_failures`, for the "we couldn't reach n people" note
 *   - `digest_opt_out`, for the update-emails switch
 *   - `poll_participants.created_at`, to disambiguate duplicate display names
 * It also returns no per-option tallies, which the totals row needs.
 *
 * NOTE ON `organiser_token`: it is deliberately NOT read back or returned here.
 * The page already holds it (it is the URL segment) and a value that never
 * enters a props object cannot be handed to a client component by accident.
 */

/** A row in the matrix: one person, with the name shown against their answers. */
export interface OrganiserParticipant {
  id: string;
  display_name: string;
  /**
   * Disambiguates duplicate display names in the row header's accessible name.
   * Two people called Sarah is the expected case, not the edge case: there are
   * no accounts, so nothing stops it.
   */
  created_at: string;
}

/** The extra poll columns this screen reads by name. */
export interface OrganiserPollExtras {
  participant_token: string;
  /**
   * How many confirmation emails the fan-out could not deliver. An INTEGER,
   * never a list of addresses. See `recordConfirmNotifyFailures`.
   */
  confirm_notify_failures: number;
  /** True when the organiser has turned off the digest and the nudge. */
  digest_opt_out: boolean;
}

/** Where one invited person has got to, as the organiser's list shows it. */
export type InviteeStatus = 'answered' | 'waiting' | 'unsent' | 'stopped';

/** One row of the organiser's invite list. The token is deliberately not carried. */
export interface InviteeListItem {
  id: string;
  email: string;
  status: InviteeStatus;
}

/** Answered wins over everything: someone who replied then opted out still replied. */
export function inviteeStatus(
  row: Pick<InviteeRow, 'participant_id' | 'opted_out_at' | 'invited_at'>
): InviteeStatus {
  if (row.participant_id) return 'answered';
  if (row.opted_out_at) return 'stopped';
  if (!row.invited_at) return 'unsent';
  return 'waiting';
}

export interface OrganiserResultsView {
  poll: PollRow & OrganiserPollExtras;
  /** People invited by email, oldest first. Empty for most polls. */
  invitees: InviteeListItem[];
  options: PollOptionRow[];
  participants: OrganiserParticipant[];
  /** `${participant_id}:${option_id}` -> availability. Absence means "not answered". */
  responses: Record<string, Availability>;
  /** Same key -> attendance, sparse. Present only where someone stated a mode. */
  attendance: Record<string, AttendanceMode>;
  tallies: OptionTally[];
  responderCount: number;
}

/** The key into `responses`. One place, so the page and the tests cannot drift. */
export function answerKey(participantId: string, optionId: string): string {
  return `${participantId}:${optionId}`;
}

/**
 * Whether a poll the organiser token found may be shown. The one home for the
 * rule, so the gate and the results read cannot disagree about which links are
 * dead.
 */
function isLiveOrganiserPoll(poll: Pick<PollRow, 'status' | 'expires_at'>): boolean {
  // A draft has not proved the organiser's address. The link is real but the
  // poll is not live, and saying so would confirm a guess.
  if (poll.status === 'draft') return false;
  // Expiry is applied here rather than left to the periodic sweep, exactly as the
  // vote screen does.
  return new Date(poll.expires_at).getTime() > Date.now();
}

/**
 * Whether an organiser token opens a live poll, from one indexed row.
 *
 * Used by `o/[token]/layout.tsx`, which must decide before anything is sent: the
 * page's skeleton is a Suspense boundary, and once it streams the status is 200
 * whatever happens next. It reads two columns rather than the whole results so
 * the skeleton still covers the slow part.
 */
export async function isLiveOrganiserToken(organiserToken: string): Promise<boolean> {
  if (!isSupabaseAdminConfigured()) return false;

  const { data } = await getSupabaseAdminClient()
    .from('polls')
    .select('status, expires_at')
    .eq('organiser_token', organiserToken)
    .maybeSingle();

  return data ? isLiveOrganiserPoll(data as Pick<PollRow, 'status' | 'expires_at'>) : false;
}

/**
 * Everything the organiser results screen renders.
 *
 * Returns null for an unknown token, an expired poll AND a draft: one outcome,
 * so a token guesser learns nothing from the difference.
 */
export async function getOrganiserResults(
  organiserToken: string
): Promise<OrganiserResultsView | null> {
  if (!isSupabaseAdminConfigured()) return null;

  const view = await getOrganiserView(organiserToken);
  if (!view || !isLiveOrganiserPoll(view.poll)) return null;

  const supabase = getSupabaseAdminClient();

  const [{ data: extras }, { data: participants }, { data: responses }] = await Promise.all([
    supabase
      .from('polls')
      .select('participant_token, confirm_notify_failures, digest_opt_out')
      .eq('id', view.poll.id)
      .maybeSingle(),
    supabase
      .from('poll_participants')
      .select('id, display_name, created_at')
      .eq('poll_id', view.poll.id)
      .order('created_at'),
    supabase
      .from('poll_responses')
      .select('option_id, participant_id, availability')
      .eq('poll_id', view.poll.id),
  ]);

  if (!extras) return null;

  // A failed read of the invite list must not take the results page down with
  // it: the results are the page's job. It is logged, and the list reads empty.
  let invitees: InviteeListItem[] = [];
  try {
    invitees = (await listInvitees(view.poll.id)).map((row) => ({
      id: row.id,
      email: row.email,
      status: inviteeStatus(row),
    }));
  } catch (error) {
    console.error('[polls] Invite list not read:', error instanceof Error ? error.message : error);
  }

  const tallyRows = (responses ?? []) as Array<{
    option_id: string;
    participant_id: string;
    availability: Availability;
  }>;

  return {
    poll: {
      ...view.poll,
      participant_token: extras.participant_token as string,
      confirm_notify_failures: (extras.confirm_notify_failures as number) ?? 0,
      digest_opt_out: extras.digest_opt_out === true,
    },
    invitees,
    options: view.options,
    participants: (participants ?? []) as OrganiserParticipant[],
    responses: view.responses,
    attendance: view.attendance,
    tallies: aggregateByOption(view.options, tallyRows),
    responderCount: countResponders(tallyRows),
  };
}
