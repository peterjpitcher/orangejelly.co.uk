// Mobile-first utility functions and constants

// Minimum touch target size (WCAG 2.1 AA compliance)
export const MIN_TOUCH_TARGET = 44;

// Check if device is mobile
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
};

// Check if device supports touch
export const hasTouch = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Get safe area insets
export const getSafeAreaInsets = () => {
  if (typeof window === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 };

  const computedStyle = getComputedStyle(document.documentElement);
  return {
    top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
    right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
    bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
  };
};

// Format phone number for tel: links
export const formatPhoneForLink = (phone: string): string => {
  return phone.replace(/\s/g, '');
};

// Format phone number for display
export const formatPhoneForDisplay = (phone: string): string => {
  // UK mobile format: 07941 266538
  if (phone.startsWith('07')) {
    return phone.replace(/(\d{5})(\d{6})/, '$1 $2');
  }
  // UK landline format: 01784 123456
  if (phone.startsWith('01')) {
    return phone.replace(/(\d{5})(\d{6})/, '$1 $2');
  }
  return phone;
};

// Viewport height that accounts for mobile browser chrome
export const getViewportHeight = () => {
  if (typeof window === 'undefined') return '100vh';
  return `${window.innerHeight}px`;
};

// Debounce function for scroll/resize events
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Check if element is in viewport
export const isInViewport = (element: Element): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Mobile-optimized lazy loading
export const lazyLoadImage = (img: HTMLImageElement) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          if (image.dataset.src) {
            image.src = image.dataset.src;
            image.classList.add('loaded');
            observer.unobserve(image);
          }
        }
      });
    },
    {
      rootMargin: '50px', // Start loading 50px before entering viewport
    }
  );

  observer.observe(img);
};
