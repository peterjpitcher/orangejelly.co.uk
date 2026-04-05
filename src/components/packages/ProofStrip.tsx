// src/components/packages/ProofStrip.tsx

import { Claim } from './Claim';

interface ProofStripProps {
  claimIds: string[];
  className?: string;
}

export function ProofStrip({ claimIds, className }: ProofStripProps): React.ReactElement {
  return (
    <div className={`bg-charcoal py-6 ${className || ''}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {claimIds.map((id) => (
            <div key={id} className="text-white">
              <span className="block text-2xl font-bold">
                <Claim id={id} variant="metric-only" className="text-orange" />
              </span>
              <span className="block text-sm text-white/70">
                <Claim id={id} variant="short" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
