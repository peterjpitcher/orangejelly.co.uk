import { memo } from 'react';

// Mobile-optimized CTA component with minimum 44px touch targets
import Button from './Button';
import WhatsAppButton from './WhatsAppButton';

interface MobileCTAProps {
  variant?: 'fixed' | 'sticky' | 'inline';
  primaryText?: string;
  whatsappText?: string;
  showBoth?: boolean;
  className?: string;
}

function MobileCTA({
  variant = 'inline',
  primaryText = 'Get Started',
  whatsappText,
  showBoth = false,
  className = '',
}: MobileCTAProps) {
  const baseClasses = 'w-full';

  const variantClasses = {
    fixed: 'fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg z-40 safe-area-bottom',
    sticky: 'sticky bottom-0 p-4 bg-white shadow-lg z-30 safe-area-bottom',
    inline: '',
  };

  const containerClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={containerClasses}>
      <div className={showBoth ? 'grid grid-cols-2 gap-3' : ''}>
        {whatsappText && (
          <WhatsAppButton
            text={whatsappText}
            size="large"
            fullWidth
            className="mobile-cta-button"
          />
        )}
        {showBoth && primaryText && (
          <Button
            href="/services"
            size="large"
            variant="secondary"
            fullWidth
            className="mobile-cta-button"
          >
            {primaryText}
          </Button>
        )}
      </div>
    </div>
  );
}

// Safe area bottom utility class
export function addSafeAreaStyles() {
  return `
    .safe-area-bottom {
      padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0));
    }
    
    .mobile-cta-button {
      /* Ensure minimum touch target size */
      min-height: 44px;
      min-height: max(44px, env(safe-area-inset-bottom, 0) + 44px);
      
      /* Better tap feedback on mobile */
      -webkit-tap-highlight-color: rgba(255, 119, 0, 0.2);
      touch-action: manipulation;
    }
    
    @media (max-width: 768px) {
      .mobile-cta-button {
        /* Slightly larger on mobile for easier tapping */
        min-height: 48px;
        font-size: 1rem; /* 16px to prevent zoom on iOS */
      }
    }
  `;
}

export default memo(MobileCTA);
