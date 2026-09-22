'use client';

import { useCallback, useEffect, useState } from 'react';

import { getValidAccessToken } from '@/lib/admin-session';
import { formatSlotInLondon } from '@/lib/dateUtils';
// Types only: the module itself is server code (service-role client, crypto).
import type { AdminSurvey } from '@/lib/db/surveys';
import { resultBars, type Answer, type Survey } from '@/lib/surveys/logic';

/**
 * Surveys in the admin view: how many answered, what they picked, what they
 * wrote, where they came from, and who volunteered.
 *
 * Counts are of real responses. Answers given through the preview link are
 * shown as a separate number and never mixed in.
 *
 * @see tasks/survey/PLAN.md
 */

const CARD = 'rounded-oj border-1.5 border-oj-ink bg-oj-cream p-5 shadow-press-sm';

function labelFor(survey: Survey, key: string): string {
  for (const question of survey.questions) {
    const option = question.options.find((o) => o.key === key);
    if (option) return option.label;
  }
  return key;
}

/** A prompt without its placeholders: "Your top pick: {{top_pick}}." reads "Your top pick: …". */
function plainPrompt(prompt: string): string {
  return prompt.replace(/\{\{[a-z0-9_]+\}\}/g, '…');
}

function picksOf(answer: Answer | undefined): readonly string[] {
  return Array.isArray(answer) ? answer : [];
}

function StatusBadge({ status }: { status: Survey['status'] }): JSX.Element {
  const tone =
    status === 'live'
      ? 'bg-oj-ok text-oj-paper'
      : status === 'draft'
        ? 'bg-oj-peach text-oj-ink'
        : 'bg-oj-cream-2 text-oj-ink-2';
  return (
    <span className={`inline-block rounded-oj px-2 py-0.5 text-xs font-bold uppercase ${tone}`}>
      {status}
    </span>
  );
}

