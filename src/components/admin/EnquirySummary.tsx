'use client';

import { useEffect, useState } from 'react';
import { BLOCK_HEADING, CARD_ON_CREAM } from '@/components/admin/BackOfficeBand';
import { Alert, Button, Field, Input } from '@/components/oj';
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
    /*
     * A block on the cream enquiries band, so it heads itself at h3 under the
     * band's "enquiries." heading. The tables take the signups table's treatment:
     * ink header, ink rule round the block, hairline rows.
     */
    <section className={CARD_ON_CREAM} aria-labelledby="enquiry-summary-title">
      <h3 id="enquiry-summary-title" className={`text-lg ${BLOCK_HEADING}`}>
        Enquiry measurement
      </h3>
      <p className="mt-2 text-sm text-oj-ink-2">
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
        <Field label="From" htmlFor="summary-from">
          <Input
            id="summary-from"
            required
            name="from"
            type="date"
            defaultValue={period.from}
            className="w-auto"
          />
        </Field>
        <Field label="To" htmlFor="summary-to">
          <Input
            id="summary-to"
            required
            name="to"
            type="date"
            defaultValue={period.to}
            className="w-auto"
          />
        </Field>
        <div className="min-w-[16rem] flex-1">
          <Field label="Test enquiry IDs to exclude" htmlFor="summary-exclude">
            <Input
              id="summary-exclude"
              value={exclusions}
              onChange={(event) => setExclusions(event.target.value)}
              maxLength={1850}
              placeholder="Comma-separated UUIDs"
            />
          </Field>
        </div>
        {/* Solid, the ink block: this panel's own action, quieter than orange. */}
        <Button type="submit" variant="solid">
          Update summary
        </Button>
      </form>
      {loading && (
        <p className="mt-4 text-sm text-oj-ink-2" role="status">
          Loading summary…
        </p>
      )}
      {error && (
        <Alert tone="danger" className="mt-4">
          {error}
        </Alert>
      )}
      {summary && (
        <div className="mt-4 space-y-4 text-sm text-oj-ink">
          <p>
            {formatDateInLondon(summary.period.from, 'short')} to{' '}
            {formatDateInLondon(summary.period.to, 'short')}. Observed{' '}
            {formatSlotInLondon(summary.observedAt)}. {summary.excludedTests} test enquiries
            excluded from {summary.excludedTestIdsSupplied} supplied IDs.
          </p>
          <p className="font-bold">
            Stored enquiries: {summary.enquiries.total}. Current qualified or later:{' '}
            {summary.enquiries.qualifiedOrLater}.
          </p>
          <p className="text-oj-ink-2">
            {LEAD_STATES.map(
              (state) => `${LEAD_STATE_LABELS[state]}: ${summary.enquiries.states[state]}`
            ).join(' · ')}{' '}
            · Unknown stage: {summary.enquiries.states.unknown}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-1.5 border-oj-ink bg-oj-paper text-left">
              <caption className="mb-2 text-left font-bold text-oj-ink">
                Selected guide context, not proof of Google acquisition
              </caption>
              <thead className="bg-oj-ink text-oj-cream">
                <tr>
                  <th scope="col" className="px-3 py-2.5 text-left font-bold">
                    Guide
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-left font-bold">
                    Enquiries
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-left font-bold">
                    Qualified or later
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-left font-bold">
                    Booked now
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-left font-bold">
                    Clients now
                  </th>
                </tr>
              </thead>
              <tbody>
                {summary.guides.map((row) => (
                  <tr key={row.guide} className="border-t border-oj-ink/15">
                    <th scope="row" className="break-words px-3 py-2.5 font-normal">
                      {row.guide === 'unknown' ? 'Unknown or no guide context' : row.guide}
                    </th>
                    <td className="px-3 py-2.5 tabular-nums">{row.total}</td>
                    <td className="px-3 py-2.5 tabular-nums">{row.qualifiedOrLater}</td>
                    <td className="px-3 py-2.5 tabular-nums">{row.states.conversation_booked}</td>
                    <td className="px-3 py-2.5 tabular-nums">{row.states.client}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!summary.guides.length && (
              <p className="mt-2 text-oj-ink-2">No stored enquiries in this period.</p>
            )}
          </div>
          <div>
            <h4 className={BLOCK_HEADING}>First-party event counts</h4>
            <p className="text-oj-ink-2">
              These are events, not unique visitors or confirmed WhatsApp conversations.
            </p>
            {Object.entries(summary.events.currentVersion).map(([name, count]) => (
              <p key={name}>
                {name}: {count} current version, {summary.events.legacy[name]} legacy or
                unversioned.
              </p>
            ))}
            <p className="text-oj-ink-2">
              Anonymous test clicks cannot be linked to an excluded enquiry ID.
            </p>
          </div>
          <div>
            <h4 className={BLOCK_HEADING}>Data not connected</h4>
            <p>{summary.unavailable.googleClicks}</p>
            <p>{summary.unavailable.consentedSessions}</p>
            <p>{summary.unavailable.conversionRate}</p>
          </div>
          <div className="space-y-3">
            <h4 className={BLOCK_HEADING}>Manual weekly readout</h4>
            <p className="text-oj-ink-2">
              Enter aggregate counts only for this period. These notes stay in this tab and are
              cleared when the report changes or the page reloads. Copy them to your weekly readout.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="w-64">
                <Field label="New genuine WhatsApp conversations" htmlFor="summary-whatsapp">
                  <Input
                    id="summary-whatsapp"
                    type="number"
                    min="0"
                    step="1"
                    value={whatsapp}
                    onChange={(event) => setWhatsapp(event.target.value)}
                  />
                </Field>
              </div>
              <div className="w-64">
                <Field label="Known duplicate conversations to remove" htmlFor="summary-duplicates">
                  <Input
                    id="summary-duplicates"
                    type="number"
                    min="0"
                    step="1"
                    value={duplicates}
                    onChange={(event) => setDuplicates(event.target.value)}
                  />
                </Field>
              </div>
            </div>
          </div>
          <p className="text-oj-ink-2">
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
