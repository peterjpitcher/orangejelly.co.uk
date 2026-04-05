'use client';

// src/components/packages/PackageComparison.tsx

import { useState } from 'react';
import { getPackages, getCapabilities } from '@/lib/packages';
import Text from '@/components/Text';
import { cn } from '@/lib/utils';
import type { SupportLevel } from '@/types/packages';

const levelConfig: Record<SupportLevel, { label: string; color: string; icon: string }> = {
  included: { label: 'Included', color: 'text-green-600', icon: '\u2713' },
  'light-touch': { label: 'Light-touch', color: 'text-amber-500', icon: '\u25CF' },
  'add-on': { label: 'Add-on', color: 'text-gray-400', icon: '+' },
  'not-included': { label: '\u2014', color: 'text-gray-300', icon: '\u2014' },
};

function SupportBadge({ level }: { level: SupportLevel }): React.ReactElement {
  const config = levelConfig[level];
  return (
    <span className={cn('flex items-center gap-1 text-sm', config.color)}>
      <span>{config.icon}</span>
      <span className="hidden sm:inline">{config.label}</span>
    </span>
  );
}

interface PackageComparisonProps {
  className?: string;
}

export function PackageComparison({ className }: PackageComparisonProps): React.ReactElement {
  const packages = getPackages();
  const capabilities = getCapabilities();
  const [activePackage, setActivePackage] = useState<string>(packages[0]?.id || '');

  return (
    <div className={className}>
      {/* Desktop: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 pr-4 text-sm font-semibold text-charcoal w-1/4">Capability</th>
              {packages.map((pkg) => (
                <th
                  key={pkg.id}
                  className={cn(
                    'py-3 px-4 text-sm font-semibold text-center',
                    pkg.badge === 'Most Popular' ? 'text-orange' : 'text-charcoal'
                  )}
                >
                  {pkg.name}
                  {pkg.badge === 'Most Popular' && (
                    <span className="block text-xs font-normal text-orange">Most Popular</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {capabilities.map((cap) => (
              <tr key={cap.id} className="border-b border-gray-100">
                <td className="py-3 pr-4">
                  <Text weight="medium" size="sm">
                    {cap.name}
                  </Text>
                </td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="py-3 px-4 text-center">
                    <SupportBadge level={cap.defaultSupportLevel[pkg.id] as SupportLevel} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Tabbed cards */}
      <div className="md:hidden">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              type="button"
              onClick={() => setActivePackage(pkg.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                activePackage === pkg.id ? 'bg-orange text-white' : 'bg-gray-100 text-charcoal'
              )}
            >
              {pkg.name}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {capabilities.map((cap) => {
            const level = cap.defaultSupportLevel[activePackage] as SupportLevel;
            return (
              <div
                key={cap.id}
                className="flex items-center justify-between py-2 border-b border-gray-100"
              >
                <Text size="sm">{cap.name}</Text>
                <SupportBadge level={level} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
