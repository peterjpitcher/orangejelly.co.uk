'use client';

import { useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CARD_ON_PAPER } from '@/components/admin/BackOfficeBand';
import { Alert, Button, Field, Input } from '@/components/oj';
import { VALIDATION_MESSAGES } from '@/lib/validation-messages';
import { updateResponse } from '@/app/actions/poll-responses';
import type { AttendanceAnswer, AvailabilityAnswer } from '@/lib/validation/poll-responses';
import OptionCard from './option-card';
import {
  formatReplyCount,
  type DisplayOption,
  type OptionKind,
  type TallyCounts,
} from './poll-display';

/**
 * Editing your own answers.
 *
 * Differs from <VoteForm /> in exactly three ways, per §2.3.1: it mounts with
 * each answer pre-selected from the existing response, its submit calls
 * `updateResponse`, and its button reads "Update my answers". Everything else
 * (the cards, the control, the glyphs, the sticky bar) is the same component.
 *
 * NO EMAIL FIELD, deliberately. `updateResponse` never writes
 * `poll_participants.email` (§3.6.4), so an editable box would take input and
 * silently discard it, and a pre-filled disabled box would be a control that
 * says "changeable" and then is not, while putting the address back on screen
 * on a link that may be open on a shared device. §1 P2.3 and §2.3.1 both say
 * "pre-filled and editable"; that text is contradicted by §3.6.4 and by the
 * shipped data layer, neither of which can write it. Flagged in the handoff.
 *
 * READ-ONLY MODE renders the participant's own answers as disabled radios (§1
 * P2.6). That is sound HERE and wrong on the shared vote link: an edit token
 * identifies exactly one person, so the value shown is genuinely theirs.
 */

export interface EditAnswersFormProps {
  editToken: string;
  optionKind: OptionKind;
  options: DisplayOption[];
  tallies: Record<string, TallyCounts>;
  responderCount: number;
  initialAnswers: Record<string, AvailabilityAnswer>;
  /** Their recorded attendance per option. Sparse; missing reads as in person. */
  initialAttendance: Record<string, AttendanceAnswer>;
  initialDisplayName: string;
  /** Poll closed or confirmed: show the answers, offer no way to change them. */
  readOnly?: boolean;
}

export default function EditAnswersForm({
  editToken,
  optionKind,
  options,
  tallies,
  responderCount,
  initialAnswers,
  initialAttendance,
  initialDisplayName,
  readOnly = false,
}: EditAnswersFormProps): JSX.Element {
  const [answers, setAnswers] = useState<Record<string, AvailabilityAnswer | null>>(() =>
    Object.fromEntries(options.map((option) => [option.id, initialAnswers[option.id] ?? null]))
  );
  const [modes, setModes] = useState<Record<string, AttendanceAnswer>>(() =>
    Object.fromEntries(
      options.map((option) => [option.id, initialAttendance[option.id] ?? 'in_person'])
    )
  );
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unanswered, setUnanswered] = useState<string[]>([]);
  const [updated, setUpdated] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  function answer(optionId: string, value: AvailabilityAnswer): void {
    setAnswers((current) => ({ ...current, [optionId]: value }));
    setUnanswered((current) => current.filter((id) => id !== optionId));
    setUpdated(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (submitting) return;

    const missing = options
      .filter((option) => answers[option.id] == null)
      .map((option) => option.id);
    if (missing.length > 0) {
      setUnanswered(missing);
      setError(VALIDATION_MESSAGES.poll.answerEveryOption);
      errorRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await updateResponse(editToken, {
        displayName,
        website,
        votes: options.map((option) => ({
          optionId: option.id,
          availability: answers[option.id] as AvailabilityAnswer,
          attendance: modes[option.id],
        })),
      });

      if (result.error) {
        // The form state is deliberately NOT cleared on failure. The answers are
        // still on screen and still submittable, which is the difference between
        // "try that again" and "type it all in again".
        setError(result.error);
        errorRef.current?.focus();
        return;
      }

      setUpdated(true);
      window.setTimeout(() => successRef.current?.focus(), 0);
    } catch {
      setError('Your changes were not recorded. Please try again.');
      errorRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  const cards = (
    <div className="space-y-4">
      {options.map((option) => (
        <OptionCard
          key={option.id}
          option={option}
          optionKind={optionKind}
          tally={tallies[option.id] ?? { yes: 0, if_need_be: 0, no: 0 }}
          responderCount={responderCount}
          value={answers[option.id] ?? null}
          onChange={(value) => answer(option.id, value)}
          attendance={modes[option.id] ?? 'in_person'}
          onAttendanceChange={(value) =>
            setModes((current) => ({ ...current, [option.id]: value }))
          }
          disabled={readOnly}
          invalid={unanswered.includes(option.id)}
        />
      ))}
    </div>
  );

  if (readOnly) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-oj-ink-2">{formatReplyCount(responderCount)}</p>
        <p className="text-sm text-oj-ink-2">These are the answers you gave.</p>
        {cards}
      </div>
    );
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <p className="text-sm text-oj-ink-2">{formatReplyCount(responderCount)}</p>

      {cards}

      <div className={`space-y-4 ${CARD_ON_PAPER}`}>
        {/* Field carries the orange asterisk, the "(required)" and the required
            attribute, which the hand-built label and input here each did by hand. */}
        <Field label="Your name" htmlFor="poll-name" required>
          <Input
            id="poll-name"
            name="displayName"
            autoComplete="name"
            maxLength={50}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </Field>

        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
        >
          <label htmlFor="poll-website-edit">Website</label>
          <input
            id="poll-website-edit"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>
      </div>

      <div ref={errorRef} tabIndex={-1} aria-live="assertive" role="alert">
        {/* The wrapper already announces, so the Alert drops its own role. */}
        {error && (
          <Alert tone="danger" role={undefined}>
            {error}
          </Alert>
        )}
      </div>

      {updated && (
        <div
          // Peach, the one warm fill that carries ink at full contrast, with the
          // block's ink border and hard shadow: the same success block the vote
          // screen shows once an answer is in.
          className={'rounded-oj border-1.5 border-oj-ink bg-oj-peach p-5 shadow-press-sm'}
          role="status"
          aria-live="polite"
        >
          <h2
            ref={successRef}
            tabIndex={-1}
            className="font-oj text-lg font-black tracking-[-0.02em] text-oj-ink focus-visible:outline-none"
          >
            Updated
          </h2>
          <p className="mt-1 text-sm text-oj-ink">
            That&rsquo;s your answers changed. This link still works if you need to come back.
          </p>
        </div>
      )}

      <div
        className="sticky bottom-0 z-50 -mx-4 border-t-1.5 border-oj-ink bg-oj-paper/95 px-4 pt-3 backdrop-blur"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={submitting}
          aria-busy={submitting || undefined}
        >
          {submitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
          {submitting ? 'Updating your answers' : 'Update my answers'}
        </Button>
      </div>

      <div aria-hidden="true" className="h-4" />
    </form>
  );
}
