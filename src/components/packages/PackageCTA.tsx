// src/components/packages/PackageCTA.tsx

import { getPackageById } from '@/lib/packages';
import TrackedButton from '@/components/TrackedButton';
import Text from '@/components/Text';
import { CONTACT } from '@/lib/constants';

interface PackageCTAProps {
  packageId?: string;
  className?: string;
}

export function PackageCTA({ packageId, className }: PackageCTAProps): React.ReactElement {
  const pkg = packageId ? getPackageById(packageId) : undefined;
  const whatsappMessage = pkg?.ctaWhatsApp || "Hi Peter, I'd like to find out about your packages.";
  const whatsappUrl = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const contactUrl = pkg ? `/contact?package=${pkg.slug}` : '/contact';

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <TrackedButton
          eventName="whatsapp_click"
          eventProperties={{
            package_id: pkg?.id || null,
            package_slug: pkg?.slug || null,
            cta: 'package_cta_whatsapp',
          }}
          href={whatsappUrl}
          variant="primary"
          size="large"
          external
        >
          Message Peter on WhatsApp
        </TrackedButton>
        <TrackedButton
          eventName="package_cta_click"
          eventProperties={{
            package_id: pkg?.id || null,
            package_slug: pkg?.slug || null,
            cta: 'package_cta_enquiry',
          }}
          href={contactUrl}
          variant="outline"
          size="large"
        >
          Send an enquiry
        </TrackedButton>
      </div>
      <Text size="xs" color="muted" align="center" className="mt-3">
        Prefer email? Use the enquiry form. Peter responds as quickly as he can.
      </Text>
    </div>
  );
}
