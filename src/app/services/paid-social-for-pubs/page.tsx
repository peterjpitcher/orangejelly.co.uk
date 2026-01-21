import { generateMetadata } from '@/lib/metadata';
import PubServiceLandingPage from '@/components/PubServiceLandingPage';
import paidSocialData from '../../../../content/data/services/paid-social-for-pubs.json';

export const metadata = generateMetadata({
  title: 'Paid Social for Pubs - Meta Ads That Fill Nights',
  description:
    'Meta (Facebook and Instagram) ads for pubs: simple campaigns that sell specific nights and drive bookings and enquiries. £75/hour + VAT.',
  path: '/services/paid-social-for-pubs',
  keywords:
    'paid social for pubs, pub facebook ads, pub instagram ads, meta ads for pubs, pub advertising on facebook, pub marketing ads',
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
