import { generateMetadata } from '@/lib/metadata';
import PubServiceLandingPage from '@/components/PubServiceLandingPage';
import paidSocialData from '../../../../content/data/services/paid-social-for-pubs.json';

export const metadata = generateMetadata({
  title: 'Paid Social for Pubs — Meta Ads That Fill Quiet Nights',
  description:
    'Facebook and Instagram ads that sell one specific night — your quiet Tuesday, Sunday lunch, or event. Locally targeted and measured on real bookings. £75/hr + VAT.',
  path: '/services/paid-social-for-pubs',
  ogType: 'website',
});

export default function PaidSocialForPubsPage() {
  return (
    <PubServiceLandingPage
      data={paidSocialData}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Paid Social for Pubs' },
      ]}
    />
  );
}
