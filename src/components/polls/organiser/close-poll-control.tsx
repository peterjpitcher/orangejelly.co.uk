'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, Button } from '@/components/oj';
import { setPollOpen } from '@/app/actions/poll-organiser';

/**
 * Close the poll, or reopen it.
 *
 * NO DIALOGUE, DELIBERATELY, and this is the one control here that does not get
 * one. Closing destroys nothing and sends nothing; it stops replies, and the
 * button directly beside it puts them back. A confirmation on a reversible
 * action trains people to click through the confirmations that matter, and the
 * two that matter on this screen are irreversible.
 */

export interface ClosePollControlProps {
  organiserToken: string;
  /** The current state. The button offers the opposite. */
  isOpen: boolean;
}

export default function ClosePollControl({
  organiserToken,
  isOpen,
}: ClosePollControlProps): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick(): void {
    setError(null);
    startTransition(async () => {
      const result = await setPollOpen(organiserToken, !isOpen);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div>
      {/* Ghost, the design system's outline role: this is reversible, so it
          stays quieter than the orange confirm above it. The spinner and
          aria-busy stand in for the old Button's `loading`, as ConfirmControl
          does. */}
      <Button
        variant="ghost"
        size="md"
        type="button"
        disabled={isPending}
        aria-busy={isPending || undefined}
        onClick={handleClick}
      >
        {isPending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
        {isOpen ? 'Close the poll' : 'Reopen the poll'}
      </Button>

      {isOpen && (
        <p className="mt-2 text-sm text-oj-ink-2">
          Stops replies. You can reopen it whenever you like.
        </p>
      )}

      {error && (
        <Alert tone="danger" role="alert" className="mt-3">
          {error}
        </Alert>
      )}
    </div>
  );
}
