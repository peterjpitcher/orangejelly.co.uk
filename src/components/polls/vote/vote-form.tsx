'use client';

import { useRef, useState } from 'react';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VALIDATION_MESSAGES } from '@/lib/validation-messages';
import { submitResponse } from '@/app/actions/poll-responses';
import type { AttendanceAnswer, AvailabilityAnswer } from '@/lib/validation/poll-responses';
import OptionCard from './option-card';
import EditLinkPanel from './edit-link-panel';
import {
  formatReplyCount,
  type DisplayOption,
  type OptionKind,
  type TallyCounts,
} from './poll-display';

/**
 * The vote form: name, email, one card per option, submit.
 *
 * NO ANSWER IS PRESELECTED. Every option starts `null` and must be chosen
 * explicitly. Defaulting to "if need be" would be the tool inventing
 * availability on someone's behalf and then reporting it as though they gave it.
 * An unanswered option is refused at submit, not guessed at.
 */

export interface VoteFormProps {
  participantToken: string;
  optionKind: OptionKind;
  options: DisplayOption[];
  tallies: Record<string, TallyCounts>;
  responderCount: number;
  organiserName: string;
}

type AnswerState = Record<string, AvailabilityAnswer | null>;
type AttendanceState = Record<string, AttendanceAnswer>;

export default function VoteForm({
  participantToken,
  optionKind,
  options,
  tallies,
  responderCount,
  organiserName,
}: VoteFormProps): JSX.Element {
  const [answers, setAnswers] = useState<AnswerState>(() =>
    Object.fromEntries(options.map((option) => [option.id, null]))
  );
  // In person by default: the pub is the usual venue, and the video link is the
  // exception worth flagging. Unlike the answer itself, a default here cannot
  // fake availability nobody gave; at worst it understates a preference.
  const [modes, setModes] = useState<AttendanceState>(() =>
    Object.fromEntries(options.map((option) => [option.id, 'in_person']))
  );
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unanswered, setUnanswered] = useState<string[]>([]);
  const [editUrl, setEditUrl] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const emptyPoll = options.length === 0;

  function answer(optionId: string, value: AvailabilityAnswer): void {
    setAnswers((current) => ({ ...current, [optionId]: value }));
    setUnanswered((current) => current.filter((id) => id !== optionId));
  }

  function setMode(optionId: string, value: AttendanceAnswer): void {
    setModes((current) => ({ ...current, [optionId]: value }));
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
      const result = await submitResponse(participantToken, {
        displayName,
        email,
        website,
        votes: options.map((option) => ({
          optionId: option.id,
          // Proven non-null by the guard above; the cast keeps the wire type honest.
          availability: answers[option.id] as AvailabilityAnswer,
          attendance: modes[option.id],
        })),
      });

      if (result.error) {
        setError(result.error);
        errorRef.current?.focus();
        return;
      }

      if (result.editUrl) {
        setEditUrl(result.editUrl);
        return;
      }

      // A honeypot hit returns `{ success: true }` with no editUrl. Nothing was
      // written and nothing should be shown — a bot gets a plain thank-you.
      setEditUrl('');
    } catch {
      setError('Your answer was not recorded. Please try again.');
      errorRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  if (editUrl !== null) {
    return <EditLinkPanel editUrl={editUrl} />;
  }

  if (emptyPoll) {
    return (
      <div className="rounded-lg border-2 border-charcoal/15 bg-white p-6" role="status">
        <Text color="muted">
          This poll has no times on it yet. {organiserName} will need to add some before you can
          answer.
        </Text>
      </div>
    );
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <Text size="sm" color="muted">
        {formatReplyCount(responderCount)}
      </Text>

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
            onAttendanceChange={(value) => setMode(option.id, value)}
            invalid={unanswered.includes(option.id)}
          />
        ))}
      </div>

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

        <div>
          <Label htmlFor="poll-email">Your email *</Label>
          <Input
            id="poll-email"
            name="email"
            type="email"
            className="mt-1 h-11"
            autoComplete="email"
            maxLength={254}
            aria-describedby="poll-email-help"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Text size="sm" color="muted" className="mt-1" id="poll-email-help">
            So we can tell you the time once it&rsquo;s picked, and send you the calendar invite.
            That&rsquo;s the only thing it&rsquo;s used for.
          </Text>
        </div>

        {/* Honeypot. Hidden from people, irresistible to bots. Not `display:none`
            on the field alone — some bots skip those — and never tab-reachable. */}
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
        >
          <label htmlFor="poll-website">Website</label>
          <input
            id="poll-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>
      </div>

      <div
        ref={errorRef}
        tabIndex={-1}
        aria-live="assertive"
        className="focus-visible:outline-none"
        role="alert"
      >
        {error && (
          <div className="rounded-lg border-2 border-destructive bg-white p-3">
            <Text size="sm" className="font-medium text-destructive">
              {error}
            </Text>
          </div>
        )}
      </div>

      <div
        className="sticky bottom-0 z-50 -mx-4 border-t border-charcoal/15 bg-white/95 px-4 pt-3 backdrop-blur"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <Button type="submit" variant="primary" size="large" fullWidth loading={submitting}>
          {submitting ? 'Sending your answer' : 'Send my answer'}
        </Button>
      </div>

      {/* Keeps the last card clear of the sticky bar on a short viewport. */}
      <div aria-hidden="true" className="h-4" />
    </form>
  );
}
