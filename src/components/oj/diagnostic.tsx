'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { SCORECARD_QUESTIONS, type ScorecardQuestion } from './scorecard-questions';

import { Button } from './Button';

/**
 * The Growth Pressure Map and its two interactive companions.
 *
 * This is the signature diagnostic asset: the one thing on the site a competitor
 * could not reproduce. It maps six connected growth areas and encodes PRESSURE, not
 * score. There is no total, no mark out of ten, and none of these components
 * calculates one. That discipline is the point: a scorecard invites a number, and a
 * number invites a league table, which is exactly the false precision the brand pack
 * argues against.
 */
export interface PressureArea {
  id: string;
  label: string;
  /** 0 steady, 1 watch, 2 pressure, 3 critical. */
  pressure: number;
  note?: string;
}

export const PRESSURE_AREAS: PressureArea[] = [
  { id: 'demand', label: 'Demand', pressure: 0 },
  { id: 'conversion', label: 'Conversion', pressure: 0 },
  { id: 'margin', label: 'Margin', pressure: 0 },
  { id: 'operations', label: 'Operations', pressure: 0 },
  { id: 'experience', label: 'Experience', pressure: 0 },
  { id: 'scale', label: 'Scale', pressure: 0 },
];

/** Static classes per level: Tailwind cannot see a constructed class name. */
const PRESSURE_FILL = [
  'bg-oj-paper text-oj-ink',
  'bg-oj-peach text-oj-ink',
  'bg-oj-orange text-oj-ink',
  'bg-oj-ember text-oj-cream',
] as const;

const PRESSURE_WORD = ['steady', 'watch', 'under pressure', 'critical'] as const;

export interface PressureMapProps {
  areas?: PressureArea[];
  variant?: 'map' | 'grid';
  title?: string;
  caption?: string;
  /** Area ids to emphasise. Everything else dims. */
  highlight?: string[];
  className?: string;
}

export function PressureMap({
  areas = PRESSURE_AREAS,
  variant = 'grid',
  title,
  caption,
  highlight,
  className,
}: PressureMapProps): JSX.Element {
  const dimmed = (id: string) => highlight?.length && !highlight.includes(id);

  return (
    <figure className={cn('m-0 flex flex-col gap-4', className)}>
      {title ? <figcaption className="oj-eyebrow">{title}</figcaption> : null}

      <ul
        className={cn(
          'm-0 grid list-none gap-3 p-0',
          variant === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3'
        )}
      >
        {areas.map((area) => {
          const level = Math.min(3, Math.max(0, Math.round(area.pressure)));
          return (
            <li
              key={area.id}
              className={cn(
                'flex flex-col gap-1 border-1.5 border-oj-ink rounded-oj p-3.5 transition-opacity duration-oj-move ease-oj motion-reduce:transition-none',
                PRESSURE_FILL[level],
                dimmed(area.id) && 'opacity-30'
              )}
            >
              <span className="font-oj text-[15px] font-black">{area.label}</span>
              {/*
                The level is stated in words as well as colour. Encoding pressure in
                fill alone would fail 1.4.1 and would also be unreadable in print.
              */}
              <span className="text-xs font-semibold opacity-80">{PRESSURE_WORD[level]}</span>
              {area.note ? (
                <span className="text-xs leading-snug opacity-75">{area.note}</span>
              ) : null}
            </li>
          );
        })}
      </ul>

      {caption ? <p className="m-0 text-[13px] text-oj-ink-3">{caption}</p> : null}
    </figure>
  );
}

export interface PressureSymptom {
  label: string;
  /** Area ids the symptom implicates. */
  areas: string[];
  cause: string;
}

export const PRESSURE_SYMPTOMS: PressureSymptom[] = [
  {
    label: 'Growth has stalled',
    areas: ['demand', 'conversion', 'scale'],
    cause:
      'A plateau is rarely one thing. Usually demand has flattened while the journey that converts it has quietly got worse, and the systems cannot carry more anyway.',
  },
  {
    label: 'Leads are not converting',
    areas: ['conversion', 'experience'],
    cause:
      'When enquiries arrive and stall, the fault is usually in the handover: how fast someone replies, what they say, and how easy the next step is to take.',
  },
  {
    label: 'Profit is weak despite good sales',
    areas: ['margin', 'operations'],
    cause:
      'Revenue growth hiding a margin problem almost always means the mix, the pricing or the cost of delivery has drifted while nobody was measuring it.',
  },
  {
    label: 'The team is busy but nothing moves',
    areas: ['operations', 'scale'],
    cause:
      'Effort without output is a process problem. Work is usually waiting on one person, or the same information is being typed into three systems.',
  },
  {
    label: 'Customers do not come back',
    areas: ['experience', 'demand'],
    cause:
      'Retention problems look like marketing problems and are usually experience problems: what happens after the sale is nobody in particular’s job.',
  },
  {
    label: 'We have outgrown our systems',
    areas: ['scale', 'operations'],
    cause:
      'Systems built for a smaller business fail quietly. The symptom is manual workarounds that everyone has stopped noticing.',
  },
];

