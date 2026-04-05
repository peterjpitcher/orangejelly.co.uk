import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import londonData from '../../../content/data/pub-marketing-london.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing in London — Fill Seats in a Busy City',
  description:
    'Pub marketing for London venues. Local SEO, events, social media, and Google visibility from a working publican. Packages from £375 + VAT.',
  path: '/pub-marketing-london',
  ogType: 'website',
});

export default function PubMarketingLondonPage() {
  return (
    <PubMarketingLocationLandingPage
      data={londonData}
      breadcrumbLabel="Pub Marketing London"
      currentSlug="pub-marketing-london"
    />
  );
}
