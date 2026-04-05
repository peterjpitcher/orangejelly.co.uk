import WhatsAppButton from './WhatsAppButton';
import Button from './Button';
import OptimizedImage from '@/components/OptimizedImage';
import Text from './Text';
import Heading from './Heading';
import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb';

interface HeroProps {
  title: string | React.ReactNode;
  subtitle?: string;
  showCTA?: boolean;
  ctaText?: string;
  ctaLabel?: string;
  ctaMessage?: string;
  secondaryAction?: {
    text: string;
    href: string;
  };
  bottomText?: string;
  headingLevel?: 1 | 2; // Prevent multiple h1s on a page
  breadcrumbs?: BreadcrumbItem[]; // Optional breadcrumbs
}

export default function Hero({
  title,
  subtitle,
  showCTA = true,
  ctaText = "Hi Peter, I'd like help building momentum for my venue.",
  ctaLabel = 'Start a Growth Conversation',
  ctaMessage,
  secondaryAction,
  bottomText,
  headingLevel = 1,
  breadcrumbs,
  backgroundImage,
}: HeroProps & { backgroundImage?: string }) {
  const isImageBackground = !!backgroundImage;
  const whatsappMessage = ctaMessage || ctaText;

  return (
    <section
      className={`relative overflow-hidden ${
        isImageBackground ? 'bg-charcoal' : 'bg-gradient-to-b from-cream to-white'
      }`}
    >
      {/* Background Image with Overlay */}
      {isImageBackground && (
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={backgroundImage}
            alt=""
            fill
            className="object-cover brightness-[0.34] contrast-110 saturate-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-dark/78 via-charcoal/74 to-charcoal-dark/84" />
          <div className="absolute inset-0 bg-black/22" />
        </div>
      )}

      {/* Watermark Logo - only show if no background image */}
      {!isImageBackground && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <OptimizedImage
            src="/logo.png"
            alt=""
            width={400}
            height={400}
            className="opacity-[0.03] blur-sm"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </div>
      )}

      <div className={`relative z-10 ${isImageBackground ? '' : 'max-w-6xl mx-auto px-4 sm:px-6'}`}>
        {/* Breadcrumbs at top of hero */}
        {breadcrumbs && (
          <div
            className={isImageBackground ? 'max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2' : 'pt-4 pb-2'}
          >
            <Breadcrumb items={breadcrumbs} variant={isImageBackground ? 'light' : 'dark'} />
          </div>
        )}

        <div className={isImageBackground ? 'w-full' : ''}>
          <div
            className={`text-center py-12 md:py-20 ${
              isImageBackground ? 'mx-auto max-w-5xl px-6 sm:px-8 md:px-10' : ''
            }`}
          >
            <Heading
              level={headingLevel}
              align="center"
              color={isImageBackground ? 'white' : 'charcoal'}
              className="text-4xl md:text-6xl mb-6"
            >
              {title}
            </Heading>

            {subtitle && (
              <Text
                size="lg"
                color={isImageBackground ? 'white' : 'muted'}
                align="center"
                className={`md:text-2xl mb-8 max-w-3xl mx-auto ${isImageBackground ? 'text-white' : ''}`}
              >
                {subtitle}
              </Text>
            )}

            {showCTA && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <WhatsAppButton
                  text={whatsappMessage}
                  label={ctaLabel}
                  size="large"
                  trustText=""
                  showPhone={false}
                />

                {secondaryAction && (
                  <Button
                    href={secondaryAction.href}
                    variant={isImageBackground ? 'outline-white' : 'outline'}
                    size="large"
                    className="min-h-[56px]"
                  >
                    {secondaryAction.text}
                  </Button>
                )}
              </div>
            )}

            {bottomText && (
              <Text
                size="sm"
                className={`${isImageBackground ? 'text-white font-medium' : 'text-charcoal/70'} text-center`}
              >
                {bottomText}
              </Text>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
