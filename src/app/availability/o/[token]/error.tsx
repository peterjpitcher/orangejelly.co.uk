'use client';

import Button from '@/components/Button';
import Heading from '@/components/Heading';
import Section from '@/components/Section';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * The error boundary for a genuine data-layer exception.
 *
 * An invalid, expired or unknown organiser token is NOT this — that outcome is a
 * 404 from the page, not a throw. This boundary only catches the database being
 * unreachable and similar.
 *
 * It says nothing about the poll's state and nothing about the token, matching
 * the verify boundary: the poll is almost certainly fine, and this screen is the
 * wrong place to speculate. The copy the organiser needs is "try again", because
 * their results are still there.
 */
export default function OrganiserError({
  reset,
}: {
  error: Error;
  reset: () => void;
}): JSX.Element {
  return (
    <Section background="cream" padding="large">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <Heading level={1} align="center" color="charcoal">
          Something went wrong
        </Heading>
        <Alert variant="destructive" className="text-left">
          <AlertTitle>That&apos;s at our end, not yours</AlertTitle>
          <AlertDescription>
            Your poll and everyone&apos;s answers are safe. Try again in a minute.
          </AlertDescription>
        </Alert>
        <Button variant="outline" size="medium" type="button" onClick={reset}>
          Try again
        </Button>
      </div>
    </Section>
  );
}
