import { memo } from 'react';

import Card from './Card';
import Grid from './Grid';
import Heading from './Heading';
import Text from './Text';

interface ResultCardProps {
  pub: string;
  before: string;
  after: string;
  timeframe: string;
  className?: string;
}

function ResultCard({ pub, before, after, timeframe, className = '' }: ResultCardProps) {
  return (
    <Card variant="bordered" padding="large" className={className}>
      <Heading level={3} color="teal" className="mb-4">
        {pub}
      </Heading>
      <Grid columns={{ default: 1, md: 3 }} gap="medium" className="text-center">
        <div>
          <Text size="sm" color="muted" align="center" className="mb-1">
            Before
          </Text>
          <Text weight="semibold" align="center" className="text-red-600">
            {before}
          </Text>
        </div>
        <div>
          <Text size="sm" color="muted" align="center" className="mb-1">
            After
          </Text>
          <Text weight="semibold" className="text-green-600" align="center">
            {after}
          </Text>
        </div>
        <div>
          <Text size="sm" color="muted" align="center" className="mb-1">
            Time
          </Text>
          <Text weight="semibold" align="center">
            {timeframe}
          </Text>
        </div>
      </Grid>
    </Card>
  );
}

export default memo(ResultCard);
