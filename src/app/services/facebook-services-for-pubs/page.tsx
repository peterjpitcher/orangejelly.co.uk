import { generateMetadata } from '@/lib/metadata';
import PubServiceLandingPage from '@/components/PubServiceLandingPage';
import facebookData from '../../../../content/data/services/facebook-services-for-pubs.json';

export const metadata = generateMetadata({
  title: 'Facebook for Pubs — Weekly Content That Fills Tables',
  description:
    'Events, local groups, reviews, and a simple weekly rhythm that brings locals back in. Built for busy licensees who need Facebook to actually work. £75/hr + VAT.',
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
