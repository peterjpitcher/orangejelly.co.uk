import { ServicePage } from '@/components/oj/ServicePage';
import { generateMetadata } from '@/lib/metadata';

import { CONTENT } from './content';

export const metadata = generateMetadata({
  ogImage: '/opengraph-image',
  title: 'Custom Booking Systems',
  description:
    'Custom booking workflows that connect enquiries, confirmations and guest communication. Improve existing software or build the missing connection.',
  path: '/solutions/booking-systems',
});

export default function BookingSystemsPage(): JSX.Element {
  return <ServicePage content={CONTENT} />;
}
