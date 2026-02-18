'use client';

import { useROICalculator } from '@/contexts/ROICalculatorContext';
import WhatsAppButton from './WhatsAppButton';
import Card from './Card';
import Heading from './Heading';
import Text from './Text';

type CalculatorFieldKey = 'adminHours' | 'socialMediaHours' | 'menuUpdates' | 'averageSpend';

interface FieldConfig {
  key: CalculatorFieldKey;
  label: string;
  min: number;
  max: number;
  step: number;
  helper: string;
  unit: 'hours' | 'pounds';
  cadence: 'week' | 'month';
}

const fieldConfigs: FieldConfig[] = [
  {
    key: 'adminHours',
    label: 'Hours per week on admin tasks (rotas, ordering, emails)',
    min: 0,
    max: 40,
    step: 1,
    helper:
      'AI admin assistants typically halve this workload when templates + automation are in place.',
    unit: 'hours',
    cadence: 'week',
  },
  {
    key: 'socialMediaHours',
    label: 'Hours per week on social media & marketing',
    min: 0,
    max: 25,
    step: 1,
    helper: 'Content batching + scheduling cuts about 80% of effort once the system is live.',
    unit: 'hours',
    cadence: 'week',
  },
  {
    key: 'menuUpdates',
    label: 'Hours per month updating menus & descriptions',
    min: 0,
    max: 20,
    step: 1,
    helper: 'Menu engineering templates reduce writing/review time by roughly 75% each cycle.',
    unit: 'hours',
    cadence: 'month',
  },
  {
    key: 'averageSpend',
    label: 'Current average customer spend (£)',
    min: 10,
    max: 40,
    step: 1,
    helper:
      'We model a conservative 15% uplift on a 50-cover baseline once the offer is tightened.',
    unit: 'pounds',
    cadence: 'week',
  },
];

const clampValue = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
};

export default function ROICalculator() {
  const { state, updateState } = useROICalculator();
  const { adminHours, socialMediaHours, menuUpdates, averageSpend } = state;

  // Calculations
  const totalHoursSaved = Math.round(
    adminHours * 0.5 + socialMediaHours * 0.8 + menuUpdates * 0.75
  );
  const hourlyValue = 25; // Conservative estimate of licensee's hourly value
  const moneySaved = totalHoursSaved * hourlyValue;
  const menuRevenue = Math.round(averageSpend * 0.15 * 50); // 15% increase on 50 covers
  const totalBenefit = moneySaved + menuRevenue;

  return (
    <Card
      background="orange-light"
      padding="large"
      className="bg-gradient-to-br from-orange/10 to-orange/5 shadow-xl"
    >
      <Heading level={3} align="center" className="mb-6">
        Forecast Your Growth Potential
      </Heading>
      <div className="space-y-6">
        {fieldConfigs.map(({ key, label, min, max, step, helper, unit }) => {
          const value = state[key];
          const sliderId = `${key}-slider`;
          const numberId = `${key}-input`;
          const helperId = `${key}-helper`;
          const formattedValue = unit === 'pounds' ? `£${value}` : `${value}h`;

          const handleChange = (numericValue: number) => {
            updateState({
              [key]: clampValue(numericValue, min, max),
            } as Partial<typeof state>);
          };

          return (
            <div key={key}>
              <label htmlFor={sliderId} className="flex flex-col gap-1 text-sm font-semibold mb-2">
                <span>{label}</span>
                <span className="font-bold text-lg">{formattedValue}</span>
              </label>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <input
                  id={sliderId}
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={value}
                  onChange={(e) => handleChange(Number(e.target.value))}
                  className="flex-1 accent-orange"
                  aria-describedby={helperId}
                />
                <input
                  id={numberId}
                  type="number"
                  min={min}
                  max={max}
                  step={step}
                  value={value}
                  onChange={(e) => handleChange(Number(e.target.value))}
                  className="w-full md:w-28 border border-charcoal/20 rounded-md px-3 py-2"
                  aria-describedby={helperId}
                />
              </div>
              <Text id={helperId} size="xs" color="muted" className="mt-2">
                {helper}
              </Text>
            </div>
          );
        })}
      </div>

      {/* Results */}
      <Card className="mt-8 shadow-inner" padding="medium">
        <Heading level={4} align="center" className="mb-4">
          Your Growth Forecast:
        </Heading>

        <div className="grid md:grid-cols-3 gap-4 text-center mb-6">
          <div>
            <Text size="2xl" weight="bold" className="text-orange">
              {totalHoursSaved}h
            </Text>
            <Text size="sm" className="text-charcoal/70">
              Growth hours per week
            </Text>
          </div>
          <div>
            <Text size="2xl" weight="bold" className="text-orange">
              £{moneySaved}
            </Text>
            <Text size="sm" className="text-charcoal/70">
              Time value per week
            </Text>
          </div>
          <div>
            <Text size="2xl" weight="bold" className="text-orange">
              £{menuRevenue}
            </Text>
            <Text size="sm" className="text-charcoal/70">
              Extra revenue per week
            </Text>
          </div>
        </div>

        <div className="text-center border-t pt-4">
          <Text size="sm" className="text-charcoal/70 mb-2">
            Total weekly benefit:
          </Text>
          <Text size="2xl" weight="bold" className="text-orange mb-4">
            £{totalBenefit}
          </Text>
          <Text size="xs" className="text-charcoal/60 mb-6" aria-live="polite">
            That's £{Math.round((totalBenefit * 52) / 1000)}k per year!
          </Text>

          <WhatsAppButton
            text={`I want to turn ${totalHoursSaved} hours a week into growth - let's chat!`}
            label="Talk to Peter on WhatsApp"
            size="medium"
            fullWidth
          />
        </div>
      </Card>

      <Text size="xs" align="center" className="mt-4 text-charcoal/60">
        * Calculations assume a 50-cover baseline, 15% menu uplift and conservative hourly value of
        £25 based on real results from The Anchor.
      </Text>
    </Card>
  );
}
