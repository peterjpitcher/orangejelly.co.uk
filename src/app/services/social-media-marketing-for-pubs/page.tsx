import { generateMetadata } from '@/lib/metadata';
import PubServiceLandingPage from '@/components/PubServiceLandingPage';
import socialMediaData from '../../../../content/data/services/social-media-marketing-for-pubs.json';

export const metadata = generateMetadata({
  title: 'Social Media Marketing for Pubs - A Simple System That Works',
  description:
    'Social media marketing for pubs across Instagram and Facebook: a repeatable plan, templates, and execution rhythm that drives bookings and footfall. £75/hour + VAT.',
  path: '/services/social-media-marketing-for-pubs',
  ogType: 'website',
});

export default function SocialMediaMarketingForPubsPage() {
  return (
    <PubServiceLandingPage
      data={socialMediaData}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Social Media Marketing for Pubs' },
      ]}
    />
  );
}
