import { generateStaticMetadata } from '@/lib/metadata';
import ContactPage from './ContactPage';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Contact Orange Jelly | Get in Touch with Peter',
    description:
      'Speak directly with Peter Pitcher about transformative, action-first marketing for your hospitality business. Small team, direct support. WhatsApp preferred, or call 07990 587315.',
    path: '/contact',
    keywords:
      'contact Orange Jelly, hospitality growth support, pub marketing help, bar marketing help, Peter Pitcher contact',
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

export default function Contact() {
  return <ContactPage />;
}
