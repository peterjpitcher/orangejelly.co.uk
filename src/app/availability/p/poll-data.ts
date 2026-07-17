import { getSupabaseAdminClient, isSupabaseAdminConfigured } from '@/lib/db/supabase-admin';
import {
  getParticipantView,
  type AttendanceMode,
  type PollOptionRow,
  type PollRow,
  type Availability,
} from '@/lib/db/polls';
import { aggregateByOption, countResponders, type OptionTally } from '@/lib/poll-aggregate';

/**
 * Server-side reads for the participant screens.
 *
 * These live here rather than in `src/lib/db/polls.ts` because this stream does
 * not own that file. Two of them would ideally move there once the streams are
 * integrated — see the handoff note.
 *
 * WHY THIS FILE EXISTS AT ALL — `getParticipantView` collapses the tallies to
 * `Record<optionId, yesPlusIfNeedBe>`, which cannot render "4 yes · 1 if need be
 * · 2 no" (§1 P1.6, P3.1). The per-state breakdown needs the raw answers, which
 * that function reads and then discards. So the breakdown is read here and run
 * through `aggregateByOption`, whose `OptionTally` type deliberately carries no
 * participant identifier — it is handed to participants and must not be able to
 * carry one.
 *
 * NOTHING HERE MAY RETURN WHO VOTED WHAT on the shared participant link. The
 * only per-person answers this module returns are a participant's OWN answers,
 * reached through their own edit token (`getEditView`).
 */

/** What the vote screen renders. Aggregates only — never a name against a vote. */
export interface VoteView {
  poll: PollRow;
  options: PollOptionRow[];
  tallies: OptionTally[];
  responderCount: number;
}

/** The poll fields the edit screen and the update action both need. */
export interface EditPollRef {
  id: string;
  status: PollRow['status'];
  option_kind: PollRow['option_kind'];
  title: string;
  description: string | null;
  location: string | null;
  agenda: string | null;
  organiser_name: string;
  confirmed_option_id: string | null;
  closes_at: string | null;
  expires_at: string;
  /**
   * Selected explicitly: `PollRow` does not declare it, even though `select('*')`
   * returns it. Needed only to revalidate the vote path after an edit.
   */
  participant_token: string;
}

export interface ResolvedEditParticipant {
  participantId: string;
  displayName: string;
  poll: EditPollRef;
  options: PollOptionRow[];
}

/** A participant's own answers, plus everything the edit screen renders. */
export interface EditView extends ResolvedEditParticipant {
  /** option_id -> this participant's answer. Their own, and only their own. */
  answers: Record<string, Availability>;
  /** Their own attendance per option, where one was recorded. Sparse. */
  attendance: Record<string, AttendanceMode>;
  tallies: OptionTally[];
  responderCount: number;
}

/**
 * Reads the per-state breakdown for one poll.
 *
 * `participant_id` is selected because `aggregateByOption` needs it to count a
 * responder once per option and to dedupe. It never leaves this module — the
 * `OptionTally[]` that comes back has no identity on it.
 */
async function readTallies(
  pollId: string,
  options: readonly PollOptionRow[]
): Promise<{ tallies: OptionTally[]; responderCount: number }> {
  const supabase = getSupabaseAdminClient();

  const { data } = await supabase
    .from('poll_responses')
    .select('option_id, participant_id, availability')
    .eq('poll_id', pollId);

  const responses = (data ?? []) as Array<{
    option_id: string;
    participant_id: string;
    availability: Availability;
  }>;

  return {
    tallies: aggregateByOption(options, responses),
    responderCount: countResponders(responses),
  };
}

/**
 * The vote screen's data.
 *
 * Returns null for an unknown token AND for a draft poll — `getParticipantView`
 * makes no distinction, which is the point: a draft link is real but not live,
 * and saying so would confirm a guess (§1 E7).
 */
export async function getVoteView(participantToken: string): Promise<VoteView | null> {
  if (!isSupabaseAdminConfigured()) return null;

  const view = await getParticipantView(participantToken);
  if (!view) return null;

  // Expiry is enforced at render, not left to the periodic sweep (§1 O9.6).
  if (new Date(view.poll.expires_at).getTime() <= Date.now()) return null;

  const { tallies, responderCount } = await readTallies(view.poll.id, view.options);

  return { poll: view.poll, options: view.options, tallies, responderCount };
}

/**
 * Resolves an edit token to its participant, their poll and its options.
 *
 * The edit token is the whole capability. The `[token]` segment in the URL is
 * decoration: it is not read, not compared and not trusted (§1 P2.5).
 */
export async function resolveEditParticipant(
  editToken: string
): Promise<ResolvedEditParticipant | null> {
  if (!isSupabaseAdminConfigured()) return null;

  const supabase = getSupabaseAdminClient();

  const { data: participant } = await supabase
    .from('poll_participants')
    .select('id, poll_id, display_name')
    .eq('edit_token', editToken)
    .maybeSingle();

  if (!participant) return null;

  const { data: poll } = await supabase
    .from('polls')
    .select(
      'id, status, option_kind, title, description, location, agenda, organiser_name, confirmed_option_id, closes_at, expires_at, participant_token'
    )
    .eq('id', participant.poll_id)
    .maybeSingle();

  // A draft is treated as absent here too, for the same reason as the vote
  // screen: the link is real but the poll is not live.
  if (!poll || poll.status === 'draft') return null;

  const { data: options } = await supabase
    .from('poll_options')
    .select('*')
    .eq('poll_id', poll.id)
    .order('position');

  return {
    participantId: participant.id,
    displayName: participant.display_name,
    poll: poll as EditPollRef,
    options: (options ?? []) as PollOptionRow[],
  };
}

/** The edit screen's data: the participant's own answers, plus the aggregates. */
export async function getEditView(editToken: string): Promise<EditView | null> {
  const resolved = await resolveEditParticipant(editToken);
  if (!resolved) return null;

  if (new Date(resolved.poll.expires_at).getTime() <= Date.now()) return null;

  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from('poll_responses')
    .select('option_id, availability, attendance')
    .eq('participant_id', resolved.participantId);

  const answers: Record<string, Availability> = {};
  const attendance: Record<string, AttendanceMode> = {};
  for (const row of (data ?? []) as Array<{
    option_id: string;
    availability: Availability;
    attendance: AttendanceMode | null;
  }>) {
    answers[row.option_id] = row.availability;
    if (row.attendance) attendance[row.option_id] = row.attendance;
  }

  const { tallies, responderCount } = await readTallies(resolved.poll.id, resolved.options);

  return { ...resolved, answers, attendance, tallies, responderCount };
}
