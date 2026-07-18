'use client';

import { useRef, useState } from 'react';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
 * `updateResponse`, and its button reads "Update my answers". Everything else —
 * the cards, the control, the glyphs, the sticky bar — is the same component.
 *
 * NO EMAIL FIELD, deliberately. `updateResponse` never writes
 * `poll_participants.email` (§3.6.4), so an editable box would take input and
 * silently discard it, and a pre-filled disabled box would be a control that
 * says "changeable" and then is not — while putting the address back on screen
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
        <Text size="sm" color="muted">
          {formatReplyCount(responderCount)}
        </Text>
        <Text size="sm" color="muted">
          These are the answers you gave.
        </Text>
        {cards}
      </div>
    );
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <Text size="sm" color="muted">
        {formatReplyCount(responderCount)}
      </Text>

      {cards}

      <div className="space-y-4 rounded-lg border-2 border-charcoal/15 bg-white p-4">
        <div>
          <Label htmlFor="poll-name">
            Your name <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </Label>
          <Input
            id="poll-name"
            name="displayName"
            className="mt-1 h-11"
            required
            autoComplete="name"
            maxLength={50}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </div>

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
        {error && (
          <div className="rounded-lg border-2 border-destructive bg-white p-3">
            <Text size="sm" className="font-medium text-destructive">
              {error}
            </Text>
          </div>
        )}
      </div>

      {updated && (
        <div
          className="rounded-lg border-2 border-orange bg-orange-light p-4"
          role="status"
          aria-live="polite"
        >
          <h2
            ref={successRef}
            tabIndex={-1}
            className="text-lg font-semibold text-charcoal focus-visible:outline-none"
          >
            Updated
          </h2>
          <Text size="sm" color="charcoal" className="mt-1">
            That&rsquo;s your answers changed. This link still works if you need to come back.
          </Text>
        </div>
      )}

      <div
        className="sticky bottom-0 z-50 -mx-4 border-t border-charcoal/15 bg-white/95 px-4 pt-3 backdrop-blur"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <Button type="submit" variant="primary" size="large" fullWidth loading={submitting}>
          {submitting ? 'Updating your answers' : 'Update my answers'}
        </Button>
      </div>

      <div aria-hidden="true" className="h-4" />
    </form>
  );
}
