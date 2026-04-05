// src/test/packages/PackageCard.test.tsx

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PackageCard } from '@/components/packages/PackageCard';

describe('PackageCard', () => {
  it('should render package name and price', () => {
    render(<PackageCard packageId="growth-fix" />);
    expect(screen.getByText('Growth Fix')).toBeTruthy();
    expect(screen.getByText(/£375/)).toBeTruthy();
  });

  it('should show Most Popular badge for growth-partner', () => {
    render(<PackageCard packageId="growth-partner" highlighted />);
    expect(screen.getByText('Most Popular')).toBeTruthy();
  });

  it('should show payment plan copy', () => {
    render(<PackageCard packageId="growth-fix" />);
    expect(screen.getByText(/Payment plans available/)).toBeTruthy();
  });

  it('should handle null price gracefully for turnaround', () => {
    render(<PackageCard packageId="turnaround-intensive" />);
    expect(screen.getByText(/Pricing confirmed after diagnostic/)).toBeTruthy();
  });

  it('should render nothing for non-existent package', () => {
    const { container } = render(<PackageCard packageId="non-existent" />);
    expect(container.innerHTML).toBe('');
  });
});
