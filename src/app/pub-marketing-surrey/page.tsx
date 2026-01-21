import { generateMetadata } from '@/lib/metadata';
import PubMarketingLocationLandingPage from '@/components/PubMarketingLocationLandingPage';
import surreyData from '../../../content/data/pub-marketing-surrey.json';

export const metadata = generateMetadata({
  title: 'Pub Marketing Surrey - Consultant for Surrey Pubs',
  description:
    'Pub marketing for Surrey pubs: get found locally, build repeatable events, and drive footfall with simple systems. Practical help at £75/hour + VAT.',
  path: '/pub-marketing-surrey',
  keywords:
    'pub marketing surrey, pub marketing consultant surrey, marketing for pubs surrey, surrey pub marketing agency, increase pub footfall surrey',
  ogType: 'website',
});

export default function PubMarketingSurreyPage() {
  return (
    <PubMarketingLocationLandingPage data={surreyData} breadcrumbLabel="Pub Marketing Surrey" />
  );
}
