'use client';

import { useState, useTransition } from 'react';
import Button from '@/components/Button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { confirmOption } from '@/app/actions/poll-organiser';

/**
 * "Confirm this time" — and its dialogue, because confirming is irreversible.
 *
 * A CLIENT COMPONENT, and one of only four on this screen. The matrix itself is
 * server-rendered; only the controls that need a dialogue and a pending state
 * cross the boundary.
 *
 * NOTE WHAT DOES NOT CROSS THE BOUNDARY. `optionLabel` arrives as a finished
 * string, formatted on the server. No date formatter and no `option_kind` branch
 * ships to the browser — which matters because `formatSlotRangeInLondon` throws
 * on a date-only value, and the branch that prevents that belongs in one place.
 * `@/lib/poll-tokens` is likewise never imported here: it pulls Node's crypto
 * shim into the browser bundle, which cost 317 kB last time.
 *
 * Radix's Dialog traps focus and closes on Escape out of the box, which is the
 * project's modal accessibility bar met without extra work.
 */

export interface ConfirmControlProps {
  organiserToken: string;
  optionId: string;
  /** Already prose, formatted on the server per option_kind. */
  optionLabel: string;
  /** Changes the dialogue's body: nobody voted, so it is purely the organiser's call. */
  hasResponses: boolean;
  /** "Confirm this time" on the summary card; a per-row label reads oddly. */
  buttonLabel?: string;
}

export default function ConfirmControl({
  organiserToken,
  optionId,
  optionLabel,
  hasResponses,
  buttonLabel = 'Confirm this time',
}: ConfirmControlProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleConfirm(): void {
    setError(null);
    startTransition(async () => {
      const result = await confirmOption(organiserToken, optionId);
      if (result.error) {
        // The dialogue stays open: the organiser is mid-decision, and closing it
        // under them would read as "it worked".
        setError(result.error);
        return;
      }
      setOpen(false);
    });
  }

  return (
    <>
      <Button
        variant="primary"
        size="medium"
        type="button"
        fullWidth
        className="mt-4 md:w-auto"
        onClick={() => setOpen(true)}
      >
        {buttonLabel}
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          // Never dismiss mid-flight: the action is already running and the
          // result still has to land somewhere.
          if (isPending) return;
          setOpen(next);
          if (!next) setError(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm this time?</DialogTitle>
            <DialogDescription>
              {hasResponses ? optionLabel : 'Nobody voted, so this is your call.'}
              {!hasResponses && <span className="mt-2 block">{optionLabel}</span>}
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-charcoal">
            This locks the poll. You can&rsquo;t undo it from here.
          </p>

          {error && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="ghost" size="medium" type="button" onClick={() => setOpen(false)}>
              Not yet
            </Button>
            <Button
              variant="primary"
              size="medium"
              type="button"
              loading={isPending}
              onClick={handleConfirm}
            >
              Yes, confirm it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
