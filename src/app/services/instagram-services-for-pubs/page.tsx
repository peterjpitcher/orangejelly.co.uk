import { generateMetadata } from '@/lib/metadata';
import PubServiceLandingPage from '@/components/PubServiceLandingPage';
import instagramData from '../../../../content/data/services/instagram-services-for-pubs.json';

export const metadata = generateMetadata({
  title: 'Instagram Services for Pubs - Content That Drives Footfall',
  description:
    'Practical Instagram support for UK pubs: content plan, Reels workflow, local engagement routine, and simple reporting. £75/hour + VAT.',
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
