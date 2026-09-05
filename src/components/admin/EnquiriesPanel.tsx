'use client';

import { useCallback, useEffect, useState } from 'react';

import EnquirySummary from '@/components/admin/EnquirySummary';
import { getValidAccessToken } from '@/lib/admin-session';
import type { AdminEnquiry } from '@/lib/db/enquiries';
import { LEAD_STATES, LEAD_STATE_LABELS, type LeadState } from '@/lib/schemas/enquiry';

/**
 * The enquiry list and the lead pipeline.
 *
 * This replaced a "Recent contacts" table that showed venue, package and message:
 * three columns that are null on every enquiry the new form writes, and a fourth
 * concept (packages with prices) that no longer exists.
 *
 * The qualification answers are shown in full here and nowhere else. They are the
 * most commercially sensitive data the site holds, which is why the notification
 * email carries step one only and links here for the rest.
 *
 * @see tasks/repositioning/SUB-SPECS.md part 1.7 and 1.9
 */
function formatWhen(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function StateBadge({ state }: { state: LeadState }) {
  // Brand tokens only: tailwind.config.js replaces the numeric orange scale with a
  // named ramp, so bg-orange-100 would silently emit no CSS at all.
  const tone =
    state === 'client'
      ? 'bg-brand-base text-white'
      : state === 'declined'
        ? 'bg-surface-alt text-brand-base/70'
        : state === 'new'
          ? 'bg-orange-light text-orange-darker'
          : 'bg-surface text-brand-base';

  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${tone}`}>
      {LEAD_STATE_LABELS[state]}
    </span>
  );
}

function Answer({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="mt-2">
      <dt className="text-xs font-semibold uppercase tracking-wide text-brand-base/60">{label}</dt>
      <dd className="whitespace-pre-wrap break-words text-sm">{value}</dd>
    </div>
  );
}

export default function EnquiriesPanel() {
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [filter, setFilter] = useState<LeadState | 'all'>('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async (status: LeadState | 'all') => {
    const token = await getValidAccessToken();
    if (!token) return;

    setLoading(true);
    setError('');
    try {
      const query = status === 'all' ? '' : `?status=${status}`;
      const response = await fetch(`/api/admin/enquiries${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not load enquiries.');
      setEnquiries(payload.enquiries as AdminEnquiry[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load enquiries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(filter);
  }, [filter, load]);

  async function updateStatus(id: string, status: LeadState) {
    const token = await getValidAccessToken();
    if (!token) return;

    // Optimistic, then reconciled. Moving a lead along is the one thing done here
    // repeatedly, and a spinner on every click makes working a list of ten
    // enquiries feel like ten round trips.
    const previous = enquiries;
    setEnquiries((rows) => rows.map((row) => (row.id === id ? { ...row, status } : row)));
    setUpdating(id);

    try {
      const response = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || 'Could not update.');
      }
      if (filter !== 'all' && status !== filter) {
        setEnquiries((rows) => rows.filter((row) => row.id !== id));
      }
    } catch (err) {
      setEnquiries(previous);
      setError(err instanceof Error ? err.message : 'Could not update.');
    } finally {
      setUpdating(null);
    }
  }

  return (
    <section className="mt-6 rounded-lg border border-brand-base/10 bg-white p-5">
      <EnquirySummary />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-brand-base">Enquiries</h2>
        <label className="text-sm">
          <span className="mr-2 text-brand-base/75">Show</span>
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as LeadState | 'all')}
            className="min-h-tap rounded border border-brand-base/20 px-2 py-1"
          >
            <option value="all">Everything</option>
            {LEAD_STATES.map((state) => (
              <option key={state} value={state}>
                {LEAD_STATE_LABELS[state]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-4 text-sm text-brand-base/75">Loading…</p>
      ) : enquiries.length === 0 ? (
        <p className="mt-4 text-sm text-brand-base/75">
          {filter === 'all' ? 'No enquiries yet.' : `Nothing in ${LEAD_STATE_LABELS[filter]}.`}
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {enquiries.map((enquiry) => (
            <li
              key={enquiry.id}
              className="rounded-lg border border-brand-base/10 p-4"
              aria-busy={updating === enquiry.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-base">
                    {enquiry.company || enquiry.legacy.pubName || 'No company given'}
                  </p>
                  <p className="text-sm text-brand-base/75">
                    {enquiry.name} ·{' '}
                    <a href={`mailto:${enquiry.email}`} className="hover:underline">
                      {enquiry.email}
                    </a>
                    {enquiry.role ? ` · ${enquiry.role}` : ''}
                    {enquiry.sizeBand ? ` · ${enquiry.sizeBand} people` : ''}
                  </p>
                  <p className="mt-1 text-xs text-brand-base/60">
                    {formatWhen(enquiry.createdAt)}
                    {enquiry.sourcePage ? ` · from ${enquiry.sourcePage}` : ''}
                    {enquiry.utmCampaign ? ` · ${enquiry.utmCampaign}` : ''}
                    {enquiry.completedStep < 2 ? ' · step one only' : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <StateBadge state={enquiry.status} />
                  <label className="text-sm">
                    <span className="sr-only">Lead state for {enquiry.name}</span>
                    <select
                      value={enquiry.status}
                      onChange={(event) =>
                        void updateStatus(enquiry.id, event.target.value as LeadState)
                      }
                      className="min-h-tap rounded border border-brand-base/20 px-2 py-1"
                    >
                      {LEAD_STATES.map((state) => (
                        <option key={state} value={state}>
                          {LEAD_STATE_LABELS[state]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <dl className="mt-3">
                <Answer label="What is happening" value={enquiry.situation} />
                <Answer label="Blocking growth" value={enquiry.qualification.blocker} />
                <Answer label="Success looks like" value={enquiry.qualification.success} />
                <Answer label="Why now" value={enquiry.qualification.whyNow} />
                {/* Historic pub-era enquiries. Read-only, and blank on everything new. */}
                <Answer label="Message (archive)" value={enquiry.legacy.message} />
                <Answer label="Package interest (archive)" value={enquiry.legacy.packageInterest} />
              </dl>

              {enquiry.website ? (
                <p className="mt-3 text-sm">
                  <a
                    href={enquiry.website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="font-semibold underline"
                  >
                    {enquiry.website}
                  </a>{' '}
                  <span className="text-brand-base/60">(opens in a new tab)</span>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
