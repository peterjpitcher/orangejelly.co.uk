import { generateMetadata } from '@/lib/metadata';
import PubServiceLandingPage from '@/components/PubServiceLandingPage';
import socialMediaData from '../../../../content/data/services/social-media-marketing-for-pubs.json';

export const metadata = generateMetadata({
  title: 'Social Media Marketing for Pubs - A Simple System That Works',
  description:
    'Social media marketing for pubs across Instagram and Facebook: a repeatable plan, templates, and local engagement that drives footfall. £75/hour + VAT.',
  path: '/services/social-media-marketing-for-pubs',
  keywords:
    'social media marketing for pubs, pub social media marketing, pub social media management, pub marketing on instagram and facebook, pub social strategy',
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
