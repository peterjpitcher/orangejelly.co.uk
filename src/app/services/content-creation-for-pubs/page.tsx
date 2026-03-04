import { generateMetadata } from '@/lib/metadata';
import PubServiceLandingPage from '@/components/PubServiceLandingPage';
import contentCreationData from '../../../../content/data/services/content-creation-for-pubs.json';

export const metadata = generateMetadata({
  title: 'Content Creation for Pubs — Phone-First, Done in Hours',
  description:
    'Photos, Reels, captions, and a batching system so you create a week of pub content in one session. Phone-first and no editing skills needed. £75/hr + VAT.',
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
