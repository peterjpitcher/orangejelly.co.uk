import Heading from '@/components/Heading';
import Text from '@/components/Text';

/**
 * The header shared by the vote screen and the edit screen.
 *
 * "All times are UK time" is not decoration. Everything is stored as an instant
 * and rendered through Europe/London, and someone reading this on a phone in
 * Spain needs to know which clock the times are on before they answer.
 */

export interface PollHeaderProps {
  title: string;
  organiserName: string;
  description?: string | null;
  location?: string | null;
  agenda?: string | null;
  /** Replaces the default "X wants to find a time" line. */
  subline?: string;
}

export default function PollHeader({
  title,
  organiserName,
  description,
  location,
  agenda,
  subline,
}: PollHeaderProps): JSX.Element {
  return (
    <header className="space-y-3">
      <Heading level={1}>{title}</Heading>

      <Text color="muted">{subline ?? `${organiserName} wants to find a time that works.`}</Text>

      {description && <Text color="charcoal">{description}</Text>}

      {agenda && (
        <div>
          <Text size="sm" weight="semibold" color="charcoal">
            What it&rsquo;s about
          </Text>
          <Text size="sm" color="muted">
            {agenda}
          </Text>
        </div>
      )}

      {location && (
        <div>
          <Text size="sm" weight="semibold" color="charcoal">
            Where
          </Text>
          <Text size="sm" color="muted">
            {location}
          </Text>
        </div>
      )}

      <Text size="sm" color="muted">
        All times are UK time (Europe/London).
      </Text>
    </header>
  );
}
