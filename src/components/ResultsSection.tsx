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
  testimonial = "We've added £75,000-£100,000 of value to our business using AI. We cut £250/week in Sunday waste and £4,000+ a month in supplier, rota, and energy costs. Every strategy we share has been proven in our own venue.",
  subtext = 'Featured in BII magazine for AI innovation in hospitality. From quiz nights to tasting events, this is measurable change in business performance.',
  buttonText = 'See More Hospitality Results',
  buttonHref = '/results',
  className = '',
}: ResultsSectionProps) {
  return (
    <section className={`bg-teal py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Heading level={2} align="center" color="white" className="mb-8">
          {title}
        </Heading>

        <div className="bg-teal-dark/30 rounded-lg p-8 mb-8">
          <Text size="lg" color="white" className="mb-4">
            {testimonial}
          </Text>
          <Text size="lg" className="text-cream/90">
            {subtext}
          </Text>
        </div>

        <Button
          href={buttonHref}
          variant="secondary"
          size="medium"
          className="bg-cream text-teal hover:bg-cream-light"
        >
          {buttonText}
        </Button>
      </div>
    </section>
  );
}

export default memo(ResultsSection);
