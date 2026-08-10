import { memo } from 'react';
import Heading from './Heading';
import Text from './Text';
import Button from './Button';

interface ResultsSectionProps {
  title?: string;
  testimonial?: string;
  subtext?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
}

function ResultsSection({
  title = 'Real Results from The Anchor',
  testimonial = "We grew Google Search visibility by 828%, table bookings by 403%, and food revenue by 98%. All using AI, all proven in our own venue. Every strategy we share, we've tested behind our own bar.",
  subtext = 'Featured in BII magazine for AI innovation in hospitality. From quiz nights to tasting events, this is measurable change in business performance.',
  buttonText = 'See More Hospitality Results',
  buttonHref = '/results',
  className = '',
}: ResultsSectionProps) {
  return (
    <section className={`bg-brand-base py-16 ${className}`}>
      <div className="page-shell text-center">
        <Heading level={2} align="center" color="white" className="mb-8">
          {title}
        </Heading>

        <div className="bg-blue-support/25 rounded-lg p-8 mb-8">
          <Text size="lg" color="white" className="mb-4">
            {testimonial}
          </Text>
          <Text size="lg" className="text-white/90">
            {subtext}
          </Text>
        </div>

        <Button
          href={buttonHref}
          variant="secondary"
          size="medium"
          className="bg-white text-brand-base hover:bg-surface-bright"
        >
          {buttonText}
        </Button>
      </div>
    </section>
  );
}

export default memo(ResultsSection);