export interface PressureCheckProps {
  symptoms?: PressureSymptom[];
  areas?: PressureArea[];
  heading?: string;
  intro?: string;
  cta?: { label: string; href?: string };
  onCta?: () => void;
  /**
   * Whether the built-in result renders its own call to action.
   *
   * False where the page adds its own, so the reader is not offered the same thing
   * twice with different words. `/tools/ai-readiness` does that, because its
   * handover carries the named pressure areas into the enquiry form and this one
   * cannot: the href would have to be known before the answers are.
   */
  showCta?: boolean;
  className?: string;
}

export function PressureCheck({
  symptoms = PRESSURE_SYMPTOMS,
  areas = PRESSURE_AREAS,
  heading = 'Which of these do you recognise?',
  intro,
  cta = { label: 'Start the conversation', href: '/start-here' },
  onCta,
  className,
}: PressureCheckProps): JSX.Element {
  const [selected, setSelected] = React.useState<number | null>(null);
  const active = selected === null ? null : symptoms[selected];

  return (
    <section className={cn('flex flex-col gap-5', className)}>
      <div>
        <h2 className="oj-display m-0 font-oj text-[28px] font-black text-oj-ink">{heading}</h2>
        {intro ? <p className="mt-2 text-[15px] leading-normal text-oj-ink-2">{intro}</p> : null}
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Symptoms">
        {symptoms.map((symptom, index) => (
          <button
            key={symptom.label}
            type="button"
            aria-pressed={selected === index}
            onClick={() => setSelected(selected === index ? null : index)}
            className={cn(
              'min-h-tap rounded-oj border-1.5 border-oj-ink px-3.5 text-sm font-bold oj-focus',
              selected === index ? 'bg-oj-ink text-oj-cream' : 'bg-oj-paper text-oj-ink'
            )}
          >
            {symptom.label}
          </button>
        ))}
      </div>

      <PressureMap
        areas={areas.map((area) =>
          active?.areas.includes(area.id) ? { ...area, pressure: 2 } : area
        )}
        highlight={active?.areas}
        title={active ? 'Where that usually shows up' : 'The six connected areas'}
      />

      {/* Announced when it appears, because the map changing is not a text change. */}
      <div aria-live="polite">
        {active ? (
          <div className="flex flex-col gap-4 border-l-[3px] border-l-oj-orange pl-5">
            <p className="m-0 text-[15px] leading-relaxed text-oj-ink-2">{active.cause}</p>
            <div>
              <Button href={cta.href} onClick={onCta} arrow>
                {cta.label}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export type { ScorecardQuestion } from './scorecard-questions';
export { SCORECARD_QUESTIONS } from './scorecard-questions';

const FREQUENCY = ['Never', 'Sometimes', 'Often', 'Always'] as const;

export interface ScorecardProps {
  questions?: ScorecardQuestion[];
  areas?: PressureArea[];
  heading?: string;
  intro?: string;
  cta?: { label: string; href?: string };
  /**
   * Fired when the last statement is answered.
   *
   * `areas` carries the computed pressure bands. It is passed rather than left to
   * the caller because the scoring rule is not obvious: reverse-scored statements
   * invert, and pressure is the inverse of the score. A caller recomputing it from
   * the raw answers has to match the questions by index, and matching them any
   * other way silently applies `reverse` to the wrong statement.
   */
  onComplete?: (answers: Array<{ area: string; v: number }>, areas: PressureArea[]) => void;
  onCta?: () => void;
  /**
   * Whether the built-in result renders its own call to action.
   *
   * False where the page adds its own, so the reader is not offered the same thing
   * twice with different words. `/tools/ai-readiness` does that, because its
   * handover carries the named pressure areas into the enquiry form and this one
   * cannot: the href would have to be known before the answers are.
   */
  showCta?: boolean;
  className?: string;
}

export function Scorecard({
  questions = SCORECARD_QUESTIONS,
  areas = PRESSURE_AREAS,
  heading = 'Where is the pressure in your business?',
  intro,
  cta = { label: 'Start the conversation', href: '/start-here' },
  onComplete,
  onCta,
  showCta = true,
  className,
}: ScorecardProps): JSX.Element {
  const [answers, setAnswers] = React.useState<Array<number | null>>(() =>
    questions.map(() => null)
  );
  const answeredCount = answers.filter((a) => a !== null).length;
  const complete = answeredCount === questions.length;

  /**
   * Pressure is the inverse of the score, and there is deliberately no total.
   * Reverse-scored statements invert, so "always" on "the same information gets
   * typed into more than one system" counts as pressure rather than health.
   *
   * THE ONLY IMPLEMENTATION OF THIS RULE. It is handed to `onComplete` rather than
   * left for a caller to redo, because redoing it means matching answers back to
   * questions, and matching them by anything other than index applies `reverse` to
   * the wrong statement without ever looking wrong.
   */
  const scoreAreas = React.useCallback(
    (given: Array<number | null>): PressureArea[] =>
      areas.map((area) => {
        const forArea = questions
          .map((question, index) => ({ question, value: given[index] }))
          .filter((entry) => entry.question.area === area.id && entry.value !== null);

        if (!forArea.length) return { ...area, pressure: 0 };

        const score = forArea.reduce((total, entry) => {
          const raw = entry.value as number;
          return total + (entry.question.reverse ? 3 - raw : raw);
        }, 0);
        const max = forArea.length * 3;
        // 6 of 6 is steady, 0 of 6 is critical.
        return { ...area, pressure: Math.round(3 - (score / max) * 3) };
      }),
    [areas, questions]
  );

  const answer = (index: number, value: number) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[index] = value;
      if (next.every((v) => v !== null)) {
        onComplete?.(
          questions.map((question, i) => ({ area: question.area, v: next[i] as number })),
          scoreAreas(next)
        );
      }
      return next;
    });
  };

  const resultAreas = React.useMemo<PressureArea[]>(
    () => scoreAreas(answers),
    [answers, scoreAreas]
  );

  const heaviest = React.useMemo(
    () => [...resultAreas].sort((a, b) => b.pressure - a.pressure).slice(0, 2),
    [resultAreas]
  );

  return (
    <section className={cn('flex flex-col gap-6', className)}>
      <div>
        <h2 className="oj-display m-0 font-oj text-[28px] font-black text-oj-ink">{heading}</h2>
        {intro ? <p className="mt-2 text-[15px] leading-normal text-oj-ink-2">{intro}</p> : null}
      </div>

      <p className="m-0 text-sm font-semibold text-oj-ink-2" aria-live="polite">
        {answeredCount} of {questions.length} answered
      </p>

      <ol className="m-0 flex list-none flex-col gap-6 p-0">
        {questions.map((question, index) => (
          <li key={question.text}>
            <fieldset className="m-0 border-0 p-0">
              <legend className="mb-2 text-[15px] font-semibold text-oj-ink">
                {question.text}
              </legend>
              <div className="flex flex-wrap gap-2">
                {FREQUENCY.map((label, value) => (
                  <label
                    key={label}
                    className={cn(
                      'inline-flex min-h-tap cursor-pointer items-center rounded-oj border-1.5 border-oj-ink px-3.5 text-sm font-bold',
                      answers[index] === value
                        ? 'bg-oj-orange text-oj-ink'
                        : 'bg-oj-paper text-oj-ink'
                    )}
                  >
                    <input
                      type="radio"
                      name={`scorecard-${index}`}
                      value={value}
                      checked={answers[index] === value}
                      onChange={() => answer(index, value)}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      {complete ? (
        <div className="flex flex-col gap-4 border-t-1.5 border-oj-ink pt-6" aria-live="polite">
          <PressureMap
            areas={resultAreas}
            title="Where the pressure is"
            caption="This is a signal, not a diagnosis."
          />
          <p className="m-0 text-[15px] leading-relaxed text-oj-ink-2">
            The heaviest pressure looks like{' '}
            <strong className="text-oj-ink">
              {heaviest.map((a) => a.label.toLowerCase()).join(' and ')}
            </strong>
            . That is where we would start looking, not what we would conclude.
          </p>
          {showCta ? (
            <div>
              <Button href={cta.href} onClick={onCta} arrow>
                {cta.label}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
