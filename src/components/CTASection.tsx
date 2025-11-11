import { memo } from 'react';

import Button from './Button';
import Heading from './Heading';
import AnimatedItem from './AnimatedItem';
import { MESSAGES, URLS, formatPhoneDisplay } from '@/lib/constants';
import Text from './Text';

interface CTASectionProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  whatsappMessage?: string;
  variant?: 'orange' | 'teal' | 'charcoal';
  bottomText?: string;
}

function CTASection({
  title,
  subtitle,
  buttonText = MESSAGES.cta.primary,
  whatsappMessage = MESSAGES.whatsapp.default,
  variant = 'orange',
  bottomText = `${formatPhoneDisplay()} | ${MESSAGES.response.whatsapp}`,
}: CTASectionProps) {
  const bgColors = {
    orange: 'bg-orange',
    teal: 'bg-teal',
    charcoal: 'bg-charcoal',
  };

  return (
    <section
      className={`${bgColors[variant]} text-white py-16 text-center relative overflow-hidden`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-stripe"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <AnimatedItem animation="fade-in">
          <Heading level={2} color="white" align="center" className="mb-6">
            {title}
          </Heading>
        </AnimatedItem>

        {subtitle && (
          <AnimatedItem animation="fade-in" delay={100}>
            <Text size="lg" align="center" className="mb-8">
              {subtitle}
            </Text>
          </AnimatedItem>
        )}

        <AnimatedItem animation="fade-in" delay={200}>
          <Button
            href={URLS.whatsapp(whatsappMessage)}
            variant="custom"
            size="large"
            className="bg-white text-orange hover:bg-cream"
            external
            aria-label="Contact us on WhatsApp about Orange Jelly services"
          >
            {buttonText}
          </Button>
        </AnimatedItem>

        {bottomText && (
          <AnimatedItem animation="fade-in" delay={300}>
            <Text size="sm" align="center" className="mt-4 opacity-80">
              {bottomText}
            </Text>
          </AnimatedItem>
        )}
      </div>
    </section>
  );
}

export default memo(CTASection);
