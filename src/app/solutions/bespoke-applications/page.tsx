import { ServicePage } from '@/components/oj/ServicePage';
import { generateMetadata } from '@/lib/metadata';

import { CONTENT } from './content';

export const metadata = generateMetadata({
  ogImage: '/opengraph-image',
  title: 'Bespoke Web Application Development',
  description:
    'Bespoke web applications for customer portals, connected records and everyday workflows. Practical software built around your business.',
  path: '/solutions/bespoke-applications',
});

export default function BespokeApplicationsPage(): JSX.Element {
  return <ServicePage content={CONTENT} />;
}
