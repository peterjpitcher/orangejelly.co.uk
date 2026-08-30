import React, { memo } from 'react';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';

interface QuickAnswerProps {
  answer: string;
  className?: string;
}

function QuickAnswer({ answer, className = '' }: QuickAnswerProps) {
  if (!answer) return null;

  return (
    <Card
      variant="colored"
      background="orange-light"
      className={`quick-answer border-l-4 border-orange ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-2xl">🎯</div>
        <div>
          {/*
            An h2, not an h4. This is the first heading after the article title, so at
            level 4 the outline jumped h1 straight to h4 on all 106 guides. The size
            is unchanged: it is set by the class, not by the level.
          */}
          <Heading level={2} className="mb-2 text-[18px] text-orange-dark">
            Quick Answer
          </Heading>
          <Text className="font-medium leading-relaxed">{answer}</Text>
        </div>
      </div>
    </Card>
  );
}

export default memo(QuickAnswer);
