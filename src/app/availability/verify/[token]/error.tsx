'use client';

import Button from '@/components/Button';
import Heading from '@/components/Heading';
import Section from '@/components/Section';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * The error boundary for a genuine data-layer exception.
 *
 * An invalid, expired or consumed token is NOT this — that outcome is rendered
 * by the page, not thrown. This boundary only catches the database being
 * unreachable and similar. It deliberately says nothing about the token: the
 * poll may or may not have been published, and guessing either way in the copy
 * would be a lie half the time.
 */
export default function VerifyError({ reset }: { error: Error; reset: () => void }): JSX.Element {
  return (
    <Section background="cream" padding="large">
      <div className="max-w-md mx-auto text-center space-y-6">
        <Heading level={1} align="center" color="charcoal">
          Something went wrong
        </Heading>
        <Alert variant="destructive" className="text-left">
          <AlertTitle>That&apos;s at our end, not yours</AlertTitle>
          <AlertDescription>Try the link from your email again in a minute.</AlertDescription>
        </Alert>
        <Button variant="outline" size="medium" type="button" onClick={reset}>
          Try again
        </Button>
      </div>
    </Section>
  );
}
