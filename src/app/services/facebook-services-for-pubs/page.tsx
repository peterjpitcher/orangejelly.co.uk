import { generateMetadata } from '@/lib/metadata';
import PubServiceLandingPage from '@/components/PubServiceLandingPage';
import facebookData from '../../../../content/data/services/facebook-services-for-pubs.json';

export const metadata = generateMetadata({
  title: 'Facebook Services for Pubs - Local Reach That Brings Customers In',
  description:
    'Facebook marketing help for pubs: events, local groups, reviews, templates, and a simple weekly system that drives footfall. £75/hour + VAT.',
  path: '/services/facebook-services-for-pubs',
  keywords:
    'facebook services for pubs, pub facebook marketing, facebook marketing for pubs, local facebook groups pubs, pub events facebook',
  ogType: 'website',
});

export default function FacebookServicesForPubsPage() {
  return (
    <PubServiceLandingPage
      data={facebookData}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Facebook Services for Pubs' },
      ]}
    />
  );
}
