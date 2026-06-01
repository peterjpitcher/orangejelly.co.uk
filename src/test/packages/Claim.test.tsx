// src/test/packages/Claim.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Claim } from '@/components/packages/Claim';

describe('Claim', () => {
  it('should render displayShort by default', () => {
    render(<Claim id="food-revenue" />);
    expect(screen.getByText(/98%/)).toBeTruthy();
  });

  it('should render displayLong when variant is long', () => {
    render(<Claim id="food-revenue" variant="long" />);
    expect(screen.getByText(/Grew food revenue/)).toBeTruthy();
  });

  it('should render metric only when variant is metric-only', () => {
    render(<Claim id="food-revenue" variant="metric-only" />);
    expect(screen.getByText('+98%')).toBeTruthy();
  });

  it('should render nothing for non-existent ID', () => {
    const { container } = render(<Claim id="non-existent" />);
    expect(container.innerHTML).toBe('');
  });

  it('should show source when showSource is true', () => {
    render(<Claim id="food-revenue" showSource />);
    expect(screen.getByText(/The Anchor/)).toBeTruthy();
  });
});
