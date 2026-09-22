'use client';

import * as React from 'react';
import Link from 'next/link';

import { Alert, Button, Checkbox, Field, Input, Textarea } from '@/components/oj';
import { submitSurvey } from '@/app/actions/surveys';
import { getBrowserLeadSource } from '@/lib/lead-source';
import type { SurveyResultsView } from '@/lib/schemas/survey';
import { surveyIcon } from '@/lib/surveys/icons';
import {
  effectiveAnswers,
  renderPrompt,
  resolveOptions,
  visibleQuestions,
  type Answer,
  type Survey,
  type SurveyQuestion,
} from '@/lib/surveys/logic';
import { trackClientEvent } from '@/lib/tracking';
import { cn } from '@/lib/utils';

import SurveyShare from './SurveyShare';

/**
 * The survey itself: one question per screen, BuzzFeed pace.
 *
 * A tap on a single-choice answer is the answer and moves on; there is no "Next"
 * to find. Pick-several screens and free text have a button, because there the
 * respondent decides when they are done.
 *
 * Every rule about what shows next comes from src/lib/surveys/logic.ts, which the
 * server runs again on submit, so the browser can never send an answer the server
 * would not have asked for.
 */

interface SurveyPlayerProps {
  survey: Survey;
  previewToken?: string;
  /** The survey's public URL, without query, for the share buttons. */
  shareUrl: string;
}

interface ContactDraft {
  name: string;
  email: string;
  businessName: string;
  consent: boolean;
}

type Stage = { kind: 'asking'; key: string } | { kind: 'done'; results: SurveyResultsView | null };

/** Long enough to see the tile change, short enough to feel instant. */
const ADVANCE_DELAY_MS = 180;

/**
 * A v4 uuid for this respondent's answers, made once and sent with every
 * attempt. If an attempt is stored but its reply never arrives (a timeout after
 * the commit), "Try again" carries the same id and the server recognises it
 * instead of storing the answers, and emailing Peter, a second time.
 */
