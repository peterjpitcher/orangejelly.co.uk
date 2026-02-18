// Accessibility utilities and helpers

// Generate unique IDs for ARIA relationships
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

// Common ARIA labels for consistent messaging
export const ariaLabels = {
  navigation: {
    main: 'Main navigation',
    footer: 'Footer navigation',
    social: 'Social media links',
    services: 'Services navigation',
    breadcrumb: 'Breadcrumb navigation',
    mobile: 'Mobile navigation menu',
    quickLinks: 'Quick links',
    problemCategories: 'Problem categories navigation',
  },

  buttons: {
    close: 'Close',
    menu: 'Open menu',
    whatsapp: 'Contact us on WhatsApp',
    phone: 'Call us',
    email: 'Email us',
    viewMore: 'View more information',
    expandCollapse: (expanded: boolean) => (expanded ? 'Collapse content' : 'Expand content'),
    playPause: (playing: boolean) => (playing ? 'Pause video' : 'Play video'),
    mute: (muted: boolean) => (muted ? 'Unmute' : 'Mute'),
    share: 'Share this page',
    bookmark: 'Bookmark this page',
  },

  forms: {
    search: 'Search the website',
    newsletter: 'Newsletter signup',
    contact: 'Contact form',
    calculator: 'ROI calculator',
    required: 'Required field',
    error: (field: string) => `Error in ${field} field`,
    success: 'Form submitted successfully',
  },

  regions: {
    hero: 'Hero section',
    services: 'Our services',
    testimonials: 'Customer testimonials',
    cta: 'Call to action',
    pricing: 'Pricing information',
    faq: 'Frequently asked questions',
    results: 'Success stories and results',
    calculator: 'ROI calculator tool',
  },

  status: {
    loading: 'Loading content',
    error: 'Error loading content',
    success: 'Action completed successfully',
    info: 'Information',
    warning: 'Warning message',
  },
};

// Helper to build descriptive button labels
export function getButtonLabel(action: string, context?: string): string {
  if (context) {
    return `${action} - ${context}`;
  }
  return action;
}

// Helper to build form field descriptions
export function getFieldDescription(
  fieldName: string,
  required: boolean = false,
  helpText?: string
): string {
  const parts = [fieldName];
  if (required) parts.push('(required)');
  if (helpText) parts.push(`- ${helpText}`);
  return parts.join(' ');
}

// Helper for live region announcements
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof document === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Helper for focus management
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

// Helper for keyboard navigation
export function handleArrowKeyNavigation(
  e: KeyboardEvent,
  currentIndex: number,
  totalItems: number,
  onNavigate: (newIndex: number) => void
): void {
  let newIndex = currentIndex;

  switch (e.key) {
    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
      break;
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault();
      newIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
      break;
    case 'Home':
      e.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      e.preventDefault();
      newIndex = totalItems - 1;
      break;
    default:
      return;
  }

  onNavigate(newIndex);
}
