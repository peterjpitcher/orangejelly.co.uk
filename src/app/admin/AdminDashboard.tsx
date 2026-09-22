'use client';

import { useEffect, useState } from 'react';
import AuthedNav, { BackOfficeLogo } from '@/components/admin/AuthedNav';
import BackOfficeBand, {
  BLOCK_HEADING,
  CARD_ON_CREAM,
  CARD_ON_PAPER,
} from '@/components/admin/BackOfficeBand';
import BackOfficeHero from '@/components/admin/BackOfficeHero';
import EnquiriesPanel from '@/components/admin/EnquiriesPanel';
import SurveysPanel from '@/components/admin/SurveysPanel';
import { Alert, Button, Field, Header, Input, KeepCase, Stat, Tag } from '@/components/oj';
import {
  readSession,
  writeSession,
  clearSession,
  getValidAccessToken,
  type AdminSession,
} from '@/lib/admin-session';

type CountRow = {
  label: string;
  count: number;
};

type SubscriberRow = {
  id: string;
  email: string;
  status: string;
  source_page: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  created_at: string;
  last_seen_at: string;
};

type AdminStats = {
  totals: {
    contacts: number;
    subscribers: number;
    events: number;
  };
  last30Days: {
    contacts: number;
    subscribers: number;
    events: number;
  };
  eventCounts: CountRow[];
  sourcePages: CountRow[];
  campaigns: CountRow[];
  searchTerms: CountRow[];
  recentSubscribers: SubscriberRow[];
  generatedAt: string;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function StatCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className={CARD_ON_PAPER}>
      <Stat value={value} label={label} sub={sub} size="sm" />
    </div>
  );
}

