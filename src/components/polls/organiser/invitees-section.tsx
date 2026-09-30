'use client';

import { useEffect, useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, Button, Field, Textarea } from '@/components/oj';
import { getValidAccessToken, readSession } from '@/lib/admin-session';
import {
  inviteByEmail,
  removeInvitation,
  retryInvitations,
  type InviteActionResult,
} from '@/app/actions/poll-invitees';
import {
  MAX_INVITEES_PER_POLL,
  inviteEmailsProblem,
  parseInviteEmails,
} from '@/lib/validation/poll-invitees';
import type { InviteeListItem, InviteeStatus } from '@/app/availability/o/organiser-data';

/**
 * The people this poll invited by email, and the controls to invite more.
 *
 * Anyone holding the organiser link sees the list: it is their poll and their
 * list. Only a signed-in admin gets the controls, because only a signed-in admin
 * may send invitations (Peter's decision, 30 September 2026); the actions check
 * that again with Supabase, so hiding the controls is courtesy, not the lock.
 */

export interface InviteesSectionProps {
  organiserToken: string;
  /** Only an open poll takes new invitations. */
  pollOpen: boolean;
  invitees: InviteeListItem[];
}

const STATUS_LABEL: Record<InviteeStatus, string> = {
  answered: '✓ Answered',
  waiting: 'Waiting',
  unsent: 'Email didn’t send',
  stopped: 'Asked us to stop emailing',
};

function describeResult(invited: NonNullable<InviteActionResult['invited']>): string {
  const parts: string[] = [];
  if (invited.sent > 0) {
    parts.push(`Sent to ${invited.sent === 1 ? '1 person' : `${invited.sent} people`}.`);
  }
  if (invited.alreadyInvited > 0) {
    parts.push(
      `${invited.alreadyInvited === 1 ? '1 was' : `${invited.alreadyInvited} were`} already on the list.`
    );
  }
  if (invited.sent === 0 && invited.alreadyInvited === 0 && invited.failed === 0) {
    parts.push('Nobody new to email.');
  }
  return parts.join(' ');
}

export default function InviteesSection({
  organiserToken,
  pollOpen,
  invitees,
}: InviteesSectionProps): JSX.Element | null {
  const [isAdmin, setIsAdmin] = useState(false);
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // A signed-in session is only knowable in the browser, so it is read after mount.
  useEffect(() => {
    setIsAdmin(Boolean(readSession()));
  }, []);

  if (invitees.length === 0 && !isAdmin) return null;

  const answered = invitees.filter((invitee) => invitee.status === 'answered').length;
  const unsent = invitees.filter((invitee) => invitee.status === 'unsent').length;
  const list = parseInviteEmails(emails);
  const problem = emails.trim() ? inviteEmailsProblem(list) : null;

  function run(action: (adminToken: string | undefined) => Promise<InviteActionResult>): void {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const adminToken = (await getValidAccessToken()) ?? undefined;
      const result = await action(adminToken);

      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.invited) {
        if (result.invited.failed > 0) {
          setError(
            `${result.invited.failed === 1 ? '1 invitation' : `${result.invited.failed} invitations`} didn’t send. ${describeResult(result.invited)} Try again below, or send those people the link yourself.`
          );
        } else {
          setMessage(describeResult(result.invited));
        }
      }
      setEmails('');
    });
  }

  return (
    <section
      aria-labelledby="invitees-heading"
      className="rounded-oj border-1.5 border-oj-ink/20 bg-oj-cream p-5"
    >
      <h2 id="invitees-heading" className="text-lg font-black tracking-[-0.02em] text-oj-ink">
        Invited by email
      </h2>
      {invitees.length > 0 ? (
        <p className="mt-1 text-sm text-oj-ink-2">
          {answered} of {invitees.length} {invitees.length === 1 ? 'has' : 'have'} answered. Each
          person has their own link, so this list knows who has replied.
        </p>
      ) : (
        <p className="mt-1 text-sm text-oj-ink-2">
          We email each person their own link, and replies come to you. You can still send the link
          yourself too.
        </p>
      )}

      {invitees.length > 0 && (
        <ul className="mt-4 divide-y divide-oj-ink/10">
          {invitees.map((invitee) => (
            <li key={invitee.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span className="break-all text-sm font-semibold text-oj-ink">{invitee.email}</span>
              <span className="flex items-center gap-3">
                <span className="text-sm text-oj-ink-2">{STATUS_LABEL[invitee.status]}</span>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    disabled={isPending}
                    aria-label={`Remove ${invitee.email} from the list`}
                    onClick={() =>
                      run((adminToken) => removeInvitation(organiserToken, adminToken, invitee.id))
                    }
                  >
                    Remove
                  </Button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      {isAdmin && pollOpen && unsent > 0 && (
        <div className="mt-4">
          <Button
            variant="primary"
            size="md"
            type="button"
            disabled={isPending}
            aria-busy={isPending || undefined}
            onClick={() => run((adminToken) => retryInvitations(organiserToken, adminToken))}
          >
            {isPending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
            Try the unsent ones again
          </Button>
        </div>
      )}

      {isAdmin && pollOpen && (
        <form
          className="mt-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (problem || list.emails.length === 0) return;
            run((adminToken) => inviteByEmail(organiserToken, adminToken, emails));
          }}
        >
          <Field
            htmlFor="invite-more-emails"
            label={invitees.length > 0 ? 'Invite more people' : 'Invite people by email'}
            hint={`Up to ${MAX_INVITEES_PER_POLL} on one poll. One address per line, or separated by commas.`}
            error={problem ?? undefined}
          >
            <Textarea
              id="invite-more-emails"
              value={emails}
              onChange={(event) => setEmails(event.target.value)}
              rows={3}
              maxLength={10000}
              placeholder={'sam@example.com\nalex@example.com'}
              disabled={isPending}
            />
          </Field>
          <Button
            variant="ghost"
            size="md"
            type="submit"
            disabled={isPending || Boolean(problem) || list.emails.length === 0}
            aria-busy={isPending || undefined}
          >
            {isPending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
            {list.emails.length > 1
              ? `Email ${list.emails.length} invitations`
              : 'Email the invitation'}
          </Button>
        </form>
      )}

      {message && (
        <Alert tone="ok" role="status" className="mt-3">
          {message}
        </Alert>
      )}
      {error && (
        <Alert tone="danger" role="alert" className="mt-3">
          {error}
        </Alert>
      )}
    </section>
  );
}
