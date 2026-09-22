'use client';

import { useCallback, useEffect, useState } from 'react';

import BackOfficeBand, { BLOCK_HEADING, CARD_ON_CREAM } from '@/components/admin/BackOfficeBand';
import EnquirySummary from '@/components/admin/EnquirySummary';
import { Alert, Field, Select, Tag, type TagProps } from '@/components/oj';
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

/*
 * Lead state as Tag props, the way the polls list shows a poll's state.
 *
 * Each state is told apart by the label and by the shape beside it, never by
 * colour alone. A new enquiry is the one that wants you, so it is the filled ink
 * chip and carries down a long list. The three in-progress states keep the orange
 * pressure dot; a declined lead wants nothing, so it has no dot; a client takes the
 * green dot. Nothing uses the orange chip: a status chip is small bold text, and
 * brand orange is the one fill the palette cannot carry it on.
 */
const STATE_TAG: Record<LeadState, { variant: TagProps['variant']; dot: TagProps['dot'] }> = {
  new: { variant: 'ink', dot: true },
  contacted: { variant: 'outline', dot: true },
  qualified: { variant: 'outline', dot: true },
  conversation_booked: { variant: 'outline', dot: true },
  declined: { variant: 'outline', dot: false },
  client: { variant: 'outline', dot: 'ok' },
};

function StateBadge({ state }: { state: LeadState }) {
  const { variant, dot } = STATE_TAG[state];
  return (
    <Tag size="sm" variant={variant} dot={dot}>
      {LEAD_STATE_LABELS[state]}
    </Tag>
  );
}

function Answer({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="mt-2">
      <dt className="text-xs font-bold uppercase tracking-[0.14em] text-oj-ink-2">{label}</dt>
      <dd className="whitespace-pre-wrap break-words text-sm text-oj-ink">{value}</dd>
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
    // Cream, between the paper numbers above and the paper surveys below.
    <BackOfficeBand tone="page" heading="enquiries.">
      <EnquirySummary />

      <div className="mt-10 max-w-xs">
        <Field label="Show" htmlFor="enquiry-filter">
          <Select
            id="enquiry-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value as LeadState | 'all')}
          >
            <option value="all">Everything</option>
            {LEAD_STATES.map((state) => (
              <option key={state} value={state}>
                {LEAD_STATE_LABELS[state]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {error ? (
        <Alert tone="danger" className="mt-4">
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <p className="mt-4 text-sm text-oj-ink-2">Loading…</p>
      ) : enquiries.length === 0 ? (
        <p className="mt-4 text-sm text-oj-ink-2">
          {filter === 'all' ? 'No enquiries yet.' : `Nothing in ${LEAD_STATE_LABELS[filter]}.`}
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-4">
          {enquiries.map((enquiry) => (
            <li key={enquiry.id} className={CARD_ON_CREAM} aria-busy={updating === enquiry.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className={`text-lg ${BLOCK_HEADING}`}>
                    {enquiry.company || enquiry.legacy.pubName || 'No company given'}
                  </p>
                  <p className="text-sm text-oj-ink-2">
                    {enquiry.name} ·{' '}
                    <a
                      href={`mailto:${enquiry.email}`}
                      className="font-semibold text-oj-ink underline"
                    >
                      {enquiry.email}
                    </a>
                    {enquiry.role ? ` · ${enquiry.role}` : ''}
                    {enquiry.sizeBand ? ` · ${enquiry.sizeBand} people` : ''}
                  </p>
                  <p className="mt-1 text-xs text-oj-ink-2">
                    {formatWhen(enquiry.createdAt)}
                    {enquiry.sourcePage ? ` · from ${enquiry.sourcePage}` : ''}
                    {enquiry.utmCampaign ? ` · ${enquiry.utmCampaign}` : ''}
                    {enquiry.completedStep < 2 ? ' · step one only' : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StateBadge state={enquiry.status} />
                  <label className="block w-52">
                    <span className="sr-only">Lead state for {enquiry.name}</span>
                    <Select
                      value={enquiry.status}
                      onChange={(event) =>
                        void updateStatus(enquiry.id, event.target.value as LeadState)
                      }
                    >
                      {LEAD_STATES.map((state) => (
                        <option key={state} value={state}>
                          {LEAD_STATE_LABELS[state]}
                        </option>
                      ))}
                    </Select>
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
                    className="font-semibold text-oj-ink underline"
                  >
                    {enquiry.website}
                  </a>{' '}
                  <span className="text-oj-ink-2">(opens in a new tab)</span>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </BackOfficeBand>
  );
}
