'use client';

import { useEffect, useState } from 'react';
import { getValidAccessToken } from '@/lib/admin-session';
import { formatDateInLondon, formatSlotInLondon } from '@/lib/dateUtils';
import { defaultSummaryPeriod, type EnquirySummaryData } from '@/lib/enquiry-summary';
import { LEAD_STATES, LEAD_STATE_LABELS } from '@/lib/schemas/enquiry';

export default function EnquirySummary(): JSX.Element {
  const [period, setPeriod] = useState(defaultSummaryPeriod);
  const [exclusions, setExclusions] = useState('');
  const [summary, setSummary] = useState<EnquirySummaryData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [whatsapp, setWhatsapp] = useState('');
  const [duplicates, setDuplicates] = useState('');

  useEffect(() => {
    let active = true;
    async function load(): Promise<void> {
      setLoading(true);
      setError('');
      setSummary(null);
      try {
        const token = await getValidAccessToken();
        if (!token) throw new Error('Sign in again to view the enquiry summary.');
        const params = new URLSearchParams({ from: period.from, to: period.to });
        if (period.excludedIds.length) params.set('exclude', period.excludedIds.join(','));
        const response = await fetch(`/api/admin/enquiry-summary?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Could not load the summary.');
        if (active) setSummary(payload as EnquirySummaryData);
      } catch (cause) {
        if (active)
          setError(cause instanceof Error ? cause.message : 'Could not load the summary.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [period, refresh]);

  return (
    <section
      className="mt-6 rounded-lg border border-brand-base/10 bg-white p-5"
      aria-labelledby="enquiry-summary-title"
    >
      <h2 id="enquiry-summary-title" className="text-lg font-semibold">
        Enquiry measurement
      </h2>
      <p className="mt-2 text-sm">
        The last 28 complete London days by default. Enquiries are grouped by creation date and
        their current stage.
      </p>
      <form
        className="mt-4 flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setPeriod({
            from: String(data.get('from')),
            to: String(data.get('to')),
            excludedIds: exclusions ? exclusions.split(',').map((id) => id.trim()) : [],
          });
          setWhatsapp('');
          setDuplicates('');
          setRefresh((value) => value + 1);
        }}
      >
        <label className="text-sm">
          From
          <input
            required
            name="from"
            type="date"
            defaultValue={period.from}
            className="mt-1 block min-h-tap rounded border border-brand-base/20 px-2"
          />
        </label>
        <label className="text-sm">
          To
          <input
            required
            name="to"
            type="date"
            defaultValue={period.to}
            className="mt-1 block min-h-tap rounded border border-brand-base/20 px-2"
          />
        </label>
        <label className="min-w-0 flex-1 text-sm">
          Test enquiry IDs to exclude
          <input
            value={exclusions}
            onChange={(event) => setExclusions(event.target.value)}
            maxLength={1850}
            placeholder="Comma-separated UUIDs"
            className="mt-1 block min-h-tap w-full rounded border border-brand-base/20 px-2"
          />
        </label>
        <button type="submit" className="min-h-tap rounded bg-brand-base px-4 text-white">
          Update summary
        </button>
      </form>
      {loading && (
        <p className="mt-4" role="status">
          Loading summary…
        </p>
      )}
      {error && (
        <p className="mt-4" role="alert">
          {error}
        </p>
      )}
      {summary && (
        <div className="mt-4 space-y-4 text-sm">
          <p>
            {formatDateInLondon(summary.period.from, 'short')} to{' '}
            {formatDateInLondon(summary.period.to, 'short')}. Observed{' '}
            {formatSlotInLondon(summary.observedAt)}. {summary.excludedTests} test enquiries
            excluded from {summary.excludedTestIdsSupplied} supplied IDs.
          </p>
          <p className="font-semibold">
            Stored enquiries: {summary.enquiries.total}. Current qualified or later:{' '}
            {summary.enquiries.qualifiedOrLater}.
          </p>
          <p>
            {LEAD_STATES.map(
              (state) => `${LEAD_STATE_LABELS[state]}: ${summary.enquiries.states[state]}`
            ).join(' · ')}{' '}
            · Unknown stage: {summary.enquiries.states.unknown}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <caption className="mb-2 text-left font-semibold">
                Selected guide context, not proof of Google acquisition
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="p-2">
                    Guide
                  </th>
                  <th scope="col" className="p-2">
                    Enquiries
                  </th>
                  <th scope="col" className="p-2">
                    Qualified or later
                  </th>
                  <th scope="col" className="p-2">
                    Booked now
                  </th>
                  <th scope="col" className="p-2">
                    Clients now
                  </th>
                </tr>
              </thead>
              <tbody>
                {summary.guides.map((row) => (
                  <tr key={row.guide} className="border-t border-brand-base/10">
                    <th scope="row" className="break-words p-2 font-normal">
                      {row.guide === 'unknown' ? 'Unknown or no guide context' : row.guide}
                    </th>
                    <td className="p-2">{row.total}</td>
                    <td className="p-2">{row.qualifiedOrLater}</td>
                    <td className="p-2">{row.states.conversation_booked}</td>
                    <td className="p-2">{row.states.client}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!summary.guides.length && <p>No stored enquiries in this period.</p>}
          </div>
          <div>
            <h3 className="font-semibold">First-party event counts</h3>
            <p>These are events, not unique visitors or confirmed WhatsApp conversations.</p>
            {Object.entries(summary.events.currentVersion).map(([name, count]) => (
              <p key={name}>
                {name}: {count} current version, {summary.events.legacy[name]} legacy or
                unversioned.
              </p>
            ))}
            <p>Anonymous test clicks cannot be linked to an excluded enquiry ID.</p>
          </div>
          <div>
            <h3 className="font-semibold">Data not connected</h3>
            <p>{summary.unavailable.googleClicks}</p>
            <p>{summary.unavailable.consentedSessions}</p>
            <p>{summary.unavailable.conversionRate}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Manual weekly readout</h3>
            <p>
              Enter aggregate counts only for this period. These notes stay in this tab and are
              cleared when the report changes or the page reloads. Copy them to your weekly readout.
            </p>
            <label className="block">
              New genuine WhatsApp conversations
              <input
                type="number"
                min="0"
                step="1"
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
                className="ml-2 min-h-tap w-24 rounded border border-brand-base/20 px-2"
              />
            </label>
            <label className="block">
              Known duplicate conversations to remove
              <input
                type="number"
                min="0"
                step="1"
                value={duplicates}
                onChange={(event) => setDuplicates(event.target.value)}
                className="ml-2 min-h-tap w-24 rounded border border-brand-base/20 px-2"
              />
            </label>
          </div>
          <p>
            Stages show the position now, not when someone entered a stage. Qualified or later
            includes qualified, conversation booked and client. Earlier qualification of a declined
            lead is unavailable without a stage history. Check relevance and workload manually
            before interpreting these counts.
          </p>
        </div>
      )}
    </section>
  );
}