function CountList({ title, rows }: { title: string; rows: CountRow[] }) {
  return (
    <section className={CARD_ON_PAPER}>
      <h2 className={`text-lg ${BLOCK_HEADING}`}>{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-oj-ink-3">No data yet.</p>
        ) : (
          rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
              <span className="truncate text-oj-ink-2">{row.label}</span>
              {/* The count is a value, not a category, so the tag keeps its
                  near-square corners and drops the signal dot. */}
              <Tag size="sm" dot={false}>
                {row.count}
              </Tag>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    // Always fetch a currently-valid token, refreshing silently if the stored
    // one is close to expiry. This is what stops the "log in again every time".
    const token = await getValidAccessToken();
    if (!token) {
      setSession(null);
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await response.json();
      if (response.status === 401) {
        // Token rejected even after refresh: the session is truly gone.
        clearSession();
        setSession(null);
        setStats(null);
        return;
      }
      if (!response.ok) {
        throw new Error(payload.error || 'Could not load admin stats.');
      }
      setStats(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load admin stats.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const stored = readSession();
    if (!stored) {
      setLoading(false);
      return;
    }
    setSession(stored);
    void loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError('');

    let payload: {
      error?: string;
      session?: { access_token: string; refresh_token?: string; expires_at?: number };
      user?: { email?: string };
    };

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      payload = await response.json();

      if (!response.ok || !payload.session?.access_token) {
        setError(payload.error || 'Could not sign in.');
        setLoading(false);
        return;
      }
    } catch {
      setError('Could not reach the admin login service.');
      setLoading(false);
      return;
    }

    const nextSession: AdminSession = {
      access_token: payload.session.access_token,
      refresh_token: payload.session.refresh_token,
      expires_at: payload.session.expires_at,
      email: payload.user?.email,
    };

    writeSession(nextSession);
    setSession(nextSession);
    await loadStats();
  }

  if (!session) {
    return (
      <>
        {/*
         * The public bar with the logo alone: it says whose console this is before
         * the heading does, in the same place the rest of the site puts it. No
         * items and no action, because there is nowhere to go until you are in.
         */}
        <Header home="/" logo={<BackOfficeLogo />} />
        <main id="main-content" className="min-h-screen bg-oj-cream">
          <BackOfficeHero eyebrow="back office" title={<KeepCase>Orange Jelly admin.</KeepCase>} />
          {/* The form sits on the cream band with paper fields, as the public
              enquiry form does, rather than in a box of its own. */}
          <BackOfficeBand tone="page" divider={false}>
            <form onSubmit={handleLogin} className="max-w-md space-y-4">
              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </Field>
              <Field label="Password" htmlFor="password">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </Field>
              {/* Alert carries role="alert" on the danger tone, so a failed sign-in
                  announces itself on a submit that did not move the page. */}
              {error && <Alert tone="danger">{error}</Alert>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </BackOfficeBand>
        </main>
      </>
    );
  }

  return (
    <>
      {/* Navigation for the signed-in area: Dashboard, Polls, New poll, Sign out.
          It also carries the create-poll link that used to live in this header,
          so the poll tool is reachable without editing the URL. */}
      <AuthedNav />
      <main id="main-content" className="min-h-screen bg-oj-paper">
        <BackOfficeHero
          eyebrow="back office"
          title="dashboard."
          intro="Leads, signups, and tracked conversion events."
          actions={
            // Ghost is the tertiary role: it sits beside the page title and should
            // not compete with anything the panels below offer. On the ink band it
            // takes the white outline from the ground, not from this call site.
            <Button variant="ghost" size="sm" onClick={() => loadStats()}>
              Refresh
            </Button>
          }
        />

        {/*
         * The page is a stack of bands, paper and cream in turn with the ink rule
         * between them, the way the public pages are. The numbers need no heading
         * of their own: they are the first thing under "dashboard".
         */}
        <BackOfficeBand tone="paper">
          {error && (
            <Alert tone="danger" className="mb-6">
              {error}
            </Alert>
          )}

          {loading && !stats ? (
            <p className="text-oj-ink-2">Loading dashboard...</p>
          ) : stats ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCard
                  label="Contacts"
                  value={stats.totals.contacts}
                  sub={`${stats.last30Days.contacts} in 30 days`}
                />
                <StatCard
                  label="Newsletter signups"
                  value={stats.totals.subscribers}
                  sub={`${stats.last30Days.subscribers} in 30 days`}
                />
                <StatCard
                  label="Events"
                  value={stats.totals.events}
                  sub={`${stats.last30Days.events} in 30 days`}
                />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
                <CountList title="Events" rows={stats.eventCounts} />
                <CountList title="Search terms" rows={stats.searchTerms} />
                <CountList title="Source pages" rows={stats.sourcePages} />
                <CountList title="Campaigns" rows={stats.campaigns} />
              </div>
            </>
          ) : null}
        </BackOfficeBand>

        {stats ? (
          <>
            <EnquiriesPanel />

            <SurveysPanel />

            <BackOfficeBand tone="page" heading="recent newsletter signups." divider={false}>
              <div className={CARD_ON_CREAM}>
                <div className="overflow-x-auto">
                  {/* The compare table's treatment, in full: the block is bounded
                      by the 1.5px ink rule and stands on paper, so the ink header
                      is the top of a block rather than a bar floating on the card.
                      Hairline ink dividers between rows keep a full rule off every
                      signup. */}
                  <table className="w-full border-collapse border-1.5 border-oj-ink bg-oj-paper text-left text-sm">
                    {/* `text-left` on every header cell, not only on the table. The
                        user agent centres a th, and that beats the inherited
                        alignment, so without this the four labels sit centred over
                        left-aligned data. */}
                    <thead className="bg-oj-ink text-oj-cream">
                      <tr>
                        <th scope="col" className="px-3 py-2.5 text-left font-bold">
                          When
                        </th>
                        <th scope="col" className="px-3 py-2.5 text-left font-bold">
                          Email
                        </th>
                        <th scope="col" className="px-3 py-2.5 text-left font-bold">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-2.5 text-left font-bold">
                          Source
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentSubscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="border-t border-oj-ink/15">
                          <td className="px-3 py-3 text-oj-ink-2">
                            {formatDate(subscriber.created_at)}
                          </td>
                          <td className="px-3 py-3 text-oj-ink">{subscriber.email}</td>
                          <td className="px-3 py-3 text-oj-ink-2">{subscriber.status}</td>
                          <td className="max-w-xs truncate px-3 py-3 text-oj-ink-2">
                            {subscriber.source_page || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="mt-4 text-xs text-oj-ink-3">
                Last updated {formatDate(stats.generatedAt)}.
              </p>
            </BackOfficeBand>
          </>
        ) : null}
      </main>
    </>
  );
}
