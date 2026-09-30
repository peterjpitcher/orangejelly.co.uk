'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, Button } from '@/components/oj';
import { setInvitationEmails } from '@/app/actions/poll-invitees';

/**
 * An invited person's switch for emails about this one poll: the reminder and
 * the confirmed time.
 *
 * This is where the "turn them off" link and the unsubscribe button in their
 * invitation land (`#emails`), so it shows the current state and goes both ways.
 * No dialogue: nothing is lost either way, and the same button puts it back.
 */

export interface InviteeEmailsControlProps {
  inviteToken: string;
  /** The current state. The button offers the opposite. */
  emailsOn: boolean;
}

export default function InviteeEmailsControl({
  inviteToken,
  emailsOn,
}: InviteeEmailsControlProps): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick(): void {
    setError(null);
    startTransition(async () => {
      const result = await setInvitationEmails(inviteToken, !emailsOn);
      if (result.error) setError(result.error);
    });
  }

  return (
    <section
      id="emails"
      aria-labelledby="invitee-emails-heading"
      className="scroll-mt-24 border-t-1.5 border-oj-ink/20 pt-6"
    >
      <h2 id="invitee-emails-heading" className="text-lg font-black tracking-[-0.02em] text-oj-ink">
        Emails about this poll
      </h2>
      <p className="mt-1 text-sm text-oj-ink-2" role="status">
        {emailsOn
          ? 'On. We email you once more if you have not answered, and again with the time once it is picked.'
          : 'Off. We won’t email you about this poll again. The link still works if you change your mind.'}
      </p>

      <div className="mt-3">
        <Button
          variant="ghost"
          size="md"
          type="button"
          disabled={isPending}
          aria-busy={isPending || undefined}
          onClick={handleClick}
        >
          {isPending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
          {emailsOn ? 'Stop these emails' : 'Turn them back on'}
        </Button>
      </div>

      {error && (
        <Alert tone="danger" role="alert" className="mt-3">
          {error}
        </Alert>
      )}
    </section>
  );
}
