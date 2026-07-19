'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import AuthedNav from '@/components/admin/AuthedNav';
import { getValidAccessToken } from '@/lib/admin-session';
import { deletePoll } from '@/app/actions/poll-organiser';

/**
 * The organiser's home for polls: every poll they have made, its TRUE current
 * state, and the action that fits that state. It answers "how do I get back to a
 * poll I made yesterday" without hunting through email for the organiser link.
 *
 * The card adapts to the poll's status, because the flows genuinely differ:
 *  - open: you might still be collecting answers, so the sharing link is offered.
 *  - closed: answering is over, so sharing is not shown; you review and confirm.
 *  - confirmed: the outcome is what matters, so the chosen time is shown and
 *    there is nothing left to share.
 *  - draft: not yet live; it needs the email confirming before anyone can vote.
 *
 * Admin-gated: it renders organiser tokens, so an unauthenticated visitor gets
 * the sign-in prompt, never the list.
 */

type PollStatus = 'draft' | 'open' | 'closed' | 'confirmed';

interface PollListItem {
  id: string;
  title: string;
  status: PollStatus;
  optionKind: 'dates' | 'slots';
  organiserToken: string;
  participantToken: string;
  responderCount: number;
  confirmedLabel: string | null;
  createdAt: string;
  expiresAt: string;
}

type LoadState = 'loading' | 'anon' | 'ready' | 'error';

const STATUS: Record<PollStatus, { label: string; style: string }> = {
  draft: { label: 'Not live yet', style: 'bg-charcoal/10 text-charcoal' },
  open: { label: 'Taking answers', style: 'bg-orange/10 text-orange' },
  closed: { label: 'Closed', style: 'bg-charcoal/10 text-charcoal' },
  confirmed: { label: 'Confirmed', style: 'bg-teal/10 text-teal' },
};

// Active polls first (they need attention), then closed, then confirmed. Within
// a group, newest first. This puts what the organiser is likely to act on at the
// top rather than burying it under finished polls.
const STATUS_ORDER: Record<PollStatus, number> = { open: 0, draft: 1, closed: 2, confirmed: 3 };

function repliesLine(count: number): string {
  if (count === 0) return 'No replies yet';
  if (count === 1) return '1 person has replied';
  return `${count} people have replied`;
}

export default function PollsDashboard(): JSX.Element {
  const [state, setState] = useState<LoadState>('loading');
  const [polls, setPolls] = useState<PollListItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setState('loading');
    const token = await getValidAccessToken();
    if (!token) {
      setState('anon');
      return;
    }

    try {
      const res = await fetch('/api/admin/polls', {
        headers: { Authorization: `Bearer ${token}` },
        // Never a cached list: a poll the organiser just closed must not still
        // read as "Taking answers".
        cache: 'no-store',
      });
      if (res.status === 401) {
        setState('anon');
        return;
      }
      if (!res.ok) {
        setState('error');
        return;
      }
      const body = (await res.json()) as { polls: PollListItem[] };
      const sorted = [...body.polls].sort(
        (a, b) =>
          STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || b.createdAt.localeCompare(a.createdAt)
      );
      setPolls(sorted);
      setState('ready');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function copyParticipantLink(poll: PollListItem): Promise<void> {
    const url = `${window.location.origin}/availability/p/${poll.participantToken}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(poll.id);
      window.setTimeout(
        () => setCopiedId((current) => (current === poll.id ? null : current)),
        2000
      );
    } catch {
      // Clipboard blocked. The results page also shows the link.
    }
  }

  async function removePoll(poll: PollListItem): Promise<void> {
    const confirmed = window.confirm(
      `Delete "${poll.title}"? This removes the poll and every answer, and cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(poll.id);
    try {
      const result = await deletePoll(poll.organiserToken);
      if (result.error) {
        setState('error');
        return;
      }
      // Drop it locally at once, then reconcile with a fresh load.
      setPolls((current) => current.filter((p) => p.id !== poll.id));
      void load();
    } finally {
      setDeletingId(null);
    }
  }

  if (state === 'anon') {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-charcoal">Sign in to see your polls</h1>
        <p className="mt-3 text-charcoal/70">
          Your polls live behind the same sign-in as the admin dashboard.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-orange px-6 py-3 font-medium text-white transition-colors hover:bg-orange-dark"
        >
          Go to sign in
        </Link>
      </main>
    );
  }

  return (
    <>
      <AuthedNav />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-charcoal">Your polls</h1>
            <p className="mt-1 text-sm text-charcoal/60">
              Every poll you have set up. Tap one to see the answers.
            </p>
          </div>
          <Link
            href="/availability/new"
            className="inline-flex items-center justify-center rounded-md bg-orange px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-dark"
          >
            New poll
          </Link>
        </div>

        {state === 'loading' && (
          <p className="mt-10 text-center text-charcoal/60">Loading your polls…</p>
        )}

        {state === 'error' && (
          <div className="mt-10 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Something went wrong.{' '}
            <button onClick={() => void load()} className="underline">
              Try again
            </button>
            .
          </div>
        )}

        {state === 'ready' && polls.length === 0 && (
          <div className="mt-10 rounded-lg border border-charcoal/15 bg-white p-8 text-center">
            <p className="text-charcoal/70">You have not made a poll yet.</p>
            <Link
              href="/availability/new"
              className="mt-4 inline-flex items-center justify-center rounded-md bg-orange px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-dark"
            >
              Make your first poll
            </Link>
          </div>
        )}

        {state === 'ready' && polls.length > 0 && (
          <ul className="mt-8 space-y-4">
            {polls.map((poll) => {
              const status = STATUS[poll.status];
              const isConfirmed = poll.status === 'confirmed';
              const isOpen = poll.status === 'open';

              return (
                <li
                  key={poll.id}
                  className="rounded-lg border border-charcoal/15 bg-white p-5 transition-shadow hover:shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-charcoal">{poll.title}</h2>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.style}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      {isConfirmed && poll.confirmedLabel ? (
                        <p className="mt-1 text-sm font-medium text-teal">
                          {poll.confirmedLabel}
                          {poll.optionKind === 'slots' ? ' UK time' : ''}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-charcoal/60">
                          {repliesLine(poll.responderCount)}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-shrink-0 flex-wrap gap-2">
                      <Link
                        href={`/availability/o/${poll.organiserToken}`}
                        className="inline-flex items-center justify-center rounded-md bg-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-dark"
                      >
                        See answers
                      </Link>

                      {/* Sharing only makes sense while a poll is still taking
                          answers. On a closed or confirmed poll it would send
                          people to a page that no longer accepts a vote. */}
                      {isOpen && (
                        <button
                          type="button"
                          onClick={() => void copyParticipantLink(poll)}
                          className="inline-flex items-center justify-center rounded-md border border-orange px-4 py-2 text-sm font-medium text-orange transition-colors hover:bg-orange hover:text-white"
                        >
                          {copiedId === poll.id ? 'Copied' : 'Copy sharing link'}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => void removePoll(poll)}
                        disabled={deletingId === poll.id}
                        className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-charcoal/60 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                        aria-label={`Delete ${poll.title}`}
                      >
                        {deletingId === poll.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
