import { generateStaticMetadata } from '@/lib/metadata';
import ContactPage from './ContactPage';

export async function generateMetadata() {
  return generateStaticMetadata({
    title: 'Contact Orange Jelly | Get in Touch with Peter',
    description:
      'Speak directly with Peter Pitcher, a hospitality marketing specialist leveraging AI for pubs, restaurants, and bars. WhatsApp preferred, or call 07990 587315. Visit us at The Anchor in Stanwell.',
    path: '/contact',
    keywords:
      'contact Orange Jelly, hospitality marketing help, pub marketing help, restaurant marketing help, bar marketing help, Peter Pitcher contact',
    ogImage: '/images/og-default.jpg',
    ogType: 'website',
  });
}

export default function Contact() {
  return <ContactPage />;
}
