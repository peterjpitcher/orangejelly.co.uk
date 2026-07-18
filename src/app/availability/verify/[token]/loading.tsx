import Section from '@/components/Section';
import { Skeleton } from '@/components/ui/skeleton';

/** The streamed shell while verification runs. */
export default function VerifyLoading(): JSX.Element {
  return (
    <Section background="cream" padding="large">
      <div className="max-w-md mx-auto space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-12 w-full" />
      </div>
    </Section>
  );
}
