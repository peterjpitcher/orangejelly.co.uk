import { memo } from 'react';

import Heading from './Heading';
import AnimatedItem from './AnimatedItem';
import { MESSAGES, URLS, formatPhoneDisplay } from '@/lib/constants';
import Text from './Text';
import TrackedButton from './TrackedButton';

interface CTASectionProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  whatsappMessage?: string;
  variant?:
    | 'orange'
    | 'blue-support'
    | 'brand-base'
    | 'base'
    | 'support'
    | 'accent'
    | 'highlight'
    | 'grounded';
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
  /*
   * Each variant carries its own text colour rather than the section hardcoding
   * white. The orange variants are filled with the brand orange, where white is
   * 2.98:1 and navy is 4.55:1; the blue and navy variants are the other way round.
   * One map, so a fill can never be changed without its label following.
   */
  const variantClasses = {
    orange: 'bg-orange text-brand-base',
    accent: 'bg-orange text-brand-base',
    'blue-support': 'bg-blue-support text-white',
    support: 'bg-blue-support text-white',
    'brand-base': 'bg-brand-base text-white',
    base: 'bg-brand-base text-white',
    highlight: 'bg-brand-highlight text-brand-base',
    grounded: 'bg-brand-grounded text-white',
  };

  return (
    <section className={`${variantClasses[variant]} py-16 text-center relative overflow-hidden`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-stripe"></div>
      </div>

      {/*
        Shell for the gutter, measure for the width, in that order.
        This used to be a single `measure px-4 sm:px-6`, which put the gutter
        inside the 768px measure and pushed the copy 24px right of every other
        measure on the page.
      */}
      <div className="page-shell relative z-10">
        <div className="measure">
          <AnimatedItem animation="fade-in">
            {/* inherit, not white. The section above decides the text colour from
              its variant, and forcing white here would fight the orange fill. */}
            <Heading level={2} color="inherit" align="center" className="mb-6">
              {title}
            </Heading>
          </AnimatedItem>

          {subtitle && (
            <AnimatedItem animation="fade-in" delay={100}>
              {/* inherit, so the subtitle follows the variant's text colour. */}
              <Text size="lg" color="inherit" align="center" className="mb-8">
                {subtitle}
              </Text>
            </AnimatedItem>
          )}

          <AnimatedItem animation="fade-in" delay={200}>
            <TrackedButton
              eventName="whatsapp_click"
              eventProperties={{
                cta: 'section_whatsapp',
                section_title: title,
              }}
              href={URLS.whatsapp(whatsappMessage)}
              variant="custom"
              size="large"
              className="bg-white text-orange-dark hover:bg-surface"
              external
              aria-label="Contact us on WhatsApp about Orange Jelly services"
            >
              {buttonText}
            </TrackedButton>
          </AnimatedItem>

          {bottomText && (
            <AnimatedItem animation="fade-in" delay={300}>
              <Text size="sm" align="center" className="mt-4 opacity-80">
                {bottomText}
              </Text>
            </AnimatedItem>
          )}
        </div>
      </div>
    </section>
  );
}

export default memo(CTASection);
