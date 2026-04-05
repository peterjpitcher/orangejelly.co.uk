// src/test/packages/Claim.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Claim } from '@/components/packages/Claim';

describe('Claim', () => {
  it('should render displayShort by default', () => {
    render(<Claim id="food-gp-growth" />);
    expect(screen.getByText(/58%/)).toBeTruthy();
  });

  it('should render displayLong when variant is long', () => {
    render(<Claim id="food-gp-growth" variant="long" />);
    expect(screen.getByText(/Grew food gross profit/)).toBeTruthy();
  });

  it('should render metric only when variant is metric-only', () => {
    render(<Claim id="food-gp-growth" variant="metric-only" />);
    expect(screen.getByText('58% → 71%')).toBeTruthy();
  });

  it('should render nothing for non-existent ID', () => {
    const { container } = render(<Claim id="non-existent" />);
    expect(container.innerHTML).toBe('');
  });

  it('should show source when showSource is true', () => {
    render(<Claim id="food-gp-growth" showSource />);
    expect(screen.getByText(/The Anchor trading records/)).toBeTruthy();
  });
});
