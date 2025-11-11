import { memo } from 'react';

import { CONTACT, URLS } from '@/lib/constants';

interface WhatsAppButtonProps {
  /** Message that will be prefilled in WhatsApp */
  text: string;
  /** Optional number override (defaults to CONTACT settings) */
  phoneNumber?: string;
  /** Visual style */
  variant?: 'primary' | 'secondary';
  /** Size tokens that maintain minimum tap targets */
  size?: 'small' | 'medium' | 'large';
  /** Force the button to stretch 100% width */
  fullWidth?: boolean;
  /** Additional utility classes */
  className?: string;
  /** Optional label shown on the button (falls back to text) */
  label?: string;
  /** Toggle displaying the phone number on the button */
  showPhone?: boolean;
}

// WhatsApp button with mobile-first touch target sizing (min 44px)
function WhatsAppButton({
  text,
  phoneNumber,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  label,
  showPhone = true,
}: WhatsAppButtonProps) {
  const whatsappUrl = phoneNumber
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`
    : URLS.whatsapp(text);

  const buttonCopy = label?.trim().length ? label.trim() : text?.trim() || 'Chat on WhatsApp';

  const baseClasses = 'font-medium rounded-lg whatsapp-button inline-block text-center';

  const variantClasses = {
    primary: 'bg-orange text-white hover:bg-orange-dark',
    secondary: 'bg-white text-orange border-2 border-orange hover:bg-orange hover:text-white',
  };

  const sizeClasses = {
    small: 'px-4 py-2.5 text-sm min-h-[44px]',
    medium: 'px-6 py-3 text-base min-h-[48px]',
    large: 'px-8 py-4 text-lg min-h-[56px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <a
      href={whatsappUrl}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label ? `${label} on WhatsApp` : `Contact us on WhatsApp at ${CONTACT.phone}`}
    >
      <span className="flex flex-col items-center justify-center sm:flex-row sm:gap-1">
        <span>{buttonCopy}</span>
        {showPhone && <span className="text-sm sm:text-xs opacity-90">{CONTACT.phone}</span>}
      </span>
    </a>
  );
}

export default memo(WhatsAppButton);
