import Link from '@/components/Link';
import { CONTACT, URLS } from '@/lib/constants';
import Button from '@/components/Button';
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

  return (
    <footer className="bg-charcoal text-cream">
      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Logo and Tagline */}
          <div className="text-center mb-8">
            <OptimizedImage
              src="/logo.png"
              alt="Orange Jelly"
              width={60}
              height={60}
              className="mx-auto mb-3 rounded-lg"
            />
            <Heading level={3} color="orange" align="center" className="mb-2">
              Orange Jelly
            </Heading>
            <Text align="center" color="white" className="text-cream/80">
              AI-powered hospitality marketing that saves up to 25 hours every week
            </Text>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-cream/90">
            <div>
              <Heading level={5} color="orange" className="mb-3 text-cream">
                Services
              </Heading>
              <ul className="space-y-2 text-sm">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link href={service.href} className="hover:text-orange transition-colors">
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Heading level={5} color="orange" className="mb-3 text-cream">
                Company
              </Heading>
              <ul className="space-y-2 text-sm">
                {company.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="hover:text-orange transition-colors"
                      external={link.external}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Heading level={5} color="orange" className="mb-3 text-cream">
                Resources
              </Heading>
              <ul className="space-y-2 text-sm">
                {resources.map((resource, index) => (
                  <li key={index}>
                    <Link href={resource.href} className="hover:text-orange transition-colors">
                      {resource.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Heading level={5} color="orange" className="mb-3 text-cream">
                Get in Touch
              </Heading>
              <div className="space-y-2 text-sm text-cream/90">
                <Link
                  href={URLS.whatsapp()}
                  className="block hover:text-orange transition-colors"
                  external
                >
                  📱 WhatsApp
                </Link>
                <Link
                  href={`tel:${footerContent?.contactInfo?.phone || CONTACT.phone}`}
                  className="block hover:text-orange transition-colors"
                >
                  📞 {footerContent?.contactInfo?.phone || CONTACT.phone}
                </Link>
                <Link
                  href={`mailto:${footerContent?.contactInfo?.email || CONTACT.email}`}
                  className="block hover:text-orange transition-colors"
                >
                  ✉️ Email Us
                </Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-cream/20 pt-8 text-cream/80">
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
                ) || 'Run by operators, for pubs, restaurants, and bars'}
              </Text>

              {/* CTA Button */}
              <Button
                href={URLS.whatsapp()}
                variant="primary"
                size="medium"
                external
                className="mb-4"
              >
                Get Marketing Help
              </Button>

              <Text size="xs" align="center" color="white" className="opacity-60 mb-2">
                I personally reply to every message. During service? I'll get back to you after.
              </Text>
              <Text size="xs" align="center" color="white" className="opacity-60 max-w-3xl mx-auto">
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
