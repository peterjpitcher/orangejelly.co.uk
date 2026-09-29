'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, Button } from '@/components/oj';
import { setUpdateEmails } from '@/app/actions/poll-organiser';

/**
 * The switch for the organiser's update emails: the digest and the one nudge.
 *
 * This is where the unsubscribe link in those emails lands (`#emails`), so it
 * shows the current state and goes both ways. No dialogue, for the same reason
 * as ClosePollControl: nothing is lost either way, and the same button puts it
 * back.
 */

export interface UpdateEmailsControlProps {
  organiserToken: string;
  /** The current state. The button offers the opposite. */
  emailsOn: boolean;
}

export default function UpdateEmailsControl({
  organiserToken,
  emailsOn,
}: UpdateEmailsControlProps): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick(): void {
    setError(null);
    startTransition(async () => {
      const result = await setUpdateEmails(organiserToken, !emailsOn);
      if (result.error) setError(result.error);
    });
  }

  return (
    <section
      id="emails"
      aria-labelledby="emails-heading"
      className="scroll-mt-24 border-t-1.5 border-oj-ink/20 pt-6"
    >
      <h2 id="emails-heading" className="text-lg font-black tracking-[-0.02em] text-oj-ink">
        Update emails
      </h2>
      <p className="mt-1 text-sm text-oj-ink-2" role="status">
        {emailsOn
          ? 'On. We email you when people answer, at most once an hour, and once more if the poll goes quiet for a week.'
          : 'Off. We won’t email you about new answers. They all still show on this page.'}
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
          {emailsOn ? 'Turn them off' : 'Turn them back on'}
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
