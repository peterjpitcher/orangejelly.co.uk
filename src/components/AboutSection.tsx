import { memo } from 'react';
import OptimizedImage from './OptimizedImage';
import Heading from './Heading';
import Text from './Text';
import Button from './Button';

interface AboutSectionProps {
  title?: string;
  content?: string[];
  buttonText?: string;
  buttonHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
}

function AboutSection({
  title = 'We Are Small On Purpose',
  content = [
    "I'm Peter. Billy and I run The Anchor in Stanwell Moor. We face the same challenges hospitality operators face every week: pressure on trade, pressure on margins, and not enough time.",
    'Orange Jelly exists to turn that experience into practical growth support: clear priorities, faster execution, and systems that move bookings, footfall, and repeat visits.',
  ],
  buttonText = 'Read Our Full Story',
  buttonHref = '/about',
  imageUrl = '/images/the-anchor/the-anchor-exterior.jpg',
  imageAlt = 'Exterior of The Anchor pub',
  className = '',
}: AboutSectionProps) {
  return (
    <section className={`bg-white py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Heading level={2} color="charcoal" className="mb-6">
              {title}
            </Heading>
            {content.map((paragraph, index) => (
              <Text key={index} color="muted" className="mb-4">
                {paragraph}
              </Text>
            ))}
            <Button href={buttonHref} variant="primary" size="medium" className="mt-4">
              {buttonText} →
            </Button>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-orange/10 to-teal/10 rounded-2xl p-8">
              <OptimizedImage
                src={imageUrl}
                alt={imageAlt}
                width={400}
                height={300}
                className="rounded-lg shadow-lg mx-auto"
              />
              <div className="text-center mt-4">
                <Text size="sm" weight="semibold" color="charcoal">
                  Proven Daily At
                </Text>
                <Text size="2xl" weight="bold" className="text-orange">
                  The Anchor
                </Text>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 pt-12 border-t border-gray-200">
          <Text size="lg" color="muted" className="mb-2">
            Real hospitality experience + practical execution =
          </Text>
          <Heading level={3} className="text-orange">
            Orange Jelly
          </Heading>
        </div>
      </div>
    </section>
  );
}

export default memo(AboutSection);
