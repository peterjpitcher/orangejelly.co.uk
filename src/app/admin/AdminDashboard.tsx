'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import AuthedNav from '@/components/admin/AuthedNav';
import EnquiriesPanel from '@/components/admin/EnquiriesPanel';
import { Alert, Button, Field, Input, Stat, Tag } from '@/components/oj';
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

/*
 * The one card treatment on this screen, so a stat block, a count list and the
 * signups table cannot drift apart. Cream on the paper page, ink border, the
 * 3px radius and the small hard shadow: the same block the rebuilt marketing
 * pages use, at the smaller shadow because a tool screen stacks a lot of them.
 */
const CARD = 'rounded-oj border-1.5 border-oj-ink bg-oj-cream p-5 shadow-press-sm';

/*
 * Tool screens take sentence case headings rather than the lowercase display
 * face. This is an internal console, not a marketing page.
 */
const PANEL_HEADING = 'font-black tracking-[-0.02em] text-oj-ink';

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
    <div className={CARD}>
      <Stat value={value} label={label} sub={sub} size="sm" />
    </div>
  );
}

function CountList({ title, rows }: { title: string; rows: CountRow[] }) {
  return (
    <section className={CARD}>
      <h2 className={`text-lg ${PANEL_HEADING}`}>{title}</h2>
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
      <main id="main-content" className="min-h-screen bg-oj-paper px-4 py-12">
        <div className="mx-auto max-w-md rounded-oj-lg border-1.5 border-oj-ink bg-oj-cream p-7 shadow-press">
          {/*
           * The logo says whose console this is before the heading does. The
           * supplied asset is 1200x260 and around 194KB, so next/image sizes it
           * down rather than shipping the raw file for something 28px tall.
           */}
          <Image
            src="/brand/logo-horizontal.png"
            alt="Orange Jelly"
            width={1200}
            height={260}
            priority
            className="h-7 w-auto"
          />
          <h1 className={`mt-6 text-2xl ${PANEL_HEADING}`}>Orange Jelly admin</h1>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
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
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Navigation for the signed-in area: Dashboard, Polls, New poll, Sign out.
          It also carries the create-poll link that used to live in this header,
          so the poll tool is reachable without editing the URL. */}
      <AuthedNav />
      <main id="main-content" className="min-h-screen bg-oj-paper px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 border-b-1.5 border-oj-ink pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className={`text-3xl ${PANEL_HEADING}`}>Admin dashboard</h1>
              <p className="mt-1 text-sm text-oj-ink-2">
                Leads, signups, and tracked conversion events.
              </p>
            </div>
            {/* Ghost is the tertiary role: this sits beside the page title and
                should not compete with anything the panels below offer. The
                component centres its own label, which is what the hand-rolled
                button here had to be patched to do. */}
            <Button variant="ghost" size="sm" onClick={() => loadStats()} className="self-start">
              Refresh
            </Button>
          </div>

          {error && (
            <Alert tone="danger" className="mt-6">
              {error}
            </Alert>
          )}

          {loading && !stats ? (
            <p className="mt-8 text-oj-ink-2">Loading dashboard...</p>
          ) : stats ? (
            <>
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
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

              <EnquiriesPanel />

              <section className={`mt-6 ${CARD}`}>
                <h2 className={`text-lg ${PANEL_HEADING}`}>Recent newsletter signups</h2>
                <div className="mt-4 overflow-x-auto">
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
              </section>

              <p className="mt-4 text-xs text-oj-ink-3">
                Last updated {formatDate(stats.generatedAt)}.
              </p>
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}
