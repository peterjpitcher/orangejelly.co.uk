'use client';

import { type MouseEventHandler, type ReactNode } from 'react';

import Button from '@/components/Button';
import { trackClientEvent } from '@/lib/tracking';

type TrackableEvent =
  | 'whatsapp_click'
  | 'package_cta_click'
  | 'guide_cta_click'
  | 'site_search'
  | 'search_result_click';

interface TrackedButtonProps {
  eventName: TrackableEvent;
  eventProperties?: Record<string, unknown>;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'custom'
    | 'outline-white'
    | 'base'
    | 'support'
    | 'accent';
  size?: 'small' | 'medium' | 'large';
  href?: string;
  external?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLElement>;
  'aria-label'?: string;
  children: ReactNode;
}

export default function TrackedButton({
  eventName,
  eventProperties,
  children,
  onClick,
  ...buttonProps
}: TrackedButtonProps) {
  return (
    <Button
      {...buttonProps}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;

        trackClientEvent(eventName, {
          properties: {
            href: buttonProps.href,
            ...eventProperties,
          },
        });
      }}
    >
      {children}
    </Button>
  );
}
