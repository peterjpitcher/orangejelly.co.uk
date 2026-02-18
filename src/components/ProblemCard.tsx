import { memo } from 'react';

import Card from './Card';
import Heading from './Heading';
import Button from './Button';

interface ProblemCardProps {
  emoji: string;
  problem: string;
  solution: string;
  linkText: string;
  linkHref: string;
}

function ProblemCard({ emoji, problem, solution, linkText, linkHref }: ProblemCardProps) {
  return (
    <Card
      variant="shadowed"
      className="hover:shadow-xl transition-normal hover:-translate-y-1 group text-center"
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-normal">{emoji}</div>
      <Heading level={3} align="center" className="mb-3 text-xl">
        {problem}
      </Heading>
      <p className="text-charcoal/80 mb-4">{solution}</p>
      <Button href={linkHref} variant="ghost" className="font-semibold">
        {linkText} →
      </Button>
    </Card>
  );
}

export default memo(ProblemCard);
