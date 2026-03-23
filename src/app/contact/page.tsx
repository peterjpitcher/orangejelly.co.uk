import { generateStaticMetadata } from '@/lib/metadata';
import ContactPage from './ContactPage';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Contact Us - Speak Directly with Peter',
    description:
      'Speak directly with Peter Pitcher about pub marketing that actually works. No agency fluff — just direct, honest advice. Book a free chat today.',
    path: '/contact',
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

export default function Contact() {
  return <ContactPage />;
}
