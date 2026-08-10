// src/components/packages/ProofStrip.tsx

import { Claim } from './Claim';

interface ProofStripProps {
  claimIds: string[];
  className?: string;
}

export function ProofStrip({ claimIds, className }: ProofStripProps): React.ReactElement {
  return (
    <div className={`bg-brand-base py-6 ${className || ''}`}>
      <div className="page-shell">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {claimIds.map((id) => (
            <div key={id} className="text-white">
              <span className="block text-2xl font-bold">
                {/* text-orange, not orange-dark: this strip is bg-brand-base, and
                    on navy the accent has to lighten. The brand orange is 4.55:1
                    here; orange-dark is 2.57:1. */}
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
