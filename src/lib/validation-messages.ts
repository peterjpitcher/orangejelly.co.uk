/**
 * Centralized validation messages for the Orange Jelly website
 *
 * This file contains all validation messages, placeholder texts, and form-related
 * strings to enable easy maintenance and future internationalization support.
 */

// Field validation messages
export const VALIDATION_MESSAGES = {
  // Email validation
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address',
  },

  // Name validation
  name: {
    required: 'Name is required',
    minLength: 'Name must be at least 2 characters',
    maxLength: 'Name must be less than 50 characters',
  },

  // Availability polls. Names reuse the `name` rules above rather than inventing
  // a second limit — a different cap would make name.maxLength a lie.
  poll: {
    titleRequired: 'Give your poll a title',
    tooFewOptions: 'Propose at least two options — one option is an announcement, not a poll',
    tooManyOptions: '8 options is the limit',
    duplicateOption: "You've proposed the same time twice",
    slotEndBeforeStart: 'The end time must be after the start time',
    slotInPast: 'That time has already passed',
    answerEveryOption: "Give an answer for every option — 'No' is a perfectly good answer",
    votingClosed: 'Voting has closed on this poll',
    alreadyConfirmed: 'This poll is already confirmed',
    responsesLocked: 'This poll is confirmed. Responses are locked',
    linkNotValid: 'This link is no longer valid',
    // Deliberately identical on every rate-limit bucket. Naming the bucket that
    // was hit tells an attacker which limit they found.
    rateLimited: 'Too many attempts. Please try again in a few minutes.',
    botCheckFailed: "We couldn't verify you're a person. Please try again.",
  },

  // Phone validation
  phone: {
    required: 'Phone number is required',
    invalid: 'Please enter a valid UK phone number',
  },

  // Message validation
  message: {
    required: 'Message is required',
    minLength: 'Message must be at least 10 characters',
    maxLength: 'Message must be less than 1000 characters',
  },

  // Pub name validation
  pubName: {
    required: 'Venue name is required',
    minLength: 'Venue name must be at least 2 characters',
  },

  // Generic validation messages
  generic: {
    required: 'This field is required',
    validationFailed: 'Validation failed',
  },
} as const;

// Form placeholder text
export const PLACEHOLDERS = {
  email: {
    default: 'your.email@example.com',
    newsletter: 'peter@yourpub.co.uk',
    simple: 'Your email',
    footer: 'Your email address',
  },

  name: {
    default: 'Your Name',
  },

  phone: {
    default: '07XXX XXXXXX',
    optional: '(Optional)',
  },

  pubName: {
    default: 'Your venue name',
  },

  message: {
    default: 'Tell us how we can help',
    general: 'Type your message here',
  },
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  newsletter: {
    subscribed: 'Success! Check your email to confirm.',
    subscribing: 'Subscribing...',
  },

  contact: {
    submitted: 'Your message has been sent successfully!',
    submitting: 'Sending...',
  },

  generic: {
    success: 'Success!',
    processing: 'Processing...',
  },
} as const;

// Form labels and descriptions
export const FORM_LABELS = {
  email: 'Email Address',
  name: 'Name',
  phone: 'Phone',
  pubName: 'Venue Name',
  message: 'Message',
} as const;

// Form descriptions and help text
export const FORM_DESCRIPTIONS = {
  newsletter: {
    title: 'Get Hospitality Growth Tips',
    description: 'Weekly action-first tips built for busy hospitality operators.',
    disclaimer: 'No spam. Unsubscribe anytime. We respect hospitality hours.',
  },

  contact: {
    title: 'Get In Touch',
    description: 'Have a question or need help building momentum in your venue?',
  },
} as const;

// Button text
export const BUTTON_TEXT = {
  submit: 'Submit',
  subscribe: 'Subscribe',
  send: 'Send Message',
  cancel: 'Cancel',
  reset: 'Reset',
} as const;

// Error states and messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please try again.',
  serverError: 'Server error. Please try again later.',
  timeout: 'Request timeout. Please try again.',
  unknown: 'Something went wrong. Please try again.',
} as const;

// Accessibility messages
export const ACCESSIBILITY_MESSAGES = {
  requiredField: 'Required field',
  optionalField: 'Optional field',
  validInput: 'Valid input',
  invalidInput: 'Invalid input',
  formError: 'Form contains errors',
  formSubmitted: 'Form submitted successfully',
} as const;

// Type exports for better TypeScript support
export type ValidationMessageKeys = typeof VALIDATION_MESSAGES;
export type PlaceholderKeys = typeof PLACEHOLDERS;
export type SuccessMessageKeys = typeof SUCCESS_MESSAGES;
export type FormLabelKeys = typeof FORM_LABELS;
export type FormDescriptionKeys = typeof FORM_DESCRIPTIONS;
export type ButtonTextKeys = typeof BUTTON_TEXT;
export type ErrorMessageKeys = typeof ERROR_MESSAGES;
export type AccessibilityMessageKeys = typeof ACCESSIBILITY_MESSAGES;
