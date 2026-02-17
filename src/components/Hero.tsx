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
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1627]/78 via-[#10233a]/74 to-[#0b1627]/84" />
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
            className="opacity-5 blur-sm"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </div>
      )}

      {/* Decorative orange circles - only show if no background image */}
      {!isImageBackground && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal/10 rounded-full translate-y-48 -translate-x-48"></div>
        </>
      )}

      <div
        className={`relative z-10 ${isImageBackground ? '' : 'max-w-6xl mx-auto px-4 sm:px-6'}`}
      >
        {/* Breadcrumbs at top of hero */}
        {breadcrumbs && (
          <div
            className={
              isImageBackground ? 'max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2' : 'pt-4 pb-2'
            }
          >
            <Breadcrumb items={breadcrumbs} variant={isImageBackground ? 'light' : 'dark'} />
          </div>
        )}

        <div
          className={
            isImageBackground
              ? 'w-full border-y border-white/12 bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-[2px]'
              : ''
          }
        >
          <div
            className={`text-center py-12 md:py-20 ${
              isImageBackground ? 'mx-auto max-w-5xl px-6 sm:px-8 md:px-10' : ''
            }`}
          >
          <Heading
            level={headingLevel}
            align="center"
            color={isImageBackground ? 'white' : 'charcoal'}
            className={`text-4xl md:text-6xl mb-6 animate-fade-in ${
              isImageBackground ? '[text-shadow:0_4px_20px_rgba(0,0,0,0.65)]' : ''
            }`}
          >
            {title}
          </Heading>

          {subtitle && (
            <Text
              size="lg"
              color={isImageBackground ? 'white' : 'muted'}
              align="center"
              className={`md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in-delay ${
                isImageBackground
                  ? 'text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.65)]'
                  : ''
              }`}
            >
              {subtitle}
            </Text>
          )}

          {showCTA && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fade-in-delay-2">
              <WhatsAppButton text={whatsappMessage} label={ctaLabel} size="large" />

              {secondaryAction && (
                <Button
                  href={secondaryAction.href}
                  variant={isImageBackground ? 'outline-white' : 'outline'}
                  size="large"
                >
                  {secondaryAction.text}
                </Button>
              )}
            </div>
          )}

          {bottomText && (
            <Text
              size="sm"
              className={`${
                isImageBackground ? 'text-white/85' : 'text-charcoal/60'
              } animate-fade-in-delay-3 text-center`}
            >
              {bottomText}
            </Text>
          )}
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal/30 to-transparent"></div>
    </section>
  );
}
