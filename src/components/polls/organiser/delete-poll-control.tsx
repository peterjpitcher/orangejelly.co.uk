'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deletePoll } from '@/app/actions/poll-organiser';

/**
 * "Delete this poll" — the organiser's Article 17 route, and the only
 * self-service erasure path in the feature.
 *
 * TYPING THE TITLE IS MANDATORY, not theatre. This destroys THIRD-PARTY data —
 * every participant's name, address and availability — not only the organiser's
 * own. A click is too cheap for that: a mis-tap on a phone should not be able to
 * erase eleven other people's answers. Typing the title is the cheapest control
 * that makes the action deliberate.
 *
 * Uses `ui/dialog.tsx`, which exists. There is no `alert-dialog.tsx` in this
 * repo — do not import one.
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

  return (
    <>
      <Button
        variant="ghost"
        size="medium"
        type="button"
        onClick={() => setOpen(true)}
        className="text-charcoal-light"
      >
        Delete this poll
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (isPending) return;
          setOpen(next);
          if (!next) {
            setTyped('');
            setError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this poll?</DialogTitle>
            <DialogDescription>
              This deletes the poll, every option and everyone&rsquo;s answers, including their
              names and email addresses. It cannot be undone, and the links stop working for
              everybody.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="delete-poll-title">
              Type <span className="font-semibold">{pollTitle}</span> to confirm
            </Label>
            <Input
              id="delete-poll-title"
              value={typed}
              autoComplete="off"
              onChange={(event) => setTyped(event.target.value)}
              aria-describedby="delete-poll-hint"
            />
            <p id="delete-poll-hint" className="text-sm text-charcoal-light">
              We ask for the title because this erases other people&rsquo;s details, not just yours.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="ghost" size="medium" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="medium"
              type="button"
              loading={isPending}
              disabled={!matches}
              onClick={handleDelete}
            >
              Delete it for good
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
