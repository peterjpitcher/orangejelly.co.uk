'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import AuthedNav from '@/components/admin/AuthedNav';
import { getValidAccessToken } from '@/lib/admin-session';

/**
 * The organiser's home for polls: every poll they have made, its status, how
 * many people have replied, and one tap to the results or to copy the sharing
 * link. It is the answer to "how do I get back to a poll I made yesterday"
 * without hunting through email for the organiser link.
 *
 * Admin-gated on purpose. It renders organiser tokens, so an unauthenticated
 * visitor gets the sign-in prompt, never the list.
 */

interface PollListItem {
  id: string;
  title: string;
  status: 'draft' | 'open' | 'closed' | 'confirmed';
  optionKind: 'dates' | 'slots';
  organiserToken: string;
  participantToken: string;
  responderCount: number;
  createdAt: string;
  expiresAt: string;
}

type LoadState = 'loading' | 'anon' | 'ready' | 'error';

const STATUS_LABEL: Record<PollListItem['status'], string> = {
  draft: 'Not confirmed yet',
  open: 'Taking answers',
  closed: 'Closed to answers',
  confirmed: 'Time confirmed',
};

const STATUS_STYLE: Record<PollListItem['status'], string> = {
  draft: 'bg-charcoal/10 text-charcoal',
  open: 'bg-orange/10 text-orange',
  closed: 'bg-charcoal/10 text-charcoal',
  confirmed: 'bg-teal/10 text-teal',
};

export default function PollsDashboard(): JSX.Element {
  const [state, setState] = useState<LoadState>('loading');
  const [polls, setPolls] = useState<PollListItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      setPolls(body.polls);
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
      // Clipboard blocked. Leave it; the results page also shows the link.
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
            We could not load your polls.{' '}
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
            {polls.map((poll) => (
              <li
                key={poll.id}
                className="rounded-lg border border-charcoal/15 bg-white p-5 transition-shadow hover:shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-charcoal">{poll.title}</h2>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[poll.status]}`}
                      >
                        {STATUS_LABEL[poll.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-charcoal/60">
                      {poll.responderCount === 1
                        ? '1 person has replied'
                        : `${poll.responderCount} people have replied`}
                    </p>
                  </div>

                  <div className="flex flex-shrink-0 flex-wrap gap-2">
                    <Link
                      href={`/availability/o/${poll.organiserToken}`}
                      className="inline-flex items-center justify-center rounded-md bg-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-dark"
                    >
                      See answers
                    </Link>
                    <button
                      type="button"
                      onClick={() => void copyParticipantLink(poll)}
                      className="inline-flex items-center justify-center rounded-md border border-orange px-4 py-2 text-sm font-medium text-orange transition-colors hover:bg-orange hover:text-white"
                    >
                      {copiedId === poll.id ? 'Copied' : 'Copy sharing link'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
