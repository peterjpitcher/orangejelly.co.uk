'use client';

import { memo } from 'react';

import { CONTACT, URLS } from '@/lib/constants';
import { trackClientEvent } from '@/lib/tracking';

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
  /** Optional trust micro-copy shown below the button */
  trustText?: string;
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
  trustText = 'Free 15-minute chat. No obligation.',
}: WhatsAppButtonProps) {
  const whatsappUrl = phoneNumber
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`
    : URLS.whatsapp(text);

  const buttonCopy = label?.trim().length ? label.trim() : text?.trim() || 'Chat on WhatsApp';

  // inline-flex, never inline-block.
  //
  // globals.css puts a 44px min-height on every anchor. On a non-flex box that
  // padding cannot be redistributed, so the label stays where line-height put it
  // at the top and every spare pixel collects underneath: measured 10px above the
  // label and 14px below it in the header, which reads as a button whose text is
  // stuck to the ceiling. items-center is the only thing that centres the label
  // inside that inflated box. ButtonAdapter.tsx carries the same note after the
  // same bug bit the main Button.
  const baseClasses =
    'font-medium rounded-lg whatsapp-button inline-flex items-center justify-center text-center';

  const variantClasses = {
    primary: 'bg-orange text-brand-base hover:text-brand-base-dark',
    secondary:
      'bg-white text-orange-dark border-2 border-orange-dark hover:bg-orange hover:text-brand-base',
  };

  const sizeClasses = {
    small: 'px-4 py-2.5 text-sm min-h-tap',
    medium: 'px-6 py-3 text-base min-h-control',
    large: 'px-8 py-4 text-lg min-h-control-lg',
  };

  // `flex` rather than `block` so w-full stretches without dropping flex centring.
  const widthClass = fullWidth ? 'w-full flex' : '';

  return (
    <span className="inline-flex flex-col items-center">
      <a
        href={whatsappUrl}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        target="_blank"
        rel="noopener noreferrer"
        // Appending " on WhatsApp" unconditionally read out as "Chat on WhatsApp
        // on WhatsApp" for the header CTA, whose label already names the channel.
        aria-label={
          label
            ? /whatsapp/i.test(label)
              ? label
              : `${label} on WhatsApp`
            : `Contact us on WhatsApp at ${CONTACT.phone}`
        }
        onClick={() =>
          trackClientEvent('whatsapp_click', {
            properties: {
              label: buttonCopy,
              component: 'WhatsAppButton',
            },
          })
        }
      >
        <span className="flex flex-col items-center justify-center sm:flex-row sm:gap-1">
          <span>{buttonCopy}</span>
          {showPhone && <span className="text-sm sm:text-xs opacity-90">{CONTACT.phone}</span>}
        </span>
      </a>
      {/* charcoal/70, not /60. At 60% this microcopy sat at 3.90:1 on white, under
          the 4.5:1 AA minimum for text this size. 70% gives 5.27:1. */}
      {trustText && <span className="mt-2 block text-xs text-brand-base/70">{trustText}</span>}
    </span>
  );
}

export default memo(WhatsAppButton);