function SurveyCard({ data }: { data: AdminSurvey }): JSX.Element {
  const { survey } = data;
  const publicUrl = `/survey/${survey.slug}`;
  const choiceQuestions = survey.questions.filter((q) => q.kind === 'single' || q.kind === 'multi');
  const textQuestions = survey.questions.filter((q) => q.kind === 'text');

  return (
    <article className={`mt-6 ${CARD}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-oj-ink">{survey.title}</h3>
          <p className="mt-1 text-sm text-oj-ink-2">
            <StatusBadge status={survey.status} /> <span className="ml-2">{publicUrl}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black tabular-nums text-oj-ink">{data.responses}</p>
          <p className="text-xs text-oj-ink-2">
            responses{data.previewResponses > 0 ? ` (+${data.previewResponses} preview)` : ''}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-oj-ink-2">
        Preview link, answers never counted:{' '}
        <a
          className="font-bold text-oj-ink underline"
          href={`${publicUrl}?preview=${data.previewToken}`}
          target="_blank"
          rel="noreferrer"
        >
          {publicUrl}?preview=…
        </a>
      </p>
      {data.truncated ? (
        <p className="mt-2 text-sm font-bold text-oj-danger">
          Very large survey: the counts below are complete, but the free-text answers and sources
          show the latest responses only.
        </p>
      ) : null}

      {data.responses > 0 ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {choiceQuestions.map((question) => {
            const bars = resultBars(survey, question.key, data.tallies, data.responses, 50);
            return (
              <section key={question.key}>
                <h4 className="text-sm font-bold text-oj-ink">{plainPrompt(question.prompt)}</h4>
                {bars.length === 0 ? (
                  <p className="mt-2 text-sm text-oj-ink-3">No answers yet.</p>
                ) : (
                  <ul className="mt-2 flex list-none flex-col gap-1.5 p-0">
                    {bars.map((bar) => (
                      <li key={bar.key} className="text-sm">
                        <div className="flex justify-between gap-3">
                          <span className="text-oj-ink">{bar.label}</span>
                          <span className="tabular-nums text-oj-ink-2">
                            {bar.picks} ({bar.percent}%)
                          </span>
                        </div>
                        <div className="mt-0.5 h-1.5 bg-oj-cream-2">
                          <div
                            className="h-full bg-oj-orange"
                            style={{ width: `${bar.percent}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <p className="mt-6 text-sm text-oj-ink-2">No real responses yet.</p>
      )}

      {textQuestions.map((question) => {
        const answers = data.texts[question.key] ?? [];
        return (
          <section key={question.key} className="mt-6">
            <h4 className="text-sm font-bold text-oj-ink">
              {plainPrompt(question.prompt)} ({answers.length})
            </h4>
            {answers.length === 0 ? (
              <p className="mt-2 text-sm text-oj-ink-3">Nothing written yet.</p>
            ) : (
              <ul className="mt-2 flex list-none flex-col gap-2 p-0">
                {answers.map((answer, index) => (
                  <li
                    key={`${answer.createdAt}-${index}`}
                    className="border-l-[3px] border-l-oj-orange bg-oj-paper px-3 py-2 text-sm"
                  >
                    <p className="whitespace-pre-wrap break-words text-oj-ink">{answer.text}</p>
                    <p className="mt-1 text-xs text-oj-ink-3">
                      {formatSlotInLondon(answer.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}

      <section className="mt-6">
        <h4 className="text-sm font-bold text-oj-ink">Where responses came from</h4>
        {data.sources.length === 0 ? (
          <p className="mt-2 text-sm text-oj-ink-3">No real responses yet.</p>
        ) : (
          <p className="mt-2 text-sm text-oj-ink">
            {data.sources.map((s) => `${s.source}: ${s.responses}`).join(' · ')}
          </p>
        )}
      </section>

      <section className="mt-6">
        <h4 className="text-sm font-bold text-oj-ink">Volunteers ({data.volunteers.length})</h4>
        {data.volunteers.length === 0 ? (
          <p className="mt-2 text-sm text-oj-ink-3">Nobody has volunteered yet.</p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full border-collapse border-1.5 border-oj-ink bg-oj-paper text-left text-sm">
              <thead className="bg-oj-ink text-oj-cream">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Business</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Said yes to</th>
                  <th className="px-3 py-2 text-left">Main pick</th>
                  <th className="px-3 py-2 text-left">When</th>
                </tr>
              </thead>
              <tbody>
                {data.volunteers.map((volunteer) => (
                  <tr
                    key={`${volunteer.email}-${volunteer.createdAt}`}
                    className="border-t border-oj-ink/20 align-top"
                  >
                    <td className="px-3 py-2">{volunteer.name}</td>
                    <td className="px-3 py-2">{volunteer.businessName ?? '-'}</td>
                    <td className="px-3 py-2">
                      <a className="underline" href={`mailto:${volunteer.email}`}>
                        {volunteer.email}
                      </a>
                    </td>
                    <td className="px-3 py-2">
                      {volunteer.volunteeredFor.map((key) => labelFor(survey, key)).join('; ')}
                    </td>
                    <td className="px-3 py-2">
                      {(survey.resultsQuestionKey
                        ? picksOf(volunteer.answers[survey.resultsQuestionKey])
                        : []
                      )
                        .map((key) => labelFor(survey, key))
                        .join(', ') || '-'}
                    </td>
                    <td className="px-3 py-2 text-oj-ink-2">
                      {formatSlotInLondon(volunteer.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </article>
  );
}

export default function SurveysPanel(): JSX.Element {
  const [surveys, setSurveys] = useState<AdminSurvey[] | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const token = await getValidAccessToken();
    if (!token) return;
    setError('');
    try {
      const response = await fetch('/api/admin/surveys', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not load surveys.');
      setSurveys(payload.surveys as AdminSurvey[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load surveys.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="mt-10">
      <h2 className="text-xl font-black tracking-[-0.02em] text-oj-ink">Surveys</h2>
      {error ? <p className="mt-3 text-sm font-bold text-oj-danger">{error}</p> : null}
      {surveys === null && !error ? <p className="mt-3 text-oj-ink-2">Loading surveys...</p> : null}
      {surveys?.length === 0 ? <p className="mt-3 text-oj-ink-2">No surveys yet.</p> : null}
      {surveys?.map((data) => (
        <SurveyCard key={data.survey.id} data={data} />
      ))}
    </section>
  );
}
