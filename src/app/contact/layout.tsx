import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Peter - Orange Jelly',
  description:
    'Get in touch with Peter Pitcher. WhatsApp preferred - I personally reply to every message. Based in Stanwell Moor, serving pubs, restaurants, and bars across the UK.',
  alternates: {
    canonical: 'https://www.orangejelly.co.uk/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
