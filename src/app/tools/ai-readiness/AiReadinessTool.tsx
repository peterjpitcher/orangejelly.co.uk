'use client';

import * as React from 'react';

import { Band, Button, Scorecard } from '@/components/oj';
import { trackClientEvent } from '@/lib/tracking';

import { AREA_RESULTS } from './content';

/**
 * The interactive half of `/tools/ai-readiness`.
 *
 * Answers are held here and nowhere else. Nothing is stored unless the visitor goes
 * on to enquire, and then only the named pressure areas travel, never the raw
 * answers. There is no deep link to a result either: it is not a shareable score,
 * and giving it a URL would invite people to treat it as one.
 *
 * The result names the one or two areas under most pressure and, for each, says
 * where AI genuinely pays and where it does not. That second half is the reason
 * this exists rather than being a lead magnet: a tool that concludes "you need AI"
 * whatever the answers is not an assessment.
 */
export default function AiReadinessTool(): JSX.Element {
  const [pressed, setPressed] = React.useState<Array<{ area: string; pressure: number }> | null>(
    null
  );
  const startedRef = React.useRef(false);
  const startedAtRef = React.useRef<number | null>(null);
  const resultRef = React.useRef<HTMLDivElement>(null);

  const onStart = React.useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startedAtRef.current = Date.now();
    trackClientEvent('scorecard_started', { dedupeKey: 'ai-readiness' });
  }, []);

  const onComplete = React.useCallback(
    (
      _answers: Array<{ area: string; v: number }>,
      scored: Array<{ id: string; pressure: number }>
    ) => {
      // The bands come from the Scorecard, which owns the scoring rule. Recomputing
      // them here would mean matching answers back to questions, and matching them by
      // anything other than index applies the reverse-scoring to the wrong statement.
      const areas = scored.map((area) => ({ area: area.id, pressure: area.pressure }));

      setPressed(areas);

      const seconds = startedAtRef.current
        ? Math.round((Date.now() - startedAtRef.current) / 1000)
        : undefined;

      // Bands only. The dictionary forbids free text in any property, and the raw
      // answers never leave the browser.
      trackClientEvent('scorecard_completed', {
        properties: {
          pressure_bands: areas.map((a) => `${a.area}:${a.pressure}`),
          ...(seconds ? { duration_seconds: seconds } : {}),
        },
        dedupeKey: 'ai-readiness',
      });
    },
    []
  );

  React.useEffect(() => {
    if (pressed) resultRef.current?.focus();
  }, [pressed]);

  const underPressure = (pressed ?? [])
    .filter((a) => a.pressure >= 2)
    .sort((a, b) => b.pressure - a.pressure)
    .slice(0, 2);

  const steady = (pressed ?? []).filter((a) => a.pressure < 2);

  /** The enquiry form pre-fill, so nobody retypes what they just answered. */
  const situation = underPressure.length
    ? `The AI readiness assessment put us under most pressure on ${underPressure
        .map((a) => AREA_RESULTS.find((r) => r.id === a.area)?.label.toLowerCase() ?? a.area)
        .join(' and ')}.`
    : '';

  return (
    <div onInput={onStart}>
      <Scorecard
        heading="Twelve statements. No score at the end."
        intro="Answer how often each one is true. There is no right answer and nothing is stored unless you decide to get in touch."
        onComplete={onComplete}
        // The handover below carries the named pressure areas into the enquiry
        // form, which this one cannot: its href would have to be known before the
        // answers are.
        showCta={false}
      />

      {pressed ? (
        <div ref={resultRef} tabIndex={-1} className="mt-12 outline-none">
          <Band
            heading={
              underPressure.length
                ? 'where the pressure is, and where ai would actually help.'
                : 'nothing is under real pressure.'
            }
            tone="paper"
            divider={false}
            className="!py-10"
          >
            {underPressure.length ? (
              <div className="flex flex-col gap-8">
                {underPressure.map(({ area }) => {
                  const result = AREA_RESULTS.find((r) => r.id === area);
                  if (!result) return null;
                  return (
                    <article
                      key={area}
                      className="rounded-oj border-1.5 border-oj-ink bg-oj-cream p-6 shadow-press-sm"
                    >
                      <h3 className="oj-display text-[26px] leading-none text-oj-ink">
                        {result.label}
                      </h3>
                      <p className="measure mt-3 text-[16.5px] leading-relaxed text-oj-ink-2">
                        {result.pressed.what}
                      </p>
                      <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                          <dt className="font-oj text-[13px] font-bold uppercase tracking-[0.1em] text-oj-ok">
                            Where AI helps
                          </dt>
                          <dd className="mt-1.5 text-[15.5px] leading-relaxed text-oj-ink-2">
                            {result.pressed.aiHelps}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-oj text-[13px] font-bold uppercase tracking-[0.1em] text-oj-danger">
                            Where it does not
                          </dt>
                          <dd className="mt-1.5 text-[15.5px] leading-relaxed text-oj-ink-2">
                            {result.pressed.aiDoesNot}
                          </dd>
                        </div>
                      </dl>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="measure text-[17px] leading-relaxed">
                On these twelve statements nothing came out badly, which is worth taking seriously
                rather than dismissing. If growth has still stalled, the cause is somewhere these
                statements do not reach, and that is worth an hour of conversation more than another
                assessment.
              </p>
            )}

            {steady.length ? (
              <p className="measure mt-8 text-[16px] leading-relaxed text-oj-ink-3">
                Holding up well:{' '}
                {steady
                  .map((a) => AREA_RESULTS.find((r) => r.id === a.area)?.label.toLowerCase())
                  .filter(Boolean)
                  .join(', ')}
                .
              </p>
            ) : null}

            <div className="mt-7">
              <Button
                size="lg"
                arrow
                href={`/start-here${situation ? `?situation=${encodeURIComponent(situation)}` : ''}`}
                onClick={() =>
                  trackClientEvent('scorecard_to_enquiry', {
                    properties: {
                      pressure_bands: (pressed ?? []).map((a) => `${a.area}:${a.pressure}`),
                    },
                    dedupeKey: 'ai-readiness',
                  })
                }
              >
                Start the conversation
              </Button>
            </div>
          </Band>
        </div>
      ) : null}
    </div>
  );
}
