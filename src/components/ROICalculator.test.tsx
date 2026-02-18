import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import ROICalculator from './ROICalculator';
import { ROICalculatorProvider } from '@/contexts/ROICalculatorContext';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('ROICalculator Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<ROICalculatorProvider>{component}</ROICalculatorProvider>);
  };

  it('renders calculator with default values', () => {
    renderWithProvider(<ROICalculator />);

    expect(screen.getByText(/Forecast Your Growth Potential/i)).toBeInTheDocument();
    expect(screen.getByText(/Hours per week on admin tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Hours per week on social media/i)).toBeInTheDocument();
  });

  it('calculates savings correctly', () => {
    renderWithProvider(<ROICalculator />);

    // Default values should match the calculator logic
    expect(screen.getByText('11h')).toBeInTheDocument(); // totalHoursSaved
    expect(screen.getByText('£275')).toBeInTheDocument(); // moneySaved
    expect(screen.getByText('£113')).toBeInTheDocument(); // menuRevenue
    expect(screen.getByText('£388')).toBeInTheDocument(); // totalBenefit
  });

  it('updates calculations when slider values change', async () => {
    const { container } = renderWithProvider(<ROICalculator />);

    // Find the admin hours slider
    const adminSlider = container.querySelector('input[type="range"]');
    expect(adminSlider).toBeInTheDocument();

    // Change the value
    if (adminSlider) {
      fireEvent.change(adminSlider, { target: { value: '20' } });
    }

    // Check that the display updates
    await waitFor(() => {
      expect(screen.getByText('20h')).toBeInTheDocument();
    });
  });

  it('persists state to localStorage', async () => {
    renderWithProvider(<ROICalculator />);

    // Change a value
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '15' } });

    // Check localStorage was called
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'roi-calculator-state',
        expect.any(String)
      );
    });
  });

  it('loads state from localStorage on mount', () => {
    const savedState = JSON.stringify({
      adminHours: 15,
      socialMediaHours: 8,
      menuUpdates: 3,
      averageSpend: 20,
    });

    localStorageMock.getItem.mockReturnValue(savedState);

    renderWithProvider(<ROICalculator />);

    // Check that localStorage was accessed
    expect(localStorageMock.getItem).toHaveBeenCalledWith('roi-calculator-state');
  });

  it('displays WhatsApp CTA button', () => {
    renderWithProvider(<ROICalculator />);

    expect(screen.getByText(/Talk to Peter on WhatsApp/i)).toBeInTheDocument();
  });

  it('shows monetary benefit calculation', () => {
    renderWithProvider(<ROICalculator />);

    expect(screen.getByText(/Total weekly benefit/i)).toBeInTheDocument();
    expect(screen.getByText(/per year/i)).toBeInTheDocument();
  });

  it('has accessible form controls', () => {
    const { container } = renderWithProvider(<ROICalculator />);

    // All sliders should have labels
    const labels = container.querySelectorAll('label');
    expect(labels.length).toBeGreaterThan(0);

    // Sliders should have proper min/max attributes
    const sliders = container.querySelectorAll('input[type="range"]');
    sliders.forEach((slider) => {
      expect(slider).toHaveAttribute('min');
      expect(slider).toHaveAttribute('max');
    });
  });
});
