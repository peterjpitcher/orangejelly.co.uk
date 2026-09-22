'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Alert, Button, Field, Input, Modal } from '@/components/oj';
import { deletePoll } from '@/app/actions/poll-organiser';

/**
 * "Delete this poll": the organiser's Article 17 route, and the only
 * self-service erasure path in the feature.
 *
 * TYPING THE TITLE IS MANDATORY, not theatre. This destroys THIRD-PARTY data,
 * every participant's name, address and availability, not only the organiser's
 * own. A click is too cheap for that: a mis-tap on a phone should not be able to
 * erase eleven other people's answers. Typing the title is the cheapest control
 * that makes the action deliberate.
 *
 * The dialogue is the design system's `Modal`, as ConfirmControl's is: it traps
 * focus and closes on Escape the way the Radix one did, and it wears the same
 * ink border and hard shadow as everything else on the screen.
 *
 * Allowed in EVERY status, including 'confirmed'. Refusing erasure on a
 * confirmed poll would make it conditional on the poll's state, which is not a
 * defensible position for a right the organiser has regardless.
 */

export interface DeletePollControlProps {
  organiserToken: string;
  pollTitle: string;
}

export default function DeletePollControl({
  organiserToken,
  pollTitle,
}: DeletePollControlProps): JSX.Element {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Trimmed and case-insensitive: the control is against a careless tap, not
  // against the organiser's shift key.
  const matches = typed.trim().toLowerCase() === pollTitle.trim().toLowerCase();

  function handleDelete(): void {
    setError(null);
    startTransition(async () => {
      const result = await deletePoll(organiserToken);
      if (result.error) {
        setError(result.error);
        return;
      }
      // The poll is gone, so this page's own token no longer resolves. Sending
      // them home beats leaving them on a page that would now 404 on refresh.
      router.push('/availability/new');
    });
  }

  function close(): void {
    // Never dismiss mid-flight: the deletion is already running and its result
    // still has to land somewhere.
    if (isPending) return;
    setOpen(false);
    setTyped('');
    setError(null);
  }

  return (
    <>
      {/* Destructive, so it keeps the outline of its neighbours but drops to the
          muted ink and only turns danger red under the pointer, as the delete on
          the polls list does. */}
      <Button
        variant="ghost"
        size="md"
        type="button"
        onClick={() => setOpen(true)}
        className="text-oj-ink-3 hover:text-oj-danger"
      >
        Delete this poll
      </Button>

      <Modal
        open={open}
        onClose={close}
        // `Modal` titles with the lowercase display face; a tool dialogue keeps
        // sentence case, as ConfirmControl's does.
        title={<span className="normal-case">Delete this poll?</span>}
        actions={
          <>
            <Button variant="ghost" size="md" type="button" onClick={close}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="button"
              disabled={!matches || isPending}
              aria-busy={isPending || undefined}
              onClick={handleDelete}
            >
              {isPending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
              Delete it for good
            </Button>
          </>
        }
      >
        <p className="m-0">
          This deletes the poll, every option and everyone&rsquo;s answers, including their names
          and email addresses. It cannot be undone, and the links stop working for everybody.
        </p>

        <Field
          className="mt-4"
          htmlFor="delete-poll-title"
          label={
            <>
              Type <span className="font-black">{pollTitle}</span> to confirm
            </>
          }
          hint="We ask for the title because this erases other people’s details, not just yours."
        >
          <Input
            id="delete-poll-title"
            value={typed}
            autoComplete="off"
            onChange={(event) => setTyped(event.target.value)}
          />
        </Field>

        {error && (
          <Alert tone="danger" role="alert" className="mt-4">
            {error}
          </Alert>
        )}
      </Modal>
    </>
  );
}
