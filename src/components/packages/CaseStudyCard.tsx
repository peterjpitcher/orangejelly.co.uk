// src/components/packages/CaseStudyCard.tsx

import { getCaseStudyById } from '@/lib/packages';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import { Claim } from './Claim';

interface CaseStudyCardProps {
  id: string;
  variant?: 'card' | 'full';
  className?: string;
}

export function CaseStudyCard({
  id,
  variant = 'card',
  className,
}: CaseStudyCardProps): React.ReactElement | null {
  const caseStudy = getCaseStudyById(id);

  if (!caseStudy) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[CaseStudyCard] No case study found for id: "${id}"`);
    }
    return null;
  }

  if (variant === 'card') {
    return (
      <Card className={className}>
        <Heading level={4} className="mb-2">
          {caseStudy.title}
        </Heading>
        <Text color="muted" className="mb-4">
          {caseStudy.result}
        </Text>
        <div className="flex flex-wrap gap-2">
          {caseStudy.metrics.map((metricId) => (
            <span
              key={metricId}
              className="inline-block bg-orange/10 text-orange px-3 py-1 rounded-full text-sm font-medium"
            >
              <Claim id={metricId} variant="short" />
            </span>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Heading level={3} className="mb-4">
        {caseStudy.title}
      </Heading>
      <div className="space-y-4">
        <div>
          <Text weight="semibold" className="mb-1">
            Challenge
          </Text>
          <Text color="muted">{caseStudy.challenge}</Text>
        </div>
        <div>
          <Text weight="semibold" className="mb-1">
            What we did
          </Text>
          <Text color="muted">{caseStudy.action}</Text>
        </div>
        <div>
          <Text weight="semibold" className="mb-1">
            Result
          </Text>
          <Text color="muted">{caseStudy.result}</Text>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {caseStudy.metrics.map((metricId) => (
          <span
            key={metricId}
            className="inline-block bg-orange/10 text-orange px-3 py-1 rounded-full text-sm font-medium"
          >
            <Claim id={metricId} variant="short" />
          </span>
        ))}
      </div>
    </Card>
  );
}
