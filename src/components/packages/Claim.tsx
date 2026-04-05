// src/components/packages/Claim.tsx

import { getClaimById } from '@/lib/packages';

interface ClaimProps {
  id: string;
  variant?: 'short' | 'long' | 'metric-only';
  showSource?: boolean;
  className?: string;
}

export function Claim({
  id,
  variant = 'short',
  showSource = false,
  className,
}: ClaimProps): React.ReactElement | null {
  const claim = getClaimById(id);

  if (!claim) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Claim] No claim found for id: "${id}"`);
    }
    return null;
  }

  const text =
    variant === 'long'
      ? claim.displayLong
      : variant === 'metric-only'
        ? claim.metric
        : claim.displayShort;

  if (variant === 'long') {
    return (
      <p className={className}>
        {text}
        {showSource && <span className="text-sm text-muted ml-1">(Source: {claim.source})</span>}
      </p>
    );
  }

  return (
    <span className={className}>
      {text}
      {showSource && <span className="text-sm text-muted ml-1">(Source: {claim.source})</span>}
    </span>
  );
}
