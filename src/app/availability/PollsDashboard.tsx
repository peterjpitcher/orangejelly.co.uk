'use client';

import { useCallback, useEffect, useState } from 'react';

import AuthedNav from '@/components/admin/AuthedNav';
import { Alert, Button, EmptyState, Skeleton, Tag, type TagProps } from '@/components/oj';
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

/*
 * One card treatment, matching /admin, because the organiser crosses between the
 * two through AuthedNav: cream block on the paper page, ink border, the 3px
 * radius and the small hard shadow rather than a blurred one.
 */
const CARD = 'rounded-oj border-1.5 border-oj-ink bg-oj-cream p-5 shadow-press-sm';

/* Tool screens take sentence case at the tool weight, not the display face. */
const TOOL_HEADING = 'font-black tracking-[-0.02em] text-oj-ink';

/*
 * Status as Tag props rather than a colour pair.
 *
 * Each state is told apart by two things at once, never by colour alone: the
 * label, and the shape or signal dot beside it. The one live state is the filled
 * ink chip so it carries down a long list; a draft still wants something from you
 * so it keeps the orange pressure dot; a closed poll wants nothing, so it has no
 * dot at all; and a confirmed one takes the green availability dot.
 *
 * Nothing here uses the orange chip: brand orange is the one fill the palette
 * cannot carry white on, and a status chip is small bold text.
 */
const STATUS: Record<
  PollStatus,
  { label: string; variant: TagProps['variant']; dot: TagProps['dot'] }
> = {
  draft: { label: 'Not live yet', variant: 'outline', dot: true },
  open: { label: 'Taking answers', variant: 'ink', dot: true },
  closed: { label: 'Closed', variant: 'outline', dot: false },
  confirmed: { label: 'Confirmed', variant: 'outline', dot: 'ok' },
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
      <main id="main-content" className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className={`text-2xl ${TOOL_HEADING}`}>Sign in to see your polls</h1>
        <p className="mt-3 text-oj-ink-2">
          Your polls live behind the same sign-in as the admin dashboard.
        </p>
        <div className="mt-6 flex justify-center">
          <Button href="/admin">Go to sign in</Button>
        </div>
      </main>
    );
  }

  return (
    <>
      <AuthedNav />
      <main id="main-content" className="measure px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className={`text-3xl ${TOOL_HEADING}`}>Your polls</h1>
            <p className="mt-1 text-sm text-oj-ink-2">
              Every poll you have set up. Tap one to see the answers.
            </p>
          </div>
          <Button href="/availability/new" size="sm">
            New poll
          </Button>
        </div>

        {/* The skeleton stands in for the list that is coming rather than
            describing it, so the page does not reflow around a line of text.
            Skeleton announces "Loading" once to a screen reader instead of
            reading out the placeholder blocks. */}
        {state === 'loading' && (
          <div className="mt-10 space-y-4">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        )}

        {state === 'error' && (
          <Alert tone="danger" className="mt-10">
            Something went wrong.{' '}
            <button
              type="button"
              onClick={() => void load()}
              // The same inline text control EmptyState uses for its action, plus
              // the system focus ring: this is the one control on the screen that
              // is not a Button, so nothing else was giving it one.
              className="oj-focus rounded-oj font-bold text-oj-orange-deep underline underline-offset-4"
            >
              Try again
            </button>
            .
          </Alert>
        )}

        {state === 'ready' && polls.length === 0 && (
          <div className="mt-10">
            <EmptyState
              body="You have not made a poll yet."
              action={{ label: 'Make your first poll', href: '/availability/new' }}
            />
          </div>
        )}

        {state === 'ready' && polls.length > 0 && (
          <ul className="mt-8 space-y-4">
            {polls.map((poll) => {
              const status = STATUS[poll.status];
              const isConfirmed = poll.status === 'confirmed';
              const isOpen = poll.status === 'open';

              return (
                <li key={poll.id} className={CARD}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className={`text-lg ${TOOL_HEADING}`}>{poll.title}</h2>
                        <Tag size="sm" variant={status.variant} dot={status.dot}>
                          {status.label}
                        </Tag>
                      </div>

                      {isConfirmed && poll.confirmedLabel ? (
                        <p className="mt-1 text-sm font-bold text-oj-ok">
                          {poll.confirmedLabel}
                          {poll.optionKind === 'slots' ? ' UK time' : ''}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-oj-ink-2">
                          {repliesLine(poll.responderCount)}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-shrink-0 flex-wrap gap-2">
                      <Button href={`/availability/o/${poll.organiserToken}`} size="sm">
                        See answers
                      </Button>

                      {/* Sharing only makes sense while a poll is still taking
                          answers. On a closed or confirmed poll it would send
                          people to a page that no longer accepts a vote. */}
                      {isOpen && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => void copyParticipantLink(poll)}
                        >
                          {copiedId === poll.id ? 'Copied' : 'Copy sharing link'}
                        </Button>
                      )}

                      {/* Destructive, so it keeps the outline of its neighbours
                          but drops to the muted ink and only turns danger red
                          under the pointer. */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void removePoll(poll)}
                        disabled={deletingId === poll.id}
                        aria-label={`Delete ${poll.title}`}
                        className="text-oj-ink-3 hover:text-oj-danger"
                      >
                        {deletingId === poll.id ? 'Deleting…' : 'Delete'}
                      </Button>
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
