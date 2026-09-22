import { getSupabaseAdminClient, isSupabaseAdminConfigured } from '@/lib/db/supabase-admin';
import {
  type AttendanceMode,
  getOrganiserView,
  type Availability,
  type PollOptionRow,
  type PollRow,
} from '@/lib/db/polls';
import { aggregateByOption, countResponders, type OptionTally } from '@/lib/poll-aggregate';

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
}

export interface OrganiserResultsView {
  poll: PollRow & OrganiserPollExtras;
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
      .select('participant_token, confirm_notify_failures')
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
    },
    options: view.options,
    participants: (participants ?? []) as OrganiserParticipant[],
    responses: view.responses,
    attendance: view.attendance,
    tallies: aggregateByOption(view.options, tallyRows),
    responderCount: countResponders(tallyRows),
  };
}
