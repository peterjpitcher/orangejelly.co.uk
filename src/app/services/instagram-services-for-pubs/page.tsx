import { generateMetadata } from '@/lib/metadata';
import PubServiceLandingPage from '@/components/PubServiceLandingPage';
import instagramData from '../../../../content/data/services/instagram-services-for-pubs.json';

export const metadata = generateMetadata({
  title: 'Instagram for Pubs — Posts That Actually Drive Footfall',
  description:
    'Stop posting into the void. Get a Reels workflow, content plan, and local engagement system built for busy licensees. Tested at a real pub. £75/hr + VAT.',
  path: '/services/instagram-services-for-pubs',
  keywords:
    'instagram services for pubs, pub instagram marketing, instagram management for pubs, pub reels, social media for pubs',
  ogType: 'website',
});

export default function InstagramServicesForPubsPage() {
  return (
    <PubServiceLandingPage
      data={instagramData}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Instagram Services for Pubs' },
      ]}
    />
  );
}
