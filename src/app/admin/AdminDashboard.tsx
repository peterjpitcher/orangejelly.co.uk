'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const ADMIN_SESSION_KEY = 'oj-admin-session';

type CountRow = {
  label: string;
  count: number;
};

type ContactRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  pub_name: string;
  package_interest: string | null;
  message: string;
  source_page: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  created_at: string;
  status: string;
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
  recentContacts: ContactRow[];
  recentSubscribers: SubscriberRow[];
  generatedAt: string;
};

type AdminSession = {
  access_token: string;
  expires_at?: number;
  user?: {
    email?: string;
  };
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
    <div className="rounded-lg border border-charcoal/10 bg-white p-5">
      <p className="text-sm text-charcoal/60">{label}</p>
      <p className="mt-2 text-3xl font-bold text-charcoal">{value}</p>
      <p className="mt-1 text-xs text-charcoal/50">{sub}</p>
    </div>
  );
}

function CountList({ title, rows }: { title: string; rows: CountRow[] }) {
  return (
    <section className="rounded-lg border border-charcoal/10 bg-white p-5">
      <h2 className="text-lg font-semibold text-charcoal">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-charcoal/60">No data yet.</p>
        ) : (
          rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
              <span className="truncate text-charcoal/75">{row.label}</span>
              <span className="rounded bg-cream px-2 py-1 font-medium text-charcoal">
                {row.count}
              </span>
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

  async function loadStats(activeSession: AdminSession | null = session) {
    if (!activeSession) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${activeSession.access_token}`,
        },
      });
      const payload = await response.json();
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
    const stored = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const storedSession = JSON.parse(stored) as AdminSession;
      if (storedSession.expires_at && storedSession.expires_at * 1000 < Date.now() + 60 * 1000) {
        window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setLoading(false);
        return;
      }

      setSession(storedSession);
      loadStats(storedSession);
    } catch {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError('');

    let payload: {
      error?: string;
      session?: { access_token: string; expires_at?: number };
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
      expires_at: payload.session.expires_at,
      user: payload.user,
    };

    window.sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    await loadStats(nextSession);
  }

  async function handleSignOut() {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setSession(null);
    setStats(null);
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-cream px-4 py-12">
        <div className="mx-auto max-w-md rounded-lg border border-charcoal/10 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-charcoal">Orange Jelly admin</h1>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-charcoal">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-md border border-charcoal/20 px-3 py-2"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-charcoal">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-md border border-charcoal/20 px-3 py-2"
                autoComplete="current-password"
                required
              />
            </div>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-orange px-4 py-2 font-medium text-white disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 border-b border-charcoal/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-charcoal">Admin dashboard</h1>
            <p className="mt-1 text-sm text-charcoal/60">
              Leads, signups, and tracked conversion events.
            </p>
          </div>
          <div className="flex gap-3">
            {/*
              The only way in. The poll tool is deliberately absent from the
              public nav — a poll is something you are sent a link to, not
              something a visitor should browse to — but that reasoning stops at
              the public nav. This is the authenticated page the one organiser
              already uses, so it is the natural front door.
            */}
            <Link
              href="/availability/new"
              className="rounded-md border border-charcoal/20 bg-white px-4 py-2 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              New availability poll
            </Link>
            <button
              type="button"
              onClick={() => loadStats()}
              className="rounded-md border border-charcoal/20 bg-white px-4 py-2 text-sm font-medium text-charcoal"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-md bg-charcoal px-4 py-2 text-sm font-medium text-white"
            >
              Sign out
            </button>
          </div>
        </div>

        {error && <div className="mt-6 rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</div>}

        {loading && !stats ? (
          <p className="mt-8 text-charcoal/60">Loading dashboard...</p>
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

            <section className="mt-6 rounded-lg border border-charcoal/10 bg-white p-5">
              <h2 className="text-lg font-semibold text-charcoal">Recent contacts</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-charcoal/60">
                    <tr>
                      <th className="py-2 pr-4 align-top">When</th>
                      <th className="py-2 pr-4 align-top">Contact</th>
                      <th className="py-2 pr-4 align-top">Venue</th>
                      <th className="py-2 pr-4 align-top">Package</th>
                      <th className="py-2 pr-4 align-top">Message</th>
                      <th className="py-2 pr-4 align-top">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentContacts.map((contact) => (
                      <tr key={contact.id} className="border-t border-charcoal/10 align-top">
                        <td className="whitespace-nowrap py-3 pr-4">
                          {formatDate(contact.created_at)}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-charcoal/50">
                            <a href={`mailto:${contact.email}`} className="hover:underline">
                              {contact.email}
                            </a>
                          </div>
                          {contact.phone && (
                            <div className="text-charcoal/50">
                              <a href={`tel:${contact.phone}`} className="hover:underline">
                                {contact.phone}
                              </a>
                            </div>
                          )}
                        </td>
                        <td className="py-3 pr-4">{contact.pub_name}</td>
                        <td className="py-3 pr-4">{contact.package_interest || '-'}</td>
                        <td className="max-w-md whitespace-pre-wrap break-words py-3 pr-4">
                          {contact.message}
                        </td>
                        <td className="max-w-xs truncate py-3 pr-4">
                          {contact.source_page || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-6 rounded-lg border border-charcoal/10 bg-white p-5">
              <h2 className="text-lg font-semibold text-charcoal">Recent newsletter signups</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-charcoal/60">
                    <tr>
                      <th className="py-2 pr-4">When</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-t border-charcoal/10">
                        <td className="py-3 pr-4">{formatDate(subscriber.created_at)}</td>
                        <td className="py-3 pr-4">{subscriber.email}</td>
                        <td className="py-3 pr-4">{subscriber.status}</td>
                        <td className="max-w-xs truncate py-3 pr-4">
                          {subscriber.source_page || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <p className="mt-4 text-xs text-charcoal/50">
              Last updated {formatDate(stats.generatedAt)}.
            </p>
          </>
        ) : null}
      </div>
    </main>
  );
}