function newResponseId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function SurveyPlayer({
  survey,
  previewToken,
  shareUrl,
}: SurveyPlayerProps): JSX.Element {
  const [raw, setRaw] = React.useState<Record<string, Answer>>({});
  const [stage, setStage] = React.useState<Stage>(() => ({
    kind: 'asking',
    key: visibleQuestions(survey, {})[0]?.key ?? '',
  }));
  const [contact, setContact] = React.useState<ContactDraft>({
    name: '',
    email: '',
    businessName: '',
    consent: false,
  });
  const [honeypot, setHoneypot] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [lastSend, setLastSend] = React.useState<{
    answers: Record<string, Answer>;
    withContact: boolean;
  } | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const errorRef = React.useRef<HTMLDivElement>(null);
  const advanceTimer = React.useRef<number | null>(null);
  const responseId = React.useRef<string | null>(null);

  // Preview answers are Peter testing, not people answering: nothing is measured.
  const measured = !previewToken;

  const answers = React.useMemo(() => effectiveAnswers(survey, raw), [survey, raw]);
  const visible = React.useMemo(() => visibleQuestions(survey, answers), [survey, answers]);
  const position = new Map(survey.questions.map((q, index) => [q.key, index]));

  // Move focus to the new question's heading and bring it into view, so a
  // screen-reader user hears it and a phone user is not left looking at the
  // bottom of the last one.
  const stageKey = stage.kind === 'asking' ? stage.key : 'done';
  const firstRender = React.useRef(true);
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    const top = containerRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      containerRef.current?.scrollIntoView({
        block: 'start',
        behavior: reduce ? 'auto' : 'smooth',
      });
    }
  }, [stageKey]);

  React.useEffect(
    () => () => {
      if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current);
    },
    []
  );

  // A failed send disables the control that had focus, which drops focus to the
  // top of the page. Put it on the message instead, where "Try again" is.
  React.useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  function cancelPendingAdvance(): void {
    if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  }

  /** An answer changed, so an earlier failed attempt no longer describes what to send. */
  function forgetFailedSend(): void {
    setError(null);
    setFieldErrors({});
    setLastSend(null);
  }

  /** The first visible question after `key` in survey order, given these answers. */
  function nextAfter(key: string, nextRaw: Record<string, Answer>): SurveyQuestion | undefined {
    const from = position.get(key) ?? -1;
    return visibleQuestions(survey, effectiveAnswers(survey, nextRaw)).find(
      (q) => (position.get(q.key) ?? -1) > from
    );
  }

  function markStarted(): void {
    if (!measured) return;
    trackClientEvent('survey_started', {
      properties: { survey: survey.slug },
      dedupeKey: `survey_started:${survey.slug}`,
    });
  }

  async function send(finalRaw: Record<string, Answer>, withContact: boolean): Promise<void> {
    const finalAnswers = effectiveAnswers(survey, finalRaw);
    setSending(true);
    setError(null);
    setFieldErrors({});
    setLastSend({ answers: finalRaw, withContact });
    responseId.current ??= newResponseId();

    try {
      const result = await submitSurvey({
        slug: survey.slug,
        previewToken,
        responseId: responseId.current,
        answers: finalAnswers,
        contact: withContact
          ? {
              name: contact.name,
              email: contact.email,
              businessName: contact.businessName || undefined,
              consent: contact.consent,
            }
          : undefined,
        subject: honeypot || undefined,
        leadSource: getBrowserLeadSource(),
      });

      if (result.success) {
        if (measured) {
          trackClientEvent('survey_completed', {
            properties: { survey: survey.slug, volunteered: withContact },
            dedupeKey: `survey_completed:${survey.slug}`,
          });
        }
        setStage({ kind: 'done', results: result.results ?? null });
        return;
      }
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      setError(result.error ?? "We couldn't send your answers. Please try again.");
    } catch {
      // The action itself could not be reached: offline, or a deploy mid-survey.
      setError(
        "We couldn't reach our server, so your answers weren't sent. Check your connection and try again, or email peter@orangejelly.co.uk."
      );
    } finally {
      setSending(false);
    }
  }

  function answerAndAdvance(question: SurveyQuestion, value: Answer, delay = 0): void {
    const nextRaw = { ...raw, [question.key]: value };
    setRaw(nextRaw);
    forgetFailedSend();
    markStarted();
    const go = (): void => {
      const next = nextAfter(question.key, nextRaw);
      if (next) setStage({ kind: 'asking', key: next.key });
      else void send(nextRaw, false);
    };
    if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current);
    if (delay > 0) advanceTimer.current = window.setTimeout(go, delay);
    else go();
  }

  function back(): void {
    if (stage.kind !== 'asking') return;
    // A tap on the way out must not carry the respondent forward again.
    cancelPendingAdvance();
    const from = position.get(stage.key) ?? 0;
    const previous = [...visible].reverse().find((q) => (position.get(q.key) ?? 0) < from);
    if (previous) {
      forgetFailedSend();
      setStage({ kind: 'asking', key: previous.key });
    }
  }

  if (stage.kind === 'done') {
    return (
      <div ref={containerRef} className="scroll-mt-24">
        <ThankYou
          survey={survey}
          results={stage.results}
          headingRef={headingRef}
          shareUrl={shareUrl}
          measured={measured}
        />
      </div>
    );
  }

  const question =
    visible.find((q) => q.key === stage.key) ??
    // The current question stopped applying (an earlier answer changed): carry on
    // from the next one that does.
    visible.find((q) => (position.get(q.key) ?? -1) > (position.get(stage.key) ?? -1));

  if (!question) {
    return (
      <Alert tone="danger" title="This survey has nothing to ask">
        Please email peter@orangejelly.co.uk and tell us what happened.
      </Alert>
    );
  }

  const index = visible.findIndex((q) => q.key === question.key);
  const prompt = renderPrompt(survey, question.prompt, answers);
  const isFirst = index === 0;
  // Progress through the whole survey, not through the questions visible so far.
  // Follow-ups appear as people answer, and a bar measured against what is
  // visible would jump backwards each time one did.
  const progress = Math.round(
    ((position.get(question.key) ?? 0) / Math.max(survey.questions.length, 1)) * 100
  );

  return (
    <div ref={containerRef} className="scroll-mt-24">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[14px] font-bold text-oj-ink-2">Question {index + 1}</p>
        {!isFirst ? (
          <button
            type="button"
            onClick={back}
            className="oj-focus min-h-tap rounded-oj px-2 text-[14px] font-bold text-oj-ink underline underline-offset-4"
          >
            Back
          </button>
        ) : null}
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-oj border-1.5 border-oj-ink bg-oj-paper"
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full bg-oj-orange transition-[width] duration-oj-move ease-oj motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        key={question.key}
        className="mt-8 animate-in fade-in slide-in-from-right-4 duration-200 motion-reduce:animate-none"
      >
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-oj text-[clamp(24px,4.5vw,32px)] font-black leading-tight text-oj-ink outline-none"
        >
          {prompt}
        </h2>
        {question.hint ? (
          <p className="mt-2 text-[16px] leading-relaxed text-oj-ink-2">{question.hint}</p>
        ) : null}

        <div className="mt-6">
          {question.kind === 'single' ? (
            <SingleChoice
              survey={survey}
              question={question}
              label={prompt}
              answers={answers}
              disabled={sending}
              onPick={(key) => answerAndAdvance(question, [key], ADVANCE_DELAY_MS)}
              onSkip={() => answerAndAdvance(question, [])}
            />
          ) : null}

          {question.kind === 'multi' ? (
            <MultiChoice
              survey={survey}
              question={question}
              label={prompt}
              answers={answers}
              disabled={sending}
              onDone={(keys) => answerAndAdvance(question, keys)}
            />
          ) : null}

          {question.kind === 'text' ? (
            <FreeText
              question={question}
              initial={typeof raw[question.key] === 'string' ? (raw[question.key] as string) : ''}
              disabled={sending}
              onDone={(text) => answerAndAdvance(question, text)}
            />
          ) : null}

          {question.kind === 'contact' ? (
            <ContactStep
              consentText={survey.consentText ?? ''}
              contact={contact}
              onChange={setContact}
              honeypot={honeypot}
              onHoneypot={setHoneypot}
              errors={fieldErrors}
              sending={sending}
              onSend={() => void send(raw, true)}
              onSkip={() => void send(raw, false)}
            />
          ) : null}
        </div>

        {sending ? (
          <p className="mt-6 text-[15px] font-bold text-oj-ink" role="status">
            Sending your answers…
          </p>
        ) : null}

        {error ? (
          <div ref={errorRef} tabIndex={-1} className="mt-6 outline-none">
            <Alert tone="danger" title="Not sent yet">
              <p>{error}</p>
              {lastSend && !fieldErrors.name && !fieldErrors.email && !fieldErrors.consent ? (
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="solid"
                    onClick={() => void send(lastSend.answers, lastSend.withContact)}
                    disabled={sending}
                  >
                    Try again
                  </Button>
                </div>
              ) : null}
            </Alert>
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface ChoiceProps {
  survey: Survey;
  question: SurveyQuestion;
  /** The prompt as shown, placeholders filled in, for the list's accessible name. */
  label: string;
  answers: Readonly<Record<string, Answer>>;
  disabled: boolean;
}

function OptionTile({
  label,
  hint,
  icon,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  hint: string | null;
  icon: string | null;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}): JSX.Element {
  const Icon = surveyIcon(icon);
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'oj-focus flex min-h-tap w-full items-start gap-3 rounded-oj border-1.5 border-oj-ink p-4 text-left',
        'transition-[transform,box-shadow,background-color] duration-oj-hover ease-oj motion-reduce:transition-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        selected
          ? 'bg-oj-ink text-oj-cream shadow-press-orange'
          : 'bg-oj-paper text-oj-ink enabled:hover:-translate-x-0.5 enabled:hover:-translate-y-0.5 enabled:hover:shadow-press-sm'
      )}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className={cn(
            'mt-0.5 h-6 w-6 flex-none',
            selected ? 'text-oj-peach' : 'text-oj-orange-deep'
          )}
        />
      ) : null}
      <span className="flex flex-col gap-1">
        <span className="text-[17px] font-bold leading-snug">{label}</span>
        {hint ? (
          <span
            className={cn(
              'text-[14.5px] leading-snug',
              selected ? 'text-oj-cream/85' : 'text-oj-ink-2'
            )}
          >
            {hint}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function SingleChoice({
  survey,
  question,
  label,
  answers,
  disabled,
  onPick,
  onSkip,
}: ChoiceProps & { onPick: (key: string) => void; onSkip: () => void }): JSX.Element {
  const current = answers[question.key];
  const picked = Array.isArray(current) ? current[0] : undefined;
  const options = resolveOptions(survey, question, answers);
  return (
    <ul
      className={cn('grid list-none gap-3 p-0', options.length > 4 && 'sm:grid-cols-2')}
      aria-label={label}
    >
      {options.map((option) => (
        <li key={option.key}>
          <OptionTile
            label={option.label}
            hint={option.hint}
            icon={option.icon}
            selected={picked === option.key}
            disabled={disabled}
            onClick={() => onPick(option.key)}
          />
        </li>
      ))}
      {question.required ? null : (
        <li className="sm:col-span-2">
          <Button variant="ghost" onClick={onSkip} disabled={disabled}>
            Skip this one
          </Button>
        </li>
      )}
    </ul>
  );
}

function MultiChoice({
  survey,
  question,
  label,
  answers,
  disabled,
  onDone,
}: ChoiceProps & { onDone: (keys: string[]) => void }): JSX.Element {
  const current = answers[question.key];
  const [picked, setPicked] = React.useState<string[]>(Array.isArray(current) ? [...current] : []);
  const options = resolveOptions(survey, question, answers);
  const max = Math.min(question.maxChoices ?? options.length, options.length);
  const min = question.minChoices ?? 0;
  // "Pick as many as you like" is a limit equal to the number of options, and
  // then there is no limit worth mentioning.
  const limited = max < options.length;
  const full = limited && picked.length >= max;

  function toggle(key: string): void {
    setPicked((now) =>
      now.includes(key) ? now.filter((k) => k !== key) : now.length >= max ? now : [...now, key]
    );
  }

  return (
    <div>
      <ul className="grid list-none gap-3 p-0 sm:grid-cols-2" aria-label={label}>
        {options.map((option) => {
          const selected = picked.includes(option.key);
          return (
            <li key={option.key}>
              <OptionTile
                label={option.label}
                hint={option.hint}
                icon={option.icon}
                selected={selected}
                disabled={disabled || (full && !selected)}
                onClick={() => toggle(option.key)}
              />
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button arrow onClick={() => onDone(picked)} disabled={disabled || picked.length < min}>
          {picked.length === 0 ? 'None of these, next' : 'Next'}
        </Button>
        <p className="text-[14.5px] text-oj-ink-2" aria-live="polite">
          {full
            ? `That's ${max} picked. Unpick one to swap it.`
            : limited
              ? `${picked.length} of ${max} picked`
              : `${picked.length} picked`}
        </p>
      </div>
    </div>
  );
}

function FreeText({
  question,
  initial,
  disabled,
  onDone,
}: {
  question: SurveyQuestion;
  initial: string;
  disabled: boolean;
  onDone: (text: string) => void;
}): JSX.Element {
  const [text, setText] = React.useState(initial);
  const max = question.maxLength ?? 400;
  const id = React.useId();
  return (
    <div>
      <Field htmlFor={id} label={<span className="sr-only">{question.prompt}</span>}>
        <Textarea
          value={text}
          maxLength={max}
          rows={4}
          onChange={(event) => setText(event.target.value)}
          disabled={disabled}
        />
      </Field>
      <p className="mt-2 text-[13.5px] text-oj-ink-3">
        {text.length} of {max} characters
      </p>
      <div className="mt-5">
        <Button
          arrow
          onClick={() => onDone(text.trim())}
          disabled={disabled || (question.required && text.trim() === '')}
        >
          {text.trim() === '' && !question.required ? 'Skip' : 'Next'}
        </Button>
      </div>
    </div>
  );
}

function ContactStep({
  consentText,
  contact,
  onChange,
  honeypot,
  onHoneypot,
  errors,
  sending,
  onSend,
  onSkip,
}: {
  consentText: string;
  contact: ContactDraft;
  onChange: (next: ContactDraft) => void;
  honeypot: string;
  onHoneypot: (value: string) => void;
  errors: Record<string, string>;
  sending: boolean;
  onSend: () => void;
  onSkip: () => void;
}): JSX.Element {
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSend();
      }}
      className="flex flex-col gap-5"
    >
      <Field label="Your name" required error={errors.name}>
        <Input
          name="name"
          autoComplete="name"
          value={contact.name}
          onChange={(event) => onChange({ ...contact, name: event.target.value })}
          disabled={sending}
        />
      </Field>
      <Field label="Email" required error={errors.email}>
        <Input
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={contact.email}
          onChange={(event) => onChange({ ...contact, email: event.target.value })}
          disabled={sending}
        />
      </Field>
      <Field label="Pub or business name" error={errors.businessName}>
        <Input
          name="organization"
          autoComplete="organization"
          value={contact.businessName}
          onChange={(event) => onChange({ ...contact, businessName: event.target.value })}
          disabled={sending}
        />
      </Field>

      {/* Honeypot. Named `subject` so no autofiller touches it; see schemas/enquiry.ts. */}
      <div aria-hidden="true" className="sr-only">
        <label>
          Subject
          <input
            type="text"
            name="subject"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => onHoneypot(event.target.value)}
          />
        </label>
      </div>

      <div>
        <Checkbox
          name="consent"
          checked={contact.consent}
          onChange={(event) => onChange({ ...contact, consent: event.target.checked })}
          disabled={sending}
          aria-invalid={errors.consent ? true : undefined}
          label={
            <>
              {consentText}{' '}
              <Link href="/privacy#surveys" className="font-bold underline underline-offset-4">
                How we handle your details
              </Link>
            </>
          }
        />
        {errors.consent ? (
          <p className="mt-2 text-xs font-semibold text-oj-danger" role="alert">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" arrow disabled={sending}>
          Send my answers
        </Button>
        <Button type="button" variant="ghost" onClick={onSkip} disabled={sending}>
          Skip, just send my answers
        </Button>
      </div>
    </form>
  );
}

function ThankYou({
  survey,
  results,
  headingRef,
  shareUrl,
  measured,
}: {
  survey: Survey;
  results: SurveyResultsView | null;
  headingRef: React.RefObject<HTMLHeadingElement>;
  shareUrl: string;
  measured: boolean;
}): JSX.Element {
  return (
    <div className="animate-in fade-in duration-200 motion-reduce:animate-none">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-oj text-[clamp(28px,5vw,40px)] font-black leading-tight text-oj-ink outline-none"
      >
        {survey.thankYouHeading}
      </h2>
      <p className="mt-3 text-[17px] leading-relaxed text-oj-ink-2">{survey.thankYouBody}</p>

      {results && results.bars.length > 0 ? (
        <section className="mt-10" aria-labelledby="survey-results-heading">
          <h3 id="survey-results-heading" className="font-oj text-[22px] font-black text-oj-ink">
            {results.heading ?? 'The results so far'}
          </h3>
          <ol className="mt-5 flex list-none flex-col gap-4 p-0">
            {results.bars.map((bar) => (
              <li key={bar.key}>
                <div className="flex items-baseline justify-between gap-4 text-[16px]">
                  <span className="font-bold text-oj-ink">{bar.label}</span>
                  <span className="font-bold tabular-nums text-oj-ink">{bar.percent}%</span>
                </div>
                <div className="mt-1.5 h-3 overflow-hidden rounded-oj border-1.5 border-oj-ink bg-oj-paper">
                  <div className="h-full bg-oj-orange" style={{ width: `${bar.percent}%` }} />
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[14px] text-oj-ink-3">
            Based on {results.responses} responses so far.
          </p>
        </section>
      ) : null}

      {results && results.bars.length === 0 && survey.resultsQuestionKey ? (
        <p className="mt-8 rounded-oj border-1.5 border-oj-ink bg-oj-paper p-4 text-[15.5px] leading-relaxed text-oj-ink">
          We'll show what everyone picked once {results.minResponses} people have answered.{' '}
          {results.responses > 0 ? `So far: ${results.responses}.` : null}
        </p>
      ) : null}

      <SurveyShare
        slug={survey.slug}
        shareText={survey.shareText}
        shareUrl={shareUrl}
        measured={measured}
      />
    </div>
  );
}
