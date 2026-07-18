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
import { deleteResponse } from '@/app/actions/poll-organiser';

/**
 * "Remove" one person's answers.
 *
 * Data destruction, so the dialogue NAMES the participant. "Are you sure?" over
 * a list of eight people is not a confirmation — it is a coin toss, and the
 * organiser finds out which one they removed afterwards.
 *
 * The participant id is passed to the action, but the action never trusts it:
 * the delete is scoped by the poll the ORGANISER TOKEN resolves to. Without that
 * scope an organiser of poll A removes a participant of poll B by pasting an id.
 */

export interface DeleteResponseControlProps {
  organiserToken: string;
  participantId: string;
  displayName: string;
}

export default function DeleteResponseControl({
  organiserToken,
  participantId,
  displayName,
}: DeleteResponseControlProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(): void {
    setError(null);
    startTransition(async () => {
      const result = await deleteResponse(organiserToken, participantId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
    });
  }

  return (
    <>
      <Button
        variant="ghost"
        size="small"
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Remove ${displayName}'s answers`}
      >
        Remove
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (isPending) return;
          setOpen(next);
          if (!next) setError(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove {displayName}&rsquo;s answers?</DialogTitle>
            <DialogDescription>
              This deletes {displayName} and everything they answered. You can&rsquo;t undo it. If
              they still want a say, they can vote again with your team&rsquo;s link.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="ghost" size="medium" type="button" onClick={() => setOpen(false)}>
              Keep them
            </Button>
            <Button
              variant="primary"
              size="medium"
              type="button"
              loading={isPending}
              onClick={handleDelete}
            >
              Yes, remove them
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
