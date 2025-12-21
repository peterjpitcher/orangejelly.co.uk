import { type Metadata } from 'next';
import { getAbsoluteUrl } from '@/lib/site-config';

const canonicalUrl = getAbsoluteUrl('/results');

export const metadata: Metadata = {
  title: 'Results - Hospitality Marketing Success Stories',
  description:
    'See how we use AI at The Anchor to save time and increase revenue, then apply it to pubs, restaurants, and bars. Real examples, real numbers, no fluff.',
  alternates: {
    canonical: canonicalUrl,
  },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
