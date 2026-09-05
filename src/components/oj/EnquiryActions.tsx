'use client';

import { CONTACT, URLS } from '@/lib/constants';
import {
  getGuideConversion,
  getGuideEnquiryHref,
  GUIDE_CONVERSION_VERSION,
  type GuideConversionContext,
  type EnquiryPlacement,
} from '@/lib/guide-conversion';
import { trackClientEvent } from '@/lib/tracking';
import { Anchor } from './Anchor';
import { Button } from './Button';

export interface EnquiryActionsProps {
  context?: GuideConversionContext;
  placement: EnquiryPlacement;
  primaryHref?: string;
  primaryLabel?: string;
  showPrimary?: boolean;
}
export function trackEnquiryAction(
  context: GuideConversionContext | undefined,
  placement: EnquiryPlacement,
  channel: 'form' | 'whatsapp'
): void {
  try {
    trackClientEvent(channel === 'form' ? 'guide_cta_click' : 'whatsapp_click', {
      properties: {
        ...(context ? { guide_slug: context.guideSlug } : {}),
        placement,
        channel,
        version: GUIDE_CONVERSION_VERSION,
      },
    });
  } catch {
    // An unavailable analytics dependency must never interrupt contact navigation.
  }
}
export function EnquiryActions({
  context,
  placement,
  primaryHref,
  primaryLabel,
  showPrimary = true,
}: EnquiryActionsProps): JSX.Element {
  const config = context
    ? getGuideConversion(context.guideSlug, context.category, context.title)
    : undefined;
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      {showPrimary ? (
        <Button
          href={
            primaryHref ??
            (context ? getGuideEnquiryHref(context.guideSlug, placement) : '#enquiry')
          }
          onClick={() => trackEnquiryAction(context, placement, 'form')}
          className="max-w-full whitespace-normal text-center"
        >
          {primaryLabel ?? config?.primaryLabel ?? 'Send an enquiry'}
        </Button>
      ) : null}
      <Button
        variant="ghost"
        href={URLS.whatsapp(
          config?.whatsappMessage ?? 'Hi Peter, I would like to talk about my business.'
        )}
        onClick={() => trackEnquiryAction(context, placement, 'whatsapp')}
        className="max-w-full whitespace-normal text-center"
      >
        Message Peter on WhatsApp
      </Button>
      <Anchor
        href={`mailto:${CONTACT.email}`}
        className="oj-focus inline-flex min-h-tap items-center font-bold underline"
      >
        Email Peter
      </Anchor>
    </div>
  );
}
