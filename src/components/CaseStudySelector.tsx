'use client';

import { useEffect, useRef, useState } from 'react';
import Button from '@/components/Button';
import Heading from '@/components/Heading';
import Text from '@/components/Text';
import Card from '@/components/Card';
import Grid from '@/components/Grid';
import AnimatedItem from '@/components/AnimatedItem';
import FeatureList from '@/components/FeatureList';

interface Result {
  id: string;
  title: string;
  subtitle: string;
  problem: string[];
  failed: string[];
  solution: string[];
  results: { metric: string; value: string }[];
  timeInvestment: string[];
  learnings: string[];
  quote?: string;
}

interface CaseStudySelectorProps {
  results: Result[];
  defaultStudy?: string;
}

export default function CaseStudySelector({
  results,
  defaultStudy = 'sunday-lunch-preorder-system',
}: CaseStudySelectorProps) {
  const resolveInitialStudy = () => {
    if (!results || results.length === 0) {
      return '';
    }

    if (defaultStudy && results.some((study) => study.id === defaultStudy)) {
      return defaultStudy;
    }

    return results[0].id;
  };

  const [activeStudy, setActiveStudy] = useState(resolveInitialStudy);
  const preferredStudyRef = useRef<string | undefined>(
    defaultStudy && results?.some((study) => study.id === defaultStudy) ? defaultStudy : undefined
  );

  useEffect(() => {
    if (!results || results.length === 0) {
      return;
    }

    const fallbackId = results[0].id;
    const preferredId =
      defaultStudy && results.some((study) => study.id === defaultStudy) ? defaultStudy : undefined;

    setActiveStudy((previous) => {
      const hasPrevious = results.some((study) => study.id === previous);

      const preferredChanged = preferredId !== preferredStudyRef.current;
      preferredStudyRef.current = preferredId;

      if (preferredChanged && preferredId) {
        return preferredId;
      }

      return hasPrevious ? previous : (preferredId ?? fallbackId);
    });
  }, [defaultStudy, results]);

  // Ensure we have results before trying to use them
  if (!results || results.length === 0) {
    return null;
  }

  const activeStudyData = results.find((study) => study.id === activeStudy) ?? results[0];

  return (
    <>
      {/* Case Study Selector */}
      <AnimatedItem animation="fade-in">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {results.map((study) => (
            <Button
              key={study.id}
              onClick={() => setActiveStudy(study.id)}
              variant={activeStudy === study.id ? 'primary' : 'outline'}
              size="medium"
            >
              {study.title}
            </Button>
          ))}
        </div>
      </AnimatedItem>

      {/* Active Case Study */}
      <AnimatedItem animation="slide-up" delay={100}>
        <div className="max-w-4xl mx-auto">
          <Heading level={2} className="mb-2">
            {activeStudyData.title}
          </Heading>
          <Text className="text-xl text-charcoal/80 mb-8">{activeStudyData.subtitle}</Text>

          {/* The Problem */}
          <div className="mb-8">
            <Heading level={3} color="orange" className="mb-4">
              The Problem
            </Heading>
            <FeatureList
              items={activeStudyData.problem}
              icon="bullet"
              iconColor="orange"
              spacing="normal"
            />
          </div>

          {/* What Failed */}
          <Card variant="bordered" className="mb-8 border-orange/20">
            <Heading level={3} className="mb-4 text-orange">
              What We Tried First (Failed!)
            </Heading>
            <FeatureList
              items={activeStudyData.failed}
              icon="cross"
              iconColor="orange"
              spacing="normal"
            />
          </Card>

          {/* The Solution */}
          <Card variant="bordered" className="mb-8 border-teal/20">
            <Heading level={3} className="mb-4 text-teal-dark">
              What Actually Worked
            </Heading>
            <FeatureList
              items={activeStudyData.solution}
              icon="check"
              iconColor="teal"
              spacing="normal"
            />
          </Card>

          {/* Quote Example */}
          {activeStudyData.quote && (
            <Card variant="bordered" className="mb-8 border-l-4 border-orange">
              <Text className="text-lg italic">{activeStudyData.quote}</Text>
            </Card>
          )}

          {/* Results */}
          <div className="mb-8">
            <Heading level={3} color="orange" className="mb-4">
              The Results
            </Heading>
            <Grid columns={{ default: 1, md: 2 }} gap="small">
              {activeStudyData.results.map((result, index) => (
                <Card key={index} variant="bordered" padding="small" className="border-orange/20">
                  <Text className="text-sm text-charcoal/60">{result.metric}</Text>
                  <Text className="text-xl font-bold text-charcoal">{result.value}</Text>
                </Card>
              ))}
            </Grid>
          </div>

          {/* Time Investment */}
          <div className="mb-8">
            <Heading level={3} className="mb-4">
              Time Investment
            </Heading>
            <FeatureList
              items={activeStudyData.timeInvestment}
              icon="bullet"
              spacing="tight"
              className="text-charcoal/80"
            />
          </div>

          {/* Key Learnings */}
          <Card background="cream" padding="large">
            <Heading level={3} className="mb-4">
              What We Learned
            </Heading>
            <ul className="space-y-2">
              {activeStudyData.learnings.map((item, index) => (
                <li key={index} className="flex items-start text-charcoal">
                  <span className="text-orange mr-2 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </AnimatedItem>
    </>
  );
}
