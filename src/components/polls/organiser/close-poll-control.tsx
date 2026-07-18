'use client';

import { useState, useTransition } from 'react';
import Button from '@/components/Button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { setPollOpen } from '@/app/actions/poll-organiser';

/**
 * Close the poll, or reopen it.
 *
 * NO DIALOGUE, DELIBERATELY — and this is the one control here that does not get
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
      <Button
        variant="outline"
        size="medium"
        type="button"
        loading={isPending}
        onClick={handleClick}
      >
        {isOpen ? 'Close the poll' : 'Reopen the poll'}
      </Button>

      {isOpen && (
        <p className="mt-2 text-sm text-charcoal-light">
          Stops replies. You can reopen it whenever you like.
        </p>
      )}

      {error && (
        <Alert variant="destructive" role="alert" className="mt-3">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
