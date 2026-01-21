import { generateMetadata } from '@/lib/metadata';
import PubServiceLandingPage from '@/components/PubServiceLandingPage';
import contentCreationData from '../../../../content/data/services/content-creation-for-pubs.json';

export const metadata = generateMetadata({
  title: 'Content Creation for Pubs - Photos, Reels, Templates',
  description:
    'Pub content creation made simple: phone-first photos and short videos, captions, templates, and batching systems so you stay consistent. £75/hour + VAT.',
  path: '/services/content-creation-for-pubs',
  keywords:
    'content creation for pubs, pub content creation, pub social content, reels for pubs, pub marketing content, pub photography',
  ogType: 'website',
});

export default function ContentCreationForPubsPage() {
  return (
    <PubServiceLandingPage
      data={contentCreationData}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Content Creation for Pubs' },
      ]}
    />
  );
}
