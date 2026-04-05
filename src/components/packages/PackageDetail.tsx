// src/components/packages/PackageDetail.tsx

import { getPackageBySlug, getAddOns, getCaseStudiesForPackage } from '@/lib/packages';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Container from '@/components/Container';
import Section from '@/components/Section';
import { CaseStudyCard } from './CaseStudyCard';
import { PackageCTA } from './PackageCTA';
import { PaymentPlanBanner } from './PaymentPlanBanner';

interface PackageDetailProps {
  slug: string;
}

export function PackageDetail({ slug }: PackageDetailProps): React.ReactElement | null {
  const pkg = getPackageBySlug(slug);

  if (!pkg) return null;

  const relatedCaseStudies = getCaseStudiesForPackage(pkg.id);
  const allAddOns = getAddOns();
  const packageAddOns = allAddOns.filter((a) => pkg.addOns.includes(a.id));

  return (
    <>
      {/* Hero */}
      <Section className="bg-white pt-16 pb-12">
        <Container>
          {pkg.badge && (
            <span className="inline-block rounded-full bg-orange px-4 py-1 text-sm font-semibold text-white mb-4">
              {pkg.badge}
            </span>
          )}
          <Heading level={1} className="mb-2">
            {pkg.name}
          </Heading>
          <Text size="xl" color="muted" className="mb-4">
            {pkg.shortDescription}
          </Text>
          <div className="mb-6">
            <Text size="2xl" weight="bold">
              {pkg.price.display}
            </Text>
            <Text color="muted" className="ml-2">
              {pkg.hours}
            </Text>
          </div>
          <div className="mb-8">
            <Text weight="semibold" className="mb-2 block">
              Best for:
            </Text>
            <ul className="space-y-1">
              {pkg.bestFor.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-orange mt-0.5 shrink-0">&#10003;</span>
                  <Text>{item}</Text>
                </li>
              ))}
            </ul>
          </div>
          {pkg.paymentPlan.available && (
            <Text size="sm" color="muted" className="mb-6">
              {pkg.paymentPlan.copy}
            </Text>
          )}
          <PackageCTA packageId={pkg.id} />
        </Container>
      </Section>

      {/* Included */}
      <Section className="bg-cream py-12">
        <Container>
          <Heading level={2} className="mb-6">
            What&apos;s included
          </Heading>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pkg.included.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-green-600 mt-0.5 shrink-0 text-lg">&#10003;</span>
                <Text>{item}</Text>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Light-touch */}
      {pkg.lightTouch.length > 0 && (
        <Section className="bg-white py-12">
          <Container>
            <Heading level={2} className="mb-2">
              Light-touch support
            </Heading>
            <Text color="muted" className="mb-6">
              We&apos;ll guide you on these, but won&apos;t manage them at full depth.
            </Text>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pkg.lightTouch.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-amber-500 mt-0.5 shrink-0">&#9679;</span>
                  <Text color="muted">{item}</Text>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Add-ons */}
      {packageAddOns.length > 0 && (
        <Section className="bg-cream py-12">
          <Container>
            <Heading level={2} className="mb-2">
              Available as add-ons
            </Heading>
            <Text color="muted" className="mb-6">
              Need more? These can be added separately.
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packageAddOns.map((addOn) => (
                <Card key={addOn.id} className="p-4">
                  <Text weight="semibold">{addOn.name}</Text>
                  <Text size="sm" color="muted">
                    {addOn.description}
                  </Text>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Not included */}
      {pkg.notIncluded.length > 0 && (
        <Section className="bg-white py-12">
          <Container>
            <Heading level={2} className="mb-2">
              To keep this package focused
            </Heading>
            <Text color="muted" className="mb-6">
              These are outside scope unless separately agreed.
            </Text>
            <ul className="space-y-2">
              {pkg.notIncluded.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-gray-300 mt-0.5 shrink-0">&mdash;</span>
                  <Text color="muted">{item}</Text>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* How it works */}
      <Section className="bg-cream py-12">
        <Container>
          <Heading level={2} className="mb-8">
            How it works
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pkg.process.map((step) => (
              <div key={step.step}>
                <span className="w-8 h-8 rounded-full bg-orange text-white text-sm font-bold flex items-center justify-center mb-3">
                  {step.step}
                </span>
                <Text weight="semibold" className="mb-1 block">
                  {step.title}
                </Text>
                <Text size="sm" color="muted">
                  {step.description}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Proof */}
      {relatedCaseStudies.length > 0 && (
        <Section className="bg-white py-12">
          <Container>
            <Heading level={2} className="mb-6">
              Results from The Anchor
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedCaseStudies.slice(0, 2).map((cs) => (
                <CaseStudyCard key={cs.id} id={cs.id} variant="card" />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Payment plan */}
      {pkg.paymentPlan.available && <PaymentPlanBanner />}

      {/* Final CTA */}
      <Section className="bg-charcoal py-16">
        <Container>
          <Heading level={2} align="center" color="white" className="mb-4">
            Ready to get started?
          </Heading>
          <Text align="center" color="white" className="mb-8 max-w-2xl mx-auto">
            Message Peter directly or send an enquiry. No obligation, no sales pitch — just a
            conversation about what your venue needs.
          </Text>
          <PackageCTA packageId={pkg.id} />
        </Container>
      </Section>
    </>
  );
}
