'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, Button, Modal } from '@/components/oj';
import { confirmOption } from '@/app/actions/poll-organiser';

/**
 * "Confirm this time", and its dialogue, because confirming is irreversible.
 *
 * A CLIENT COMPONENT, and one of only four on this screen. The matrix itself is
 * server-rendered; only the controls that need a dialogue and a pending state
 * cross the boundary.
 *
 * NOTE WHAT DOES NOT CROSS THE BOUNDARY. `optionLabel` arrives as a finished
 * string, formatted on the server. No date formatter and no `option_kind` branch
 * ships to the browser, which matters because `formatSlotRangeInLondon` throws
 * on a date-only value, and the branch that prevents that belongs in one place.
 * `@/lib/poll-tokens` is likewise never imported here: it pulls Node's crypto
 * shim into the browser bundle, which cost 317 kB last time.
 *
 * The dialogue is the design system's `Modal`, not the shadcn/Radix one. Radix
 * traps focus and closes on Escape, and so does this: the port carries a real
 * focus trap for exactly that reason. What Radix could not give us was the
 * surface, which is hardcoded to `rounded-lg`, `shadow-lg` and `bg-background`
 * in `ui/dialog.tsx` and cannot be restyled from a call site.
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
  /**
   * The tied alternatives render as outline so the leader's button is the one
   * that reads as "the" action. Three identical primaries stacked in one card
   * is a wall of orange with no hierarchy at all.
   *
   * The name stays `outline` because two call sites in `best-option-card` pass
   * it. The design system's equivalent role is `ghost`: transparent fill, ink
   * border, ink label.
   */
  buttonVariant?: 'primary' | 'outline';
}

export default function ConfirmControl({
  organiserToken,
  optionId,
  optionLabel,
  hasResponses,
  buttonLabel = 'Confirm this time',
  buttonVariant = 'primary',
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
        variant={buttonVariant === 'outline' ? 'ghost' : 'primary'}
        size="md"
        type="button"
        className="mt-4 w-full md:w-auto"
        onClick={() => setOpen(true)}
      >
        {buttonLabel}
      </Button>

      <Modal
        open={open}
        onClose={() => {
          // Never dismiss mid-flight: the action is already running and the
          // result still has to land somewhere.
          if (isPending) return;
          setOpen(false);
          setError(null);
        }}
        title={
          // `Modal` styles its title with `.oj-display`, which lowercases. That is
          // the marketing treatment; a tool screen keeps sentence case.
          <span className="normal-case">Confirm this time?</span>
        }
        actions={
          <>
            <Button variant="ghost" size="md" type="button" onClick={() => setOpen(false)}>
              Not yet
            </Button>
            <Button
              variant="primary"
              size="md"
              type="button"
              disabled={isPending}
              aria-busy={isPending || undefined}
              onClick={handleConfirm}
            >
              {isPending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
              Yes, confirm it
            </Button>
          </>
        }
      >
        <p className="m-0">
          {hasResponses ? optionLabel : 'Nobody voted, so this is your call.'}
          {!hasResponses && <span className="mt-2 block">{optionLabel}</span>}
        </p>

        <p className="mt-3 text-sm text-oj-ink">
          This locks the poll. You can&rsquo;t undo it from here.
        </p>

        {error && (
          <Alert tone="danger" role="alert" className="mt-4">
            {error}
          </Alert>
        )}
      </Modal>
    </>
  );
}
