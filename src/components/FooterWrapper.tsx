import FooterSimple from './FooterSimple';
import footerData from '../../content/data/footer.json';

export default function FooterWrapper() {
  // Transform the local footer data to the expected format
  const footerContent = {
    services: footerData.links.packages.map((pkg) => ({
      title: pkg.label,
      href: pkg.href,
    })),
    company: footerData.links.company.map((link) => ({
      title: link.label,
      href: link.href,
      external: 'external' in link ? (link as { external?: boolean }).external || false : false,
    })),
    resources: footerData.links.resources.map((link) => ({
      title: link.label,
      href: link.href,
      external: false,
    })),
    solutions: footerData.links.capabilities.map((link) => ({
      title: link.label,
      href: link.href,
    })),
    locations: footerData.links.locations.map((link) => ({
      title: link.label,
      href: link.href,
    })),
    quickLinks: [
      ...footerData.links.resources.map((link) => ({
        title: link.label,
        href: link.href,
        external: false,
      })),
    ],
    contactInfo: {
      phone: footerData.contact.phone,
      email: footerData.contact.email,
    },
    bottomBar: {
      copyrightText: footerData.copyright,
      additionalText: 'Run by operators, for hospitality partners',
    },
  };

  return <FooterSimple footerContent={footerContent} />;
}
