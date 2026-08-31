'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, Button, Modal } from '@/components/oj';
import { deleteResponse } from '@/app/actions/poll-organiser';

/**
 * "Remove" one person's answers.
 *
 * Data destruction, so the dialogue NAMES the participant. "Are you sure?" over
 * a list of eight people is not a confirmation: it is a coin toss, and the
 * organiser finds out which one they removed afterwards.
 *
 * The participant id is passed to the action, but the action never trusts it:
 * the delete is scoped by the poll the ORGANISER TOKEN resolves to. Without that
 * scope an organiser of poll A removes a participant of poll B by pasting an id.
 *
 * The dialogue is the design system's `Modal` for the same reason as the confirm
 * control: it carries its own focus trap and Escape handling, and the shadcn
 * dialog's surface is hardcoded to the old system.
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
        size="sm"
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Remove ${displayName}'s answers`}
      >
        Remove
      </Button>

      <Modal
        open={open}
        onClose={() => {
          if (isPending) return;
          setOpen(false);
          setError(null);
        }}
        title={
          // Sentence case: `Modal` styles its title with `.oj-display`, which
          // lowercases, and a lowercased person's name reads as a typo.
          <span className="normal-case">Remove {displayName}&rsquo;s answers?</span>
        }
        actions={
          <>
            <Button variant="ghost" size="md" type="button" onClick={() => setOpen(false)}>
              Keep them
            </Button>
            <Button
              variant="primary"
              size="md"
              type="button"
              disabled={isPending}
              aria-busy={isPending || undefined}
              onClick={handleDelete}
            >
              {isPending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
              Yes, remove them
            </Button>
          </>
        }
      >
        <p className="m-0">
          This deletes {displayName} and everything they answered. You can&rsquo;t undo it. If they
          still want a say, they can vote again with your team&rsquo;s link.
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
