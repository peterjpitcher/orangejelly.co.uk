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
  title = "We're licensees, Just Like You",
  content = [
    "I'm Peter. My husband Billy and I have run The Anchor in Stanwell Moor since March 2019. We faced the same struggles - empty tables, rising costs, fierce competition.",
    "Orange Jelly exists because we discovered how AI can add 25 hours of value per week. I've been an early AI adopter since 2021, and now I help other pubs implement the same strategies that transformed our business.",
  ],
  buttonText = 'Read Our Full Story',
  buttonHref = '/about',
  imageUrl = '/logo_the-anchor.png',
  imageAlt = 'The Anchor Pub',
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
            Real pub experience + proven strategies =
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
