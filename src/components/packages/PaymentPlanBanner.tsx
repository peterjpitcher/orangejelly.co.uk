// src/components/packages/PaymentPlanBanner.tsx

import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Section from '@/components/Section';
import Container from '@/components/Container';

interface PaymentPlanBannerProps {
  className?: string;
}

export function PaymentPlanBanner({ className }: PaymentPlanBannerProps): React.ReactElement {
  return (
    <Section className={`bg-teal/5 py-12 ${className || ''}`}>
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <Heading level={3} className="mb-3">
            Flexible payment options available
          </Heading>
          <Text color="muted">
            We want to make support accessible. If you need to spread the cost, ask Peter about
            payment plans when you get in touch. No judgement, no fuss.
          </Text>
        </div>
      </Container>
    </Section>
  );
}
