import BackOfficeHero from '@/components/admin/BackOfficeHero';

/**
 * The header shared by the vote screen and the edit screen.
 *
 * "All times are UK time" is not decoration. Everything is stored as an instant
 * and rendered through Europe/London, and someone reading this on a phone in
 * Spain needs to know which clock the times are on before they answer.
 *
 * It renders the ink hero the rest of the site opens on, so it must sit at the
 * top of `<main>`, full width, rather than inside the page's shell. The title is
 * the organiser's own words, so it keeps its case.
 */

export interface PollHeaderProps {
  title: string;
  organiserName: string;
  description?: string | null;
  location?: string | null;
  agenda?: string | null;
  /** Replaces the default "X wants to find a time" line. */
  subline?: string;
  /** The small peach line above the title: what this screen is for. */
  eyebrow?: string;
}

export default function PollHeader({
  title,
  organiserName,
  description,
  location,
  agenda,
  subline,
  eyebrow = 'availability poll',
}: PollHeaderProps): JSX.Element {
  return (
    <BackOfficeHero
      eyebrow={eyebrow}
      title={title}
      keepCase
      intro={subline ?? `${organiserName} wants to find a time that works.`}
    >
      <div className="max-w-[62ch] space-y-3 text-oj-cream/85">
        {description && <p className="text-[17px] leading-relaxed">{description}</p>}

        {agenda && (
          <div>
            <p className="text-sm font-bold text-oj-cream">What it&rsquo;s about</p>
            <p className="text-sm">{agenda}</p>
          </div>
        )}

        {location && (
          <div>
            <p className="text-sm font-bold text-oj-cream">Where</p>
            <p className="text-sm">{location}</p>
          </div>
        )}

        <p className="text-sm">All times are UK time (Europe/London).</p>
      </div>
    </BackOfficeHero>
  );
}
