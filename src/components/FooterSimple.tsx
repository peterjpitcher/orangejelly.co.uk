import Link from '@/components/Link';
import { CONTACT, URLS } from '@/lib/constants';
import TrackedButton from '@/components/TrackedButton';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import OptimizedImage from '@/components/OptimizedImage';
// Local type definition
type FooterContent = {
  services?: Array<{
    title: string;
    href: string;
  }>;
  company?: Array<{
    title: string;
    href: string;
    external?: boolean;
  }>;
  resources?: Array<{
    title: string;
    href: string;
    external?: boolean;
  }>;
  playbooks?: Array<{
    title: string;
    href: string;
  }>;
  solutions?: Array<{
    title: string;
    href: string;
  }>;
  locations?: Array<{
    title: string;
    href: string;
  }>;
  quickLinks?: Array<{
    title: string;
    href: string;
    external?: boolean;
  }>;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  bottomBar?: {
    copyrightText?: string;
    additionalText?: string;
  };
};

interface FooterSimpleProps {
  footerContent?: FooterContent | null;
}

export default function FooterSimple({ footerContent }: FooterSimpleProps) {
  const currentYear = new Date().getFullYear();

  // Use footer data with proper structure
  const services = footerContent?.services || [];
  const company = footerContent?.company || [];
  const resources = footerContent?.resources || [];
  const playbooks = footerContent?.playbooks || [];
  const solutions = footerContent?.solutions || [];
  const locations = footerContent?.locations || [];

  return (
    <footer className="bg-brand-base text-surface">
      {/* Main Footer Content */}
      <div className="py-12">
        <div className="page-shell">
          {/* Logo and Tagline */}
          <div className="text-center mb-8">
            <OptimizedImage
              src="/logo.png"
              alt="Orange Jelly"
              width={60}
              height={60}
              className="mx-auto mb-3 rounded-lg"
            />
            {/* The footer sits on navy, where the accent has to lighten rather
                than darken. See the note in ui/typography.tsx. */}
            <Heading level={3} color="orange-on-dark" align="center" className="mb-2">
              Orange Jelly
            </Heading>
            <Text align="center" color="white" className="text-surface/80">
              Small team. Big momentum. Transformative marketing for hospitality partners.
            </Text>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6 mb-8 text-surface/90">
            <div>
              <Heading level={5} color="white" className="mb-3 text-surface">
                Packages
              </Heading>
              <ul className="space-y-2 text-sm">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link href={service.href} color="orange-on-dark">
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Heading level={5} color="white" className="mb-3 text-surface">
                Capabilities
              </Heading>
              <ul className="space-y-2 text-sm">
                {solutions.map((solution, index) => (
                  <li key={index}>
                    <Link href={solution.href} color="orange-on-dark">
                      {solution.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {locations.length > 0 && (
              <div>
                <Heading level={5} color="white" className="mb-3 text-surface">
                  Areas We Serve
                </Heading>
                <ul className="space-y-2 text-sm">
                  {locations.map((location, index) => (
                    <li key={index}>
                      <Link href={location.href} color="orange-on-dark">
                        {location.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <Heading level={5} color="white" className="mb-3 text-surface">
                Company
              </Heading>
              <ul className="space-y-2 text-sm">
                {company.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} color="orange-on-dark" external={link.external}>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Heading level={5} color="white" className="mb-3 text-surface">
                Resources
              </Heading>
              <ul className="space-y-2 text-sm">
                {resources.map((resource, index) => (
                  <li key={index}>
                    <Link href={resource.href} color="orange-on-dark">
                      {resource.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {playbooks.length > 0 && (
              <div>
                <Heading level={5} color="white" className="mb-3 text-surface">
                  Playbooks
                </Heading>
                <ul className="space-y-2 text-sm">
                  {playbooks.map((playbook, index) => (
                    <li key={index}>
                      <Link href={playbook.href} color="orange-on-dark">
                        {playbook.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <Heading level={5} color="white" className="mb-3 text-surface">
                Get in Touch
              </Heading>
              <div className="space-y-2 text-sm text-surface/90">
                <Link href={URLS.whatsapp()} color="orange-on-dark" className="block" external>
                  📱 WhatsApp
                </Link>
                <Link
                  href={`tel:${footerContent?.contactInfo?.phone || CONTACT.phone}`}
                  color="orange-on-dark"
                  className="block"
                >
                  📞 {footerContent?.contactInfo?.phone || CONTACT.phone}
                </Link>
                <Link
                  href={`mailto:${footerContent?.contactInfo?.email || CONTACT.email}`}
                  color="orange-on-dark"
                  className="block"
                >
                  ✉️ Email Us
                </Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-surface/20 pt-8 text-surface/80">
            {/* Bottom Info */}
            <div className="text-center">
              <Text size="sm" align="center" color="white" className="mb-4">
                {footerContent?.bottomBar?.copyrightText?.replace(
                  '{year}',
                  currentYear.toString()
                ) || `© ${currentYear} Orange Jelly Limited`}{' '}
                |
                {footerContent?.bottomBar?.additionalText?.replace(
                  ' | Made with ❤️ in Stanwell Moor',
                  ''
                ) || 'Run by operators, for hospitality partners'}
              </Text>

              {/* CTA Button */}
              <TrackedButton
                eventName="whatsapp_click"
                eventProperties={{
                  cta: 'footer_growth_conversation',
                }}
                href={URLS.whatsapp()}
                variant="primary"
                size="medium"
                external
                className="mb-4"
              >
                Start a Growth Conversation
              </TrackedButton>

              <Text size="xs" align="center" color="white" className="opacity-60 mb-2">
                I personally reply to every message. During service? I'll reply as soon as I can.
              </Text>
              <Text size="xs" align="center" color="white" className="opacity-60 measure">
                Information on this site is general guidance only. Always consult the relevant
                legal, licensing, and regulatory bodies before acting on any advice.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
